/**
 * Assist Mode advisor.
 *
 * Pure scoring helpers behind Campaign's Assist Mode recommendations. Nothing
 * here touches the DOM or mutates a run — every function takes the run plus the
 * prompt it is advising on and returns a suggestion, or `null` when it has no
 * opinion worth showing.
 *
 * Every suggestion carries a short `why` string. The UI shows it next to the
 * badge, because a recommendation the player cannot interrogate is worse than
 * none: these are heuristics, not solved play, and they are labelled as such.
 *
 * Deliberately deterministic — no RNG. The same run state always produces the
 * same advice, so a suggestion cannot change under the player between renders,
 * and nothing here can desynchronise a seeded run.
 */
(function (global) {
  'use strict';

  const RedGPT = global.RedGPT;
  const Dex = RedGPT.Dex;
  const PokemonLib = RedGPT.Pokemon;

  /* ------------------------------------------------------------------ *
   * Move valuation
   * ------------------------------------------------------------------ */

  /** Status moves worth keeping, and roughly what they are worth. */
  const STATUS_VALUE = {
    // recovery
    recover: 95, roost: 95, softboiled: 95, milkdrink: 95, slackoff: 95, synthesis: 85,
    moonlight: 85, morningsun: 85, shoreup: 85, rest: 70, strengthsap: 100,
    // setup
    swordsdance: 100, nastyplot: 100, dragondance: 105, calmmind: 95, quiverdance: 110,
    bulkup: 85, shellsmash: 110, bellydrum: 100, irondefense: 60, agility: 65, workup: 60,
    growth: 70, tailglow: 105, victorydance: 100, shiftgear: 100, filletaway: 95,
    // hazards and control
    stealthrock: 90, spikes: 75, toxicspikes: 70, stickyweb: 70,
    defog: 65, rapidspin: 70, tidyup: 70, courtchange: 55,
    // status infliction
    willowisp: 75, thunderwave: 70, toxic: 75, spore: 100, sleeppowder: 80, hypnosis: 55,
    glare: 70, nuzzle: 65,
    // utility
    protect: 70, substitute: 75, leechseed: 75, taunt: 65, encore: 60, trick: 55,
    haze: 45, healbell: 55, aromatherapy: 55, reflect: 55, lightscreen: 55, auroraveil: 70,
    tailwind: 70, trickroom: 65, wish: 70, painsplit: 55, destinybond: 55,
    // pivots
    batonpass: 65, teleport: 45, partingshot: 70, chillyreception: 55,
  };

  /** A pivot move is worth more than its raw power suggests. */
  const PIVOT_MOVES = new Set(['uturn', 'voltswitch', 'flipturn']);

  /**
   * Moves that do nothing in a battle. They need an explicit zero: the generic
   * "unknown status move" fallback below is deliberately low, but still enough
   * to beat a weak attack whose type a stronger move already covers — which is
   * how an early version of this ended up advising Splash over Ember.
   */
  const NO_EFFECT_MOVES = new Set(['splash', 'celebrate', 'holdhands', 'happyhour', 'teatime']);

  /**
   * Roughly how useful a move is on a given set.
   *
   * Comparable across moves on the same Pokémon, which is all the callers need
   * — nothing here pretends to be a damage calculation.
   */
  function moveScore(moveId, set, plan = null) {
    const move = Dex.move(moveId);
    if (!move || move.missing) return 0;
    const species = Dex.species(set.species);
    // A plan re-weights utility rather than carrying a second move table: Trick
    // Room is a 65 on a balanced team and the highest-value move on the board
    // for a Trick Room one. `NO_EFFECT_MOVES` is checked first, so no plan can
    // ever talk the advisor into recommending Splash.
    const bias = planMoveBias(plan, move.id);

    if (move.category === 'Status') {
      if (NO_EFFECT_MOVES.has(move.id)) return 0;
      const base = STATUS_VALUE[move.id];
      if (base != null) return base * bias;
      // Unknown status move: low enough to lose to a real attack, non-zero so
      // it still beats something genuinely useless.
      return 22 * bias;
    }

    let power = move.basePower || 0;
    if (Array.isArray(move.multihit)) power *= 3.1;
    else if (typeof move.multihit === 'number') power *= move.multihit;
    if (move.id === 'seismictoss' || move.id === 'nightshade') power = 70;
    if (!power) power = 60;                       // fixed-damage / OHKO oddities

    const accuracy = move.accuracy == null ? 1 : move.accuracy / 100;
    const stab = species.types.includes(move.type) ? 1.5 : 1;

    // Prefer the offensive stat the species actually has.
    const atk = species.baseStats.atk;
    const spa = species.baseStats.spa;
    const best = Math.max(atk, spa, 1);
    const fit = (move.category === 'Physical' ? atk : spa) / best;

    let score = power * accuracy * stab * (0.55 + 0.45 * fit);
    if (PIVOT_MOVES.has(move.id)) score += 25;
    if (move.priority > 0) score += 12;
    if (move.recoil) score *= 0.92;
    return score * bias;
  }

  /**
   * Score a move in the context of the set it would sit in, penalising a type
   * that a stronger attack already covers. Keeps advice from stacking four
   * moves of one type.
   */
  function contextualScore(moveId, set, otherMoveIds, plan = null) {
    const move = Dex.move(moveId);
    let score = moveScore(moveId, set, plan);
    if (move.category === 'Status') return score;
    const duplicate = otherMoveIds.some(other => {
      if (other === moveId) return false;
      const m = Dex.move(other);
      return m.category !== 'Status' && m.type === move.type && moveScore(other, set, plan) >= score;
    });
    return duplicate ? score * 0.55 : score;
  }

  /* ------------------------------------------------------------------ *
   * Team plans
   *
   * A plan is a row of preferences in `CampaignContent.TEAM_PLANS`, chosen by
   * the player and stored in `run.assist.plan`. It re-weights advice; it never
   * changes what is offered. Reading it anywhere that draws from the run RNG
   * would desynchronise a seeded run — see the note on the data itself.
   * ------------------------------------------------------------------ */

  const moveIdsOf = set => (set.moves || []).map(Dex.toID);

  /** Resolve a plan from a run, a plan id, or a plan object. Never null. */
  function planFor(source) {
    const Content = RedGPT.CampaignContent;
    if (!source) return Content.teamPlan('balance');
    if (typeof source === 'string') return Content.teamPlan(source);
    if (source.enablers) return source;                 // already a plan
    return Content.teamPlan(source.assist?.plan);       // a run
  }

  /*
   * Membership lookups, built once per plan. The plan objects are module-level
   * constants, so keying the cache on the object identity is safe and means a
   * recruit screen scoring three candidates does not rebuild eight Sets.
   */
  const planCache = new WeakMap();
  function planIndex(plan) {
    let index = planCache.get(plan);
    if (!index) {
      index = {
        enablerMoves: new Set((plan.enablers?.moves || []).map(Dex.toID)),
        enablerAbilities: new Set((plan.enablers?.abilities || []).map(Dex.toID)),
        payoffMoves: new Set((plan.payoff?.moves || []).map(Dex.toID)),
        payoffAbilities: new Set((plan.payoff?.abilities || []).map(Dex.toID)),
      };
      planCache.set(plan, index);
    }
    return index;
  }

  /** Multiplier the plan applies to a move's generic score. */
  function planMoveBias(plan, moveId) {
    if (!plan) return 1;
    const bias = (plan.statusBias || {})[moveId];
    if (bias != null) return bias;
    return planIndex(plan).payoffMoves.has(moveId) ? 1.25 : 1;
  }

  /** Does this set switch the plan on by itself? */
  function isEnabler(plan, set) {
    const index = planIndex(plan);
    if (index.enablerAbilities.has(Dex.toID(set.ability))) return true;
    return moveIdsOf(set).some(id => index.enablerMoves.has(id));
  }

  /** How many of the plan's payoff pieces this set brings. */
  function payoffCount(plan, set) {
    const index = planIndex(plan);
    let count = index.payoffAbilities.has(Dex.toID(set.ability)) ? 1.5 : 0;
    for (const id of moveIdsOf(set)) if (index.payoffMoves.has(id)) count++;
    return count;
  }

  /* ------------------------------------------------------------------ *
   * Move learning
   * ------------------------------------------------------------------ */

  /**
   * Which of the four known moves to forget for `incomingId`, or null when the
   * incoming move is not an upgrade.
   * @returns {{index:number, why:string}|null}
   */
  function recommendMoveReplacement(set, incomingId, planSource = null) {
    const plan = planSource ? planFor(planSource) : null;
    const known = [...(set.moves || [])];
    if (known.length < 4) return {index: known.length, why: 'There is a free move slot.'};
    const pool = known.concat([incomingId]);
    const incoming = contextualScore(incomingId, set, pool, plan);
    let worstIndex = -1;
    let worstScore = Infinity;
    for (let i = 0; i < known.length; i++) {
      const score = contextualScore(known[i], set, pool, plan);
      if (score < worstScore) { worstScore = score; worstIndex = i; }
    }
    if (worstIndex < 0 || incoming <= worstScore) {
      return null;
    }
    const outgoing = Dex.move(known[worstIndex]);
    const planNote = plan && planMoveBias(plan, Dex.toID(incomingId)) > 1
      ? ` It is a ${plan.name} move.` : '';
    return {
      index: worstIndex,
      why: `${Dex.move(incomingId).name} scores higher than ${outgoing.name} on this Pokémon.${planNote}`,
    };
  }

  /** Best (move, party member) pairing for a TM offering several moves. */
  function recommendTm(run, prompt) {
    const plan = planFor(run);
    let best = null;
    const entries = prompt.moves || [];
    entries.forEach((entry, moveIndex) => {
      const moveId = typeof entry === 'string' ? entry : entry.id;
      const eligibleUids = typeof entry === 'string' ? run.party.map(m => m.uid) : entry.eligible;
      for (const member of run.party) {
        if (!eligibleUids.includes(member.uid)) continue;
        const known = member.set.moves || [];
        const gain = known.length < 4
          ? moveScore(moveId, member.set, plan)
          : moveScore(moveId, member.set, plan) - Math.min(...known.map(id => contextualScore(id, member.set, known.concat([moveId]), plan)));
        if (gain <= 0) continue;
        if (!best || gain > best.gain) {
          best = {
            gain, moveIndex, memberUid: member.uid,
            why: `Biggest upgrade: ${Dex.move(moveId).name} on ${PokemonLib.displayName(member.set)}.`,
          };
        }
      }
    });
    return best;
  }

  /** Highest-scoring legal move for a tutor. */
  function recommendTutorMove(set, legalMoves, planSource = null) {
    const plan = planSource ? planFor(planSource) : null;
    const known = new Set(set.moves || []);
    let best = null;
    for (const id of legalMoves || []) {
      if (known.has(id)) continue;
      const score = moveScore(id, set, plan);
      if (!best || score > best.score) best = {moveId: id, score};
    }
    if (!best) return null;
    const planNote = plan && planMoveBias(plan, Dex.toID(best.moveId)) > 1
      ? `${Dex.move(best.moveId).name} is what a ${plan.name} team wants here.`
      : `${Dex.move(best.moveId).name} is the strongest option this Pokémon can learn.`;
    return {moveId: best.moveId, why: planNote};
  }

  /* ------------------------------------------------------------------ *
   * Held items
   * ------------------------------------------------------------------ */

  const BULK_ITEMS = new Set(['leftovers', 'blacksludge', 'rockyhelmet', 'assaultvest', 'heavydutyboots', 'shellbell']);
  const PHYSICAL_ITEMS = new Set(['choiceband', 'muscleband', 'punchingglove']);
  const SPECIAL_ITEMS = new Set(['choicespecs', 'wiseglasses', 'throatspray']);
  const SPEED_ITEMS = new Set(['choicescarf', 'roomservice']);
  const FRAIL_ITEMS = new Set(['focussash', 'airballoon']);
  const TYPE_BOOST_ITEMS = {
    charcoal: 'Fire', mysticwater: 'Water', magnet: 'Electric', miracleseed: 'Grass',
    nevermeltice: 'Ice', blackbelt: 'Fighting', poisonbarb: 'Poison', softsand: 'Ground',
    sharpbeak: 'Flying', twistedspoon: 'Psychic', silverpowder: 'Bug', hardstone: 'Rock',
    spelltag: 'Ghost', dragonfang: 'Dragon', blackglasses: 'Dark', metalcoat: 'Steel',
    fairyfeather: 'Fairy', silkscarf: 'Normal',
  };

  /**
   * How well `itemId` suits `member`, or -1 when it is a non-starter.
   *
   * The plan bonus is added at the end rather than replacing the quality score,
   * because a plan item still has to land on a sensible holder. It is what
   * rescues the items generic scoring rates as junk — a Damp Rock, a Light Clay
   * and this project's own Warp Prism are all near-worthless in the abstract
   * and the single best item in the pool for the right plan.
   */
  function itemFit(member, itemId, planSource = null) {
    const item = Dex.item(itemId);
    if (!item) return -1;
    const plan = planSource ? planFor(planSource) : null;
    const planBonus = plan ? (plan.items || {})[Dex.toID(itemId)] || 0 : 0;
    const set = member.set;
    const species = Dex.species(set.species);
    const stats = species.baseStats;
    const physical = stats.atk >= stats.spa;
    const offence = Math.max(stats.atk, stats.spa);
    const bulk = stats.hp + stats.def + stats.spd;

    // Transformation items only ever suit the species they belong to — a Mega
    // Stone, and equally a Red Orb or a Rusted Sword. Handing one to anything
    // else is strictly worse than an empty item slot.
    const formeMapping = item.megaStone || RedGPT.Mechanics.FORME_CHANGE_ITEMS[item.id];
    if (formeMapping) {
      const pairs = typeof formeMapping === 'string' ? [] : Object.entries(formeMapping);
      const matches = pairs.some(([base, target]) => Dex.toID(base) === species.id && Dex.hasSpecies(target));
      return matches ? 500 : -1;
    }
    if (itemId === 'eviolite') {
      return (species.evolutions || []).length ? 300 + bulk / 4 : -1;
    }
    if (itemId === 'boosterenergy') {
      const ability = Dex.toID(set.ability);
      return ability === 'protosynthesis' || ability === 'quarkdrive' ? 320 : -1;
    }
    if (TYPE_BOOST_ITEMS[itemId]) {
      const type = TYPE_BOOST_ITEMS[itemId];
      const hasStab = species.types.includes(type);
      const hasMove = (set.moves || []).some(id => Dex.move(id).type === type && Dex.move(id).category !== 'Status');
      if (!hasMove) return -1;
      return 60 + (hasStab ? 60 : 0) + offence / 4;
    }
    /*
     * A plan item belongs on the Pokémon that turns the plan on: the Damp Rock
     * goes on whatever sets the rain, not on the biggest attacker. Weighted
     * above the plan bonus itself so it decides the holder rather than merely
     * nudging it. Plans with no enabler (Balance, Hyper Offense, Stall) skip
     * this entirely.
     */
    const enablerBonus = plan && planBonus > 0 && isEnabler(plan, set) ? 150 : 0;

    if (PHYSICAL_ITEMS.has(itemId)) return (physical ? 120 + stats.atk : 20) + planBonus + enablerBonus;
    if (SPECIAL_ITEMS.has(itemId)) return (physical ? 20 : 120 + stats.spa) + planBonus + enablerBonus;
    if (SPEED_ITEMS.has(itemId)) return 100 + offence / 2 + stats.spe / 3 + planBonus + enablerBonus;
    if (FRAIL_ITEMS.has(itemId)) return 90 + offence / 2 - bulk / 6 + planBonus + enablerBonus;
    /*
     * Black Sludge heals a Poison type and *damages* everything else by 1/8 a
     * turn, so on a non-Poison holder it is strictly worse than no item at all.
     * It sits in `BULK_ITEMS` alongside Leftovers, which had the advisor
     * recommending it — and the Battle Shop stocking it — for any bulky
     * Pokémon. A negative item has to be a non-starter, not a low score.
     */
    if (itemId === 'blacksludge' && !species.types.includes('Poison')) return -1;
    if (BULK_ITEMS.has(itemId)) return 90 + bulk / 3 + planBonus + enablerBonus;
    if (itemId === 'lifeorb' || itemId === 'expertbelt') return 110 + offence + planBonus + enablerBonus;
    // Anything unrecognised: mildly favour the strongest attacker.
    return 50 + offence / 3 + planBonus + enablerBonus;
  }

  /** Which party member should hold `itemId`. */
  function recommendHeldItemTarget(run, itemId) {
    const plan = planFor(run);
    let best = null;
    for (const member of run.party) {
      const fit = itemFit(member, itemId, plan);
      if (fit < 0) continue;
      if (!best || fit > best.fit) best = {fit, uid: member.uid, member};
    }
    if (!best) return null;
    const item = Dex.item(itemId);
    const planBonus = (plan.items || {})[Dex.toID(itemId)] || 0;
    if (planBonus > 0) {
      const why = isEnabler(plan, best.member.set)
        ? `${item.name} belongs on ${PokemonLib.displayName(best.member.set)} — it is what sets up your ${plan.name}.`
        : `${item.name} is a ${plan.name} item; ${PokemonLib.displayName(best.member.set)} makes the most of it.`;
      return {uid: best.uid, why};
    }
    return {
      uid: best.uid,
      why: `${item.name} suits ${PokemonLib.displayName(best.member.set)} best.`,
    };
  }

  /* ------------------------------------------------------------------ *
   * Rewards
   * ------------------------------------------------------------------ */

  /**
   * Score a reward option. Values are on one arbitrary scale; only their order
   * matters, and the run state shifts them (a hurt team wants healing, a short
   * team wants a recruit).
   */
  function rewardScore(run, option) {
    const partyFull = run.party.length >= (RedGPT.Campaign?.MAX_PARTY ?? 6);
    const hurt = run.party.filter(m => m.condition.currentHP <= 0).length;

    switch (option.kind) {
      case 'recruit':
        return partyFull ? 120 : 320;
      case 'relic':
        return 300;
      case 'tm': {
        const gain = recommendTm(run, {moves: option.moves || []});
        return gain ? 150 + Math.min(120, gain.gain) : 90;
      }
      case 'held': {
        const target = recommendHeldItemTarget(run, option.id);
        if (!target) return 60;
        const member = run.party.find(m => m.uid === target.uid);
        // Plan-aware, so a Damp Rock offered to a Rain team outranks the
        // generically-better item next to it on the reward screen.
        return 140 + Math.min(160, itemFit(member, option.id, planFor(run)) / 2);
      }
      case 'credits':
        return 110 + Math.min(90, (option.amount || 0) / 6);
      case 'consumable':
        return 90 + hurt * 45;
      default:
        return 80;
    }
  }

  /** The reward option Assist Mode suggests taking. */
  function recommendReward(run, prompt) {
    const options = prompt.options || [];
    if (!options.length) return null;
    let best = null;
    options.forEach((option, index) => {
      const score = rewardScore(run, option);
      if (!best || score > best.score) best = {score, index, option};
    });
    if (!best) return null;
    return {index: best.index, why: reasonForReward(run, best.option)};
  }

  /* ------------------------------------------------------------------ *
   * Recruitment
   *
   * The one screen where the player is choosing a *Pokémon* rather than a
   * number, and the one that most shapes the rest of the run. Everything here
   * is player information: the candidates are on screen, and the party is the
   * player's own.
   * ------------------------------------------------------------------ */

  /** What the party is short of. Computed once per recruit screen. */
  function partyProfile(run, plan) {
    const sets = (run.party || []).map(member => member.set);
    const speciesList = sets.map(set => Dex.species(set.species));

    /*
     * A defensive hole is a type that hits at least two of the party for super
     * effective damage and that *nobody* resists. One weak member is a matchup;
     * two weak and no answer is a hole a boss will find.
     */
    const holes = [];
    for (const type of Dex.TYPES) {
      let weak = 0;
      let resist = 0;
      for (const species of speciesList) {
        const eff = Dex.typeEffectiveness(type, species.types);
        if (eff > 1) weak++;
        else if (eff < 1) resist++;
      }
      if (speciesList.length >= 2 && weak >= 2 && resist === 0) holes.push(type);
    }

    // Attacking types the party can already threaten with.
    const covered = new Set();
    for (const set of sets) {
      for (const id of moveIdsOf(set)) {
        const move = Dex.move(id);
        if (move.category !== 'Status' && move.basePower) covered.add(move.type);
      }
    }

    const speeds = speciesList.map(species => species.baseStats.spe);
    return {
      holes,
      covered,
      hasEnabler: sets.some(set => isEnabler(plan, set)),
      size: sets.length,
      medianSpeed: speeds.length ? speeds.slice().sort((a, b) => a - b)[Math.floor(speeds.length / 2)] : 80,
    };
  }

  /** Does this plan have an enabler at all? Balance, HO and Stall do not. */
  function planNeedsEnabler(plan) {
    const index = planIndex(plan);
    return index.enablerMoves.size > 0 || index.enablerAbilities.size > 0;
  }

  /**
   * Score one recruit candidate, returning the reasons alongside the number so
   * the UI can explain itself. A recommendation the player cannot interrogate
   * is worse than none.
   */
  function recruitScore(set, plan, profile) {
    const species = Dex.species(set.species);
    const stats = species.baseStats;
    const reasons = [];
    // Baseline quality, deliberately reason-less: "it has a high BST" is not an
    // argument, it is the default. Only the terms below earn an explanation.
    let score = species.bst / 12;
    const add = (points, text) => {
      if (points <= 0) return;
      score += points;
      reasons.push({points, text});
    };

    // 1. The linchpin. A payoff piece with no enabler is a dead card, so the
    //    first setter is worth more than anything else on the screen.
    if (planNeedsEnabler(plan) && isEnabler(plan, set)) {
      if (!profile.hasEnabler) add(150, `nothing in your party sets ${plan.name} up yet, and this does`);
      else add(45, `a second ${plan.name} setter, so losing the first does not end the plan`);
    }

    // 2. Payoff, worth roughly double once the enabler is actually down.
    const payoff = payoffCount(plan, set);
    if (payoff > 0) {
      add(Math.min(95, payoff * (profile.hasEnabler ? 26 : 14)),
        profile.hasEnabler
          ? `it cashes in on the ${plan.name} you already have running`
          : `it is built for ${plan.name}`);
    }

    /*
     * 3. Speed profile. Trick Room is the reason this is a plan field and not a
     *    constant: it wants the slowest thing on the board.
     *
     * Signed on purpose. A base-130 Pokémon is not merely *unhelpful* on a
     * Trick Room team, it is a liability — it moves last while the room is up,
     * which is the one thing the plan exists to avoid. Scoring it zero let
     * coverage and raw stats hand the recommendation to exactly the Pokémon the
     * plan cannot use. Only the positive side earns a stated reason; the
     * penalty just lowers the score.
     */
    if (plan.speed === 'fast') {
      const points = (stats.spe - 70) / 1.6;
      if (points > 0) add(points, `at ${stats.spe} base Speed it outruns most of what you will meet`);
      else score += points;
    } else if (plan.speed === 'slow') {
      const points = (70 - stats.spe) / 1.1;
      if (points > 0) add(points, `${stats.spe} base Speed is slow enough to move first under Trick Room`);
      else score += points;
    }

    /*
     * 4. Bulk, weighted by the plan.
     *
     * The divisor is set so a genuinely bulky Pokémon on a `bulk: 1` plan earns
     * ~40 points, i.e. the same order as the coverage and defensive-hole terms.
     * At the original /6 it topped out near 25 and Stall recommended a Crobat
     * over a Slowbro — the plan whose entire identity is bulk was being decided
     * by base stat total and coverage instead.
     */
    const bulk = stats.hp + stats.def + stats.spd;
    add((bulk - 250) / 3.5 * (plan.bulk ?? 0.5), `it can take a hit (${bulk} total bulk)`);

    // 5. The defensive hole this covers. The most concrete argument available.
    const answers = profile.holes.filter(type => Dex.typeEffectiveness(type, species.types) < 1);
    if (answers.length) {
      add(38 * Math.min(2, answers.length),
        `your team has no answer to ${listOf(answers)} and this resists ${answers.length > 1 ? 'them' : 'it'}`);
    }

    /*
     * 6. Attacking types nobody else brings.
     *
     * Scaled by how full the party is. With one Pokémon drafted, *everything*
     * adds two or three "missing" types and the term pays out in full to every
     * candidate — which is noise, not signal, and it was loud enough to drown
     * out the Trick Room Speed profile entirely. A coverage gap is only a real
     * argument once there is a team for it to be a gap in.
     */
    const brings = [...new Set(moveIdsOf(set)
      .map(id => Dex.move(id))
      .filter(move => move.category !== 'Status' && move.basePower && !profile.covered.has(move.type))
      .map(move => move.type))];
    if (brings.length) {
      const maturity = Math.min(1, profile.size / 3);
      add(20 * Math.min(2, brings.length) * maturity,
        `it adds ${listOf(brings)} coverage the party does not have`);
    }

    // 7. It already holds something the plan wants.
    const heldBonus = (plan.items || {})[Dex.toID(set.item)] || 0;
    if (heldBonus > 0) add(30, `it arrives holding a ${Dex.item(set.item).name}`);

    reasons.sort((a, b) => b.points - a.points);
    return {score, reasons, species};
  }

  const listOf = items => (items.length <= 1
    ? String(items[0] || '')
    : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`);

  /**
   * Which recruit candidate to take.
   * @param {object} run
   * @param {object[]} candidates the sets on offer
   * @returns {{index:number, why:string}|null}
   */
  function recommendRecruit(run, candidates) {
    const list = candidates || [];
    if (!list.length) return null;
    const plan = planFor(run);
    const profile = partyProfile(run, plan);

    let best = null;
    list.forEach((set, index) => {
      const scored = recruitScore(set, plan, profile);
      if (!best || scored.score > best.score) best = Object.assign({index}, scored);
    });
    if (!best) return null;

    /*
     * Two reasons at most. One is thin for a decision this large; three reads
     * as a scorecard rather than an argument, and the third is always the
     * weakest of the three.
     */
    const top = best.reasons.slice(0, 2).map(reason => reason.text);
    const name = best.species.name;
    const why = top.length
      ? `${name}: ${top.join(', and ')}.`
      : `${name} is the strongest all-round option here.`;
    return {index: best.index, why, plan: plan.id};
  }

  /**
   * With a full party, which member to release for an incoming recruit.
   *
   * Deliberately the *least* useful member rather than the weakest on paper:
   * the one whose plan fit and coverage the party would miss least. Never
   * suggests releasing the only enabler of an active plan, which would trade
   * the whole plan for one Pokémon.
   */
  function recommendRelease(run, incomingSet = null) {
    const plan = planFor(run);
    const party = run.party || [];
    if (party.length < 2) return null;
    const enablers = party.filter(member => isEnabler(plan, member.set)).length;

    let worst = null;
    for (const member of party) {
      const species = Dex.species(member.set.species);
      const soleEnabler = planNeedsEnabler(plan) && enablers === 1 && isEnabler(plan, member.set);
      if (soleEnabler) continue;                    // never trade away the plan
      let score = species.bst / 12 + payoffCount(plan, member.set) * 20;
      if (plan.speed === 'fast') score += species.baseStats.spe / 3;
      if (plan.speed === 'slow') score += (150 - species.baseStats.spe) / 3;
      if (!worst || score < worst.score) worst = {score, member, species};
    }
    if (!worst) return null;
    const incoming = incomingSet ? Dex.species(incomingSet.species).name : 'the recruit';
    return {
      uid: worst.member.uid,
      why: `${PokemonLib.displayName(worst.member.set)} contributes least to your ${plan.name} plan, so it costs the least to swap for ${incoming}.`,
    };
  }

  /* ------------------------------------------------------------------ *
   * Abilities
   * ------------------------------------------------------------------ */

  /**
   * Which ability to take when the run offers a swap.
   *
   * Plan-first: Swift Swim is an unremarkable ability and the single best one
   * on a Rain team. Falls back to a small table of abilities that are strong
   * regardless, so the advice is not silent on a balanced team.
   */
  const STRONG_ABILITIES = {
    hugepower: 100, purepower: 100, adaptability: 70, protean: 75, libero: 75,
    magicguard: 80, regenerator: 75, intimidate: 65, levitate: 65, unaware: 60,
    speedboost: 85, moxie: 60, technician: 65, sheerforce: 65, guts: 55,
    thickfat: 55, waterabsorb: 50, voltabsorb: 50, flashfire: 50, naturalcure: 50,
    sturdy: 45, prankster: 70, multiscale: 80, wonderguard: 120, beastboost: 65,
  };

  function recommendAbility(run, member, abilities) {
    const list = abilities || [];
    if (!list.length || !member) return null;
    const plan = planFor(run);
    const index = planIndex(plan);
    const profile = partyProfile(run, plan);
    const current = Dex.toID(member.set.ability);

    let best = null;
    for (const name of list) {
      const id = Dex.toID(name);
      let score = STRONG_ABILITIES[id] || 25;
      let reason = null;
      if (index.enablerAbilities.has(id)) {
        score += profile.hasEnabler ? 60 : 190;
        reason = profile.hasEnabler
          ? `a second ${plan.name} setter`
          : `it sets your ${plan.name} up by itself, which nothing in the party does yet`;
      } else if (index.payoffAbilities.has(id)) {
        score += profile.hasEnabler ? 90 : 45;
        reason = `it is what a ${plan.name} team wants`;
      }
      if (id === current) score -= 15;              // a swap should be an upgrade
      if (!best || score > best.score) best = {score, name, id, reason};
    }
    if (!best || best.id === current) return null;
    const ability = Dex.ability(best.name);
    const why = best.reason
      ? `${best.name}: ${best.reason}.`
      : `${best.name} is the strongest of these: ${ability?.shortDesc || 'a solid ability'}`;
    return {ability: best.name, why};
  }

  function reasonForReward(run, option) {
    switch (option.kind) {
      case 'recruit': return 'A wider roster covers more matchups than any single item.';
      case 'relic': return 'Relics last the whole run.';
      case 'tm': return 'This upgrades a move on someone in the party.';
      case 'held': {
        const target = recommendHeldItemTarget(run, option.id);
        return target ? target.why : 'A useful held item.';
      }
      case 'credits': return 'Flexible — shops turn credits into whatever the team needs.';
      case 'consumable': return run.party.some(m => m.condition.currentHP <= 0)
        ? 'The team is hurt; healing is worth more than usual.'
        : 'Useful, but the team is healthy right now.';
      default: return 'Best of the options offered.';
    }
  }

  /* ------------------------------------------------------------------ *
   * Battle lead
   * ------------------------------------------------------------------ */

  /* Moves that want turn one, and weather that a teammate may be built around.
   * Kept here rather than imported from `ai.js` because the advisor must not
   * grow a dependency on the full-information battle AI — see docs/AI_DESIGN.md. */
  const LEAD_MOVES = new Set(['stealthrock', 'spikes', 'toxicspikes', 'stickyweb',
    'reflect', 'lightscreen', 'auroraveil', 'tailwind']);
  const SUICIDE_MOVES = new Set(['explosion', 'selfdestruct', 'memento', 'healingwish', 'lunardance']);
  const SETUP_MOVES = new Set(['swordsdance', 'dragondance', 'nastyplot', 'calmmind', 'bulkup',
    'quiverdance', 'shellsmash', 'bellydrum', 'agility', 'rockpolish', 'irondefense',
    'workup', 'howl', 'growth', 'coil', 'honeclaws', 'victorydance', 'tidyup', 'clangoroussoul']);
  const WEATHER_SETTERS = {
    drought: 'sun', drizzle: 'rain', sandstream: 'sand', snowwarning: 'snow',
    orichalcumpulse: 'sun', hadronengine: 'electric',
  };
  const WEATHER_MOVES = {sunnyday: 'sun', raindance: 'rain', sandstorm: 'sand', snowscape: 'snow', hail: 'snow'};
  const WEATHER_ABUSERS = {
    // Kept in step with `AI.WEATHER_ABUSERS` by hand — the two tables must
    // agree or Assist Mode and the battle AI disagree about what a Sun team is.
    // Protosynthesis and Quark Drive are the modern pair: sun turns one on,
    // Electric Terrain the other (see TERRAIN_ABUSERS below).
    sun: new Set(['chlorophyll', 'solarpower', 'flowergift', 'leafguard', 'harvest', 'protosynthesis']),
    rain: new Set(['swiftswim', 'raindish', 'dryskin', 'hydration']),
    sand: new Set(['sandrush', 'sandveil', 'sandforce']),
    snow: new Set(['slushrush', 'snowcloak', 'iceface', 'icebody']),
  };
  const TERRAIN_SETTERS = {electricsurge: 'electric', psychicsurge: 'psychic', hadronengine: 'electric'};
  const TERRAIN_MOVES = {electricterrain: 'electric', psychicterrain: 'psychic'};
  const TERRAIN_ABUSERS = {
    electric: {abilities: new Set(['quarkdrive', 'surgesurfer', 'galvanize']), items: new Set(['electricseed'])},
    psychic: {abilities: new Set([]), items: new Set(['psychicseed'])},
  };
  /**
   * Flying types and floating abilities are untouched by terrain.
   *
   * Asked through the registry's own `ungrounded` declaration rather than by
   * name, so Levitate and Eelevate are both covered and a third one needs no
   * edit here — the same change was made to `AI.estimateDamage` and the AI's
   * Gravity valuation, which is the §1 rule about a change reaching every
   * consumer.
   */
  const FLOATS = set => Dex.species(set.species).types.includes('Flying') ||
    !!RedGPT.Abilities.get(set.ability)?.ungrounded || Dex.toID(set.item) === 'airballoon';
  /* Snow is usually set for Aurora Veil, which is a screens plan and is covered
   * by the screens theme. Only Slush Rush justifies leading the snow setter —
   * mirrors `AI.LEAD_ABUSERS`. */
  const LEAD_ABUSERS = {snow: new Set(['slushrush'])};
  const TAILWIND_SPEED_CEILING = 115;

  /**
   * Which party index should lead, given the opposing team.
   *
   * **Deliberately restricted to what the player can see.** At Team Preview that
   * is the opponent's *species* and nothing else — `hideOpponentDetails` is on in
   * every format, and two relics are sold on revealing opponent details, so an
   * advisor that read the opposing moveset would hand over for free what those
   * relics charge for. The battle AI's own `chooseTeamPreview` is full
   * information and is therefore **not** reused here (docs/AI_DESIGN.md §2).
   *
   * What *is* fair, and was missing: the player fully sees their own team, so
   * leading is treated as a role rather than as a type matchup alone. A hazard
   * or screen setter wants turn one; a suicide lead wants it most; a weather
   * setter wants to be out before the teammates built around its weather; and a
   * win condition wants the field cleared first, so it is held back.
   */
  const SCREEN_MOVES = new Set(['reflect', 'lightscreen', 'auroraveil']);
  const TRICK_ROOM_SPEED = 65;

  /**
   * The party member that *must* lead, because the rest of the team does not
   * function until it has acted.
   *
   * The mirror of `AI.themeLead`, and it has to exist twice: `ai.js` loads
   * before `campaign/` in the script order (§4), so the advisor cannot import
   * it, and the two run on different shapes — battle Pokémon there, sets here.
   * The *rule* is identical, which is what matters, and it costs the advisor no
   * opponent information: which weather your own team wants is your own team's
   * business, so this is squarely inside the §2 boundary.
   *
   * See `AI.themeLead` for why Trick Room, screens and the Rain/Sun ability
   * setters are unconditional while Sand, Snow and every weather *move* setter
   * have to show an abuser first.
   */
  function themeLeadFromSets(sets) {
    const list = sets || [];
    if (list.length < 2) return null;
    const movesOf = set => (set.moves || []).map(Dex.toID);
    const abilityOf = set => Dex.toID(set.ability);
    const candidates = [];

    const trIndex = list.findIndex(set => movesOf(set).includes('trickroom'));
    if (trIndex >= 0) {
      const slow = list.filter((set, i) => i !== trIndex &&
        Dex.species(set.species).baseStats.spe <= TRICK_ROOM_SPEED).length;
      candidates.push({index: trIndex, theme: 'Trick Room', payoff: 1 + slow});
    }

    const scIndex = list.findIndex(set => movesOf(set).some(id => SCREEN_MOVES.has(id)));
    if (scIndex >= 0) {
      const users = list.filter((set, i) => i !== scIndex &&
        movesOf(set).some(id => SETUP_MOVES.has(id))).length;
      candidates.push({index: scIndex, theme: 'screens', payoff: 1 + users});
    }

    // Terrain — Electric and Psychic, mirroring `AI.themeLead`. Psychic's
    // priority protection only reaches grounded teammates, so only those count.
    list.forEach((set, i) => {
      const fromAbility = TERRAIN_SETTERS[abilityOf(set)] || null;
      const fromMove = movesOf(set).map(id => TERRAIN_MOVES[id]).find(Boolean) || null;
      const terrain = fromAbility || fromMove;
      if (!terrain) return;
      const abusers = TERRAIN_ABUSERS[terrain];
      let payoff = list.filter((other, j) => {
        if (j === i) return false;
        if (abusers.abilities.has(abilityOf(other))) return true;
        if (abusers.items.has(Dex.toID(other.item))) return true;
        if (terrain === 'psychic') return !FLOATS(other);
        return movesOf(other).some(id => Dex.move(id).category !== 'Status' && Dex.move(id).type === 'Electric');
      }).length;
      const dedicated = !!fromAbility;
      if (!dedicated && payoff < 1) return;
      if (dedicated) payoff += 1;
      candidates.push({
        index: i,
        theme: terrain === 'electric' ? 'Electric Terrain' : 'Psychic Terrain',
        payoff,
      });
    });

    // Tailwind — doubles Speed for the team, so it is led for the strong but
    // middling-Speed attackers behind it. Mirrors `AI.themeLead`.
    const twIndex = list.findIndex(set => movesOf(set).includes('tailwind'));
    if (twIndex >= 0) {
      const beneficiaries = list.filter((set, i) => {
        if (i === twIndex) return false;
        const stats = Dex.species(set.species).baseStats;
        return Math.max(stats.atk, stats.spa) >= 95 && stats.spe < TAILWIND_SPEED_CEILING;
      }).length;
      if (beneficiaries >= 1) candidates.push({index: twIndex, theme: 'Tailwind', payoff: beneficiaries});
    }

    list.forEach((set, i) => {
      const fromAbility = WEATHER_SETTERS[abilityOf(set)] || null;
      const fromMove = movesOf(set).map(id => WEATHER_MOVES[id]).find(Boolean) || null;
      const weather = fromAbility || fromMove;
      if (!weather) return;
      const abuserSet = LEAD_ABUSERS[weather] || WEATHER_ABUSERS[weather];
      const abusers = list.filter((other, j) => j !== i &&
        abuserSet && abuserSet.has(abilityOf(other))).length;
      const dedicated = !!fromAbility && (weather === 'rain' || weather === 'sun');
      if (!dedicated && abusers < 1) return;
      const label = weather.charAt(0).toUpperCase() + weather.slice(1);
      candidates.push({index: i, theme: label, payoff: abusers + (dedicated ? 1 : 0)});
    });

    if (!candidates.length) return null;
    return candidates.reduce((best, entry) => (entry.payoff > best.payoff ? entry : best));
  }

  function recommendLead(playerSets, enemySets) {
    const sets = playerSets || [];
    const movesOf = set => (set.moves || []).map(Dex.toID);

    // A themed team's setter leads outright — the same hard rule the battle AI
    // applies, so Assist Mode and the AI agree about what a Rain team does.
    const forced = themeLeadFromSets(sets);
    if (forced) return forced.index;

    /* Which weathers does this team actually want? Computed once over the whole
     * party, because "lead the weather setter" is only right when somebody else
     * is built to use it. */
    const wanted = new Set();
    for (const set of sets) {
      const ability = Dex.toID(set.ability);
      for (const [weather, abusers] of Object.entries(WEATHER_ABUSERS)) {
        if (abusers.has(ability)) wanted.add(weather);
      }
    }

    let best = null;
    sets.forEach((set, index) => {
      const species = Dex.species(set.species);
      let score = species.bst / 6;
      for (const foe of enemySets || []) {
        const foeSpecies = Dex.species(foe.species);
        // How hard we hit them, and how hard they hit us.
        let offence = 1;
        for (const type of species.types) {
          offence = Math.max(offence, Dex.typeEffectiveness(type, foeSpecies.types));
        }
        let defence = 1;
        for (const type of foeSpecies.types) {
          defence = Math.max(defence, Dex.typeEffectiveness(type, species.types));
        }
        score += (offence - defence) * 18;
      }

      const moves = movesOf(set);
      const ability = Dex.toID(set.ability);
      if (moves.some(id => SUICIDE_MOVES.has(id))) score += 42;
      else if (moves.some(id => LEAD_MOVES.has(id))) score += 26;
      const weather = WEATHER_SETTERS[ability] ||
        WEATHER_MOVES[moves.find(id => WEATHER_MOVES[id]) || ''];
      if (weather && wanted.has(weather)) score += 24;
      // A win condition should not be led with — it wants the field cleared.
      if (moves.some(id => SETUP_MOVES.has(id)) && !moves.some(id => LEAD_MOVES.has(id))) score -= 16;

      if (!best || score > best.score) best = {score, index};
    });
    return best ? best.index : 0;
  }

  global.RedGPT.Advisor = {
    moveScore, contextualScore, itemFit,
    recommendMoveReplacement, recommendTm, recommendTutorMove,
    recommendHeldItemTarget, recommendReward, rewardScore, recommendLead,
    // Team plans
    planFor, planMoveBias, isEnabler, payoffCount, planNeedsEnabler,
    partyProfile, recruitScore, recommendRecruit, recommendRelease, recommendAbility,
    themeLeadFromSets,
  };
})(typeof window !== 'undefined' ? window : globalThis);
