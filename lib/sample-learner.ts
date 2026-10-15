import type { Preferences, StartLevel } from "@/features/onboarding/options"

/** A sample learner for development-only previews. Never used for a signed-in learner. */
export function sampleLearner(startLevel: string | string[] | undefined) {
  const level: StartLevel =
    (["beginner", "a1", "a2", "b1", "b2"].find(
      (value) => value === startLevel
    ) as StartLevel | undefined) ?? "beginner"
  const preferences: Preferences = {
    goal: "work",
    startLevel: level,
    contexts: ["standups", "messaging", "everyday"],
    dailyMinutes: 15,
    reminderEnabled: false,
    reminderTime: null,
    onboardedAt: new Date().toISOString(),
    startedAt: new Date().toISOString(),
    step: "plan",
  }
  return {
    name: "Sam Haddad",
    firstName: "Sam",
    email: "sam@example.com",
    preferences,
    progress: [],
  }
}
