/**
 * The app was called Klarlingo, and saved its settings in this browser under `klarlingo…` keys.
 * This copies them to their `hamstalk…` names once, so nobody loses their sound, motion, text size,
 * speaking pause or reminder choice. Runs as soon as the first client module loads, before any
 * setting is read. Safe to delete once the old keys have had time to move (say, 2027).
 */
export function moveLegacyKeys() {
  try {
    const storage = window.localStorage
    for (const key of Object.keys(storage)) {
      if (!key.startsWith("klarlingo")) continue
      const renamed = `hamstalk${key.slice("klarlingo".length)}`
      const value = storage.getItem(key)
      if (value !== null && storage.getItem(renamed) === null)
        storage.setItem(renamed, value)
      storage.removeItem(key)
    }
  } catch {
    // Storage blocked (a private window): there's nothing saved to move.
  }
}
