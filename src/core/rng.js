/**
 * Seeded random number generation.
 *
 * Every gameplay system in RedGPT — battles, random teams, Campaign map
 * generation, shop stock, rewards — draws from an RNG instance rather than
 * Math.random, so runs and battles are reproducible from a seed.
 */
(function (global) {
  'use strict';

  const SEED_ALPHABET = '0123456789ABCDEF';
  const SEED_PREFIX = 'REDGPT-';

  /** FNV-1a over a string, returned as an unsigned 32-bit integer. */
  function hashString(str) {
    let h = 0x811c9dc5;
    const s = String(str);
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    return h >>> 0;
  }

  class RNG {
    /**
     * @param {number|string|{a:number,b:number,c:number,d:number}} seed
     */
    constructor(seed = Date.now()) {
      if (seed && typeof seed === 'object' && 'a' in seed) {
        this.seedValue = seed.seedValue >>> 0;
        this.a = seed.a >>> 0; this.b = seed.b >>> 0; this.c = seed.c >>> 0; this.d = seed.d >>> 0;
        this.calls = seed.calls || 0;
        return;
      }
      const numeric = typeof seed === 'number' && Number.isFinite(seed) ? Math.abs(Math.floor(seed)) >>> 0 : hashString(seed);
      this.seedValue = numeric >>> 0;
      this.reset();
    }

    reset() {
      // sfc32 initialised from four decorrelated hashes of the seed.
      const s = this.seedValue >>> 0;
      this.a = (s ^ 0x9e3779b9) >>> 0;
      this.b = (Math.imul(s, 0x85ebca6b) ^ 0x165667b1) >>> 0;
      this.c = (Math.imul(s ^ 0xc2b2ae35, 0x27d4eb2f)) >>> 0;
      this.d = (s + 0x6d2b79f5) >>> 0;
      this.calls = 0;
      // Discard the first few outputs so nearby seeds diverge immediately.
      for (let i = 0; i < 12; i++) this.next();
      this.calls = 0;
    }

    /** @returns {number} float in [0, 1) */
    next() {
      this.calls++;
      let {a, b, c, d} = this;
      a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
      let t = (a + b) >>> 0;
      a = (b ^ (b >>> 9)) >>> 0;
      b = (c + (c << 3)) >>> 0;
      c = ((c << 21) | (c >>> 11)) >>> 0;
      d = (d + 1) >>> 0;
      t = (t + d) >>> 0;
      c = (c + t) >>> 0;
      this.a = a; this.b = b; this.c = c; this.d = d;
      return (t >>> 0) / 4294967296;
    }

    /** Inclusive integer range. */
    int(min, max) {
      if (max === undefined) { max = min - 1; min = 0; }
      if (max < min) return min;
      return min + Math.floor(this.next() * (max - min + 1));
    }

    /** True with probability `p` (0..1). */
    chance(p) { return this.next() < p; }

    /** True with probability `numerator/denominator`. */
    ratio(numerator, denominator) { return this.next() * denominator < numerator; }

    pick(list) {
      if (!list || !list.length) return undefined;
      return list[Math.floor(this.next() * list.length)];
    }

    /** Fisher–Yates on a copy. */
    shuffle(list) {
      const out = [...list];
      for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(this.next() * (i + 1));
        [out[i], out[j]] = [out[j], out[i]];
      }
      return out;
    }

    /** `n` distinct entries, or fewer when the list is short. */
    sample(list, n) { return this.shuffle(list).slice(0, n); }

    /**
     * @param {Array<[any, number]>} entries `[value, weight]` pairs
     */
    weighted(entries) {
      const usable = entries.filter(e => e && e[1] > 0);
      if (!usable.length) return undefined;
      const total = usable.reduce((sum, e) => sum + e[1], 0);
      let roll = this.next() * total;
      for (const [value, weight] of usable) {
        roll -= weight;
        if (roll <= 0) return value;
      }
      return usable[usable.length - 1][0];
    }

    /** A fresh independent stream derived from this one — used per-battle. */
    fork(label = '') {
      return new RNG(hashString(`${this.seedValue}:${this.calls}:${label}`));
    }

    getState() {
      return {seedValue: this.seedValue, a: this.a, b: this.b, c: this.c, d: this.d, calls: this.calls};
    }

    static fromState(state) { return new RNG(state); }

    /** `REDGPT-8F32A1` style display seed. */
    static format(value) {
      const n = (typeof value === 'number' ? value : hashString(value)) >>> 0;
      let out = '';
      let rest = n;
      for (let i = 0; i < 6; i++) {
        out = SEED_ALPHABET[rest & 0xf] + out;
        rest >>>= 4;
      }
      return SEED_PREFIX + out;
    }

    /**
     * Accepts `REDGPT-8F32A1`, bare hex, a decimal number, or arbitrary text
     * (hashed). Returns `{value, label, valid}`; `valid` is false only for
     * empty input.
     */
    static parse(input) {
      const raw = String(input ?? '').trim();
      if (!raw) return {value: null, label: '', valid: false};
      const upper = raw.toUpperCase();
      const hex = upper.startsWith(SEED_PREFIX) ? upper.slice(SEED_PREFIX.length) : upper;
      if (/^[0-9A-F]{1,8}$/.test(hex)) {
        const value = parseInt(hex, 16) >>> 0;
        return {value, label: RNG.format(value), valid: true};
      }
      const value = hashString(raw);
      return {value, label: RNG.format(value), valid: true, hashed: true};
    }

    static hash(str) { return hashString(str); }

    /** A new unpredictable seed for "surprise me" buttons. */
    static random() {
      const entropy = `${Date.now()}:${Math.random()}:${Math.random()}`;
      return hashString(entropy);
    }
  }

  global.RedGPT = global.RedGPT || {};
  global.RedGPT.RNG = RNG;
  if (typeof module !== 'undefined' && module.exports) module.exports = {RNG};
})(typeof window !== 'undefined' ? window : globalThis);
