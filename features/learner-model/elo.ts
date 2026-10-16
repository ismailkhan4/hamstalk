/**
 * The learner model: an Elo-style rating per concept and a difficulty per exercise, on the same
 * scale (1000 to start). record_attempts() in adaptive.sql updates both; this is the prediction
 * side, used to pick practice the learner should get right about 80% of the time.
 */

export const START_RATING = 1000

/** The chance of getting an exercise right first time. */
export function pCorrect(skill: number, difficulty: number) {
  return 1 / (1 + 10 ** ((difficulty - skill) / 400))
}

/** How sure the model is about a concept: little evidence means stay near the middle. */
export function skillOf(
  skills: ReadonlyMap<string, { rating: number; attempts: number }>,
  conceptTag: string
) {
  return skills.get(conceptTag)?.rating ?? START_RATING
}
