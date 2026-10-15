/**
 * In-lesson combos: answers right first time in a row. Only graded exercises count: reading a
 * dialogue or a grammar tip neither builds nor breaks a combo.
 */

export type ComboOutcome = "first_try" | "second_try" | "shown"

export function nextCombo(
  current: number,
  outcome: ComboOutcome,
  graded: boolean
) {
  if (!graded) return current
  return outcome === "first_try" ? current + 1 : 0
}

/** A combo starts glowing at this length. */
export const COMBO_GLOW_AT = 3

export type ComboMilestone = { count: number; cheer: string }

/** The combos worth shouting about, with a German cheer that grows with them. */
export function comboMilestone(count: number): ComboMilestone | null {
  if (count === 3) return { count, cheer: "Super!" }
  if (count === 5) return { count, cheer: "Fantastisch!" }
  if (count === 7) return { count, cheer: "Unglaublich!" }
  if (count >= 10 && count % 5 === 0) return { count, cheer: "Weltklasse!" }
  return null
}
