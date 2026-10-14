import "server-only"

import type { LessonProgress } from "./model"

/**
 * Lesson progress for the signed-in learner. No lesson can be completed until the first lessons
 * ship, so nothing is stored yet; this becomes a query when lesson progress gets its table.
 */
export async function loadLessonProgress(): Promise<LessonProgress[]> {
  return []
}
