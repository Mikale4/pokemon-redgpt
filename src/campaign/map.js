/**
 * Campaign map generation.
 *
 * Each Act is a directed acyclic graph laid out in rows. Several independent
 * paths are walked from the first row to the boss row and their union becomes
 * the map, so branches genuinely diverge instead of reconnecting after every
 * choice. Node types are then assigned under routing rules (no Elite in the
 * opening rows, no two identical services back to back on one path, a Rest Site
 * before the boss) that make route planning matter.
 *
 * Everything is derived from the run's seeded RNG, so the same seed always
 * produces the same map.
 */
(function (global) {
  'use strict';

  const RedGPT = global.RedGPT;
  const Content = RedGPT.CampaignContent;

  const WIDTH = 5;

  const ACT_LAYOUT = [
    {act: 1, rows: 9, paths: 5, name: 'The Outer Circuit'},
    {act: 2, rows: 10, paths: 6, name: 'The Contested Reach'},
    {act: 3, rows: 11, paths: 6, name: 'The Summit Trial'},
  ];

  /** Base weights before routing rules are applied. */
  const TYPE_WEIGHTS = {
    trainer: 30,
    wild: 14,
    event: 14,
    elite: 10,
    shop: 7,
    // A specialist held-item dealer with one purchase. Weighted below the
    // general Shop because it is the narrower node: it can be exactly what a
    // team needs, or nothing, and a run wants more of the reliable one.
    battleshop: 6,
    rest: 9,
    treasure: 8,
    specialist: 8,
    // Rare Encounters are the map's uncommon prize node. Weighted below every
    // other type and barred from the opening rows (see below), so a run sees a
    // couple of them rather than one on the way out of the gate.
    rare: 5,
  };

  function nodeId(act, row, col) { return `a${act}r${row}c${col}`; }

  /**
   * Walk `paths` routes from row 0 to the penultimate row, merging them into a
   * node/edge set.
   */
  function buildGraph(rng, act, rows, paths) {
    const nodes = new Map();
    const edges = new Set();

    const ensure = (row, col) => {
      const id = nodeId(act, row, col);
      if (!nodes.has(id)) nodes.set(id, {id, act, row, col, type: null, next: [], prev: []});
      return nodes.get(id);
    };

    const lastWalkRow = rows - 2; // the final row is the boss
    for (let p = 0; p < paths; p++) {
      let col = rng.int(0, WIDTH - 1);
      // Spread the starting columns so row 0 always offers real choices.
      if (p < WIDTH) col = (p * 2 + rng.int(0, 1)) % WIDTH;
      ensure(0, col);
      for (let row = 0; row < lastWalkRow; row++) {
        const options = [col - 1, col, col + 1].filter(c => c >= 0 && c < WIDTH);
        const next = rng.pick(options);
        ensure(row + 1, next);
        edges.add(`${nodeId(act, row, col)}>${nodeId(act, row + 1, next)}`);
        col = next;
      }
    }

    // Guarantee at least two choices on the opening row.
    let firstRow = [...nodes.values()].filter(n => n.row === 0);
    if (firstRow.length < 2) {
      const taken = new Set(firstRow.map(n => n.col));
      const free = [...Array(WIDTH).keys()].filter(c => !taken.has(c));
      const col = rng.pick(free) ?? 0;
      ensure(0, col);
      // Route the new opener into the existing row-1 nodes.
      const rowOne = [...nodes.values()].filter(n => n.row === 1);
      const target = rowOne.length ? rng.pick(rowOne) : ensure(1, col);
      edges.add(`${nodeId(act, 0, col)}>${target.id}`);
    }

    // Boss row: every penultimate node leads to it.
    const boss = ensure(rows - 1, Math.floor(WIDTH / 2));
    boss.type = 'boss';
    for (const node of [...nodes.values()].filter(n => n.row === lastWalkRow)) {
      edges.add(`${node.id}>${boss.id}`);
    }

    for (const edge of edges) {
      const [from, to] = edge.split('>');
      const a = nodes.get(from);
      const b = nodes.get(to);
      if (!a || !b) continue;
      if (!a.next.includes(to)) a.next.push(to);
      if (!b.prev.includes(from)) b.prev.push(from);
    }

    // Any node that cannot reach the boss is pruned so no path is a dead end.
    const reachable = new Set([boss.id]);
    for (let row = rows - 2; row >= 0; row--) {
      for (const node of [...nodes.values()].filter(n => n.row === row)) {
        if (node.next.some(id => reachable.has(id))) reachable.add(node.id);
      }
    }
    for (const [id, node] of [...nodes.entries()]) {
      if (!reachable.has(id)) { nodes.delete(id); continue; }
      node.next = node.next.filter(n => reachable.has(n));
      node.prev = node.prev.filter(n => reachable.has(n));
    }
    return {nodes, boss};
  }

  function assignTypes(rng, nodes, rows, act, options) {
    const eliteWeight = options.eliteWeight || 1;
    const byRow = [];
    for (let row = 0; row < rows; row++) byRow.push([...nodes.values()].filter(n => n.row === row));

    for (let row = 0; row < rows; row++) {
      for (const node of byRow[row]) {
        if (node.type) continue;

        // Rest Site immediately before the boss, always.
        if (row === rows - 2) { node.type = 'rest'; continue; }
        // The opening row is always a straightforward fight.
        if (row === 0) { node.type = rng.chance(0.7) ? 'trainer' : 'wild'; continue; }

        const parentTypes = new Set(node.prev.map(id => nodes.get(id)?.type).filter(Boolean));
        const weights = [];
        for (const [type, base] of Object.entries(TYPE_WEIGHTS)) {
          let weight = base;
          if (type === 'elite') {
            if (row < 3 || act === 1 && row < 4) weight = 0;
            else weight = base * eliteWeight * (1 + row / rows);
          }
          if (type === 'rest' && row < 3) weight = 0;
          if (type === 'shop' && row < 2) weight = 0;
          // The Battle Shop sells held items scored against the party, so it is
          // held back further than the general Shop: at row 2 the party is one
          // or two Pokémon and the shelf has almost nothing to be relevant to.
          if (type === 'battleshop' && row < 3) weight = 0;
          if (type === 'specialist' && row < 2) weight = 0;
          // A Rare Encounter is a fully-trained Pokémon, so it is barred from the
          // early rows where the party is one or two members with starter gear.
          if (type === 'rare' && row < 2) weight = 0;
          // Never repeat a service directly after itself on the same path.
          if (parentTypes.has(type) && ['rest', 'shop', 'battleshop', 'treasure', 'specialist', 'event', 'elite', 'rare'].includes(type)) weight *= 0.15;
          if (type === 'trainer' && row > rows - 4) weight *= 0.7;
          weights.push([type, weight]);
        }
        node.type = rng.weighted(weights) || 'trainer';
      }

      // Guarantee variety: a row of identical nodes is not a choice.
      if (byRow[row].length > 1 && new Set(byRow[row].map(n => n.type)).size === 1 && row !== rows - 2 && row !== rows - 1) {
        const alt = byRow[row][byRow[row].length - 1];
        const different = Object.keys(TYPE_WEIGHTS).filter(t => t !== alt.type &&
          !(t === 'elite' && row < 3) && !(t === 'rest' && row < 3) && !(t === 'rare' && row < 2) &&
          !(t === 'battleshop' && row < 3));
        alt.type = rng.pick(different) || alt.type;
      }
    }

    // Every Act must contain at least one shop and one Elite past row 2.
    const ensureType = (type, minRow) => {
      if ([...nodes.values()].some(n => n.type === type)) return;
      const candidates = [...nodes.values()].filter(n => n.row >= minRow && n.row < rows - 2 && n.type === 'trainer');
      if (candidates.length) rng.pick(candidates).type = type;
    };
    ensureType('shop', 2);
    ensureType('elite', 3);
    ensureType('rest', 3);
  }

  /**
   * @param {RNG} rng
   * @param {object} options `{act, extraRows, eliteWeight}`
   */
  function generateAct(rng, options = {}) {
    const act = options.act || 1;
    const layout = layoutFor(act);
    const rows = layout.rows + (options.extraRows || 0);
    const {nodes} = buildGraph(rng, act, rows, layout.paths);
    assignTypes(rng, nodes, rows, act, options);

    const list = [...nodes.values()].sort((a, b) => a.row - b.row || a.col - b.col);
    for (const node of list) {
      node.background = rng.pick(Content.NODE_BACKGROUNDS[node.type] || Content.NODE_BACKGROUNDS.trainer);
      node.seed = rng.int(0, 0x7fffffff);
    }
    return {
      act,
      name: layout.name,
      rows,
      width: WIDTH,
      nodes: list,
      entries: list.filter(n => n.row === 0).map(n => n.id),
      bossId: list.find(n => n.type === 'boss')?.id || null,
    };
  }

  /**
   * Layout for an Act. Runs can be longer than the three hand-authored Acts,
   * so anything past the table extends the last one: a little longer each time,
   * and named by number rather than pretending to have a written title.
   */
  function layoutFor(act) {
    const known = ACT_LAYOUT[act - 1];
    if (known) return known;
    const last = ACT_LAYOUT[ACT_LAYOUT.length - 1];
    const beyond = act - ACT_LAYOUT.length;
    return {act, rows: last.rows + beyond, paths: last.paths, name: `Trial ${act}`};
  }

  /** Generate all Acts for a run up front so the whole map is seed-stable. */
  function generateRunMap(rng, options = {}) {
    const total = Math.max(1, Math.round(options.acts || ACT_LAYOUT.length));
    const acts = [];
    for (let act = 1; act <= total; act++) acts.push(generateAct(rng, {...options, act}));
    return {acts};
  }

  function getNode(map, act, nodeId) {
    const actMap = map.acts[act - 1];
    return actMap?.nodes.find(n => n.id === nodeId) || null;
  }

  /** Nodes selectable from `currentNodeId` (or the entry row when null). */
  function availableFrom(map, act, currentNodeId) {
    const actMap = map.acts[act - 1];
    if (!actMap) return [];
    if (!currentNodeId) return [...actMap.entries];
    const node = actMap.nodes.find(n => n.id === currentNodeId);
    return node ? [...node.next] : [];
  }

  /** Sanity check used by tests: every entry can reach the boss. */
  function validateAct(actMap) {
    const byId = new Map(actMap.nodes.map(n => [n.id, n]));
    const problems = [];
    const canReachBoss = id => {
      const seen = new Set();
      const stack = [id];
      while (stack.length) {
        const current = stack.pop();
        if (current === actMap.bossId) return true;
        if (seen.has(current)) continue;
        seen.add(current);
        const node = byId.get(current);
        if (node) stack.push(...node.next);
      }
      return false;
    };
    if (!actMap.entries.length) problems.push('act has no entry nodes');
    if (actMap.entries.length < 2) problems.push('act offers fewer than two opening choices');
    for (const entry of actMap.entries) {
      if (!canReachBoss(entry)) problems.push(`entry ${entry} cannot reach the boss`);
    }
    for (const node of actMap.nodes) {
      if (!node.type) problems.push(`${node.id} has no node type`);
      if (node.row < actMap.rows - 1 && !node.next.length) problems.push(`${node.id} is a dead end`);
      if (node.row > 0 && !node.prev.length) problems.push(`${node.id} is unreachable`);
    }
    const branching = actMap.nodes.filter(n => n.next.length > 1).length;
    if (branching < 2) problems.push('map has almost no branching');
    return problems;
  }

  global.RedGPT.CampaignMap = {generateAct, generateRunMap, getNode, availableFrom, validateAct, layoutFor, ACT_LAYOUT, WIDTH, TYPE_WEIGHTS};
})(typeof window !== 'undefined' ? window : globalThis);
