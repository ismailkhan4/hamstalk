import { pCorrect, skillOf } from "@/features/learner-model/elo"
import type { GradedExercise } from "@/features/lessons/schema"

/**
 * The session generator: picks the exercises for a practice session from what the learner has
 * already met. Pure, so it can be reasoned about and previewed without a database.
 *
 *   smart     about 80% predicted success, with open mistakes and weak concepts favoured and
 *             anything seen in the last day held back
 *   mistakes  the exercises behind open mistakes, most missed first
 *   express   a finished unit's hardest exercises for this learner
 */

export type PracticeKind = "smart" | "mistakes" | "express"

export type Candidate = {
  /** '<lesson>:<position>', as in the pool and the mistakes notebook. */
  key: string
  lessonId: string
  unitId: string
  conceptTag: string
  difficulty: number
  exercise: GradedExercise
}

export type GeneratorInput = {
  candidates: readonly Candidate[]
  skills: ReadonlyMap<string, { rating: number; attempts: number }>
  /** Open mistakes: exercise key → times missed. */
  mistakes: ReadonlyMap<string, number>
  /** Exercises attempted in the last day. */
  recent: ReadonlySet<string>
  random?: () => number
}

export const SESSION_SIZE: Record<PracticeKind, number> = {
  smart: 10,
  mistakes: 10,
  express: 10,
}

/** The success rate smart practice aims for: hard enough to learn from, easy enough to enjoy. */
export const TARGET = 0.8

export type Picked = Candidate & { p: number }

/** Weighted sampling without replacement. */
function sample<T>(
  items: readonly T[],
  weight: (item: T) => number,
  count: number,
  random: () => number
) {
  const pool = items.map((item) => ({ item, w: Math.max(weight(item), 1e-6) }))
  const picked: T[] = []
  while (picked.length < count && pool.length > 0) {
    const total = pool.reduce((sum, entry) => sum + entry.w, 0)
    let roll = random() * total
    const index = pool.findIndex((entry) => (roll -= entry.w) <= 0)
    const [chosen] = pool.splice(index === -1 ? pool.length - 1 : index, 1)
    picked.push(chosen!.item)
  }
  return picked
}

export function generate(kind: PracticeKind, input: GeneratorInput): Picked[] {
  const random = input.random ?? Math.random
  const size = SESSION_SIZE[kind]
  const scored: Picked[] = input.candidates.map((candidate) => ({
    ...candidate,
    p: pCorrect(
      skillOf(input.skills, candidate.conceptTag),
      candidate.difficulty
    ),
  }))

  if (kind === "mistakes")
    return scored
      .filter((candidate) => input.mistakes.has(candidate.key))
      .sort(
        (a, b) =>
          (input.mistakes.get(b.key) ?? 0) - (input.mistakes.get(a.key) ?? 0)
      )
      .slice(0, size)

  if (kind === "express")
    // Hardest for this learner first, then served easiest to hardest so the run builds up.
    return scored
      .sort((a, b) => a.p - b.p)
      .slice(0, size)
      .sort((a, b) => b.p - a.p)

  const chosen = sample(
    scored,
    (candidate) => {
      // Closeness to the target, as a bell curve around 80%.
      let weight = Math.exp(-((candidate.p - TARGET) ** 2) / (2 * 0.12 ** 2))
      if (input.mistakes.has(candidate.key)) weight *= 3
      if (input.recent.has(candidate.key)) weight *= 0.2
      return weight
    },
    size,
    random
  )
  // Warm up with the likeliest, finish with the stretch.
  return chosen.sort((a, b) => b.p - a.p)
}
