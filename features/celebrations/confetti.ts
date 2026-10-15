import confetti from "canvas-confetti"

import { feedbackPreferences } from "@/lib/appearance"

const TOKENS = ["--primary", "--reward", "--spark", "--info", "--level-b1"]
const FALLBACK = ["#3ccf6a", "#ffc531", "#ff9a3d", "#1769c2", "#7b4fe0"]

/** The brand colours as the current theme resolves them. */
function colours() {
  const style = getComputedStyle(document.documentElement)
  const resolved = TOKENS.map((token) =>
    style.getPropertyValue(token).trim()
  ).filter((value) => /^#[0-9a-f]{6}$/i.test(value))
  return resolved.length === TOKENS.length ? resolved : FALLBACK
}

/**
 * A burst of confetti from both sides of the screen. Skipped entirely for learners who asked for
 * less motion: the sound and the words still celebrate.
 */
export function celebrate(intensity: "small" | "big" = "big") {
  try {
    if (feedbackPreferences().reduceMotion) return
    const palette = colours()
    const count = intensity === "big" ? 70 : 30
    const shared = {
      colors: palette,
      ticks: 220,
      gravity: 1.05,
      scalar: 1.05,
      disableForReducedMotion: true,
      zIndex: 1650,
    }
    void confetti({
      ...shared,
      particleCount: count,
      angle: 60,
      spread: 62,
      origin: { x: 0, y: 0.7 },
    })
    void confetti({
      ...shared,
      particleCount: count,
      angle: 120,
      spread: 62,
      origin: { x: 1, y: 0.7 },
    })
  } catch {
    // Decoration only.
  }
}
