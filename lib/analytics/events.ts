/**
 * Every product event Klarlingo sends, with its properties. One list for the browser and the
 * server, so a dashboard or experiment never depends on an event name nobody sends. Add an event
 * here only when the feature that fires it ships.
 *
 * Properties carry ids and counts, never learner text: no answers, names or email addresses.
 */
export type AnalyticsEvents = {
  /** The learner pressed Start or Resume on a lesson intro. */
  lesson_started: {
    lesson_id: string
    resumed: boolean
    replay: boolean
  }
  /** One exercise finished, whatever the result. */
  exercise_answered: {
    lesson_id: string
    exercise_type: string
    position: number
    outcome: "first_try" | "second_try" | "shown"
  }
  /** Sent by the server, once, when a lesson is first completed and its XP is awarded. */
  lesson_completed: {
    lesson_id: string
    xp: number
    exercises: number
    first_try: number
    source: "pool" | "registry"
  }
  /** The server confirmed the learner completed onboarding. */
  onboarding_completed: Record<string, never>
  /** The server recorded a completed placement check. */
  placement_completed: {
    suggested_level: "beginner" | "a1" | "a2" | "b1"
  }
  /** The server confirmed the learner applied their placement suggestion. */
  placement_applied: {
    level: "beginner" | "a1" | "a2" | "b1"
    returning_learner: boolean
  }
  /** The server saved a spaced-repetition rating. */
  review_item_rated: {
    rating: "again" | "remembered"
    strength: 1 | 2 | 3
  }
  /** The server confirmed the learner completed a team standup. */
  standup_completed: {
    unit_id: string
  }
  /** The server saved a learner's settings preferences. */
  preferences_saved: Record<string, never>
  /** The server confirmed the learner reset their progress. */
  progress_reset: Record<string, never>
  /** The server confirmed the learner deleted their account. */
  account_deleted: Record<string, never>
}

export type AnalyticsEvent = keyof AnalyticsEvents
