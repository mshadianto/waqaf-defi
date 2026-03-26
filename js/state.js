/*═══════════════════════════════════════════════════════════════
  WaqFi — Reactive State Manager
  Event-driven state with subscribe/publish pattern.
  UI modules subscribe to state changes and re-render only
  when relevant data changes.
═══════════════════════════════════════════════════════════════*/

class StateManager extends EventTarget {
  #data;

  constructor(initial = {}) {
    super();
    this.#data = { ...initial };
  }

  /** Read a single key */
  get(key) {
    return this.#data[key];
  }

  /** Read entire snapshot (shallow copy) */
  snapshot() {
    return { ...this.#data };
  }

  /**
   * Update one or more keys.
   * @param {string|object} keyOrPatch — single key string, or { key: value } patch
   * @param {*} [value]                — value when keyOrPatch is a string
   */
  set(keyOrPatch, value) {
    const patch = typeof keyOrPatch === 'string'
      ? { [keyOrPatch]: value }
      : keyOrPatch;

    const changed = [];

    for (const [k, v] of Object.entries(patch)) {
      if (this.#data[k] !== v) {
        this.#data[k] = v;
        changed.push(k);
      }
    }

    if (changed.length) {
      this.dispatchEvent(new CustomEvent('change', {
        detail: { keys: changed, state: this.snapshot() },
      }));

      for (const k of changed) {
        this.dispatchEvent(new CustomEvent(`change:${k}`, {
          detail: { value: this.#data[k], state: this.snapshot() },
        }));
      }
    }
  }

  /** Increment a numeric key */
  increment(key, delta = 1) {
    this.set(key, (this.#data[key] || 0) + delta);
  }

  /** Push an item to an array key (immutable — creates new array) */
  push(key, item) {
    const arr = this.#data[key] || [];
    this.set(key, [...arr, item]);
  }

  /** Subscribe to changes. Returns unsubscribe function. */
  on(eventName, handler) {
    this.addEventListener(eventName, handler);
    return () => this.removeEventListener(eventName, handler);
  }
}

// ── Singleton ──
export const store = new StateManager({
  blocks:           [],
  transactions:     [],
  totalWaqf:        0,
  totalWakif:       0,
  totalTokens:      0,
  blockHeight:      0,
  walletConnected:  false,
  walletAddress:    '',
});
