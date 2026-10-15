/**
 * The order answer options are shown in. Lessons author the right answer first, so without this
 * "always pick A" would pass every question.
 *
 * The order is seeded, not random: the same exercise always shows the same order, so the server
 * render matches the browser's and a resumed lesson looks the way it did. Grading never sees
 * display positions, only the authored option indexes.
 */

/** FNV-1a: a small, stable string hash. */
function hash(text: string) {
  let h = 0x811c9dc5
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

/** mulberry32: a tiny seeded generator, plenty for shuffling a handful of options. */
function generator(seed: number) {
  let state = seed
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * `order[displayPosition]` is the authored index of the option shown there. A Fisher–Yates
 * shuffle seeded by `key`, e.g. `a1-u1-l2:4` or `a1-u1-l2:7.1` for a conversation turn.
 */
export function optionOrder(count: number, key: string): number[] {
  const order = Array.from({ length: count }, (_, i) => i)
  const random = generator(hash(key))
  for (let i = count - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[order[i], order[j]] = [order[j]!, order[i]!]
  }
  return order
}
