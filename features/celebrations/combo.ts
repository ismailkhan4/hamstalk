import { ACTIVE_COURSE } from "@/content/courses"

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

/** The combos worth shouting about, with a cheer in the course's language that grows with them. */
export function comboMilestone(
  count: number,
  phrases = ACTIVE_COURSE.phrases
): ComboMilestone | null {
  if (count === 3 || count === 5 || count === 7)
    return { count, cheer: phrases.combo[count] }
  if (count >= 10 && count % 5 === 0) return { count, cheer: phrases.comboBig }
  return null
}
