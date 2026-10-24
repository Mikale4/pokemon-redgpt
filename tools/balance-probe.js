/**
 * Campaign balance probe.
 *
 * Plays complete Campaign runs with a competent scripted policy — routes around
 * Elites when hurt and around nodes that have already cost a Beacon, equips
 * spare held items, uses potions before hard fights, keeps movesets current, and
 * takes recruits while the party is small — then reports clear rate, run length
 * and per-encounter win rates.
 *
 * This is a measurement tool, not a test. `npm test` deliberately asserts that
 * runs *terminate correctly*, never how often they are won: a win-rate
 * assertion would be flaky and would freeze tuning. Run this by hand after
 * changing difficulty, encounter sizing, boss teams or the reward economy.
 *
 *   node tools/balance-probe.js [runs] [normal|veteran|master] [advisor|basic]
 *
 * The policy argument selects how well the run is played — see `POLICY` below.
 * Seeds are fixed (`2000 + i * 13`), so the same arguments always reproduce the
 * same result and two policies can be compared on identical runs.
 */
'use strict';

const path = require('path');
const {loadEngine} = require(path.resolve(__dirname, '..', 'tests', 'helpers', 'engine.js'));

const RedGPT = loadEngine();
const {Dex, Campaign, AI, RNG, Advisor} = RedGPT;

const STATS = {
  wins: 0, losses: 0, nodes: 0, byKind: {}, deaths: {}, failures: [],
  // Control for the policy itself: if a policy reports zero moves taught, its
  // comparison against another policy is measuring nothing. The `basic` policy
  // is expected to report taught: 0 for movelearn and tutor — that is its
  // defect, and it should be visible rather than inferred.
  moves: {taught: 0, declined: 0},
};

/**
 * Which policy plays the run.
 *
 * `advisor` (default) delegates every move-learning and held-item decision to
 * `RedGPT.Advisor` — the same deterministic scorer Assist Mode shows the player
 * — so the probe models someone following the in-game recommendations. It also
 * declines to re-enter a node that has already cost a Beacon.
 *
 * `basic` is the original policy. It **skips every move-learn and tutor prompt**,
 * so the party fights the last Act with the moveset it had at level 16, and it
 * re-attacks the fight that just killed it; it measures a floor, not competent
 * play. Keep it for comparing the two policies on identical seeds within one
 * build — it does *not* reproduce numbers published before the difficulty dials
 * moved on 2026-08-12.
 */
const POLICY = process.argv[4] || 'advisor';
const useAdvisor = POLICY !== 'basic';

const memberByUid = (run, uid) => run.party.find(m => m.uid === uid) || null;

/** Advisor-chosen slot to overwrite, or null when the move is not an upgrade. */
function replacementSlot(member, moveId) {
  if (member.set.moves.length < 4) return {index: member.set.moves.length};
  return Advisor.recommendMoveReplacement(member.set, moveId);
}

/* ------------------------------ battle ------------------------------ */

function playBattle(run, config) {
  const battle = Campaign.createBattle(run, config);
  battle.sides[0].ai = {difficulty: 'expert'};
  battle.start();
  let guard = 0;
  while (!battle.ended && guard++ < 3000) {
    const request = battle.requests[0];
    if (!request) break;
    const choice = AI.chooseAction(battle, 0, request);
    if (!battle.choose(0, choice).ok) battle.choose(0, battle.fallbackChoice(0, request));
  }
  return battle;
}

/* ------------------------------ policy ------------------------------ */

function partyHealth(run) {
  let current = 0;
  let max = 0;
  for (const member of run.party) {
    current += Math.max(0, member.condition.currentHP);
    max += Campaign.memberMaxHP(run, member);
  }
  return max ? current / max : 0;
}

/**
 * Put spare held items on the party. The advisor policy asks who the item
 * actually suits and falls back to any free holder; the basic policy takes
 * whoever happens to have an empty slot, in bag order.
 */
function equipSpares(run) {
  for (const [itemId, count] of Object.entries(run.bag.held)) {
    for (let i = 0; i < count; i++) {
      const free = run.party.filter(m => !m.set.item);
      if (!free.length) return;
      let target = free[0];
      if (useAdvisor) {
        const rec = Advisor.recommendHeldItemTarget(run, itemId);
        // Only follow the recommendation when that member is actually free —
        // equipping over a held item would put the old one back in the bag and
        // this loop would reconsider it forever.
        target = free.find(m => m.uid === rec?.uid) || free[0];
      }
      Campaign.equipHeldItem(run, target.uid, itemId);
    }
  }
}

/** Revive the fallen, then top up anyone below the threshold. */
function patchUp(run, threshold) {
  for (const member of run.party) {
    if (member.condition.currentHP > 0) continue;
    for (const id of ['maxrevive', 'revive']) {
      if (run.bag.consumables[id]) { Campaign.useConsumable(run, id, member.uid); break; }
    }
  }
  for (const member of run.party) {
    const max = Campaign.memberMaxHP(run, member);
    let guard = 0;
    while (member.condition.currentHP > 0 && member.condition.currentHP < max * threshold && guard++ < 4) {
      const id = ['potion', 'superpotion', 'hyperpotion', 'fullrestore'].find(x => run.bag.consumables[x]);
      if (!id || !Campaign.useConsumable(run, id, member.uid).ok) break;
    }
  }
}

function pickNode(run, rng, lostTo) {
  const health = partyHealth(run);
  return run.availableNodeIds
    .map(id => {
      const node = Campaign.nodeById(run, id);
      let score = {trainer: 5, wild: 6, event: 4, shop: 6, rest: 5, treasure: 6, specialist: 5, elite: 3, boss: 10}[node.type] || 3;
      if (node.type === 'elite') score += health > 0.8 && run.party.length >= 4 ? 5 : -4;
      if (node.type === 'rest') score += health < 0.6 ? 8 : 0;
      if (node.type === 'shop') score += run.credits > 600 ? 4 : -1;
      if (node.type === 'wild' && run.party.length >= 6) score -= 3;
      // A node that already cost a Beacon is a known bad matchup. Losing heals
      // the team fully, so without this an Elite that just won scores *higher*
      // next time round and the run feeds it every remaining Beacon. A real
      // player takes another route; only a mandatory node (the Act boss, when
      // it is the sole option) gets attacked again.
      if (useAdvisor) score -= 12 * (lostTo.get(id) || 0);
      return {id, score: score + rng.next()};
    })
    .sort((a, b) => b.score - a.score)[0].id;
}

function rewardPriority(run, option) {
  switch (option.kind) {
    case 'recruit': return run.party.length < 5 ? 100 : 20;
    case 'relic': return 85;
    case 'held': return 70;
    case 'levels': return 65;
    case 'tm': return 55;
    case 'heal': return partyHealth(run) < 0.6 ? 75 : 25;
    case 'consumable': return 40;
    case 'credits': return 35;
    default: return 10;
  }
}

const SHOP_PRIORITY = run => ({
  relic: 6, recruit: run.party.length < 5 ? 6 : 1, heal: 5, held: 4, evolution: 4,
  consumable: 3, tutor: 2, beacon: 5,
});

function resolvePrompt(run) {
  const prompt = run.pending;
  switch (prompt.type) {
    case 'reward': {
      const best = prompt.options
        .map((option, index) => ({index, score: rewardPriority(run, option)}))
        .sort((a, b) => b.score - a.score)[0];
      return Campaign.resolvePrompt(run, {index: best.index});
    }
    case 'tm': {
      if (!useAdvisor) {
        STATS.moves.taught++;
        return Campaign.resolvePrompt(run, {moveIndex: 0, memberUid: prompt.moves[0].eligible[0], replaceIndex: 3});
      }
      const rec = Advisor.recommendTm(run, prompt);
      const member = rec && memberByUid(run, rec.memberUid);
      if (!member) { STATS.moves.declined++; return Campaign.resolvePrompt(run, {skip: true}); }
      const entry = prompt.moves[rec.moveIndex];
      const slot = replacementSlot(member, typeof entry === 'string' ? entry : entry.id);
      if (!slot) { STATS.moves.declined++; return Campaign.resolvePrompt(run, {skip: true}); }
      STATS.moves.taught++;
      return Campaign.resolvePrompt(run,
        {moveIndex: rec.moveIndex, memberUid: rec.memberUid, replaceIndex: slot.index});
    }
    case 'tutor': {
      if (!useAdvisor) {
        if (prompt.memberUid) STATS.moves.declined++;
        return prompt.memberUid
          ? Campaign.resolvePrompt(run, {skip: true})
          : Campaign.resolvePrompt(run, {memberUid: run.party[0].uid});
      }
      // Two stages: name a member, then pick from the legal moves it returns.
      if (!prompt.memberUid) {
        let best = null;
        for (const member of run.party) {
          const legal = Dex.legalMoveList(member.set.species).filter(id => !member.set.moves.includes(id));
          const pick = Advisor.recommendTutorMove(member.set, legal);
          if (!pick) continue;
          const score = Advisor.moveScore(pick.moveId, member.set);
          if (!best || score > best.score) best = {uid: member.uid, score};
        }
        return Campaign.resolvePrompt(run, {memberUid: (best || run.party[0]).uid});
      }
      const member = memberByUid(run, prompt.memberUid);
      const pick = member && Advisor.recommendTutorMove(member.set, prompt.legalMoves);
      const slot = pick && replacementSlot(member, pick.moveId);
      if (!slot) { STATS.moves.declined++; return Campaign.resolvePrompt(run, {skip: true}); }
      STATS.moves.taught++;
      return Campaign.resolvePrompt(run,
        {memberUid: member.uid, moveId: pick.moveId, replaceIndex: slot.index});
    }
    case 'movelearn': {
      if (!useAdvisor) { STATS.moves.declined++; return Campaign.resolvePrompt(run, {skip: true}); }
      const member = memberByUid(run, prompt.memberUid);
      const slot = member && Advisor.recommendMoveReplacement(member.set, prompt.moveId);
      if (!slot) { STATS.moves.declined++; return Campaign.resolvePrompt(run, {skip: true}); }
      STATS.moves.taught++;
      return Campaign.resolvePrompt(run, {replaceIndex: slot.index});
    }
    case 'recruit': {
      if (prompt.needsRelease) {
        const weakest = [...run.party].sort((a, b) => Dex.species(a.set.species).bst - Dex.species(b.set.species).bst)[0];
        return Campaign.resolvePrompt(run, {index: prompt.chosenIndex, releaseUid: weakest.uid});
      }
      const best = prompt.options
        .map((set, index) => ({index, bst: Dex.species(set.species).bst}))
        .sort((a, b) => b.bst - a.bst)[0];
      return Campaign.resolvePrompt(run, {index: best.index});
    }
    case 'shop': {
      const priority = SHOP_PRIORITY(run);
      const wanted = prompt.stock
        .filter(entry => !entry.sold && entry.price <= run.credits)
        .sort((a, b) => (priority[b.kind] || 1) - (priority[a.kind] || 1));
      if (wanted.length && run.credits > 300) return Campaign.resolvePrompt(run, {index: wanted[0].index});
      return Campaign.resolvePrompt(run, {leave: true});
    }
    case 'rest':
      return Campaign.resolvePrompt(run, {id: partyHealth(run) < 0.85 ? 'heal' : 'train'});
    case 'event':
      return Campaign.resolvePrompt(run, {index: prompt.choices.find(c => c.enabled).index});
    case 'message': return Campaign.resolvePrompt(run, {});
    case 'specialist':
      return Campaign.resolvePrompt(run, {id: run.party.length < 5 ? 'recruit' : 'leave'});
    case 'ability':
      return prompt.memberUid
        ? Campaign.resolvePrompt(run, {memberUid: prompt.memberUid, ability: prompt.abilities[0]})
        : Campaign.resolvePrompt(run, {memberUid: run.party[0].uid});
    case 'nature':
      return prompt.memberUid
        ? Campaign.resolvePrompt(run, {memberUid: prompt.memberUid, nature: 'adamant'})
        : Campaign.resolvePrompt(run, {memberUid: run.party[0].uid});
    case 'evolve': return Campaign.resolvePrompt(run, {memberUid: run.party[0].uid});
    case 'evolvechoice': {
      // Branching evolution: take the highest BST. Falling through to the default
      // `skip` would mean the probe never evolved a Wurmple, Tyrogue, Slowpoke or
      // Eevee at all, quietly weakening every measured run.
      const best = prompt.options
        .map((option, index) => ({index, bst: option.bst || 0}))
        .sort((a, b) => b.bst - a.bst)[0];
      return Campaign.resolvePrompt(run, {index: best.index});
    }
    default: return Campaign.resolvePrompt(run, {skip: true});
  }
}

/* ------------------------------ driver ------------------------------ */

/**
 * Rebirth Mode measurement.
 *
 * The §6 table says nothing about Rebirth: every opponent in the mode is a
 * different team, at a different AI tier, with a field effect the base game
 * never has. It has to be measured on its own.
 *
 * The honest way is also the only cheap-enough one: play an ordinary run, and
 * if it clears, rebirth *that* run and measure the rebirth. Synthesising a
 * plausible carried-over party instead would be measuring a team nobody built.
 * The cost is that the denominator is the base clear rate — 200 Normal seeds
 * buy roughly 80 rebirths — so the run count has to be reported alongside.
 */
const REBIRTH_MODE = process.argv.includes('rebirth');
/** Stats are recorded only for the run being measured, not the qualifying one. */
let recording = true;

function driveRun(run, rng) {
  let guard = 0;
  /** node id → Beacons already spent on it, so the run stops re-attacking it. */
  const lostTo = new Map();
  while (!['victory', 'defeat'].includes(run.phase) && guard++ < 600) {
    if (run.phase === 'map') {
      equipSpares(run);
      const next = pickNode(run, rng, lostTo);
      const type = Campaign.nodeById(run, next).type;
      patchUp(run, type === 'boss' || type === 'elite' ? 0.9 : 0.5);
      const result = Campaign.enterNode(run, next);
      if (!result.ok) throw new Error(result.error);
    } else if (run.phase === 'battle') {
      const {kind} = run.pending.config;
      const nodeId = run.activeNodeId;
      const battle = playBattle(run, run.pending.config);
      const won = battle.winner === 0;
      if (!won) lostTo.set(nodeId, (lostTo.get(nodeId) || 0) + 1);
      if (recording) {
        STATS.byKind[kind] = STATS.byKind[kind] || {wins: 0, losses: 0};
        STATS.byKind[kind][won ? 'wins' : 'losses']++;
      }
      const result = Campaign.resolveBattle(run, {won, survivors: Campaign.collectSurvivors(battle, 0)});
      if (!result.ok) throw new Error(result.error);
    } else {
      const result = resolvePrompt(run);
      if (result && !result.ok) throw new Error(`${run.pending?.type}: ${result.error}`);
    }
  }
  if (guard >= 600) throw new Error('run did not terminate');
  return run;
}

function playRun(seed, difficulty) {
  const rng = new RNG(seed * 3 + 11);
  const run = Campaign.createRun({seed, difficulty, trainerName: 'Probe'});
  const draft = run.pending.options
    .map((set, index) => ({index, bst: Dex.species(set.species).bst}))
    .sort((a, b) => b.bst - a.bst)[0];
  Campaign.chooseStarter(run, {index: draft.index});
  return driveRun(run, rng);
}

/** Play an ordinary run and, if it clears, the Rebirth started from it. */
function playRebirth(seed, difficulty) {
  recording = false;
  const qualifier = playRun(seed, difficulty);
  recording = true;
  if (qualifier.phase !== 'victory') return null;
  const reborn = Campaign.createRebirthRun(qualifier, {seed: seed * 7 + 3});
  return driveRun(reborn, new RNG(seed * 5 + 29));
}

const total = Number(process.argv[2] || 20);
const difficulty = process.argv[3] || 'normal';
let qualified = 0;

for (let i = 0; i < total; i++) {
  try {
    const run = REBIRTH_MODE ? playRebirth(2000 + i * 13, difficulty) : playRun(2000 + i * 13, difficulty);
    if (!run) continue;                       // rebirth mode: the base run did not clear
    qualified++;
    STATS.nodes += run.stats.nodes;
    if (run.result.won) STATS.wins++;
    else {
      STATS.losses++;
      STATS.deaths[`act${run.act}`] = (STATS.deaths[`act${run.act}`] || 0) + 1;
    }
  } catch (error) {
    STATS.failures.push(`seed ${2000 + i * 13}: ${error.message}`);
    // A crashed run is a real bug, and the message alone is rarely enough to
    // find it. `REDGPT_PROBE_STACK=1` prints the stack for each failure.
    if (process.env.REDGPT_PROBE_STACK) console.error(`\n=== STACK for seed ${2000 + i * 13} ===\n${error.stack}`);
  }
}

const completed = STATS.wins + STATS.losses;
const rate = completed ? Math.round(100 * STATS.wins / completed) : 0;
console.log(`${difficulty} (${POLICY} policy${REBIRTH_MODE ? ', REBIRTH' : ''}): ${STATS.wins}/${completed} cleared (${rate}%)`);
if (REBIRTH_MODE) {
  // The denominator, not an aside: a rebirth can only be measured on a seed
  // whose base run cleared, so "12% of 34" and "12% of 200" are different
  // findings and must not print the same way.
  console.log(`rebirths measured: ${qualified} of ${total} seeds (the rest never cleared a base run)`);
}
console.log(`moves taught: ${STATS.moves.taught}, declined: ${STATS.moves.declined}`);
console.log(`average run length: ${(STATS.nodes / Math.max(1, completed)).toFixed(1)} nodes`);
console.log(`deaths by act: ${JSON.stringify(STATS.deaths)}`);
for (const [kind, record] of Object.entries(STATS.byKind)) {
  const battles = record.wins + record.losses;
  console.log(`  ${kind.padEnd(8)} ${record.wins}/${battles} (${Math.round(100 * record.wins / battles)}%)`);
}
if (STATS.failures.length) {
  console.log(`\nfailures: ${STATS.failures.length}`);
  STATS.failures.slice(0, 5).forEach(f => console.log('  ' + f));
  process.exit(1);
}
