import type { Economy } from "@/features/economy/model"

/**
 * Development only: a sample stash. `fresh` is a new learner, `busy` has a quest done and a few
 * pins, `low` has one Akku bar left, `empty` has none.
 */
export function sampleEconomy(stage = "busy"): Economy {
  const inHours = (hours: number) =>
    new Date(Date.now() + hours * 3_600_000).toISOString()
  const fresh = stage === "fresh"
  const akku = stage === "empty" ? 0 : stage === "low" ? 1 : fresh ? 5 : 4
  return {
    nuts: fresh ? 100 : 245,
    akku,
    nextBarAt: akku < 5 ? inHours(2.6) : null,
    boostUntil: null,
    freezes: 1,
    quests: [
      {
        id: "xp-30",
        target: 30,
        progress: fresh ? 0 : 30,
        reward: 15,
        done: !fresh,
      },
      {
        id: "lessons-2",
        target: 2,
        progress: fresh ? 0 : 1,
        reward: 15,
        done: false,
      },
      {
        id: "reviews-5",
        target: 5,
        progress: fresh ? 0 : 2,
        reward: 10,
        done: false,
      },
    ],
    pins: fresh
      ? []
      : [
          { pin: "stations", tier: 2, unlockedAt: inHours(-30) },
          { pin: "streak", tier: 1, unlockedAt: inHours(-20) },
          { pin: "planner", tier: 1, unlockedAt: inHours(-2) },
          { pin: "xp", tier: 1, unlockedAt: inHours(-1) },
        ],
  }
}

/** Development only: the Akku and nuts a lesson starts with. */
export function sampleLessonStash(akku: number) {
  return {
    akku,
    nextBarAt:
      akku < 5 ? new Date(Date.now() + 2.5 * 3_600_000).toISOString() : null,
    nuts: 340,
  }
}
