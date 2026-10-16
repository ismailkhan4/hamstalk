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
  /** Sent by the server when a day's XP first passes the streak threshold. */
  streak_extended: {
    streak: number
    /** A missed day without enough freezes ended the old streak; this is day 1 of a new one. */
    restarted: boolean
    freezes_used: number
    milestone: number | null
  }
  /** Sent by the server when the day's XP first reaches the learner's daily goal. */
  daily_goal_reached: {
    goal_xp: number
    source: "lesson" | "lesson_replay" | "review" | "standup"
  }
  /** The reminder job sent a reminder. */
  reminder_sent: { kind: string; channel: string; template: string }
  /** The learner turned reminders on or off on this device. */
  push_enabled: Record<string, never>
  push_disabled: Record<string, never>
  /** A quest from today's plan was finished and paid out. */
  quest_completed: { quest: string; reward: number }
  /** A lanyard pin tier was unlocked. */
  pin_unlocked: { pin: string; tier: number }
  /** Nuts were spent in the shop. */
  item_bought: { item: string; price: number }
  /** A lesson took Akku bars for missed answers. */
  akku_used: { lesson_id: string; bars: number; left: number }
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
