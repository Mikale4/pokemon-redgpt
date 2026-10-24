/**
 * Battle AI.
 *
 * The AI reads only information a human opponent could have: the public battle
 * state plus its own team. It never inspects future RNG rolls — damage is
 * *estimated* with an average damage roll and the same modifier pipeline the
 * engine uses. Probabilistic decisions draw from `battle.aiRng`, a stream kept
 * separate from the mechanics RNG so replaying a recorded command list (which
 * skips AI evaluation) reproduces the battle exactly.
 *
 * Difficulty changes the quality of the decision, not the rules:
 *   casual   frequently picks a merely-reasonable move, rarely switches
 *   trainer  solid move choice, basic switching
 *   ace      accurate KO maths, hazard/status planning, good switching
 *   expert   full evaluation including opponent threat projection and
 *            preservation of win conditions
 */
(function (global) {
  'use strict';

  const RedGPT = global.RedGPT;
  const Dex = RedGPT.Dex;
  const Mechanics = RedGPT.Mechanics;

  /*
   * Difficulty tiers.
   *
   * Tiers differ by the **mistakes they make**, not by abstract weights on a
   * shared ranking. That distinction is the whole design, and it was learned the
   * hard way: the tiers used to differ only in `noise`/`topN` (how far down a
   * good ranking they would pick) and in how eagerly they switched. Measured head
   * to head on mirrored teams, that produced no separation at all — every pairing
   * sat inside the noise band — because the 2nd- and 3rd-best moves on a real set
   * are usually also fine, so "picks the 3rd best move sometimes" costs nothing.
   *
   *   mistakeChance  ignore the ranking entirely and pick a random legal move
   *   koBlindness    fail to notice a move that would knock the target out
   *   sloppyType     ignore resistances when ranking damage
   *
   * Those three cost real games: a missed KO hands over a turn and a Pokémon, a
   * random move can be a resisted attack or a wasted status move.
   *
   * `switchThreshold` is a *matchup margin*, and switching costs a whole turn
   * here (the incoming Pokémon eats a free hit — see `considerSwitch`), so the
   * thresholds are high across the board and rise with tier. They used to fall,
   * which had the strongest tier switching ~5 times a 17-turn battle and losing
   * to Casual 34-66.
   */
  const DIFFICULTIES = {
    casual: {
      id: 'casual', name: 'Casual',
      description: 'Learning the ropes. Often misses knockouts, plays into resistances and rarely switches.',
      mistakeChance: 0.52, koBlindness: 0.7, sloppyType: 0.6,
      noise: 0.55, topN: 3, switchThreshold: 3.4, switchChance: 0.15,
      usesStatus: 0.4, usesHazards: 0.15, usesSetup: 0.2, predicts: false, savesRevenge: false,
    },
    trainer: {
      id: 'trainer', name: 'Trainer',
      description: 'Competent. Uses type matchups, status and healing, but still lets knockouts slip.',
      mistakeChance: 0.26, koBlindness: 0.34, sloppyType: 0.22,
      noise: 0.25, topN: 2, switchThreshold: 4.0, switchChance: 0.35,
      usesStatus: 0.75, usesHazards: 0.55, usesSetup: 0.55, predicts: false, savesRevenge: false,
    },
    ace: {
      id: 'ace', name: 'Ace',
      description: 'Strong. Counts damage accurately, sets hazards and rarely misses a knockout.',
      mistakeChance: 0.14, koBlindness: 0.18, sloppyType: 0.07,
      noise: 0.08, topN: 2, switchThreshold: 4.6, switchChance: 0.5,
      usesStatus: 0.95, usesHazards: 0.9, usesSetup: 0.85, predicts: true, savesRevenge: true,
    },
    expert: {
      id: 'expert', name: 'Expert',
      description: 'Tournament level. Never misses a knockout it can see, and switches only when it clearly pays.',
      mistakeChance: 0, koBlindness: 0, sloppyType: 0,
      noise: 0, topN: 1, switchThreshold: 5.2, switchChance: 0.6,
      usesStatus: 1, usesHazards: 1, usesSetup: 1, predicts: true, savesRevenge: true,
    },
  };

  /**
   * How many boost stages a Pokémon may already hold and still be offered a
   * "free" setup turn in front of something it outspeeds and can knock out.
   *
   * This is the loop bound. The safety gate does not provide one: at full HP
   * against a weak attacker every condition stays true turn after turn, so the
   * AI would boost, boost, boost and never take the kill it has had all along.
   * Two stages is a Dragon Dance and a follow-up; past that, take the knockout.
   */
  const FREE_SETUP_STACK_CAP = 2;

  /**
   * Does something guarantee `pokemon` lives through `move`, whatever it rolls?
   *
   * Only for the effects a damage estimate **cannot** express. Most mitigation
   * is already priced by `estimateDamage` and needs nothing here: Fluffy halves
   * a contact hit and doubles a Fire one, Wonder Guard zeroes anything not
   * super-effective, and Ice Scales, Thick Fat, Heatproof, Filter, Solid Rock,
   * Prism Armor, Multiscale and Shadow Shield all come through as smaller
   * numbers. Re-listing those here would double-count them.
   *
   * What is left is the effects that survive an *arbitrarily large* hit, which
   * no multiplier can represent:
   *
   *   Focus Sash / Sturdy  live on 1 HP from full, however big the hit
   *   Disguise             the hit is blocked outright (no HP cost, §5)
   *   Ice Face             the same, but only against a Physical move
   *
   * Ice Face is the one that actually needed saying: `estimateDamage` does not
   * model it, so a full-HP Eiscue read a Close Combat as 174 damage when it
   * really takes none.
   */
  function survivesOutright(battle, pokemon, move) {
    if (!move || move.category === 'Status') return true;
    const ability = Dex.toID(pokemon.ability);
    const item = Dex.toID(pokemon.item);
    const atFull = pokemon.currentHP === pokemon.maxHP;
    if (atFull && (item === 'focussash' || ability === 'sturdy')) return true;
    if (ability === 'disguise' && !pokemon.volatiles.disguiseBusted) return true;
    if (ability === 'iceface' && !pokemon.volatiles.iceFaceBroken && move.category === 'Physical') return true;
    return false;
  }

  const SETUP_MOVES = new Set(['swordsdance', 'nastyplot', 'dragondance', 'calmmind', 'quiverdance', 'bulkup',
    'irondefense', 'agility', 'rockpolish', 'shellsmash', 'bellydrum', 'curse', 'coil', 'honeclaws', 'workup',
    'growth', 'tailglow', 'geomancy', 'clangoroussoul', 'noretreat', 'victorydance', 'takeheart', 'shiftgear',
    'autotomize', 'cosmicpower', 'amnesia', 'barrier', 'acidarmor', 'defensecurl', 'howl', 'meditate', 'sharpen',
    'dragonhammer', 'filletaway', 'tidyup', 'torchsong']);
  const HAZARD_MOVES = new Set(['stealthrock', 'spikes', 'toxicspikes', 'stickyweb']);
  const REMOVAL_MOVES = new Set(['defog', 'rapidspin', 'mortalspin', 'tidyup', 'courtchange']);
  /**
   * Protect and its variants — the moves that buy a turn by *refusing* the hit.
   *
   * Derived from `Mechanics.PROTECT_MOVES` rather than listed, so a new variant
   * is picked up automatically; the inline copy this replaced had drifted and
   * was missing Obstruct. **Endure is the one deliberate exclusion**: it does
   * not block the move, it survives it at 1 HP, so none of the chip-healing
   * reasoning below applies to it.
   */
  const BLOCKING_PROTECT_MOVES = new Set([...RedGPT.Mechanics.PROTECT_MOVES].filter(id => id !== 'endure'));

  /** Moves that still execute while their user is asleep. */
  const SLEEP_USABLE = new Set(['sleeptalk', 'snore']);

  /**
   * Is this Pokémon asleep *and still going to be* when it tries to move?
   *
   * `sleepTurns` is spent at the start of each move attempt: at 1 it decrements
   * to 0 and the Pokémon is still asleep this turn, and only at 0 does it wake
   * and act. So "asleep right now" for choice-making purposes is `> 0`, not
   * `>= 0`, and getting that boundary wrong would have the AI throw away the
   * turn it wakes up on.
   */
  function stillAsleep(pokemon) {
    return pokemon.status === 'slp' && (pokemon.statusData?.sleepTurns || 0) > 0;
  }

  /**
   * How many turns of *doing nothing* using Rest would cost this Pokémon.
   *
   * `Rest` sets `sleepTurns = 2`, spent one per move attempt, so the sleeper is
   * helpless on the next two turns and acts again on the third. Two things cut
   * that, and both are the reason the sets that run Rest run them:
   *
   * - **Early Bird** (`fastWake`) burns two counters a turn, so only one turn
   *   is actually lost.
   * - **Sleep Talk or Snore** in the moveset means no turn is lost at all —
   *   the Pokémon keeps acting through the sleep, which is the entire point of
   *   the pairing.
   *
   * A status-curing held item is deliberately *not* counted: Chesto and Lum are
   * one-shot, and a Rest priced as free because of a berry that has already
   * been eaten is worse than one priced conservatively.
   */
  function restingTurns(battle, pokemon) {
    if ((pokemon.moves || []).some(slot => SLEEP_USABLE.has(Dex.toID(slot.id)))) return 0;
    return battle.abilityOf(pokemon)?.fastWake ? 1 : 2;
  }

  const RECOVERY_MOVES = new Set(['recover', 'roost', 'softboiled', 'milkdrink', 'slackoff', 'synthesis',
    'moonlight', 'morningsun', 'shoreup', 'rest', 'healorder', 'strengthsap', 'junglehealing', 'lunarblessing']);
  const PIVOT_MOVES = new Set(['uturn', 'voltswitch', 'flipturn', 'partingshot', 'batonpass', 'teleport', 'chillyreception', 'shedtail']);
  const SCREEN_MOVES = new Set(['reflect', 'lightscreen', 'auroraveil']);
  /**
   * Status moves that are *for* the turn you are about to faint on, and are worth
   * more the more certain that is: Destiny Bond trades the knockout back, Memento
   * pays its own HP to cripple the attacker, and the two wishes hand a full
   * recovery to whoever comes in next. Every other utility move is a turn bought
   * on credit that a doomed Pokémon never gets to collect — see `scoreMove`.
   */
  const LAST_STAND_MOVES = new Set(['destinybond', 'memento', 'healingwish', 'lunardance']);

  /** Moves that undo the opponent's setup, so setting up into them is wasted. */
  const PHAZING_MOVES = new Set(['roar', 'whirlwind', 'dragontail', 'circlethrow', 'haze', 'clearsmog',
    'perishsong', 'encore', 'taunt', 'trick', 'switcheroo']);
  /** Moves that punish a switch, so pivoting away from them is not free. */
  const TRAPPING_ABILITIES = new Set(['shadowtag', 'arenatrap', 'magnetpull']);
  const CONTACT_PUNISH_ABILITIES = new Set(['roughskin', 'ironbarbs', 'flamebody', 'static',
    'poisonpoint', 'effectspore', 'cursedbody', 'gooey', 'tanglinghair', 'aftermath', 'perishbody']);
  const HAZARD_IMMUNE_ABILITIES = new Set(['magicguard']);
  const REMOVAL_ALL = new Set([...REMOVAL_MOVES]);

  function difficulty(id) {
    return DIFFICULTIES[Dex.toID(id || 'trainer')] || DIFFICULTIES.trainer;
  }

  /* ------------------------------------------------------------------ *
   * Awareness helpers
   *
   * Everything below answers a question the AI used to ignore entirely: what
   * does this Pokémon's item let it do, what does its ability change, what will
   * the hazards on the floor cost, and will this move even work this turn.
   * ------------------------------------------------------------------ */

  /** Fraction of max HP a Pokémon loses walking into its own side's hazards. */
  function hazardCost(battle, pokemon, sideIndex = pokemon.side) {
    const cond = battle.sides[sideIndex].conditions;
    if (battle.itemOf(pokemon)?.ignoreHazards) return 0;
    const ability = Dex.toID(battle.abilityOf(pokemon)?.id || pokemon.ability);
    let cost = 0;
    if (cond.stealthrock) cost += Dex.typeEffectiveness('Rock', pokemon.types) / 8;
    const grounded = battle.isGrounded(pokemon);
    if (grounded && cond.spikes > 0) cost += [0, 1 / 8, 1 / 6, 1 / 4][cond.spikes];
    // Magic Guard takes no chip at all, but Sticky Web and Toxic Spikes still
    // land their non-damaging halves, so they are priced separately below.
    if (HAZARD_IMMUNE_ABILITIES.has(ability)) cost = 0;
    if (grounded && cond.toxicspikes > 0 && !pokemon.types.includes('Poison') &&
        !pokemon.types.includes('Steel') && !battle.abilityOf(pokemon)?.toxicSpikesImmune) {
      cost += cond.toxicspikes >= 2 ? 0.22 : 0.12;   // ongoing poison, not one hit
    }
    if (grounded && cond.stickyweb) cost += 0.08;    // a Speed drop, priced as chip
    return cost;
  }

  /** Would this hazard actually bite the Pokémon still on the opposing bench? */
  /**
   * What one more layer of this hazard would actually cost the opposing team.
   *
   * Returned as an average fraction of a health bar per remaining Pokémon, so
   * it is directly comparable across hazards. Counting *heads* — as this used
   * to — rated Stealth Rock the same against a team of Charizards as against a
   * team of Steels, when it is four times the damage against one and an eighth
   * against the other. It already knew Heavy-Duty Boots, Levitate and Magic
   * Guard opt out; now it knows by how much everyone else suffers.
   *
   * Existing layers are accounted for: a fourth layer of Spikes is worth
   * nothing, and the marginal value of the third is smaller than the first.
   */
  function hazardValue(battle, sideIndex, moveId) {
    const foeSide = battle.sides[1 - sideIndex];
    const targets = foeSide.team.filter(p => !p.fainted && p !== battle.active(1 - sideIndex));
    if (!targets.length) return 0;
    const cond = foeSide.conditions;
    const SPIKE_STEPS = [0, 1 / 8, 1 / 6, 1 / 4];

    let total = 0;
    for (const mon of targets) {
      if (battle.itemOf(mon)?.ignoreHazards) continue;          // Heavy-Duty Boots
      const ability = Dex.toID(mon.ability);
      const immune = HAZARD_IMMUNE_ABILITIES.has(ability);      // Magic Guard
      const grounded = battle.isGrounded(mon);

      if (moveId === 'stealthrock') {
        if (immune || cond.stealthrock) continue;
        // Rock effectiveness is the whole point: 4x on Charizard, 1/4 on Excadrill.
        total += Dex.typeEffectiveness('Rock', mon.types) / 8;
        continue;
      }
      if (!grounded) continue;                                   // the floor hazards miss
      if (moveId === 'spikes') {
        if (immune || cond.spikes >= 3) continue;
        total += SPIKE_STEPS[cond.spikes + 1] - SPIKE_STEPS[cond.spikes];
      } else if (moveId === 'toxicspikes') {
        if (cond.toxicspikes >= 2) continue;
        if (mon.types.includes('Poison') || mon.types.includes('Steel')) continue;
        if (battle.abilityOf(mon)?.toxicSpikesImmune) continue;
        // Poison is worth much more than one hit of chip over a long game.
        total += cond.toxicspikes === 0 ? 0.12 : 0.10;
      } else if (moveId === 'stickyweb') {
        if (cond.stickyweb) continue;
        total += 0.08;
      }
    }
    // Scaled so a full-value layer against a whole bench reads ~1.
    return Math.min(1.5, (total / targets.length) / 0.125);
  }

  /** Does the opposing side still hold an answer to hazards? */
  function foeHasRemoval(battle, sideIndex) {
    return battle.sides[1 - sideIndex].team.some(mon => !mon.fainted &&
      (mon.moves || []).some(slot => REMOVAL_ALL.has(slot.id) && slot.pp > 0));
  }

  /**
   * Will this move simply fail if used right now?
   *
   * Asks the engine rather than keeping a second copy of the rules — the list in
   * `moveSpecialFailure` is project-specific (Sucker Punch and First Impression
   * are unconditional here, Fake Out is not) and a duplicate would drift.
   */
  /**
   * Abilities that refuse an incoming move outright.
   *
   * Matched by name rather than by running the ability's own `onTryHit`, for the
   * same reason `estimateDamage` does it: those hooks *mutate* — Flash Fire
   * takes a boost, Disguise busts — and asking what a move would do must never
   * change anything (§5). The cost of the copy is that a new immunity ability
   * has to be added here too.
   */
  const STATUS_IMMUNE_ABILITIES = {
    goodasgold: () => true,                                  // refuses any status move aimed at it
    magicbounce: () => true,                                 // worse than failing: it comes back
    soundproof: move => !!move.flags?.sound,
    overcoat: move => !!move.flags?.powder,
    bulletproof: move => !!move.flags?.bullet,
  };

  /**
   * The same, for held items.
   *
   * A separate table because the engine keeps them separate too, and missing it
   * is easy: powder immunity lives in **two** places in `executeMove` — Grass
   * and Overcoat are refused early, while Safety Goggles is caught later by the
   * item hook. A first version of this gate covered only the ability half, and
   * Spore into a Safety Goggles holder still scored +40.
   */
  const IMMUNE_ITEMS = {
    safetygoggles: move => !!move.flags?.powder,
    airballoon: (move, battle, holder) => move.category !== 'Status' &&
      battle.moveType(holder, holder, move) === 'Ground',
  };

  /**
   * Would this move accomplish nothing at all against this target?
   *
   * `moveSpecialFailure` covers the engine's hand-written preconditions (Fake
   * Out's first turn, Dark Void being Darkrai-only, Destiny Bond's repeat rule)
   * but **not type immunity**, and nothing else asked. So a Grimmsnarl scored
   * Thunder Wave 95 — its best move — against a Ground-type Gliscor and threw it
   * every single turn, because nothing in the loop could ever change. Reported
   * from a real battle log.
   *
   * Damaging moves were already safe: `estimateDamage` returns 0 for an immune
   * target, so they score as worthless on their own. It is *status* moves that
   * had no check, because they are scored by what they inflict rather than by
   * damage.
   *
   * Mirrors `executeMove`'s own refusal order, side-effect free throughout.
   */
  function cannotAffect(battle, self, foe, move) {
    if (!foe || foe === self) return false;
    // Self-targeting, ally-side and hazard moves are not aimed at this Pokémon,
    // so its immunities have nothing to say about them.
    if (typeof battle.aimedAtFoePokemon === 'function' && !battle.aimedAtFoePokemon(move)) return false;

    /*
     * Primal weather refuses the opposing element outright, so a Fire move
     * under heavy rain can never do anything. This mirrors the refusal in
     * `executeMove` and has to exist, or the AI repeats a move that always
     * fails for as long as the weather is up — §8's Thunder-Wave-into-Gliscor
     * bug, which is the failure mode of a refusal the AI does not know about.
     */
    if (battle.field.weatherPrimal && move.category !== 'Status') {
      const blocked = battle.field.weatherPrimal === 'primordialsea' ? 'Fire' : 'Water';
      if (battle.moveType(self, foe, move) === blocked) return true;
    }

    if (move.flags?.powder && foe.types.includes('Grass')) return true;

    /*
     * Priority is refused outright by Psychic Terrain (against a grounded
     * target) and by Dazzling / Queenly Majesty / Armor Tail.
     *
     * Reported from a real log: a Kingambit threw Sucker Punch into a Tapu Lele
     * under its own Psychic Terrain on three consecutive turns and died without
     * landing anything. `scoreMove` *did* know — it computes `priorityBlocked` —
     * but only ever used it to withhold a +80 bonus, so the move kept its full
     * damage score and stayed the best-rated option. A guard that knows a move
     * cannot work and does not refuse it is the §8 Thunder-Wave-into-Gliscor
     * bug wearing the costume of a fix.
     *
     * **Mirrors the engine, which reads the packaged `move.priority`** rather
     * than the effective one (`executeMove`, and see `effectivePriority` for
     * the difference). So Grassy Glide — whose +1 this project applies in
     * `runTurn` against a packaged 0 — really does land under Psychic Terrain
     * here, and the AI must keep using it. Mirroring the engine rather than the
     * games is the whole point: the AI has to agree with the battle it is in.
     */
    if ((move.priority || 0) > 0 && move.target !== 'self') {
      if (battle.defenderAbility(foe, self)?.blocksPriority) return true;
      if (battle.field.terrain === 'psychic' && battle.isGrounded(foe)) return true;
    }

    const aimedStatus = move.category === 'Status' && move.target !== 'self';
    if (aimedStatus && !move.ignoreImmunity &&
        battle.effectiveness(move.type, foe, move) === 0) return true;
    // Dark types ignore Prankster-boosted status moves.
    if (aimedStatus && foe.types.includes('Dark') && battle.abilityOf(self)?.prankster) return true;

    const guard = STATUS_IMMUNE_ABILITIES[Dex.toID(foe.ability)];
    if (guard) {
      // Good as Gold and Magic Bounce only intercept *status* moves.
      const statusOnly = ['goodasgold', 'magicbounce'].includes(Dex.toID(foe.ability));
      if ((!statusOnly || aimedStatus) && guard(move)) return true;
    }

    const heldGuard = IMMUNE_ITEMS[Dex.toID(foe.item)];
    if (heldGuard && heldGuard(move, battle, foe)) return true;
    return false;
  }

  /**
   * A weather or terrain move that cannot change the field.
   *
   * `cannotAffect` cannot answer this: it is about what the *target* can be
   * hurt by, and these moves are not aimed at the target at all — they exit its
   * `aimedAtFoePokemon` guard immediately. So it needs its own check, and
   * without one the AI throws the move every turn, which is §8's
   * Thunder-Wave-into-Gliscor bug once more. Reported: a Ludicolo used Rain
   * Dance under Primal Groudon's Desolate Land and the log read "But it
   * failed!".
   *
   * Two refusals, both mirrored from `setWeather` / `setTerrain`:
   *
   * - **Primal weather refuses every ordinary weather outright.** That is most
   *   of what makes it primal (§5), and it is the reported case.
   * - **Setting the weather or terrain that is already up does nothing.**
   *
   * Moves that do something *else* as well are excluded, because failing to
   * change the weather does not make them useless: Chilly Reception still
   * pivots, and a damaging move still damages.
   */
  function fieldMoveFails(battle, move) {
    if (move.category !== 'Status') return false;
    if (Mechanics.SELF_SWITCH_MOVES.has(move.id) || move.selfSwitch) return false;
    if (move.weather) {
      if (battle.field.weatherPrimal) return true;
      return battle.field.weather === Mechanics.canonicalWeather(move.weather);
    }
    if (move.terrain) {
      return battle.field.terrain === Dex.toID(move.terrain).replace(/terrain$/, '');
    }
    return false;
  }

  function willFail(battle, self, foe, move) {
    try {
      if (battle.moveSpecialFailure(self, foe, move)) return true;
      if (cannotAffect(battle, self, foe, move)) return true;
      if (fieldMoveFails(battle, move)) return true;
    } catch { /* treat an unanswerable question as "it might work" */ }
    return false;
  }

  /**
   * Moves that defeat themselves in a way `willFail` cannot see, because at
   * choice time the thing that breaks them has not happened yet.
   *
   * **Currently empty, deliberately.** Its only entry was Focus Punch, which
   * used to fail outright if the user took any damage first — at -3 priority
   * that was the normal case, so the AI scored it −800 unless it was behind a
   * Substitute. Focus Punch no longer has that condition (project decision; it
   * pays 70% accuracy instead), so the penalty had to go with it or the AI would
   * have kept refusing a move that now simply works.
   *
   * Kept rather than deleted because the *shape* is the useful part: a move
   * whose failure depends on what happens between the choice and the execution
   * cannot be caught by `willFail`, and this is where it goes.
   */
  function selfDefeating(battle, self, foe, move) {
    void battle; void self; void foe; void move;
    return false;
  }

  /** Choice items lock the holder into the move it picks. */
  function choiceLocked(battle, pokemon) {
    return !!battle.itemOf(pokemon)?.choiceLock || !!Dex.item(pokemon.item)?.isChoice;
  }

  /* ------------------------------------------------------------------ *
   * Turn order
   *
   * "Do I move first" was a bare Speed comparison, which is wrong the moment
   * anything interesting is happening: priority, Trick Room, Tailwind, Prankster
   * and a Choice Scarf all decide turns that raw Speed gets backwards.
   * ------------------------------------------------------------------ */

  /** Effective priority of a move for its user, including ability modifiers. */
  function effectivePriority(battle, pokemon, move) {
    if (!move) return 0;
    let priority = battle.modifyValue('onModifyPriority', pokemon, move.priority || 0, move);
    const ability = battle.abilityOf(pokemon);
    if (typeof ability?.onFractionalPriority === 'function') {
      priority += ability.onFractionalPriority(battle, pokemon, move) || 0;
    }
    // Grassy Glide's +1 is applied in runTurn against the packaged priority 0,
    // with no terrain check in this project (PROJECT_CONTEXT §5).
    if (move.id === 'grassyglide') priority += 1;
    return priority;
  }

  /** Effective Speed for turn order, honouring Trick Room. */
  function turnSpeed(battle, pokemon) {
    const speed = battle.getStat(pokemon, 'spe');
    return battle.field.pseudoWeather.trickroom > 0 ? -speed : speed;
  }

  /**
   * Will `self` act before `foe` this turn?
   *
   * `myMove` is the move being considered; `foeMove` defaults to the foe's most
   * damaging option, which is the one that matters when asking "can I be killed
   * before I move".
   */
  function movesFirst(battle, self, foe, myMove = null, foeMove = null) {
    const mine = effectivePriority(battle, self, myMove);
    const theirs = effectivePriority(battle, foe, foeMove || bestDamage(battle, foe, self).move);
    if (mine !== theirs) return mine > theirs;
    return turnSpeed(battle, self) > turnSpeed(battle, foe);
  }

  /**
   * How much a pivot move is worth right now.
   *
   * Pivoting is the AI's main tool for fixing a bad matchup without eating the
   * free hit a raw switch costs — but only if there is somewhere better to go,
   * the hazards on the floor do not eat the gain, and the move can actually
   * connect. None of that was priced: status pivots (Teleport, Parting Shot,
   * Baton Pass, Chilly Reception, Shed Tail) were not scored as pivots at all.
   */
  function pivotValue(battle, self, foe, move, level) {
    const bench = benchOptions(battle, self.side);
    // Nothing to pivot to: Teleport and friends simply fail, and U-turn is then
    // just an attack, which the damage half of the score already covers.
    if (!bench.length) return move.category === 'Status' ? -350 : -10;
    // Volt Switch into a Ground type never lands, so the switch never happens.
    if (move.category !== 'Status' && battle.effectiveness(battle.moveType(self, foe, move), foe, move, self) === 0) return -60;

    /*
     * Fast pivot or slow pivot?
     *
     * The distinction is the whole skill of pivoting, and the AI had none of it.
     * A *slow* pivot (Teleport at -6, or any pivot from the slower Pokémon) lets
     * the foe attack first and only then swaps — the teammate arrives untouched.
     * A *fast* pivot swaps before the foe acts, so the teammate walks straight
     * into the incoming attack. Bringing a frail win condition in on a fast
     * pivot is how it dies; bringing it in on a slow pivot is how it sweeps.
     */
    const goesFirst = movesFirst(battle, self, foe, move);
    const incomingHit = mon => bestDamage(battle, foe, mon).damage / Math.max(1, mon.maxHP);

    const current = matchupScore(battle, self, foe);
    let best = -Infinity;
    let bestMon = null;
    for (const option of bench) {
      // The Pokémon coming in pays the hazard toll immediately, and on a fast
      // pivot it also eats the hit the foe was going to throw this turn.
      let landing = matchupScore(battle, option.pokemon, foe);
      if (level.predicts) {
        landing -= hazardCost(battle, option.pokemon, self.side) * 2.0;
        if (goesFirst) landing -= incomingHit(option.pokemon) * 2.0;
      }
      if (landing > best) { best = landing; bestMon = option.pokemon; }
    }
    let value = 0;
    const gain = best - current;
    if (gain > 0.6) value += Math.min(70, 30 + gain * 25);
    else if (gain < -0.8) value -= 40;              // pivoting into something worse

    if (!level.predicts) return value;

    // Trapped: the move cannot move you, so it is just a weak attack.
    if (battle.isTrapped(self) && TRAPPING_ABILITIES.has(Dex.toID(foe.ability))) return move.category === 'Status' ? -300 : -40;
    // Regenerator turns every pivot into a heal.
    if (Dex.toID(self.ability) === 'regenerator' && self.currentHP < self.maxHP * 0.7) value += 35;
    // Escaping a Choice lock is worth a turn on its own.
    if (choiceLocked(battle, self) && self.choiceLockedMove) value += 25;
    // Getting out before dying preserves the Pokémon and the momentum — but
    // only if the pivot actually resolves first. This was inverted: it rewarded
    // pivoting precisely when the pivot would never happen.
    const incoming = bestDamage(battle, foe, self).damage;
    const doomed = incoming >= effectiveHP(battle, self);
    if (doomed) value += movesFirst(battle, self, foe, move) ? 40 : -50;
    // Baton Pass is only special when there is something to pass.
    if (move.id === 'batonpass') {
      const boosts = Object.values(self.boosts).reduce((a, b) => a + Math.max(0, b), 0);
      value += boosts >= 2 ? 60 + boosts * 15 : -50;
      if (self.volatiles.substituteHP) value += 25;
    }
    /*
     * Shed Tail is the safest pivot in the game and is priced separately.
     *
     * It costs half the user's HP to build a Substitute and hands that
     * Substitute to whatever comes in — so the teammate arrives behind a shield
     * regardless of whether the pivot was fast or slow, which is exactly what a
     * setup sweeper wants. It needs more than half HP to pay for itself, and
     * that is a hard requirement rather than a preference.
     */
    if (move.id === 'shedtail') {
      if (self.currentHP <= self.maxHP * 0.5) return -350;          // simply fails
      value += 45;
      if (bestMon) {
        // The Substitute absorbs the free hit, so a fast pivot stops being a
        // liability, and a frail sweeper becomes the right thing to bring in.
        const sub = Math.floor(self.maxHP / 2);
        if (bestDamage(battle, foe, bestMon).damage < sub) value += 35;
        const wantsSetup = (bestMon.moves || []).some(slot => SETUP_MOVES.has(slot.id) && slot.pp > 0);
        if (wantsSetup) value += 40;
      }
    } else if (level.predicts) {
      // Every other pivot: a slow one delivers the teammate untouched, a fast
      // one delivers it into the attack.
      if (goesFirst) value -= incomingHit(bestMon || self) * 45;
      else value += 25;
      // Teleport is a slow pivot by construction (-6 priority), which is the
      // only reason it is worth a turn at all.
      if (move.id === 'teleport' && !goesFirst) value += 15;
    }
    // Parting Shot softens whatever comes in next.
    if (move.id === 'partingshot') value += 20;
    // Chilly Reception only pays if snow is worth having.
    if (move.id === 'chillyreception') value += battle.field.weather === 'snow' ? -30 : 15;
    // Leaving your own boosts behind is a waste (Baton Pass excepted above).
    if (move.id !== 'batonpass') {
      const boosts = Object.values(self.boosts).reduce((a, b) => a + Math.max(0, b), 0);
      value -= boosts * 18;
    }
    return value;
  }

  /* ------------------------------------------------------------------ *
   * Setting up
   *
   * Boosting is the highest-variance decision in the game: done at the right
   * moment it wins outright, done at the wrong one it hands over a free turn
   * and then a Pokémon. The old scoring asked only "am I comfortably healthy",
   * which missed both halves of the real question — *will I live through the
   * turn I spend*, and *does the boost actually convert into anything*.
   * ------------------------------------------------------------------ */

  /**
   * What a setup move really grants. The packaged data describes most of them,
   * but the hand-written ones in `applySpecialStatusMove` carry no `boosts`, so
   * their effect is declared here to match the engine.
   */
  const SETUP_PLANS = {
    // Halves HP and maxes Attack outright (engine: boost to +6, not +6 stages).
    bellydrum: {maxes: 'atk', hpCost: 0.5},
    filletaway: {boosts: {atk: 2, spa: 2, spe: 2}, hpCost: 0.5},
    curse: {boosts: {atk: 1, def: 1, spe: -1}},
    noretreat: {boosts: {atk: 1, def: 1, spa: 1, spd: 1, spe: 1}, traps: true},
  };

  /** Items that heal the holder back once a setup move drops it into range. */
  const PINCH_HEAL_ITEMS = {
    sitrusberry: 0.25, oranberry: 10, figyberry: 1 / 3, wikiberry: 1 / 3,
    magoberry: 1 / 3, aguavberry: 1 / 3, iapapaberry: 1 / 3, berryjuice: 20,
  };

  function setupPlan(move) {
    const declared = SETUP_PLANS[move.id];
    if (declared) return declared;
    return {boosts: move.boosts || move.self?.boosts || null, hpCost: 0};
  }

  /**
   * Score a setup move by what it will actually achieve.
   *
   * Four questions, in order:
   *   1. Does the move even work right now (Belly Drum below half HP fails)?
   *   2. Do I survive the turn I spend boosting — counting Focus Sash, Sturdy,
   *      Multiscale, and a healing berry that the move's own HP cost triggers?
   *   3. Does the boost convert? A +2 that still does not out-damage or outspeed
   *      the foe bought nothing.
   *   4. Can it be undone or ignored — phazing, Haze, Taunt, priority, an
   *      unaffected Unaware holder?
   *
   * Held items are read throughout rather than bolted on: White Herb makes
   * Shell Smash's drops free, Focus Sash guarantees the turn, and a Sitrus
   * Berry pays back Belly Drum's cost.
   */
  function setupValue(battle, self, foe, move, level, foeThreat) {
    const plan = setupPlan(move);
    if (!plan.boosts && !plan.maxes) return 0;
    const item = Dex.toID(self.item);
    let score = 0;

    const cost = Math.floor(self.maxHP * (plan.hpCost || 0));
    if (plan.maxes && (self.boosts[plan.maxes] || 0) >= 6) return -400;

    const incoming = foeThreat.damage;
    const movesFirstNow = movesFirst(battle, self, foe, null, foeThreat.move);

    /*
     * One berry, eaten the first time it is triggered.
     *
     * Mirrors the engine's own thresholds: Sitrus and Berry Juice fire at half
     * HP, the rest at the pinch threshold, and Gluttony raises that. Using the
     * pinch threshold for everything meant Belly Drum's Sitrus payback — which
     * lands at exactly half — never registered.
     */
    const healFraction = PINCH_HEAL_ITEMS[item];
    let berryLeft = !!healFraction;
    const eatBerryIfTriggered = hp => {
      if (!berryLeft || hp <= 0) return hp;
      const base = self.maxHP / (item === 'sitrusberry' || item === 'berryjuice' ? 2 : 4);
      const threshold = Math.max(base, battle.pinchBerryThreshold(self));
      if (hp > threshold) return hp;
      const healed = healFraction > 1 ? healFraction : Math.floor(self.maxHP * healFraction);
      berryLeft = false;
      return Math.min(self.maxHP, hp + healed);
    };

    /*
     * 1. What HP does this move actually get used at?
     *
     * Moving second means the hit lands *first*, and a berry it triggers heals
     * back *before* the move is used. That is the whole Belly Drum + Sitrus
     * plan: a slower drummer is knocked under half, the Sitrus fires, and the
     * Drum is legal again. Checking Belly Drum's HP cost against the *current*
     * HP — as this did — gets a slower drummer wrong in both directions: it
     * approves a Drum that the incoming hit makes illegal, and refuses one the
     * berry would have rescued.
     */
    let hpAtUse = self.currentHP;
    let diesBeforeActing = false;
    if (!movesFirstNow) {
      hpAtUse = self.currentHP - incoming;
      if (hpAtUse <= 0) diesBeforeActing = true;
      else hpAtUse = eatBerryIfTriggered(hpAtUse);
    }
    if (diesBeforeActing && !survivesOutright(battle, self, foeThreat.move)) return -260;
    if (plan.hpCost && hpAtUse <= cost) return -400;

    // 2. Surviving the turn. The HP cost is paid before the hit lands when we
    //    move first, and a pinch berry that the cost triggers heals back too.
    const hpBeforeBerry = hpAtUse - cost;
    let hpAfterCost = eatBerryIfTriggered(hpBeforeBerry);
    const berrySaves = hpAfterCost !== hpBeforeBerry;
    // Focus Sash and Sturdy only hold from full HP, which an HP-cost move gives up.
    const sashHolds = self.currentHP === self.maxHP && !plan.hpCost &&
      (item === 'focussash' || Dex.toID(self.ability) === 'sturdy');
    /*
     * Multiscale and Shadow Shield halve the hit while the holder is untouched,
     * which is the same thing Focus Sash buys — a turn you are guaranteed to get.
     * `foeThreat.damage` already has the halving in it (`estimateDamage` applies
     * both), so this must not reduce the damage again; it only records that the
     * guarantee exists so the turn can be valued. Like Sash it is lost the moment
     * the holder drops below full, which an HP-cost move does immediately.
     */
    const guarded = self.currentHP === self.maxHP && !plan.hpCost &&
      ['multiscale', 'shadowshield'].includes(Dex.toID(self.ability));
    /*
     * `survivesOutright` covers the effects a damage number cannot express — a
     * blocked hit still reads as full damage here. Without it a full-HP Eiscue
     * refused to set up in front of a physical attacker it takes *nothing*
     * from, because the estimate said 174 against 150 HP.
     *
     * The hit is only still ahead of us if we move first. Moving second, it has
     * already been subtracted into `hpAtUse` above — charging it twice would
     * refuse every setup move a slower Pokémon could safely use.
     */
    const survives = sashHolds || survivesOutright(battle, self, foeThreat.move) ||
      (movesFirstNow ? hpAfterCost > incoming : hpAfterCost > 0);
    if (!survives) return -260;                      // boost and die: nothing gained
    if (sashHolds) score += 30;                      // the turn is guaranteed
    if (guarded) score += 20;                        // ...and nearly guaranteed here
    if (berrySaves) score += 25;                     // the cost pays for itself

    // 3. Does the boost convert? Apply it, measure, restore — the same
    //    technique the Tera decision uses.
    const before = Object.assign({}, self.boosts);
    if (plan.maxes) self.boosts[plan.maxes] = 6;
    for (const [stat, delta] of Object.entries(plan.boosts || {})) {
      // White Herb undoes the drops, so Shell Smash costs nothing defensively.
      if (delta < 0 && item === 'whiteherb') continue;
      self.boosts[stat] = Math.max(-6, Math.min(6, (self.boosts[stat] || 0) + delta));
    }
    const damageAfter = bestDamage(battle, self, foe).damage;
    const outspeedsAfter = movesFirst(battle, self, foe, null, foeThreat.move);
    const incomingAfter = bestDamage(battle, foe, self).damage;
    /*
     * The bench matters as much as the Pokémon in front of it. A boost buys nothing
     * if something else on the opposing team outspeeds the *boosted* sweeper and
     * knocks it out — and the AI had no awareness of the enemy bench's movesets at
     * all, so it would set up in front of its own revenge killer.
     *
     * Measured inside the boosted window on purpose, so the Speed a Dragon Dance
     * buys is counted when asking who is faster.
     */
    const benchRevenge = battle.sides[1 - self.side].team.some(p =>
      !p.fainted && p !== foe &&
      turnSpeed(battle, p) > turnSpeed(battle, self) &&
      incomingThreat(battle, self, p).damage >= hpAfterCost);
    Object.assign(self.boosts, before);

    const damageBefore = bestDamage(battle, self, foe).damage;
    const gain = damageAfter / Math.max(1, damageBefore);
    /*
     * Is the boosting *finished*?
     *
     * A boost is a turn traded for future damage, so it is only ever worth it
     * while there is future damage left to buy. Once the Pokémon already knocks
     * the target out as it stands, another boost buys nothing at all this turn
     * and hands the foe a free one — the stack counter in `scoreMove` taxes
     * repeated setup but cannot see this, because a fifth Calm Mind still
     * multiplies damage by 1.5 and so still looked like a gain. This is the
     * "when is boosting enough" question, and the answer is: the moment the
     * current move already wins the exchange.
     */
    /*
     * ...unless the knockout is only *deferred*, and deferring it is free.
     *
     * If this Pokémon already outspeeds the target and already knocks it out,
     * the target is dead whenever it chooses to kill it — including next turn.
     * Spending this turn on a boost costs exactly one incoming hit and banks a
     * boost against everything still on the other side. That is the free setup
     * turn a sweeper is looking for, and refusing it was wrong: a full-HP
     * Lilligant-Hisui holding a Focus Sash threw Close Combat at something it
     * outsped and outclassed instead of taking a free Victory Dance.
     *
     * Four conditions, and all four matter:
     *   outspeeds     the kill is still guaranteed next turn, so nothing is lost
     *   survives      crit-proofed below; "sure to survive" is the player's rule
     *   bench left    a boost is worthless if this is the last thing standing
     *   not yet stacked  the bound. Without it the same test passes every turn
     *                 and the AI boosts forever, never actually killing anything
     *                 — the safety gate alone does not stop that at full HP.
     */
    const alreadyLethal = damageBefore >= effectiveHP(battle, foe);
    const stacked = Object.values(self.boosts).reduce((total, stage) => total + Math.max(0, stage), 0);
    /*
     * "Sure to survive" two ways. Either something blocks the hit outright
     * whatever it rolls (`survivesOutright`), or the arithmetic leaves room for
     * a high roll *and* a critical hit — a mean-roll estimate is not "sure".
     * `incomingAfter` is measured after the boost, so a Victory Dance's Defence
     * counts, and it already carries every mitigating ability the damage
     * pipeline knows about.
     */
    /*
     * Which hit do we actually take this turn?
     *
     * `incomingAfter` is measured with the boost applied, which is only what
     * happens if we move **first** — boost, then get hit at the new defences.
     * Moving second means the hit lands at current defences, before the boost
     * exists, so trusting `incomingAfter` there is optimistic by exactly the
     * amount the boost was worth. Note a Speed boost never helps here either:
     * turn order is fixed at the start of the turn, so Agility does not outrun
     * anything on the turn it is used.
     */
    const incomingThisTurn = movesFirstNow ? incomingAfter : incoming;
    const survivesForSure = survivesOutright(battle, self, foeThreat.move) ||
      incomingThisTurn * 1.5 < hpAfterCost;
    const foesLeft = battle.sides[1 - self.side].team.filter(p => !p.fainted).length;
    /*
     * Behind `level.predicts`, like the rest of the AI's real judgement. Casual
     * and Trainer keep the simpler "you can kill it, so kill it" behaviour —
     * measured, this rule was worth ~5 points to Trainer against Casual, which
     * is difficulty the lower tiers are not supposed to have.
     */
    const freeSetupTurn = level.predicts && alreadyLethal && movesFirstNow && survivesForSure &&
      foesLeft > 1 && stacked < FREE_SETUP_STACK_CAP;

    /*
     * A turn you are certain to survive is a turn a boost costs nothing but the
     * chip you did not deal — so pay that chip back.
     *
     * Without this the AI kept attacking in positions that were plainly safe: a
     * full-HP Volcarona facing 90 damage into 160 HP scored Bug Buzz 96 against
     * Quiver Dance 30 and hit, turn after turn, instead of taking the free
     * Quiver Dance that wins the game. It does not need a Focus Sash or a
     * damage-halving ability to know it is safe — `foeThreat` is already the
     * worst of the foe's four moves, so the arithmetic is available.
     *
     * The payback is the *forgone damage*, priced the way `scoreMove` prices it
     * (100 x the share of the target's health the hit would have removed), so it
     * scales itself: skipping a big hit costs more to justify than skipping a
     * scratch, and a boost is never worth more than the turn it replaces plus a
     * small premium for being permanent. A flat bonus tuned to one matchup would
     * have been a number that happened to work here.
     *
     * Mutually exclusive with the already-lethal case above, which is a
     * different trade (deferring a kill, not skipping chip) and pays differently.
     */
    const safeSetupTurn = level.predicts && !alreadyLethal && survivesForSure &&
      foesLeft > 1 && stacked < FREE_SETUP_STACK_CAP;
    if (safeSetupTurn) {
      const foeHP = Math.max(1, effectiveHP(battle, foe));
      const forgone = 100 * Math.min(damageBefore, foeHP) / foeHP;
      score += Math.min(forgone, 120) + 20;
    }

    if (alreadyLethal && !freeSetupTurn) score -= 170;
    /*
     * Worth about what the attack's own knockout premium is (+220 for the KO,
     * +70 for landing it first), because that premium is not being given up —
     * it is being collected one turn later with a boost already banked.
     */
    if (freeSetupTurn) score += 250;
    if (damageAfter >= foe.currentHP && damageBefore < foe.currentHP) score += 70;
    else if (gain > 1.4) score += 40;
    else if (gain <= 1.05 && !plan.boosts?.spe && !plan.boosts?.def && !plan.boosts?.spd) score -= 40;
    if (outspeedsAfter && !movesFirst(battle, self, foe, null, foeThreat.move)) score += 45;
    if (item === 'whiteherb' && Object.values(plan.boosts || {}).some(v => v < 0)) score += 35;

    // 4. Can it be taken away, or simply ignored?
    if (level.predicts) {
      // Still dying next turn even after the boost means the sweep never starts.
      if (incomingAfter >= hpAfterCost && !outspeedsAfter) score -= 70;
      // Priority ignores the Speed the boost just bought.
      const revenge = (foe.moves || []).some(slot => {
        const m = Dex.move(slot.id);
        return slot.pp > 0 && (m.priority || 0) > 0 && estimateDamage(battle, foe, self, m) >= hpAfterCost;
      });
      if (revenge) score -= 80;
      // ...and the same question asked of the whole bench, not just the active foe.
      if (benchRevenge) score -= 70;
      if (Dex.toID(foe.ability) === 'unaware') score -= 90;    // the boost is invisible to it
      if (plan.traps) score -= 20;                             // No Retreat locks you in
      /*
       * Spend the free turn on the turn it is free.
       *
       * A Focus Sash, an unbroken Sturdy or a full-HP Multiscale guarantees one
       * turn and one only — and it is guaranteed *now*, while the holder is
       * untouched. Attacking first and boosting later pays for the same boost out
       * of real HP, because the guarantee is gone the moment anything connects.
       * So a fresh sweeper that will outspeed once boosted should take the boost
       * immediately. Restricted to exactly that case: it needs the guarantee, it
       * needs to still be on its opening turn, and the boost has to actually win
       * the Speed race, or this is just a bonus for setting up badly.
       */
      if ((sashHolds || guarded) && (self.activeTurns || 0) <= 1 && outspeedsAfter) score += 35;
    }
    return score;
  }

  /** Effective HP, accounting for the things that refuse to let it die. */
  function effectiveHP(battle, pokemon) {
    let hp = pokemon.currentHP;
    const ability = Dex.toID(pokemon.ability);
    const item = Dex.toID(pokemon.item);
    if (pokemon.currentHP === pokemon.maxHP && (ability === 'sturdy' || item === 'focussash')) hp += 1;
    /*
     * Disguise and Ice Face are represented here and *only* here: `estimateDamage`
     * deliberately does not run their hooks, because those hooks mutate — busting
     * the disguise, printing a message and changing forme — and merely asking what
     * a move would do must never change anything (§5).
     *
     * Multiscale and Shadow Shield are the opposite case: `estimateDamage` already
     * halves the damage for both, so inflating the HP here as well counted the same
     * protection twice. Multiscale had that line and Shadow Shield did not, which is
     * how it was caught — two abilities with byte-identical hooks cannot correctly
     * disagree. Measured: a full-HP Multiscale Dragonite read as 484 effective HP
     * against a hit already reduced to 124, i.e. 3.9 hits of bulk where the truth is
     * 2.6. The AI under-attacked it and over-valued setting up in front of it.
     */
    if (ability === 'disguise' && !pokemon.volatiles.disguiseBusted) hp = Math.floor(hp * 1.35);
    if (ability === 'iceface' && !pokemon.volatiles.iceFaceBroken) hp = Math.floor(hp * 1.25);
    return hp;
  }

  /*
   * Guards the one recursive path in the turn-order projection below.
   *
   * `movesFirst` defaults its `foeMove` to `bestDamage(battle, foe, self).move`,
   * and `bestDamage` calls `estimateDamage` for every move it ranks — so a
   * projection that asked `movesFirst` unguarded would recurse without end the
   * moment BOTH sides carried a turn-order move. Inside a projection the live
   * flag is used instead, which terminates at one level deep and is the right
   * answer anyway: the inner question is "what can the foe hit me with", and
   * that ranking does not need its own projection to be ordered correctly.
   */
  let projectingTurnOrder = false;

  function defenderWillHaveActed(battle, attacker, defender, move) {
    if (projectingTurnOrder) return defender.hasActedThisTurn;
    projectingTurnOrder = true;
    try {
      // Moving second means the target has already taken its turn. A target
      // that SWITCHES does not count as having acted — the engine only sets the
      // flag after `performMove` — which is correct for these moves.
      return !movesFirst(battle, attacker, defender, move);
    } finally {
      projectingTurnOrder = false;
    }
  }

  /**
   * Average expected damage of `move` from `attacker` to `defender`, computed
   * from the battle's own damage pipeline but with the random roll fixed at its
   * mean so the AI cannot see the future.
   */
  function estimateDamage(battle, attacker, defender, move) {
    if (!move || move.category === 'Status') return 0;
    /*
     * Tera Blast and Revelation Dance pick their category from the user at use
     * time (`battle.moveCategory`), so the AI has to ask the same question the
     * engine will — otherwise it prices a physical Tera Blast against the
     * target's Special Defence and mis-reads every Tera'd attacker.
     */
    if (typeof battle.moveCategory === 'function') {
      const category = battle.moveCategory(attacker, move);
      if (category !== move.category) move = Object.assign({}, move, {category});
    }
    const fixed = battle.fixedDamage(attacker, defender, move);
    if (fixed != null) return Math.min(fixed, defender.currentHP);

    const type = battle.moveType(attacker, defender, move);
    // The attacker is passed so a Ring Target holder's estimate matches the hit.
    const eff = battle.effectiveness(type, defender, move, attacker);
    if (eff === 0) return 0;

    // Type/ability immunity checks that would zero the move out entirely.
    const guard = battle.defenderAbility(defender, attacker);
    if (guard && typeof guard.onTryHit === 'function') {
      const probe = Object.assign({}, move, {userRef: attacker});
      // A dry-run is unsafe (hooks mutate); use the well-known immunity flags.
      /*
       * Levitate and Eelevate, asked through the `ungrounded` declaration the
       * registry already carries rather than by name, so a third floating
       * ability is priced with nothing to add here. The two exceptions mirror
       * the hook exactly — Thousand Arrows and `ignoreImmunity` really do land,
       * and reading 0 for them told the AI a Pokémon was safe when it was not.
       */
      if (guard.ungrounded && type === 'Ground' && !move.ignoreImmunity && move.id !== 'thousandarrows') return 0;
      if (guard.name === 'Wonder Guard' && eff <= 1) return 0;
      if (guard.name === 'Bulletproof' && move.flags?.bullet) return 0;
      if (guard.name === 'Soundproof' && move.flags?.sound) return 0;
      if (['Volt Absorb', 'Motor Drive', 'Lightning Rod'].includes(guard.name) && type === 'Electric') return 0;
      if (['Water Absorb', 'Storm Drain', 'Dry Skin'].includes(guard.name) && type === 'Water') return 0;
      // Heatproof is a full Fire immunity in this project, not a halving.
      if (['Flash Fire', 'Well-Baked Body', 'Heatproof'].includes(guard.name) && type === 'Fire') return 0;
      if (guard.name === 'Sap Sipper' && type === 'Grass') return 0;
      if (guard.name === 'Earth Eater' && type === 'Ground') return 0;
      void probe;
    }

    /*
     * "Will the target have moved by the time this lands?", not "has it moved".
     *
     * Fishious Rend, Bolt Beak, Payback and Analytic all read
     * `defender.hasActedThisTurn` — and the AI chooses *before* the turn runs,
     * when `resetTurnFlags` has cleared that flag for both sides. So the engine
     * value is true at choice time and false when the move actually lands, and
     * a slower Dracovish rated its own Fishious Rend at the full doubled 170 BP
     * (measured: estimateDamage 299 whether `movesFirst` was true or false,
     * against a real 151 when it moved second).
     *
     * This is the family §8 records for the Mega-aware `incomingThreat` fix —
     * **the resolve rule was right and its input was wrong** — and the
     * information was already there: `movesFirst` is computed a few lines away.
     *
     * Set-and-restore rather than a threaded option, deliberately: one
     * mechanism then covers `dynamicBasePower` *and* the `onBasePower` hooks
     * (Analytic), which are two different systems. It is restored in a
     * `finally`, so nothing observable changes and §5's "asking must not change
     * anything" still holds — the same idiom `hitPlan` uses for the RNG and
     * `setupValue` uses for boosts.
     */
    const projects = Mechanics.TURN_ORDER_POWER_MOVES.has(move.id) ||
      battle.abilityOf(attacker)?.readsTargetActed;
    const savedActed = defender.hasActedThisTurn;
    if (projects) defender.hasActedThisTurn = defenderWillHaveActed(battle, attacker, defender, move);

    let power;
    try {
      power = battle.dynamicBasePower(attacker, defender, move, {preview: true});
      power = battle.modifyValue('onBasePower', attacker, power, defender, move);
    } finally {
      defender.hasActedThisTurn = savedActed;
    }

    const atkKey = move.id === 'bodypress' ? 'def' : move.category === 'Physical' ? 'atk' : 'spa';
    const defKey = ['psyshock', 'psystrike', 'secretsword'].includes(move.id) ? 'def' : move.category === 'Physical' ? 'def' : 'spd';
    const attackMon = move.id === 'foulplay' ? defender : attacker;
    const atk = battle.getStat(attackMon, atkKey);
    const def = battle.getStat(defender, defKey);

    const stab = battle.stabFor(attacker, type);
    const burn = move.category === 'Physical' && attacker.status === 'brn' && move.id !== 'facade' && !battle.abilityOf(attacker)?.ignoreBurnDrop ? 0.5 : 1;
    let modifier = stab * eff * burn * 0.925 *
      battle.weatherPowerModifier(attacker, type) *
      battle.terrainPowerModifier(type, attacker, defender, move);

    const targetSide = battle.sides[defender.side];
    if (targetSide.conditions.auroraveil > 0) modifier *= 0.5;
    else if (move.category === 'Physical' && targetSide.conditions.reflect > 0) modifier *= 0.5;
    else if (move.category === 'Special' && targetSide.conditions.lightscreen > 0) modifier *= 0.5;

    let damage = Math.max(1, Math.floor((((2 * attacker.level / 5 + 2) * power * atk / Math.max(1, def)) / 50 + 2) * modifier));
    damage = battle.modifyValue('onModifyDamage', attacker, damage, defender, move);
    if (guard && typeof guard.onSourceModifyDamage === 'function') {
      if (guard.name === 'Multiscale' || guard.name === 'Shadow Shield') { if (defender.currentHP === defender.maxHP) damage = Math.floor(damage * 0.5); }
      else if (['Filter', 'Solid Rock', 'Prism Armor'].includes(guard.name)) { if (eff > 1) damage = Math.floor(damage * 0.75); }
      else if (guard.name === 'Thick Fat') { if (['Fire', 'Ice'].includes(type)) damage = Math.floor(damage * 0.5); }
      else if (guard.name === 'Ice Scales') { if (move.category === 'Special') damage = Math.floor(damage * 0.5); }
      else if (guard.name === 'Fluffy') { if (move.flags?.contact) damage = Math.floor(damage * 0.5); if (type === 'Fire') damage *= 2; }
      else if (guard.name === 'Heatproof') { if (type === 'Fire') damage = Math.floor(damage * 0.5); }
    }

    // Expected hits for a 2-5 move under the engine's 35/35/15/15 spread. Worth
    // being exact now that every 2-5 move is a flat 25 BP per hit.
    let hits = Array.isArray(move.multihit) ? 3.1 : (typeof move.multihit === 'number' ? move.multihit : 1);
    // Parental Bond adds a second strike at half power (1 + 0.5 expected hits).
    // It is not declared as `multihit` on the move, so it is counted here.
    if (!move.multihit && battle.abilityOf(attacker)?.parentalBond && battle.parentalBondApplies(move)) hits = 1.5;
    /*
     * Real accuracy, asked of the engine rather than read off the move.
     *
     * The packaged number is wrong in every situation the engine special-cases:
     * Thunder and Hurricane never miss in rain (and drop to 50% in sun),
     * Blizzard never misses in snow, Toxic never misses from a Poison type,
     * Gravity multiplies by 5/3, and accuracy/evasion stages, Compound Eyes,
     * Wonder Skin, Bright Powder and Zoom Lens all apply. Using the raw value
     * had the AI refusing its own best move in the weather it had just set.
     */
    return Math.floor(damage * hits * hitChance(battle, attacker, defender, move));
  }

  /**
   * The move's real chance to connect, 0-1, as the engine will compute it.
   *
   * `battle.moveAccuracy` returns null for "cannot miss". It is read-only — it
   * runs the accuracy hooks and returns a number — so it is safe to ask.
   */
  function hitChance(battle, attacker, defender, move) {
    try {
      const accuracy = battle.moveAccuracy(attacker, defender, move);
      if (accuracy == null) return 1;
      return Math.max(0, Math.min(100, accuracy)) / 100;
    } catch {
      return move.accuracy == null ? 1 : Math.max(0, Math.min(100, move.accuracy)) / 100;
    }
  }

  /** Best damage `attacker` can do to `defender` with its current moveset. */
  /**
   * Incoming damage, counting a transformation the foe has **not spent yet**.
   *
   * `bestDamage` measures the foe as it stands, which is what the AI sees at choice
   * time — but Mega Evolution resolves in `runTurn` *before actions are ordered*
   * (§5), so a foe that is about to Mega is already stronger than it looks by the
   * time anything is thrown. Reported case, measured exactly: a level-68 Kingambit
   * facing Rayquaza read V-create at **228** against its **235** effective HP,
   * concluded it would survive by 7 HP, and correctly took its biggest move — then
   * Rayquaza Mega Evolved, V-create became **266**, and the move never happened.
   *
   * So the resolve rule was right and its input was wrong. That is the bug this
   * fixes, and it is a general one: any "am I dying?" question asked against the
   * pre-transformation foe can be off by the size of a Mega's stat jump.
   *
   * Deliberately an *estimate* rather than a simulation. Damage scales linearly with
   * the attacker's offensive stat, so the base-stat ratio is exact for that
   * component (Rayquaza Atk 150 -> Mega 180 predicts 1.2x against an observed
   * 1.17x). Not modelled: the Mega forme's new ability, and any move it would rather
   * use in the new forme. Erring high here is the safe direction — it makes the AI
   * respect a threat it might otherwise walk into.
   */
  function incomingThreat(battle, self, foe) {
    const base = bestDamage(battle, foe, self);
    if (!base.move || !base.damage) return base;
    let worst = base.damage;

    if (typeof battle.canMegaEvolve === 'function' && battle.canMegaEvolve(foe)) {
      const target = typeof battle.megaFormeFor === 'function' ? battle.megaFormeFor(foe) : null;
      const from = Dex.species(foe.species)?.baseStats;
      if (target?.baseStats && from) {
        const key = base.move.category === 'Special' ? 'spa' : 'atk';
        const ratio = (target.baseStats[key] || 0) / Math.max(1, from[key] || 1);
        if (ratio > 1) worst = Math.max(worst, Math.round(base.damage * ratio));
      }
    }

    // Terastallising into the move's own type lifts STAB from 1.5x to 2x. Only
    // counted when the types actually line up — in the reported log Rayquaza Tera'd
    // into Flying and attacked with Fire, so this correctly contributes nothing.
    if (typeof battle.canTerastallize === 'function' && battle.canTerastallize(foe)) {
      const tera = foe.set?.teraType;
      if (tera && base.move.type === tera && !foe.types.includes(tera)) {
        worst = Math.max(worst, Math.round(base.damage * (2 / 1.5)));
      }
    }
    return worst === base.damage ? base : {damage: worst, move: base.move};
  }

  /**
   * The hardest hit **anything on the opposing team** could land on `mon`, and who
   * lands it.
   *
   * The AI already read the *active* foe's real moveset; this extends that to the
   * bench, which it had no awareness of at all. That blindness has a specific cost:
   * it would happily spend a turn setting up while the Pokémon that revenge-kills
   * the sweeper sat one switch away.
   *
   * Note this is full information — the AI sees movesets the *player* cannot, since
   * `hideOpponentDetails` is on in every format (§5). That is a deliberate choice:
   * the AI is an opponent, not a simulation of a player, and it already read the
   * active foe's real moves rather than a guess.
   */
  function teamThreat(battle, mon, {exclude = null} = {}) {
    const foes = battle.sides[1 - mon.side].team.filter(p => !p.fainted && p !== exclude);
    let worst = {damage: 0, move: null, from: null};
    for (const foe of foes) {
      const hit = incomingThreat(battle, mon, foe);
      if (hit.damage > worst.damage) worst = {damage: hit.damage, move: hit.move, from: foe};
    }
    return worst;
  }

  /**
   * The hardest hit `attacker` can land on `defender` **with a move it is
   * actually allowed to select**.
   *
   * The Choice lock used to be invisible here: a Kingambit locked into Dig
   * against a Flying Skarmory reported its Kowtow Cleave at 91 damage, a move
   * it could not use. Everything built on this inherited the lie — `canKO`
   * refused to switch away from a knockout it could not execute, `matchupScore`
   * rated the position as survivable, and the AI stayed in for six turns
   * hitting nothing. Reported from a real battle.
   *
   * `choiceLockedMove` is the only restriction applied, deliberately. Taunt,
   * Disable and Encore are *volatile* and the engine already refuses those
   * moves, but they lapse — pricing a matchup as though a two-turn Taunt were
   * permanent would make the AI flee positions it should hold. A Choice lock
   * lasts as long as the Pokémon stays in, which is exactly the question a
   * matchup is asking.
   */
  function bestDamage(battle, attacker, defender) {
    let best = 0;
    let bestMove = null;
    const locked = attacker.choiceLockedMove || null;
    for (const slot of attacker.moves) {
      if (slot.pp <= 0) continue;
      if (locked && Dex.toID(slot.id) !== Dex.toID(locked)) continue;
      const move = Dex.move(slot.id);
      const damage = estimateDamage(battle, attacker, defender, move);
      if (damage > best) { best = damage; bestMove = move; }
    }
    return {damage: best, move: bestMove};
  }

  /**
   * Can this Pokémon do *anything at all* to the foe in front of it?
   *
   * Not "is this a bad matchup" — literally nothing: every move it is allowed
   * to select deals no damage and would be refused as a status move. The
   * reported case is a Choice lock into a move the target is immune to, but the
   * same thing happens to a Taunted staller with only status moves, or an
   * Encore into a Sucker Punch that will never connect.
   *
   * `availableMoveIndices` is the engine's own answer to "what may this Pokémon
   * pick", so this stays correct as new restrictions are added rather than
   * re-deriving the Choice/Taunt/Disable/PP rules a second time.
   */
  function helpless(battle, self, foe) {
    if (!foe || foe.fainted) return false;
    let legal;
    try { legal = battle.availableMoveIndices(self); } catch { return false; }
    // Struggle (-1) is still damage, so a Pokémon reduced to it is not helpless.
    if (!legal.length || legal.includes(-1)) return false;
    for (const index of legal) {
      const slot = self.moves[index];
      if (!slot) continue;
      const move = Dex.move(slot.id);
      if (move.category === 'Status') {
        if (!willFail(battle, self, foe, move)) return false;
      } else if (estimateDamage(battle, self, foe, move) > 0) {
        return false;
      }
    }
    return true;
  }

  /**
   * How well `candidate` fares against `foe`; higher is better.
   *
   * Damage traded is most of it, but a matchup is more than arithmetic: an
   * ability that punishes the attacker's own style changes who wins the
   * exchange without changing either damage roll. Flame Body and Static answer
   * a physical contact attacker by threatening to cripple it outright; Rough
   * Skin and Iron Barbs tax it every hit. The AI could already be *deterred* by
   * those abilities on the opponent — it had no idea they were an asset on its
   * own side, so it never switched a Flame Body holder into the physical
   * attacker it was built to wall.
   */
  function matchupScore(battle, candidate, foe) {
    const offense = bestDamage(battle, candidate, foe).damage / Math.max(1, foe.currentHP);
    const threat = bestDamage(battle, foe, candidate).damage / Math.max(1, candidate.currentHP);
    const hpRatio = candidate.currentHP / candidate.maxHP;
    let score = offense * 2.2 - threat * 2.0 + hpRatio * 0.6;
    if (candidate.status) score -= 0.35;
    if (candidate.status === 'slp' || candidate.status === 'frz') score -= 0.5;

    // Does the candidate's ability punish how this foe actually attacks?
    const ability = Dex.toID(candidate.ability);
    if (CONTACT_PUNISH_ABILITIES.has(ability) || Dex.toID(candidate.item) === 'rockyhelmet') {
      const foeThreat = bestDamage(battle, foe, candidate).move;
      if (foeThreat?.flags?.contact && !battle.abilityOf(foe)?.noContactAbility &&
          !battle.itemOf(foe)?.noContact) {
        // A status punisher can end the attacker's usefulness; a chip punisher
        // only taxes it. Worth more against something that is already committed
        // to contact — a Choice-locked attacker cannot switch its move away.
        const crippling = ['flamebody', 'static', 'poisonpoint', 'effectspore', 'cursedbody'].includes(ability);
        let bonus = crippling ? 0.55 : 0.3;
        if (foe.status) bonus *= 0.35;                       // already statused
        if (choiceLocked(battle, foe)) bonus *= 1.4;
        score += bonus;
      }
    }
    /*
     * Immunity to the foe's only real damage is the strongest wall there is.
     *
     * Note there is deliberately no *tiered* resistance bonus on top of this (a
     * "+0.5 if doubly resisted, +0.25 if not very effective" term was written and
     * removed). The `threat` term above already prices resistance correctly and
     * continuously, because a resisted hit simply *is* less damage — so an explicit
     * bonus double-counts it. Measured: it changed 0 of 512 switch decisions
     * across four tiers, including 284 real switches. "Switch to something that
     * resists this" is already what the damage maths says.
     */
    if (bestDamage(battle, foe, candidate).damage <= 0) score += 0.8;
    return score;
  }

  /** Turns `foe` needs to KO `pokemon`, capped for scoring purposes. */
  function turnsToKO(battle, attacker, defender) {
    const {damage} = bestDamage(battle, attacker, defender);
    if (damage <= 0) return 99;
    return Math.ceil(defender.currentHP / damage);
  }

  function hazardPressure(battle, sideIndex) {
    const cond = battle.sides[sideIndex].conditions;
    return (cond.stealthrock ? 1 : 0) + cond.spikes + cond.toxicspikes + (cond.stickyweb ? 1 : 0);
  }

  /**
   * @param {object} lapse per-decision mistakes rolled once per turn:
   *   `{koBlind, sloppyType}`. Rolled in `chooseAction` rather than here so a
   *   tier that misses a knockout misses it consistently across every move it
   *   is comparing, instead of flickering move by move.
   */
  /**
   * Score one move.
   *
   * The sleep adjustment is applied by the wrapper rather than inside, because
   * the damaging branch returns from several places and "does this move happen
   * at all while asleep" is orthogonal to every one of them.
   */
  function scoreMove(battle, self, foe, slot, index, level, lapse = {}) {
    const base = scoreMoveBase(battle, self, foe, slot, index, level, lapse);
    if (base === -Infinity) return base;
    return base + sleepAdjustment(battle, self, Dex.move(slot.id), level);
  }

  function scoreMoveBase(battle, self, foe, slot, index, level, lapse = {}) {
    const move = Dex.move(slot.id);
    if (!move || move.missing) return -Infinity;
    if (slot.pp <= 0) return -Infinity;

    // A move that cannot work this turn is never the answer. Asked of the
    // engine, so the project's own rules apply (Sucker Punch is unconditional
    // here; Fake Out still is not).
    if (willFail(battle, self, foe, move)) return -900;
    // ...and one that is about to be interrupted by its own drawback. This is
    // the Focus Punch case: -3 priority, fails the moment anything touches it.
    if (selfDefeating(battle, self, foe, move)) return -800;
    // Assault Vest holders physically cannot select a status move.
    if (move.category === 'Status' && battle.itemOf(self)?.blocksStatusMoves) return -Infinity;

    const selfHP = self.currentHP / self.maxHP;
    const foeHP = foe.currentHP / foe.maxHP;
    const damage = estimateDamage(battle, self, foe, move);
    const eff = move.category === 'Status' ? 1 : battle.effectiveness(battle.moveType(self, foe, move), foe, move, self);
    // Counts an unspent Mega or Tera, because both land before this move would.
    const foeThreat = incomingThreat(battle, self, foe);
    // Real turn order for *this* move, not a bare Speed comparison: priority,
    // Trick Room, Tailwind, Prankster and a Choice Scarf all decide turns that
    // raw Speed gets backwards.
    const outspeeds = movesFirst(battle, self, foe, move, foeThreat.move);
    // ...and the Speed race with nothing on top, for the decisions that are
    // about the Pokémon rather than the move (paralysis, Trick Room setting).
    const fasterBase = turnSpeed(battle, self) > turnSpeed(battle, foe);
    // Effective HP, so Sturdy, Focus Sash, Multiscale and Disguise stop the AI
    // panicking about a hit that will not actually kill it.
    const dying = foeThreat.damage >= effectiveHP(battle, self);
    /*
     * Will this move happen at all?
     *
     * The single most important question the AI was not asking. If the foe moves
     * first and its best hit knocks this Pokémon out, *any* move slower than it
     * never resolves — the knockout it would have scored, the status it would
     * have inflicted, the heal it would have gained, all of it simply does not
     * occur. Every branch below is weighed against this, so a priority move that
     * lands is preferred over a bigger one that does not, for every Pokémon and
     * every tier, not as a special case for any one interaction.
     *
     * Priority moves are unconditional in this project (PROJECT_CONTEXT §5), so
     * `movesFirst` is a straight answer here rather than a prediction.
     */
    const resolves = outspeeds || !dying;
    const foeAbility = Dex.toID(foe.ability);
    const myTeam = archetypeOf(battle, self.side);
    /*
     * There is deliberately no `priorityBlocked` local here any more. It used to
     * compute exactly this condition and then only *withhold a bonus* with it,
     * which let a Sucker Punch that could never land stay the best-rated move
     * for three turns running (see `cannotAffect`). The refusal now happens in
     * `willFail`, which returns -900 well above this point — so a second copy
     * of the test down here could never fire, and a guard that can never fire
     * is the shape of bug §8 keeps recording.
     */

    if (move.category !== 'Status') {
      if (eff === 0 || damage <= 0) return -500;
      // Future Sight is a damaging move that only resolves later, and a second
      // copy always fails while one is pending.
      if (move.id === 'futuresight' || move.id === 'doomdesire') {
        if (battle.sides[1 - self.side].conditions.futureSight) return -400;
        return 30 + 20 * (battle.sides[1 - self.side].team.filter(p => !p.fainted).length);
      }
      // A sloppy tier ranks raw power and forgets what the target resists, so a
      // resisted STAB can outrank a neutral coverage move.
      const rated = lapse.sloppyType && eff < 1 ? damage / Math.max(0.25, eff) : damage;
      /*
       * Damage is worth what it *removes*, capped at the target's remaining HP.
       *
       * Overkill is not a tiebreaker: a 397-damage Earthquake into a 56 HP
       * target is worth exactly as much as any other knockout, and the knockout
       * bonus below is what rewards securing it. Leaving the ratio uncapped let
       * a huge slow move outbid a priority move that would actually resolve,
       * purely on a number that could never be collected.
       *
       * Then: damage from a move that never resolves is worth a fraction of
       * damage that lands. Not zero — the foe may switch, miss, or pick a status
       * move — but nowhere near full.
       */
      const removed = Math.min(rated, foe.currentHP);
      let score = 100 * (removed / Math.max(1, foe.currentHP)) * (resolves ? 1 : 0.25);
      const kos = damage >= effectiveHP(battle, foe);
      // A knockout that lands after you are dead is not a knockout. This used
      // to award a +90 "trade favourably" bonus for exactly that case.
      if (kos && !lapse.koBlind) {
        score += resolves ? 220 : 40;
        // A knockout landed *first* ends the exchange. Priority is what turns
        // second into first, so it is worth most when the Speed race is lost.
        if (outspeeds) score += 70;
        if ((move.priority || 0) > 0 && !fasterBase) score += 80;
      }
      // About to be knocked out: moving first is the whole decision.
      if (dying) score += outspeeds ? 40 : -60;
      // Revenge-killing with priority when the foe is nearly dead and would
      // otherwise move first.
      if (!kos && (move.priority || 0) > 0 && !fasterBase && dying) score += 25;
      if (move.recoil) score -= 12 * (move.recoil[0] / move.recoil[1]) * 100 / 33;
      if (move.selfdestruct) score -= foe.currentHP > damage ? 120 : 30;
      if (move.drain && selfHP < 0.6) score += 25;
      if (PIVOT_MOVES.has(move.id)) score += pivotValue(battle, self, foe, move, level);
      if (move.flags?.charge || RedGPT.BattleConstants.CHARGE_MOVES.has(move.id)) score -= dying ? 200 : 40;
      if (RedGPT.BattleConstants.RECHARGE_MOVES.has(move.id) && damage < foe.currentHP) score -= 45;
      // Real accuracy, so a Thunder the weather has made perfect is not
      // penalised as if it were still 70%.
      const chance = hitChance(battle, self, foe, move) * 100;
      if (chance < 85) score -= (100 - chance) * 0.4;

      // Contact into a punisher is a real cost, and the AI used to take it for
      // free: Rough Skin and Iron Barbs chip, Flame Body and Static can end the
      // turn's attacker outright.
      if (move.flags?.contact && !battle.abilityOf(self)?.noContactAbility && !battle.itemOf(self)?.noContact) {
        if (CONTACT_PUNISH_ABILITIES.has(foeAbility)) score -= 22;
        if (Dex.toID(foe.item) === 'rockyhelmet') score -= 18;
      }
      // Life Orb costs a tenth of max HP per attack; that matters at low HP.
      if (Dex.toID(self.item) === 'lifeorb' && selfHP < 0.25 && Dex.toID(self.ability) !== 'magicguard') score -= 30;
      // Choice items lock the holder in. Committing to a move that the foe's
      // likely switch-in walls is how a Choice user gets set up on.
      if (choiceLocked(battle, self) && !self.choiceLockedMove) {
        const bench = battle.sides[1 - self.side].team.filter(p => !p.fainted && p !== foe);
        if (bench.length) {
          // `self` is the attacker here, so a Ring Target holder correctly sees
          // nothing on the bench as immune and is not talked out of the move.
          const worst = Math.min(...bench.map(p => battle.effectiveness(battle.moveType(self, p, move), p, move, self)));
          if (worst === 0) score -= 40;         // something on the bench is immune
        }
      }
      return score;
    }

    // ---- status / utility moves ----
    let score = 12;
    const usesStatus = level.usesStatus;

    /*
     * This is the Pokémon's last action — does the move pay out before it faints?
     *
     * Almost every utility move is a turn bought on credit: hazards collect as
     * the opponent switches, a status buys time, screens and weather pay out over
     * following turns, a boost converts next turn. None of that arrives for a
     * Pokémon that is about to be knocked out, so a doomed Pokémon should spend
     * its final action on damage it can actually land — chip the attacker so the
     * replacement finishes it — rather than on a Toxic or a Stealth Rock whose
     * value it will not live to collect.
     *
     * `LAST_STAND_MOVES` are the exception the games build for exactly this
     * moment: they are *worth more* when the user is dying, because fainting is
     * their trigger or their cost.
     */
    if (dying) {
      if (LAST_STAND_MOVES.has(move.id)) score += 95;
      else score -= 75;
    }

    if (move.status && !foe.status) {
      const worth = {tox: 90, brn: 75, par: 70, slp: 95, psn: 45, frz: 60}[move.status] || 40;
      // Typing is only half the story — an ability or a held item stops most of
      // these outright, and statusing into one of those is a free turn given up.
      const guard = battle.defenderAbility(foe, self);
      const abilityBlocks = guard && typeof guard.onSetStatus === 'function' &&
        guard.onSetStatus(battle, foe, move.status, self) === false;
      const immune = (move.status === 'brn' && foe.types.includes('Fire')) ||
        (['psn', 'tox'].includes(move.status) && (foe.types.includes('Poison') || foe.types.includes('Steel')) &&
          !battle.abilityOf(self)?.corrosion) ||
        (move.status === 'par' && foe.types.includes('Electric')) ||
        abilityBlocks ||
        (['psn', 'tox', 'brn', 'par', 'slp'].includes(move.status) &&
          ['lumberry', 'chestoberry', 'cheriberry', 'pechaberry', 'rawstberry', 'aspearberry'].includes(Dex.toID(foe.item))) ||
        // Terrain refuses it outright: Misty blocks every status on a grounded
        // target, Electric blocks sleep. Both are implemented in this engine.
        (battle.isGrounded(foe) && battle.field.terrain === 'misty') ||
        (battle.isGrounded(foe) && battle.field.terrain === 'electric' && move.status === 'slp') ||
        (battle.sides[1 - self.side].conditions.safeguard > 0);
      score += immune ? -400 : worth * usesStatus;
      // Some abilities *want* the status. Poisoning a Guts or Poison Heal
      // holder is doing it a favour.
      if (['guts', 'quickfeet', 'marvelscale', 'poisonheal', 'toxicboost', 'flareboost', 'facade'].includes(foeAbility)) score -= 120;
      if (Dex.toID(foe.item) === 'flameorb' || Dex.toID(foe.item) === 'toxicorb') score -= 60;
      if (move.status === 'brn' && battle.getStat(foe, 'atk') < battle.getStat(foe, 'spa')) score -= 30;
      if (move.status === 'par' && !fasterBase) score += 25;
      if (foeAbility === 'naturalcure' || foeAbility === 'magicbounce') score -= 60;
      if (level.predicts) {
        /*
         * Is this status worth spending a turn on *against this team*?
         *
         * A status is only as good as the time it buys, so it is worth far more
         * against a Pokémon that intends to stay in — a wall trying to out-heal
         * you — than against something that will pivot straight out. And it is
         * worth much less against a team that can simply undo it.
         */
        const foeRole = roleOf(battle, foe);
        if (move.status === 'tox' && (foeRole.wall || foeRole.recovery)) score += 55;
        if (move.status === 'brn' && battle.getStat(foe, 'atk') >= battle.getStat(foe, 'spa')) score += 30;
        if (move.status === 'par' && battle.getStat(foe, 'spe') > battle.getStat(self, 'spe')) score += 20;
        // A cleric, or a bench full of Natural Cure, makes status temporary.
        const foeTeam = battle.sides[1 - self.side].team.filter(p => !p.fainted);
        const cleric = foeTeam.some(p => (p.moves || []).some(slot =>
          ['healbell', 'aromatherapy'].includes(slot.id) && slot.pp > 0));
        if (cleric) score -= 45;
        const curers = foeTeam.filter(p => Dex.toID(p.ability) === 'naturalcure').length;
        score -= curers * 15;
        // Statusing the last Pokémon standing rarely pays — the battle ends first.
        if (foeTeam.length <= 1 && move.status !== 'slp') score -= 40;
      }
    } else if (move.status && foe.status) {
      score -= 200;
    }
    // Magic Bounce and Good as Gold send the whole thing back or refuse it.
    if (move.category === 'Status' && battle.aimedAtFoePokemon?.(move)) {
      if (foeAbility === 'magicbounce' && move.flags?.reflectable) score -= 300;
      if (foeAbility === 'goodasgold') score -= 300;
    }

    if (SETUP_MOVES.has(move.id)) {
      const already = Object.values(self.boosts).reduce((a, b) => a + Math.max(0, b), 0);
      const safe = foeThreat.damage * 2 < effectiveHP(battle, self);
      score += (safe ? 110 : -60) * level.usesSetup;
      score -= already * 25;
      if (already >= 4) score -= 150;
      // An HP-cost move is *meant* to be used low; the flat low-HP penalty
      // would otherwise talk the AI out of Belly Drum with a Sitrus Berry.
      if (selfHP < 0.45 && !setupPlan(move).hpCost) score -= 80;
      // What the boost is actually worth here, items included.
      score += setupValue(battle, self, foe, move, level, foeThreat) * level.usesSetup;
      if (level.predicts) {
        // Setting up only pays if the boosts survive and convert. Anything that
        // resets them, or stops you moving, makes the turn a gift.
        const canPhase = (foe.moves || []).some(s => PHAZING_MOVES.has(s.id) && s.pp > 0);
        if (canPhase) score -= 70;
        if (self.volatiles.taunt) score -= 400;
        if (foe.status === 'slp' || foe.status === 'frz' || foe.volatiles.encore) score += 45;
        // A sweep needs a team that wants one, and something worth sweeping.
        const foesLeft = battle.sides[1 - self.side].team.filter(p => !p.fainted).length;
        if (myTeam.style === 'hyperoffense') score += 25;
        if (myTeam.style === 'stall') score -= 25;
        if (foesLeft <= 2 && safe) score += 30;
      }
    }
    if (HAZARD_MOVES.has(move.id)) {
      const foeSide = battle.sides[1 - self.side].conditions;
      const existing = move.id === 'spikes' ? foeSide.spikes : move.id === 'toxicspikes' ? foeSide.toxicspikes : foeSide[move.id] ? 1 : 0;
      const maxStack = move.id === 'spikes' ? 3 : move.id === 'toxicspikes' ? 2 : 1;
      if (existing >= maxStack) score -= 400;
      else {
        const remaining = battle.sides[1 - self.side].team.filter(p => !p.fainted).length;
        // Hazards are worth what they will actually collect: nothing against a
        // bench of Heavy-Duty Boots, Flying types or Magic Guard, and much more
        // on a team that forces switches.
        const bite = level.predicts ? hazardValue(battle, self.side, move.id) : 1;
        let value = (55 + remaining * 12) * bite;
        if (level.predicts) {
          if (foeHasRemoval(battle, self.side)) value *= 0.7;
          value *= 1 + 0.12 * myTeam.switchPressure;
          if (myTeam.style === 'stall') value *= 1.25;
          // Late in a battle there is not enough switching left to bank on.
          if (remaining <= 1) value *= 0.35;
        }
        score += value * level.usesHazards;
      }
    }
    if (REMOVAL_MOVES.has(move.id)) {
      // Price removal by what the hazards are actually costing this team, not by
      // how many layers happen to be down.
      const bench = battle.sides[self.side].team.filter(p => !p.fainted);
      const cost = bench.reduce((sum, mon) => sum + hazardCost(battle, mon, self.side), 0);
      score += cost > 0.02 ? 40 + cost * 160 : -180;
      // Defog also strips your own side's screens, which is a real loss.
      if (move.id === 'defog') {
        const mine = battle.sides[self.side].conditions;
        if (mine.reflect || mine.lightscreen || mine.auroraveil) score -= 60;
      }
    }
    if (RECOVERY_MOVES.has(move.id)) {
      if (selfHP > 0.75) score -= 250;
      // Healing that resolves after the knockout heals nothing. Even healing
      // that *does* go first is wasted if it cannot out-pace the incoming hit.
      else if (!resolves) score -= 120;
      else if (outspeeds && dying && foeThreat.damage >= self.maxHP * 0.5 + self.currentHP) score -= 90;
      else score += (1 - selfHP) * 220;
      if (move.id === 'rest' && (selfHP > 0.5 || self.status === 'slp')) score -= 200;
      /*
       * Rest costs turns, and the AI had no idea how many. `Rest` sets
       * `sleepTurns = 2`, and the counter is spent at the *start* of each move
       * attempt — so the user is helpless on the next two turns and acts again
       * on the third. That is two free turns handed to the opponent, which is
       * the whole reason Rest is a commitment rather than a heal.
       *
       * Priced in the same currency as everything else: a turn spent asleep is
       * a turn of `incoming` taken for nothing, as a share of the sleeper's own
       * health. So Rest stays attractive against something that cannot punish
       * two free turns and becomes a bad idea against something that can.
       */
      if (move.id === 'rest' && level.predicts) {
        score -= restingTurns(battle, self) * 110 * Math.min(1, foeThreat.damage / Math.max(1, self.maxHP));
        /*
         * Rest is a full heal *and* a full status cure, and the cure was worth
         * nothing at all: a badly poisoned Pokémon rated Rest identically to a
         * clean one. Reported from a real log — a poisoned Dondozo losing HP
         * every turn while the AI weighed Rest as if the poison were not there.
         *
         * Priced from what the status is actually costing, which
         * `residualSwing` already measures, plus a flat allowance for the
         * statuses that cost tempo rather than HP (paralysis, sleep) and for
         * the toxic counter it resets.
         */
        if (self.status) {
          const bleeding = Math.max(0, -battle.residualSwing(self));
          score += 45 + Math.min(1, bleeding / Math.max(1, self.maxHP)) * 220;
        }
      }
    }
    if (SCREEN_MOVES.has(move.id)) {
      const cond = battle.sides[self.side].conditions;
      score += cond[move.id] > 0 ? -300 : 55;
      if (move.id === 'auroraveil' && !['snow', 'hail'].includes(battle.effectiveWeather())) score -= 400;
    }
    if (move.weather) {
      const want = battle.canonicalWeather(move.weather);
      if (battle.field.weather === want) score -= 300;
      else {
        // A weather lead is only doing its job if somebody on the team cashes
        // the weather in. Setting sun for a team with no Chlorophyll and no Fire
        // attackers is a wasted turn, and the AI used to take it every time.
        let value = 45;
        if (level.predicts) {
          const team = battle.sides[self.side].team.filter(p => !p.fainted);
          const abusers = team.filter(mon => WEATHER_ABUSERS[want]?.has(Dex.toID(mon.ability))).length;
          const stab = team.filter(mon => (mon.moves || []).some(s => {
            const type = Dex.move(s.id).type;
            return (want === 'sun' && type === 'Fire') || (want === 'rain' && type === 'Water');
          })).length;
          value += abusers * 45 + stab * 12;
          if (!abusers && !stab) value = -40;
          // Overwriting a weather the *opponent* needs is worth doing anyway.
          if (battle.field.weather && myTeam.style !== 'weather') value += 25;
        }
        score += value;
      }
    }
    if (move.terrain) {
      const want = Dex.toID(move.terrain).replace(/terrain$/, '');
      if (battle.field.terrain === want) score -= 300;
      else {
        // Terrain is worth what this team can collect from it, and every one of
        // these effects is implemented, so the AI can price them honestly:
        // the 1.3x type boost, Grassy healing and its Earthquake halving,
        // Electric's sleep block, Misty's status block, Psychic's priority block.
        let value = 40;
        if (level.predicts) {
          const team = battle.sides[self.side].team.filter(p => !p.fainted);
          const boosted = {electric: 'Electric', grassy: 'Grass', psychic: 'Psychic'}[want];
          if (boosted) {
            value += 14 * team.filter(mon => (mon.moves || []).some(s => Dex.move(s.id).type === boosted &&
              Dex.move(s.id).category !== 'Status')).length;
          }
          if (battle.isGrounded(self)) {
            if (want === 'grassy') value += 25;                       // end-of-turn healing
            if (want === 'electric' && foeThreat.move && Dex.move(foeThreat.move.id || '').status === 'slp') value += 30;
            if (want === 'misty') value += 25;                        // blocks incoming status
            // Psychic Terrain shuts off the foe's priority against you.
            if (want === 'psychic' && (foe.moves || []).some(s => (Dex.move(s.id).priority || 0) > 0)) value += 35;
          } else {
            value -= 20;                                              // floating: most of it does nothing
          }
          // Overwriting a terrain the opponent is living off is worth doing.
          if (battle.field.terrain) value += 20;
        }
        score += value;
      }
    }
    // The three "rooms" and Gravity, none of which were scored at all.
    if (move.pseudoWeather && level.predicts) {
      const id = Dex.toID(move.pseudoWeather);
      const team = battle.sides[self.side].team.filter(p => !p.fainted);
      /*
       * Re-using Trick Room, Magic Room or Wonder Room now *ends* it (games
       * behaviour, added alongside Rebirth Mode's endless rooms so an endless
       * one has counterplay at all). So when one of those is up the move is a
       * cancel, and it is worth exactly the negative of what setting it would
       * be worth: tear down a room that suits the other side, leave one that
       * suits your own. Gravity does not self-cancel, so re-using it is still
       * simply a wasted turn.
       */
      const active = battle.field.pseudoWeather[id] > 0;
      if (active && !Mechanics.SELF_CANCELLING_ROOMS.has(id)) score -= 300;
      else {
        let value = 0;
        if (id === 'gravity') {
          // Grounds everything (Flying and Levitate lose their Ground immunity and
          // start eating hazards) and multiplies accuracy by 5/3.
          const shaky = (self.moves || []).filter(s => (Dex.move(s.id).accuracy ?? 100) < 90).length;
          const floaters = battle.sides[1 - self.side].team.filter(p => !p.fainted &&
            (p.types.includes('Flying') || RedGPT.Abilities.get(p.ability)?.ungrounded)).length;
          value = 15 + shaky * 25 + floaters * 20;
          // It grounds your own side too, so your own floaters start taking Spikes.
          value -= team.filter(p => p.types.includes('Flying')).length * 12;
        } else if (id === 'wonderroom') {
          // Swaps Defense and Sp. Def. Worth it when the foe's bulk is lopsided
          // the wrong way for you and yours is not.
          const foeGap = battle.getStat(foe, 'def') - battle.getStat(foe, 'spd');
          const physical = battle.getStat(self, 'atk') >= battle.getStat(self, 'spa');
          value = (physical ? foeGap : -foeGap) / 12;
        } else if (id === 'magicroom') {
          // Suppresses every held item. Good when they have one and you do not.
          const foeItems = battle.sides[1 - self.side].team.filter(p => !p.fainted && p.item).length;
          const myItems = team.filter(p => p.item).length;
          value = (foeItems - myItems) * 18;
        }
        score += active ? -value : value;
      }
    }
    if (move.id === 'trickroom') {
      /*
       * Trick Room is about the Pokémon's Speed, not this move's priority — and
       * it is judged against **both whole teams**, because it lasts five turns
       * and the Pokémon in front right now will usually not be the one it
       * matters against.
       *
       * It used to compare only against the *active* foe, which reads the
       * question far too narrowly: a slow team facing one fast lead scored the
       * room the same as a slow team facing six. The AI is full-information on
       * the opposing team already (§5), and `teamThreat` uses that, so the
       * median of what is still standing is the honest measure of "would this
       * make my team faster than theirs".
       */
      const team = battle.sides[self.side].team.filter(p => !p.fainted);
      const foes = battle.sides[1 - self.side].team.filter(p => !p.fainted);
      const speeds = foes.map(p => battle.getStat(p, 'spe')).sort((a, b) => a - b);
      const median = speeds.length ? speeds[Math.floor(speeds.length / 2)] : battle.getStat(foe, 'spe');
      // Measured against the median of the opposing team *and* the Pokémon in
      // front: the current matchup still matters most, it is simply not the
      // only thing that does.
      const bar = Math.max(median, battle.getStat(foe, 'spe'));
      const slower = team.filter(p => battle.getStat(p, 'spe') < bar).length;
      let value = slower > team.length / 2 ? 70 + slower * 10 : -80;
      /*
       * **A Trick Room setter sets Trick Room, and it does it first — even over
       * a knockout.** By project decision, and the measurement is emphatic.
       *
       * Reported twice. A Calyrex-Ice came in against a team that entirely
       * outsped it, took two knockouts with Glacial Lance, and then died to the
       * third Pokémon without acting. The old scoring was *right* by its own
       * lights: a certain KO is worth ~320 and Trick Room ~130, so the room
       * never won. But the AI never looks past the current turn (§3), and Trick
       * Room is the one move whose entire value is the turns after this one.
       *
       * Played out 120 times from that exact position, forcing each choice:
       *
       *   take the KO      won   3/120  (3%)   avg 1.38 foes knocked out
       *   set Trick Room   won  94/120  (78%)  avg 3.56 foes knocked out
       *
       * A 75-point swing. One knockout is worth far less than five turns of
       * moving first with a 165-Attack sweeper, and no one-turn model can see
       * that — so the room is priced above a knockout outright rather than
       * being nudged and hoping.
       *
       * Two guards keep it from being a blanket rule. It only applies when the
       * team-majority test above already says the room helps, so a fast team
       * still refuses it; and **never when a knockout would end the battle** —
       * setting up instead of winning is the obvious way to make this worse.
       */
      const foesLeft = battle.sides[1 - self.side].team.filter(p => !p.fainted).length;
      if (value > 0 && foesLeft > 1) value += 260;
      // Cancelling is new judgement, so it sits behind `predicts` like the rest:
      // Casual and Trainer keep the old flat refusal and the ladder ordering is
      // unaffected by a change neither tier can see.
      if (battle.field.pseudoWeather.trickroom > 0) score += level.predicts ? -value : -300;
      else score += value;
    }
    // Status pivots were never scored as pivots at all.
    if (PIVOT_MOVES.has(move.id)) score += pivotValue(battle, self, foe, move, level);
    if (move.id === 'leechseed') score += foe.volatiles.leechSeed != null || foe.types.includes('Grass') ? -400 : 90;
    if (move.id === 'substitute') score += self.volatiles.substituteHP ? -400 : (selfHP > 0.5 ? 40 : -60);
    if (BLOCKING_PROTECT_MOVES.has(move.id)) {
      score += self.volatiles.stallCounter ? -120 : 25;
      /*
       * Chip healing. A turn behind Protect is a free turn, and a free turn is
       * worth exactly what the residual phase does in it — so a Leftovers wall
       * or a Poison Heal Gliscor banks HP by stalling, while a burned attacker
       * pays for it. The AI had none of this: it scored a flat +25 and a flat
       * +25 for a badly-poisoned foe, so Gliscor clicked attacks at 40% HP with
       * a Toxic Orb running.
       *
       * Both halves are priced in the currency `scoreMove` already uses:
       * healing like a recovery move (`(1 - selfHP) * 220` for a full heal),
       * chip like damage (`100 x share of the target's health removed`).
       *
       * **Healing is capped at the HP actually missing**, which is the whole
       * reason this is not a flat bonus: Leftovers is worth nothing at full HP,
       * and a Pokémon at full HP should still be attacking.
       */
      if (level.predicts) {
        const mine = battle.residualSwing(self);
        const theirs = battle.residualSwing(foe);
        if (mine > 0) score += Math.min(mine, self.maxHP - self.currentHP) / self.maxHP * 220;
        else if (mine < 0) score += mine / self.maxHP * 160;
        if (theirs < 0) score += 100 * Math.min(-theirs, foe.currentHP) / Math.max(1, foe.currentHP);
        else if (theirs > 0) score -= 60 * Math.min(theirs, foe.maxHP - foe.currentHP) / foe.maxHP;
      } else if (foe.status === 'tox' || (self.volatiles.leechSeed == null && foe.volatiles.leechSeed != null)) {
        // The weak tiers keep the old flat read, so the ladder ordering holds.
        score += 25;
      }
    }
    if (move.id === 'taunt') score += foe.volatiles.taunt ? -300 : 45;
    if (move.id === 'futuresight' || move.id === 'doomdesire') {
      score += battle.sides[1 - self.side].conditions.futureSight ? -400 : 35;
    }
    if (move.id === 'wish') score += battle.sides[self.side].conditions.wish ? -300 : (1 - selfHP) * 90;
    if (move.id === 'trick' || move.id === 'switcheroo') score += self.item && !foe.item ? 55 : -120;
    if (move.id === 'haze' || move.id === 'clearsmog') {
      const foeBoosts = Object.values(foe.boosts).reduce((a, b) => a + Math.max(0, b), 0);
      score += foeBoosts >= 2 ? 60 + foeBoosts * 20 : -150;
    }
    if (move.boosts && move.target !== 'self') {
      const drop = Object.values(move.boosts).reduce((a, b) => a + b, 0);
      score += drop < 0 ? 30 : -50;
    }
    if (move.heal && move.target === 'self' && !RECOVERY_MOVES.has(move.id)) score += (1 - selfHP) * 150;
    if (['splash', 'celebrate', 'followme', 'helpinghand', 'ragepowder', 'allyswitch', 'aromaticmist', 'coaching'].includes(move.id)) score -= 400;
    // The same "will this happen" test the damaging branch applies. A status
    // move thrown while dying and slower achieves nothing at all — no status,
    // no boost, no heal — so it is worth strictly less than anything that
    // resolves. Pivots are exempt only because `pivotValue` prices them itself.
    if (!resolves && !PIVOT_MOVES.has(move.id)) score -= 120;
    return score * usesStatus + 8;
  }

  /**
   * Sleep-aware scoring, applied to damaging and status moves alike.
   *
   * Kept out of both category branches above because it is orthogonal to both:
   * whether a move *happens* while its user is asleep has nothing to do with
   * what it would do if it did.
   */
  function sleepAdjustment(battle, self, move, level) {
    if (!level.predicts) return 0;
    const asleep = stillAsleep(self);
    if (SLEEP_USABLE.has(move.id)) {
      /*
       * Asleep, this is the only thing that works — and Sleep Talk is *why* the
       * set carries Rest. Awake, it does nothing at all: Sleep Talk resolves to
       * no move and Snore is refused outright in `moveSpecialFailure`.
       */
      return asleep ? 260 : -600;
    }
    /*
     * Every other move: asleep, it simply does not happen.
     *
     * The same rule as the type-immunity gate in §8 — a move that cannot
     * execute must never outscore one that can, or the AI throws it every turn
     * until something outside the loop changes. Without this a sleeping Pokémon
     * picked whatever scored highest, usually a knockout worth 250, and printed
     * "is fast asleep" instead while the Sleep Talk in the same moveset sat
     * unused. Not a flat refusal like a real immunity, because sleep ends on
     * its own: large enough to lose to anything usable, small enough that a
     * Pokémon with nothing usable still picks something rather than stalling
     * on `-Infinity`.
     */
    return asleep ? -450 : 0;
  }

  /* ------------------------------------------------------------------ *
   * Team composition
   *
   * A team is not six independent Pokémon, and playing it as though it were is
   * what made the AI's hazard and setup decisions look random. A hazard setter
   * is worth far more on a team that can force switches than on one that wins by
   * hitting things; a weather setter exists to serve the three teammates that
   * need the weather; a suicide lead is *supposed* to die.
   * ------------------------------------------------------------------ */

  const WEATHER_SETTING_MOVES = {sunnyday: 'sun', raindance: 'rain', sandstorm: 'sandstorm', snowscape: 'snow', hail: 'hail', chillyreception: 'snow'};
  const WEATHER_ABILITIES = {drought: 'sun', drizzle: 'rain', sandstream: 'sandstorm', snowwarning: 'snow',
    desolateland: 'sun', primordialsea: 'rain', orichalcumpulse: 'sun'};
  const WEATHER_ABUSERS = {
    sun: new Set(['chlorophyll', 'solarpower', 'flowergift', 'leafguard', 'harvest', 'protosynthesis']),
    rain: new Set(['swiftswim', 'raindish', 'dryskin', 'hydration']),
    sandstorm: new Set(['sandrush', 'sandforce', 'sandveil']),
    snow: new Set(['slushrush', 'icebody', 'snowcloak', 'iceface']),
  };

  /** Display names for the weathers, for the reason string a test can assert. */
  const WEATHER_LABELS = {sun: 'Sun', rain: 'Rain', sandstorm: 'Sand', snow: 'Snow', hail: 'Snow'};

  /** Slow enough that Trick Room is an upgrade rather than a downgrade. */
  const TRICK_ROOM_SPEED = 65;
  /** Above this, doubling Speed does not change what you outrun that matters. */
  const TAILWIND_SPEED_CEILING = 115;

  /**
   * Which abusers justify spending turn one on the weather setter, where that
   * is narrower than "anything that likes the weather" (`WEATHER_ABUSERS`).
   * Only snow differs, and see `themeLead` for why.
   */
  const LEAD_ABUSERS = {snow: new Set(['slushrush'])};

  const TERRAIN_ABILITIES = {electricsurge: 'electric', psychicsurge: 'psychic', hadronengine: 'electric'};
  const TERRAIN_SETTING_MOVES = {electricterrain: 'electric', psychicterrain: 'psychic'};
  /**
   * What cashes a terrain in. Abilities and held items both count, because the
   * Seeds are items and they are half the reason to set the terrain at all.
   *
   * Grassy and Misty Terrain are deliberately absent. Grassy Terrain's headline
   * payoff elsewhere is Grassy Glide's priority, and **this project makes
   * Grassy Glide unconditional** (§5) — the engine applies the +1 with no
   * terrain check — so a Grassy lead rule would be built on a mechanic that no
   * longer depends on the terrain. Misty has no sweeper payoff to lead for.
   */
  const TERRAIN_ABUSERS = {
    electric: {
      abilities: new Set(['quarkdrive', 'surgesurfer', 'galvanize']),
      items: new Set(['electricseed']),
    },
    psychic: {
      abilities: new Set([]),
      items: new Set(['psychicseed']),
    },
  };

  /**
   * The Pokémon that *must* be on the field first, because the rest of the team
   * does not function until it has acted.
   *
   * `chooseTeamPreview` scores leads on matchup and nudges a weather setter by
   * +0.8, which is a preference. On a themed team it is not a preference: a
   * Rain team that leads with its Swift Swim sweeper has simply not set the
   * rain, and every turn the setter is not out is a turn the plan is off. This
   * moves the setter to the front of the order outright.
   *
   * **Which themes are unconditional, and which need proof, is the whole
   * design.** A move can be filler; a dedicated ability cannot:
   *
   * - **Trick Room and screens are unconditional.** Neither move is ever filler
   *   — nobody carries Trick Room by accident — and both are pure team plans.
   * - **Rain and Sun *ability* setters are unconditional.** Drizzle and Drought
   *   belong to Pokémon that are only ever brought to set weather.
   * - **Sand and Snow ability setters need an abuser.** Tyranitar and Hippowdon
   *   are routinely used as standalone bulky Pokémon where Sand Stream is
   *   incidental, so leading one just because it makes sand would be wrong.
   *   With a Sand Rush sweeper behind it, it is right.
   * - **Every weather *move* setter needs an abuser**, for the same reason: Rain
   *   Dance in a filler slot does not make a Rain team.
   *
   * Returns `{index, theme, payoff}` or null. `index` is into `side.team`,
   * deliberately not into `archetypeOf`'s role list, which excludes fainted
   * Pokémon and therefore renumbers.
   */
  function themeLead(battle, sideIndex) {
    const team = battle.sides[sideIndex].team;
    if (team.length < 2) return null;
    const movesOf = mon => (mon.moves || []).map(slot => slot.id);
    const abilityOf = mon => Dex.toID(mon.ability);
    const candidates = [];

    // Trick Room — unconditional, but worth more the slower the team behind it.
    const trIndex = team.findIndex(mon => movesOf(mon).includes('trickroom'));
    if (trIndex >= 0) {
      const slow = team.filter((mon, i) => i !== trIndex &&
        Dex.species(mon.species).baseStats.spe <= TRICK_ROOM_SPEED).length;
      candidates.push({index: trIndex, theme: 'Trick Room', payoff: 1 + slow});
    }

    // Screens — unconditional, worth more behind something that sets up.
    const scIndex = team.findIndex(mon => movesOf(mon).some(id => SCREEN_MOVES.has(id)));
    if (scIndex >= 0) {
      const users = team.filter((mon, i) => {
        if (i === scIndex) return false;
        const role = roleOf(battle, mon);
        return role.setup || role.sweeper || role.breaker;
      }).length;
      candidates.push({index: scIndex, theme: 'screens', payoff: 1 + users});
    }

    /*
     * Terrain — Electric and Psychic. Both are led for the same reason weather
     * is: the payoff pieces are inert until the terrain is down. Electric turns
     * on Quark Drive, Surge Surfer and the Electric Seed and boosts Electric
     * attacks; Psychic shuts off the opponent's priority against anything
     * grounded, which is what keeps a frail sweeper alive, and turns on the
     * Psychic Seed.
     *
     * Psychic's priority protection only reaches **grounded** teammates, so
     * that is what is counted — a team of Flying types collects nothing from it
     * and should not be leading its setter.
     */
    for (let i = 0; i < team.length; i++) {
      const ability = abilityOf(team[i]);
      const fromAbility = TERRAIN_ABILITIES[ability] || null;
      const fromMove = movesOf(team[i]).map(id => TERRAIN_SETTING_MOVES[id]).find(Boolean) || null;
      const terrain = fromAbility || fromMove;
      if (!terrain) continue;
      const abusers = TERRAIN_ABUSERS[terrain];
      let payoff = team.filter((other, j) => {
        if (j === i) return false;
        if (abusers.abilities.has(abilityOf(other))) return true;
        if (abusers.items.has(Dex.toID(other.item))) return true;
        if (terrain === 'psychic') return battle.isGrounded(other);
        return (other.moves || []).some(slot => Dex.move(slot.id).category !== 'Status' &&
          Dex.move(slot.id).type === 'Electric');
      }).length;
      // A dedicated surge ability is never incidental — the Pokémon carrying it
      // is on the team to set the terrain.
      const dedicated = !!fromAbility;
      if (!dedicated && payoff < 1) continue;
      if (dedicated) payoff += 1;
      candidates.push({
        index: i,
        theme: terrain === 'electric' ? 'Electric Terrain' : 'Psychic Terrain',
        payoff,
      });
    }

    /*
     * Tailwind — doubles the team's Speed for a few turns, which is what lets a
     * strong but middling-Speed attacker move first. Counted against teammates
     * that are actually offensive and not already fast enough not to care:
     * doubling a base-130 sweeper's Speed changes nothing it needed changing.
     */
    const twIndex = team.findIndex(mon => movesOf(mon).includes('tailwind'));
    if (twIndex >= 0) {
      const beneficiaries = team.filter((mon, i) => {
        if (i === twIndex) return false;
        const role = roleOf(battle, mon);
        return (role.sweeper || role.breaker) &&
          Dex.species(mon.species).baseStats.spe < TAILWIND_SPEED_CEILING;
      }).length;
      if (beneficiaries >= 1) {
        candidates.push({index: twIndex, theme: 'Tailwind', payoff: beneficiaries});
      }
    }

    // Weather — the setter, gated as described above.
    for (let i = 0; i < team.length; i++) {
      const ability = abilityOf(team[i]);
      const fromAbility = WEATHER_ABILITIES[ability] || null;
      const fromMove = movesOf(team[i]).map(id => WEATHER_SETTING_MOVES[id]).find(Boolean) || null;
      const weather = fromAbility || fromMove;
      if (!weather) continue;
      /*
       * `LEAD_ABUSERS` narrows the set for snow. Snow is rarely set to be
       * *used* — the common reason is Aurora Veil, which is a screens plan and
       * is already covered by the screens theme above. Ice Body and Snow Cloak
       * are passive perks that create no reason to spend turn one on the
       * setter; Slush Rush does. Counting the passive ones would have every
       * snow team leading its setter for nothing.
       */
      const abuserSet = LEAD_ABUSERS[weather] || WEATHER_ABUSERS[weather];
      const abusers = team.filter((other, j) => j !== i &&
        abuserSet && abuserSet.has(abilityOf(other))).length;
      const dedicated = !!fromAbility && (weather === 'rain' || weather === 'sun');
      if (!dedicated && abusers < 1) continue;
      candidates.push({
        index: i,
        theme: WEATHER_LABELS[weather] || weather,
        payoff: abusers + (dedicated ? 1 : 0),
      });
    }

    if (!candidates.length) return null;
    // Most-supported theme wins when a team carries two. Ties keep the order
    // above, which puts the shortest-lived effect first.
    return candidates.reduce((best, entry) => (entry.payoff > best.payoff ? entry : best));
  }

  /** What kind of Pokémon is this, in team-building terms? */
  function roleOf(battle, mon) {
    const species = Dex.species(mon.species);
    const base = species.baseStats;
    const moves = (mon.moves || []).map(slot => slot.id);
    const bulk = base.hp + base.def + base.spd;
    const offence = Math.max(base.atk, base.spa);
    const has = set => moves.some(id => set.has(id));
    const hazards = has(HAZARD_MOVES);
    const screens = has(SCREEN_MOVES);
    const recovery = has(RECOVERY_MOVES);
    const setup = has(SETUP_MOVES);
    const pivot = has(PIVOT_MOVES);
    const weather = moves.find(id => WEATHER_SETTING_MOVES[id]) || WEATHER_ABILITIES[Dex.toID(mon.ability)];
    return {
      hazards, screens, recovery, setup, pivot,
      weather: WEATHER_SETTING_MOVES[weather] || WEATHER_ABILITIES[Dex.toID(mon.ability)] || null,
      // A lead wants to be out first: hazards or screens, and no interest in
      // staying alive afterwards.
      lead: (hazards || screens) && !recovery,
      // A suicide lead spends itself putting hazards up. Explosion-likes and
      // Focus Sash are the tell.
      suicide: hazards && (moves.includes('explosion') || moves.includes('selfdestruct') ||
        moves.includes('memento') || moves.includes('finalgambit') || Dex.toID(mon.item) === 'focussash'),
      wall: bulk >= 480 && recovery && !setup,
      sweeper: setup && offence >= 100,
      breaker: offence >= 120 && !setup,
    };
  }

  /**
   * Classify a whole side. Cached per battle per side — this walks every team
   * member and is asked once per decision.
   */
  function archetypeOf(battle, sideIndex) {
    battle._aiArchetypes = battle._aiArchetypes || {};
    const cached = battle._aiArchetypes[sideIndex];
    // Roles change as moves are revealed and Pokémon faint, so cache per turn.
    if (cached && cached.turn === battle.turn) return cached;

    const team = battle.sides[sideIndex].team.filter(mon => !mon.fainted);
    const roles = team.map(mon => roleOf(battle, mon));
    const count = key => roles.filter(r => r[key]).length;
    const weathers = roles.map(r => r.weather).filter(Boolean);
    const weather = weathers.length ? weathers[0] : null;
    const abusers = weather
      ? team.filter(mon => WEATHER_ABUSERS[weather]?.has(Dex.toID(mon.ability))).length
      : 0;

    const walls = count('wall');
    const offensive = count('sweeper') + count('breaker');
    let style = 'balance';
    if (walls >= 3) style = 'stall';
    else if (offensive >= 4 && walls === 0) style = 'hyperoffense';
    else if (weather && abusers >= 2) style = 'weather';

    const result = {
      turn: battle.turn, style, roles, weather,
      weatherAbusers: abusers,
      hazardSetters: count('hazards'),
      // Hazards pay off in proportion to how often the opponent is *made* to
      // switch, which is what these two do.
      switchPressure: count('pivot') + count('breaker'),
    };
    battle._aiArchetypes[sideIndex] = result;
    return result;
  }

  function benchOptions(battle, sideIndex) {
    const side = battle.sides[sideIndex];
    return side.team
      .map((pokemon, index) => ({pokemon, index}))
      .filter(entry => !entry.pokemon.fainted && entry.index !== side.activeIndex);
  }

  /* ------------------------------------------------------------------ *
   * Sacking
   *
   * A Pokémon that is going to faint this turn presents a choice the AI was
   * getting backwards. Switching *preserves* it, but the replacement walks into
   * the attack — so the turn costs a second Pokémon's health and the doomed one
   * is still nearly dead. Letting it faint costs the Pokémon but the replacement
   * arrives **for free**, because a faint replacement takes no hit.
   *
   * So the question is not "am I about to die" but "is this one worth a switch,
   * and can anything on the bench actually absorb the hit". A spent lead is a
   * sack; a healthy win condition is not.
   * ------------------------------------------------------------------ */

  /** Roughly how much this Pokémon is still worth to the team. */
  function preserveValue(battle, mon) {
    const foeSide = battle.sides[1 - mon.side];
    const hp = mon.currentHP / Math.max(1, mon.maxHP);
    let value = hp;
    // Does it still answer anything the opponent has left?
    const alive = foeSide.team.filter(p => !p.fainted);
    const answers = alive.filter(p => bestDamage(battle, mon, p).damage >= p.currentHP * 0.8).length;
    value += answers * 0.25;
    // ...and can it meaningfully hurt anything at all? A Pokémon that chips for
    // nothing is the sack however healthy it looks, which a bare HP fraction
    // misses entirely.
    const output = alive.length
      ? Math.max(...alive.map(p => bestDamage(battle, mon, p).damage / Math.max(1, p.maxHP)))
      : 0;
    value += Math.min(0.4, output);
    if (output < 0.12) value -= 0.5;
    const role = roleOf(battle, mon);
    if (role.sweeper || role.wall) value += 0.3;
    if (role.suicide) value -= 0.5;                       // it is meant to be spent
    value += Object.values(mon.boosts).reduce((a, b) => a + Math.max(0, b), 0) * 0.2;
    if (mon.status === 'slp' || mon.status === 'frz') value -= 0.3;
    if (hp < 0.25) value -= 0.4;                          // already spent
    return value;
  }

  /** Can anything on the bench take the hit that is about to land? */
  /**
   * Can `candidate` actually come in on `foe`, and still be there next turn?
   *
   * A switch is not one hit, it is two. The Pokémon coming in eats a free hit on
   * the turn it arrives, and then — if it is slower — eats a second one before it
   * ever acts. Pricing only the first hit (which is all `switchCost` did) meant
   * the AI would pay a "small" cost to bring in something that was dead before it
   * moved, trading a damaged Pokémon for a healthy one and getting nothing.
   *
   * Returns `{lands, survives, resists, freeHit, afterTwo}`:
   *   lands     it is not knocked out on the way in
   *   survives  it is still alive when its own turn comes round
   *   resists   the foe's best move is not super-effective against it
   *
   * Measured against `effectiveHP`, so Focus Sash, Sturdy, Multiscale, Disguise
   * and Ice Face count — the same number `scoreMove` and `considerSwitch` already
   * use, so all three halves of the AI agree about what "dies" means.
   */
  function switchInSurvival(battle, candidate, foe) {
    const hit = bestDamage(battle, foe, candidate);
    const hp = effectiveHP(battle, candidate);
    const freeHit = hit.damage;
    const lands = freeHit < hp;
    // Faster: it arrives, takes one hit, then acts. Slower: it takes a second
    // hit before acting, so the switch only makes sense if it lives through both.
    const faster = battle.getStat(candidate, 'spe') > battle.getStat(foe, 'spe');
    const afterTwo = faster ? freeHit : freeHit * 2;
    const survives = lands && afterTwo < hp;
    // `foe` is the attacker here — a Ring Target on the *opponent* means the
    // switch-in does not get to count on its immunity.
    const resists = !hit.move ||
      battle.effectiveness(battle.moveType(foe, candidate, hit.move), candidate, hit.move, foe) <= 1;
    return {lands, survives, resists, freeHit, afterTwo};
  }

  function findAbsorber(battle, sideIndex, foe) {
    return benchOptions(battle, sideIndex).find(entry =>
      bestDamage(battle, foe, entry.pokemon).damage < entry.pokemon.currentHP * 0.6);
  }

  /** Should the AI switch out this turn, and to whom? */
  function considerSwitch(battle, sideIndex, level, request) {
    if (!request.canSwitch) return null;
    const side = battle.sides[sideIndex];
    const self = side.team[side.activeIndex];
    const foe = battle.foeActive(self);
    if (!foe || foe.fainted) return null;
    if (self.volatiles.lockedMove || self.volatiles.charging) return null;

    const current = matchupScore(battle, self, foe);
    let options = benchOptions(battle, sideIndex)
      .map(entry => ({
        ...entry,
        score: matchupScore(battle, entry.pokemon, foe),
        survival: switchInSurvival(battle, entry.pokemon, foe),
      }))
      .sort((a, b) => b.score - a.score);
    if (!options.length) return null;

    /*
     * A switch-in that dies before it acts is not a switch, it is a sacrifice
     * with extra steps — and the AI used to make it, because `switchCost` priced
     * the free hit softly and a bad enough current matchup could always outbid
     * it. Bringing a healthy Pokémon in to eat two hits and faint loses the game
     * faster than staying in and chipping.
     *
     * So at the predicting tiers survival is a *gate*, not a price: a candidate
     * has to still be standing when its own turn arrives (see
     * `switchInSurvival`). Resisting the foe's best move is preferred but not
     * required — a neutral wall that comfortably lives through two hits is a
     * perfectly good pivot, and demanding a resist as well left the AI with no
     * legal switch in ordinary positions.
     *
     * If nothing qualifies the function returns null and the turn goes to
     * `scoreMove`, which is the intent: make progress rather than shuffle.
     */
    if (level.predicts) {
      const viable = options.filter(entry => entry.survival.survives);
      const resisting = viable.filter(entry => entry.survival.resists);
      options = resisting.length ? resisting : viable;
      if (!options.length) return null;
    }

    const best = options[0];
    const incomingDamage = incomingThreat(battle, self, foe).damage;
    // Measured against effective HP, so Focus Sash, Sturdy, Multiscale, Disguise
    // and Ice Face do not read as a knockout the foe cannot actually score. This
    // matches `scoreMove`'s own `dying`, so the two halves of the AI agree about
    // whether this Pokémon is about to faint.
    const dyingSoon = incomingDamage >= effectiveHP(battle, self);
    const canKO = bestDamage(battle, self, foe).damage >= effectiveHP(battle, foe);
    const outspeeds = battle.getStat(self, 'spe') > battle.getStat(foe, 'spe');

    // Never abandon a guaranteed KO the AI would win.
    if (canKO && (outspeeds || !dyingSoon)) return null;

    /*
     * NOT ADDED, deliberately: an explicit "boosted and surviving, so hold
     * position" rule (the +2 Cresselia versus Dark Pulse case).
     *
     * It was written, and then measured to change **nothing**: across 2,400
     * decisions (600 randomised matchups × all four tiers) it altered zero
     * choices. Its precondition — boosts ≥ 2, survives the incoming hit, and wins
     * the damage race — was reached 86 times, and in every one of those the
     * existing logic had *already* decided to stay. Three things get there first:
     * the guaranteed-KO short-circuit above, `switchCost += boosted * 0.5` below,
     * and the fact that failing `margin < threshold` defaults to staying in.
     *
     * Left as a comment because "the AI abandons its boosts" is an intuitive
     * suspicion that will come up again — it is already handled, and re-adding the
     * rule adds an unreachable branch. If a real battle log ever shows a boosted,
     * surviving Pokémon retreating, re-measure with
     * `tools/` sweeps before assuming this is the cause.
     */

    /*
     * Price the switch before taking it.
     *
     * Switching gives up the turn: the Pokémon coming in eats a free hit, and
     * pays the hazard chip on the way. Nothing used to charge for that, so the
     * decision was "is the next matchup any better at all" — and because the
     * stronger tiers had the lowest thresholds, they switched most and were
     * measurably the *weakest*. Expert lost to Casual 34-66 and burned ~5 turns
     * a battle switching. The free hit is expressed in `matchupScore` units:
     * its `threat` term is (damage / HP) * 2.0, so the same conversion applies.
     */
    // Hazard chip is per-Pokémon, not per-side: the switch-in with Heavy-Duty
    // Boots pays nothing, and a Flying type walks over Spikes. Pricing it off a
    // raw layer count charged Boots holders for hazards they ignore.
    const hazards = level.predicts
      ? hazardCost(battle, best.pokemon, sideIndex) * 3.0
      : hazardPressure(battle, sideIndex) * 0.3;
    const freeHit = bestDamage(battle, foe, best.pokemon).damage / Math.max(1, best.pokemon.maxHP);
    let switchCost = freeHit * 2.0 + hazards;
    if (level.predicts) {
      // Trapped: the switch is not on the table at all.
      if (TRAPPING_ABILITIES.has(Dex.toID(foe.ability)) && battle.isTrapped(self)) return null;
      // Regenerator turns switching into healing, which pays for a lot of it.
      if (Dex.toID(self.ability) === 'regenerator' && self.currentHP < self.maxHP * 0.7) switchCost -= 0.6;
      /*
       * Progress the Pokémon in front is already making is progress a switch
       * throws away. A switch that merely improves the matchup on paper is a
       * turn spent doing nothing, so the chip the current Pokémon would deal is
       * charged against it — most heavily when that chip is a large share of
       * what the foe has left, which is the case where staying actually wins the
       * exchange. Capped so it can never outweigh a genuinely losing matchup.
       */
      const progress = bestDamage(battle, self, foe).damage / Math.max(1, effectiveHP(battle, foe));
      switchCost += Math.min(progress, 1) * 0.8;
      // Leaving a Speed Boost or a set-up sweep behind is expensive.
      const boosted = Object.values(self.boosts).reduce((a, b) => a + Math.max(0, b), 0);
      switchCost += boosted * 0.5;
    }
    /*
     * Unable to do anything at all: switch, and do not haggle about it.
     *
     * This is a **gate, not a margin**, and it has to be. Reported twice now:
     * a Kingambit Choice-locked into Dig against a Flying Skarmory stayed in for
     * six turns. `matchupScore` had it right — 0.0 against a bench of 1.1 and
     * 1.5 — but `switchThreshold` is a margin of 3.4-5.2, so a position that is
     * *completely* lost still loses the comparison to a position that is merely
     * bad. No amount of tuning the threshold fixes that: the whole point is that
     * staying has a value of exactly zero, so nothing should have to outbid it.
     *
     * **Not gated on `level.predicts`**, unlike most of the AI's judgement, and
     * for the reason §8 gives about impossible moves: "a blunder must be a
     * worse move, not an impossible one". Six turns of hitting a Pokémon that
     * cannot be hit reads as the game being broken rather than as an easy
     * opponent, and the weak tiers keep every other way of being wrong.
     *
     * The survival gate above still applies at the predicting tiers, so this
     * cannot send a replacement in to die on arrival — and if nothing survives,
     * `options` is already empty and we never reach here.
     */
    if (helpless(battle, self, foe) && !helpless(battle, best.pokemon, foe)) {
      if (level.predicts && TRAPPING_ABILITIES.has(Dex.toID(foe.ability)) && battle.isTrapped(self)) return null;
      return {type: 'switch', index: best.index};
    }

    const margin = best.score - current - switchCost;
    /*
     * About to faint and unable to trade: switch to preserve it, or sack it?
     *
     * Switching keeps the Pokémon but hands the replacement a free hit; fainting
     * loses it but the *next* replacement arrives untouched. Discounting the
     * threshold unconditionally — as this used to — meant the AI reliably fed a
     * second healthy Pokémon to the same attack in order to save a spent one.
     */
    let threshold = level.switchThreshold;
    if (dyingSoon && !canKO) {
      if (!level.predicts) threshold *= 0.4;
      else {
        const worth = preserveValue(battle, self);
        const absorber = findAbsorber(battle, sideIndex, foe);
        // Worth saving *and* somebody can take the hit: preserving is cheap.
        if (worth >= 0.9 && absorber) threshold *= 0.4;
        // Nothing can absorb it, or it is spent: let it faint and take the free
        // switch-in afterwards. Its last turn is still worth spending on a move.
        else if (worth < 0.6 || !absorber) return null;
      }
    }
    if (margin < threshold) return null;
    if (!battle.aiRng.chance(level.switchChance)) return null;
    if (level.savesRevenge && best.pokemon.currentHP / best.pokemon.maxHP < 0.35 && options.length > 1) {
      const alternative = options[1];
      if (alternative.score > current + level.switchThreshold) return {type: 'switch', index: alternative.index};
    }
    return {type: 'switch', index: best.index};
  }

  function chooseTeamPreview(battle, sideIndex, request, level) {
    const side = battle.sides[sideIndex];
    const foeSide = battle.sides[1 - sideIndex];
    const bring = request.bring || side.team.length;
    const team = level.predicts ? archetypeOf(battle, sideIndex) : null;
    // Score each Pokémon against the opposing roster and lead with the best.
    const scored = side.team.map((pokemon, index) => {
      let total = 0;
      for (const foe of foeSide.team) total += matchupScore(battle, pokemon, foe);
      let score = total / Math.max(1, foeSide.team.length) + (level.predicts ? 0 : battle.aiRng.next() * 0.6);
      if (team) {
        // Leading is a role, not just the best matchup. A hazard setter or a
        // screen setter wants turn one; a suicide lead wants it most of all; a
        // weather setter wants to be out before the teammates that need it.
        const role = team.roles[side.team.filter(p => !p.fainted).indexOf(pokemon)] || roleOf(battle, pokemon);
        if (role.suicide) score += 1.6;
        else if (role.lead) score += 0.9;
        if (role.weather && team.weatherAbusers >= 1) score += 0.8;
        // A win condition should not be led with — it wants the field cleared.
        if (role.sweeper && !role.lead) score -= 0.5;
        if (role.wall && team.style === 'stall') score += 0.3;
      }
      return {index, score};
    }).sort((a, b) => b.score - a.score);
    const order = scored.map(s => s.index);
    /*
     * A themed team's setter leads outright rather than being nudged. Done by
     * reordering rather than by a score bonus because "always" is the rule —
     * any bonus large enough to be reliable would distort the matchup scoring
     * it was added to, and any bonus small enough not to would sometimes lose.
     *
     * Moved before the `bring` slice below, so the setter is also guaranteed to
     * be one of the Pokémon actually brought.
     */
    const forced = team ? themeLead(battle, sideIndex) : null;
    if (forced) {
      const at = order.indexOf(forced.index);
      if (at > 0) {
        order.splice(at, 1);
        order.unshift(forced.index);
      }
    }
    if (bring < side.team.length) {
      const chosen = order.slice(0, bring);
      const rest = order.slice(bring);
      return {type: 'team', order: [...chosen, ...rest]};
    }
    return {type: 'team', order};
  }

  function chooseSwitchReplacement(battle, sideIndex, level) {
    const foe = battle.active(1 - sideIndex);
    const options = benchOptions(battle, sideIndex);
    if (!options.length) return {type: 'switch', index: battle.sides[sideIndex].activeIndex};
    if (!foe || foe.fainted) return {type: 'switch', index: options[0].index};
    /*
     * A replacement arrives for free — nothing hit it on the way in — so this is
     * the one moment the AI gets to pick a fight on its own terms. The best pick
     * is a revenge killer: something that outspeeds what is standing there and
     * knocks it out before it can act. `matchupScore` values that only
     * indirectly, through an offense term that a bulky attacker can match
     * without ever winning the race, so it is named explicitly here.
     *
     * The KO has to be measured against `effectiveHP`, or a Focus Sash or an
     * unbroken Sturdy reads as a kill that does not happen — and the AI would
     * spend its best sweeper revenging something that survives on 1 HP.
     */
    const revengeBonus = entry => {
      if (!level.predicts) return 0;
      const mon = entry.pokemon;
      const outspeeds = battle.getStat(mon, 'spe') > battle.getStat(foe, 'spe');
      const hit = bestDamage(battle, mon, foe);
      const kills = hit.damage >= effectiveHP(battle, foe);
      if (!kills) return 0;
      // Killing first wins the exchange outright; killing second only trades.
      if (outspeeds) return 2.5;
      return switchInSurvival(battle, mon, foe).lands ? 1.0 : 0;
    };

    /*
     * Sending in something that is knocked out by the first thing it sees, while
     * a Pokémon that survives sits on the bench, hands over a free kill. Only
     * charged when a survivor actually exists — when everything dies the choice
     * is which Pokémon to spend, and that is the sack logic below, which is a
     * deliberate decision rather than a mistake.
     */
    /*
     * A replacement is not a switch. Nothing hits it on the way in — it arrives
     * after the faint and both sides act next turn — so the test is not "does it
     * survive a free hit" but "does it get to do anything at all". Something
     * faster that knocks the foe out never takes the hit in the first place, and
     * an earlier version of this penalty scored those *down*, punishing exactly
     * the revenge killers the rest of this function is trying to find.
     */
    const landsSafely = entry => {
      const mon = entry.pokemon;
      const faster = battle.getStat(mon, 'spe') > battle.getStat(foe, 'spe');
      if (faster && bestDamage(battle, mon, foe).damage >= effectiveHP(battle, foe)) return true;
      return bestDamage(battle, foe, mon).damage < effectiveHP(battle, mon);
    };
    const anySurvivor = level.predicts && options.some(landsSafely);

    const scored = options
      .map(entry => ({
        ...entry,
        // The replacement pays the hazard toll the moment it lands, so a Boots
        // holder is a genuinely better answer than an equal Pokémon without.
        score: matchupScore(battle, entry.pokemon, foe) +
          revengeBonus(entry) +
          (anySurvivor && !landsSafely(entry) ? -2.0 : 0) +
          (level.predicts ? -hazardCost(battle, entry.pokemon, sideIndex) * 2.0 : 0) +
          (level.noise ? battle.aiRng.next() * level.noise : 0),
      }))
      .sort((a, b) => b.score - a.score);

    /*
     * Keeping a sack for later.
     *
     * When every option loses the matchup anyway, sending the *best* Pokémon in
     * simply feeds the win condition to whatever is out there. Send the most
     * expendable one instead: it buys the same turn, and the Pokémon that
     * actually beats something later is still on the bench.
     */
    if (level.predicts && options.length > 1) {
      const everyOptionLoses = scored.every(entry =>
        bestDamage(battle, foe, entry.pokemon).damage >= entry.pokemon.currentHP);
      if (everyOptionLoses) {
        const sack = scored
          .map(entry => ({...entry, worth: preserveValue(battle, entry.pokemon)}))
          .sort((a, b) => a.worth - b.worth)[0];
        // Only if it really is more expendable than the best answer, so this
        // never throws away a Pokémon that was going to win the exchange.
        if (sack && sack.index !== scored[0].index &&
            preserveValue(battle, scored[0].pokemon) - sack.worth > 0.3) {
          return {type: 'switch', index: sack.index};
        }
      }
    }
    return {type: 'switch', index: scored[0].index};
  }

  /**
   * @param {Battle} battle
   * @param {number} sideIndex
   * @param {object} request
   * @returns {object} a choice object accepted by `Battle.choose`
   */
  function chooseAction(battle, sideIndex, request) {
    const side = battle.sides[sideIndex];
    const level = difficulty(side.ai?.difficulty);

    if (request.type === 'teampreview') return chooseTeamPreview(battle, sideIndex, request, level);
    if (request.type === 'switch') return chooseSwitchReplacement(battle, sideIndex, level);

    const self = side.team[side.activeIndex];
    const foe = battle.foeActive(self);

    if (request.forcedMoveIndex != null && request.forcedMoveIndex >= 0) {
      return {type: 'move', index: request.forcedMoveIndex, tera: false, mega: !!request.canMega};
    }

    const switchChoice = considerSwitch(battle, sideIndex, level, request);
    if (switchChoice) return switchChoice;

    const legal = battle.availableMoveIndices(self);
    if (legal.length === 1 && legal[0] === -1) return {type: 'move', index: -1, tera: false, mega: !!request.canMega};

    // Roll this turn's lapses once, so a tier that misses a knockout misses it
    // consistently while comparing its options. Uses aiRng, per the two-stream
    // rule — replays skip AI evaluation entirely.
    const lapse = {
      koBlind: level.koBlindness > 0 && battle.aiRng.chance(level.koBlindness),
      sloppyType: level.sloppyType > 0 && battle.aiRng.chance(level.sloppyType),
    };

    const scored = legal
      .map(index => ({index, score: scoreMove(battle, self, foe, self.moves[index], index, level, lapse)}))
      .filter(entry => entry.score > -Infinity)
      .sort((a, b) => b.score - a.score);
    if (!scored.length) return {type: 'move', index: legal[0], tera: false, mega: !!request.canMega};

    let choiceIndex = scored[0].index;

    /*
     * A blunder is "played a worse move", not "played a move that cannot work".
     *
     * Both randomisers used to draw from every legal move, so a weak tier could
     * roll a move the target is flatly immune to — and then roll it again next
     * turn, because nothing about the position had changed. Reported from a real
     * log: a Nidoking used Earthquake into a Water/Flying Pelipper on two
     * consecutive turns. Measured at 6.7% of Casual's decisions, 5.8% of
     * Trainer's and 4.2% of Ace's.
     *
     * That is not difficulty, it is incoherence — the one mistake a player reads
     * as the game being broken rather than the opponent being beatable. The
     * weak tiers keep every other way of being wrong: they still miss the best
     * move, still mistime setup, still switch badly.
     *
     * Falls back to the full list when *everything* is futile, because something
     * still has to be chosen.
     */
    const canDoSomething = entry => {
      const slot = self.moves[entry.index];
      const move = slot && Dex.move(slot.id);
      if (!move || !foe || foe.fainted) return true;
      if (willFail(battle, self, foe, move)) return false;
      return move.category === 'Status' || estimateDamage(battle, self, foe, move) > 0;
    };
    const sane = scored.filter(canDoSomething);
    const pool = sane.length ? sane : scored;

    // Outright blunder: ignore the ranking and play something at random. This is
    // what actually separates a weak tier from a strong one — picking the third
    // best move rarely costs anything, picking an arbitrary one often does.
    if (level.mistakeChance > 0 && pool.length > 1 && battle.aiRng.chance(level.mistakeChance)) {
      choiceIndex = battle.aiRng.pick(pool).index;
    }
    if (level.noise > 0 && pool.length > 1) {
      const window = pool.slice(0, Math.min(level.topN, pool.length))
        .filter(entry => entry.score > pool[0].score - 120 * level.noise);
      if (window.length > 1 && battle.aiRng.chance(level.noise)) {
        choiceIndex = battle.aiRng.pick(window).index;
      }
    }

    /*
     * Terastallization: once per battle, so the question is not "does this help"
     * but "is this the moment".
     *
     * Everything is measured by temporarily applying the Tera typing and reading
     * the engine back, the same technique the setup evaluation uses. The
     * previous version measured correctly but named the two halves backwards —
     * `incomingBefore` was read *while* Tera'd — which made the condition
     * impossible to check by eye.
     */
    let tera = false;
    if (request.canTera && foe && !foe.fainted) {
      const chosenMove = Dex.move(self.moves[choiceIndex]?.id);
      if (chosenMove && !chosenMove.missing) {
        const plainOut = estimateDamage(battle, self, foe, chosenMove);
        const plainIn = bestDamage(battle, foe, self).damage;

        const original = {types: self.types, terastallized: self.terastallized};
        self.types = [self.teraType];
        self.terastallized = true;
        const teraOut = estimateDamage(battle, self, foe, chosenMove);
        const teraIn = bestDamage(battle, foe, self).damage;
        self.types = original.types;
        self.terastallized = original.terastallized;

        const health = effectiveHP(battle, self);
        const convertsKO = plainOut < foe.currentHP && teraOut >= foe.currentHP;
        const savesLife = plainIn >= health && teraIn < health;

        if (level.predicts) {
          let want = convertsKO || savesLife;
          /*
           * Defensive Tera.
           *
           * Changing typing to blunt an incoming attack is a play in its own
           * right, not only a last resort when the hit would be lethal — a
           * Fairy with a Steel Tera type facing a Poison move takes *nothing*
           * instead of double, and keeps that resistance for the rest of the
           * battle. `bestDamage` is re-read after the swap, so this cannot be
           * fooled by a foe that simply switches to its other coverage move.
           */
          const health = plainIn > 0 ? effectiveHP(battle, self) : 1;
          const avoided = (plainIn - teraIn) / Math.max(1, health);
          const meaningful = plainIn >= health * 0.25;   // not worth it to dodge a scratch
          if (!want && meaningful && (teraIn === 0 || avoided >= 0.3)) want = true;
          const boosted = Object.values(self.boosts).reduce((a, b) => a + Math.max(0, b), 0);
          const mineLeft = battle.sides[self.side].team.filter(p => !p.fainted).length;
          const theirsLeft = battle.sides[1 - self.side].team.filter(p => !p.fainted).length;
          // A Pokémon that has already set up is the win condition; Tera is how
          // its STAB gets through the thing that would otherwise wall it.
          if (!want && boosted >= 2 && teraOut > plainOut * 1.3) want = true;
          // Last Pokémon standing, or last opponent: nothing left to save it for.
          if (!want && (mineLeft === 1 || theirsLeft === 1) && teraOut > plainOut * 1.15) want = true;
          // Never spend it on a gain that changes no outcome.
          if (want && !convertsKO && !savesLife && teraOut <= plainOut * 1.15 && teraIn >= plainIn) want = false;
          tera = want;
        } else {
          tera = (convertsKO || teraOut > plainOut * 1.25) && battle.aiRng.chance(0.5);
        }
      }
    }
    // Mega Evolution: near-pure upside — the forme has better stats, the stone
    // is never consumed and there is nothing to save it for in singles — so
    // committing at the first opportunity is close to optimal. Weaker tiers
    // dither, using aiRng so replays stay in sync.
    const mega = !!request.canMega && (level.predicts || battle.aiRng.chance(0.6));

    return {type: 'move', index: choiceIndex, tera, mega};
  }

  /**
   * Everything the AI knows about the current turn, as data.
   *
   * The AI computes a score and a pile of intermediate judgements for every
   * option and then throws all of it away, keeping only the index it picked.
   * That makes "why did it do that?" answerable only by re-deriving the whole
   * decision by hand, which is how a session gets spent proving an AI change
   * altered nothing. This returns the working.
   *
   * **Read-only, and it has to stay that way.** Two rules, both load-bearing:
   *
   * - **It must not draw from `battle.aiRng`.** Replays skip AI evaluation
   *   entirely (§5), so a display that advanced the AI stream would
   *   desynchronise playback of any battle the inspector had been open during.
   *   `scoreMove` is safe — the noise and the `lapse` rolls live in
   *   `chooseAction`, not in the scorer — but `considerSwitch` is **not**, so
   *   the switch rows use the pure `matchupScore` instead of asking the real
   *   switch logic.
   * - **It must not draw from `battle.rng` either**, which is why every damage
   *   figure here comes from `estimateDamage` (which previews) rather than from
   *   anything that rolls.
   *
   * @param {object} battle
   * @param {number} sideIndex   the side whose reasoning to explain
   * @param {string|object} [tier] difficulty id or level object; defaults to
   *   the side's own `ai.difficulty`, or Expert for a human-controlled side.
   * @returns {object|null}
   */
  function explainChoice(battle, sideIndex, tier = null) {
    const side = battle.sides[sideIndex];
    const self = side?.team[side.activeIndex];
    const foe = self ? battle.foeActive(self) : null;
    if (!self || !foe || self.fainted) return null;
    const level = typeof tier === 'object' && tier ? tier : difficulty(tier || side.ai?.difficulty || 'expert');

    const threat = incomingThreat(battle, self, foe);
    const selfHP = effectiveHP(battle, self);
    const foeHP = effectiveHP(battle, foe);
    const outspeeds = movesFirst(battle, self, foe, null, threat.move);

    const moves = (self.moves || []).map((slot, index) => {
      const move = Dex.move(slot.id);
      const type = battle.moveType(self, foe, move);
      const damage = move.category === 'Status' ? 0 : estimateDamage(battle, self, foe, move);
      return {
        index,
        id: slot.id,
        name: move.name,
        type,
        category: move.category,
        pp: slot.pp,
        score: scoreMove(battle, self, foe, slot, index, level),
        damage,
        percentOfFoe: foe.maxHP ? Math.round(100 * Math.min(damage, foe.currentHP) / foe.maxHP) : 0,
        effectiveness: move.category === 'Status' ? null : battle.effectiveness(type, foe, move, self),
        accuracy: Math.round(100 * hitChance(battle, self, foe, move)),
        willFail: willFail(battle, self, foe, move),
        kos: damage >= foeHP,
        setup: setupPlan(move) ? Math.round(setupValue(battle, self, foe, move, level, threat)) : null,
      };
    });
    const ranked = moves.slice().sort((a, b) => b.score - a.score);

    const bench = side.team
      .map((mon, index) => ({mon, index}))
      .filter(entry => !entry.mon.fainted && entry.index !== side.activeIndex)
      .map(entry => ({
        index: entry.index,
        species: Dex.species(entry.mon.species).name,
        matchup: Math.round(matchupScore(battle, entry.mon, foe) * 10) / 10,
        survivesSwitchIn: switchInSurvival(battle, entry.mon, foe).lands,
      }))
      .sort((a, b) => b.matchup - a.matchup);

    return {
      tier: level.name || level.id,
      predicts: !!level.predicts,
      self: {name: Dex.species(self.species).name, hp: self.currentHP, maxHP: self.maxHP, effectiveHP: Math.round(selfHP)},
      foe: {name: Dex.species(foe.species).name, hp: foe.currentHP, maxHP: foe.maxHP, effectiveHP: Math.round(foeHP)},
      // The three facts most of `scoreMove`'s branches hang off.
      outspeeds,
      incoming: {damage: Math.round(threat.damage), move: threat.move ? Dex.move(threat.move.id).name : null},
      dying: threat.damage >= selfHP,
      // What a turn spent stalling is worth to each side, in HP. This is the
      // number behind "why did it Protect instead of attacking?".
      residual: {self: battle.residualSwing(self), foe: battle.residualSwing(foe)},
      moves,
      best: ranked.length ? ranked[0].index : null,
      switches: bench,
    };
  }

  global.RedGPT.AI = {
    chooseAction, difficulty, DIFFICULTIES, explainChoice,
    estimateDamage, bestDamage, incomingThreat, teamThreat, matchupScore, turnsToKO, scoreMove,
    archetypeOf, roleOf, themeLead, hazardCost, hazardValue, effectiveHP, willFail, selfDefeating,
    movesFirst, effectivePriority, turnSpeed, pivotValue, setupValue, setupPlan, hitChance,
    preserveValue, findAbsorber, considerSwitch, chooseSwitchReplacement,
    restingTurns, stillAsleep, helpless,
  };
})(typeof window !== 'undefined' ? window : globalThis);
