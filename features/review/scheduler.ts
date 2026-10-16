import {
  createEmptyCard,
  fsrs,
  Rating as FsrsRating,
  State,
  type Card,
  type Grade,
} from "ts-fsrs"

/**
 * When a review word comes back, by FSRS (the Free Spaced Repetition Scheduler): each word keeps a
 * stability (days until recall drops to 90%) and a difficulty, and every answer reschedules it.
 * The learner answers Forgot, Hard or Got it. Strength (one to three bars) is derived from
 * stability for display.
 */

export type Rating = "forgot" | "hard" | "good"
export type Strength = 1 | 2 | 3

const DAY_MS = 86_400_000
const scheduler = fsrs({ enable_fuzz: true, request_retention: 0.9 })

const GRADES: Record<Rating, Grade> = {
  forgot: FsrsRating.Again,
  hard: FsrsRating.Hard,
  good: FsrsRating.Good,
}

/** A word's FSRS memory as stored on review_items. Null stability: FSRS hasn't seen it yet. */
export type Memory = {
  stability: number | null
  difficulty: number | null
  fsrsState: number
  lapses: number
  scheduledDays: number
  learningSteps: number
  reviewCount: number
  lastReviewedAt: string | null
  dueAt: string
}

/** The columns to write after a review. */
export type MemoryUpdate = {
  stability: number
  difficulty: number
  fsrs_state: number
  lapses: number
  scheduled_days: number
  learning_steps: number
  review_count: number
  last_reviewed_at: string
  due_at: string
  strength: Strength
}

export function firstDue(now: Date): Date {
  return new Date(now.getTime() + DAY_MS)
}

export function isDue(dueAt: Date | string, now: Date) {
  return new Date(dueAt).getTime() <= now.getTime()
}

function cardOf(memory: Memory, now: Date): Card {
  if (memory.stability === null || memory.difficulty === null)
    return createEmptyCard(now)
  return {
    due: new Date(memory.dueAt),
    stability: memory.stability,
    difficulty: memory.difficulty,
    elapsed_days: 0,
    scheduled_days: memory.scheduledDays,
    learning_steps: memory.learningSteps,
    reps: memory.reviewCount,
    lapses: memory.lapses,
    state: memory.fsrsState as State,
    last_review: memory.lastReviewedAt
      ? new Date(memory.lastReviewedAt)
      : undefined,
  }
}

/** One bar under three days of stability, two under three weeks, three after that. */
export function strengthOf(stability: number | null): Strength {
  if (stability === null || stability < 3) return 1
  return stability < 21 ? 2 : 3
}

/** The word's memory after an answer. */
export function rate(memory: Memory, rating: Rating, now: Date): MemoryUpdate {
  const { card } = scheduler.next(cardOf(memory, now), now, GRADES[rating])
  return {
    stability: card.stability,
    difficulty: card.difficulty,
    fsrs_state: card.state,
    lapses: card.lapses,
    scheduled_days: card.scheduled_days,
    learning_steps: card.learning_steps,
    review_count: card.reps,
    last_reviewed_at: now.toISOString(),
    due_at: card.due.toISOString(),
    strength: strengthOf(card.stability),
  }
}

/** "in 10 min", "later today", "tomorrow", "in 4 days", "in 3 weeks", "in 2 months". */
export function whenLabel(due: Date, now: Date) {
  const ms = due.getTime() - now.getTime()
  const minutes = Math.round(ms / 60_000)
  if (minutes < 60) return `in ${Math.max(1, minutes)} min`
  const days = Math.round(ms / DAY_MS)
  if (days < 1) return "later today"
  if (days === 1) return "tomorrow"
  if (days < 21) return `in ${days} days`
  if (days < 60) return `in ${Math.round(days / 7)} weeks`
  return `in ${Math.round(days / 30)} months`
}

/** When the word would come back after each answer, shown on the buttons. */
export function previewLabels(
  memory: Memory,
  now: Date
): Record<Rating, string> {
  const preview = scheduler.repeat(cardOf(memory, now), now)
  const label = (rating: Rating) =>
    whenLabel(preview[GRADES[rating]].card.due, now)
  return { forgot: label("forgot"), hard: label("hard"), good: label("good") }
}

/**
 * Before adaptive.sql is applied there are no FSRS columns: the old three-step spacing (1, 2, 4
 * and 7 days) keeps reviews working.
 */
export function legacyRate(strength: Strength, rating: Rating, now: Date) {
  if (rating === "forgot")
    return {
      strength: Math.max(1, strength - 1) as Strength,
      dueAt: new Date(now.getTime() + DAY_MS),
    }
  const next = Math.min(3, strength + (rating === "good" ? 1 : 0)) as Strength
  const days = { 1: 2, 2: 4, 3: 7 }[next]
  return { strength: next, dueAt: new Date(now.getTime() + days * DAY_MS) }
}
