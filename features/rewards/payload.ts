import { z } from "zod"

/**
 * What award_xp() reports after an activity: what was earned and what changed, so the app can
 * celebrate it. The database decides all of it; the app only shows it.
 */
export const rewardsSchema = z.object({
  awarded: z.number().int().min(0),
  source: z.enum(["lesson", "lesson_replay", "review", "standup"]),
  xpToday: z.number().int().min(0),
  goalXp: z.number().int().positive(),
  goalReached: z.boolean(),
  streak: z.object({
    before: z.number().int().min(0),
    after: z.number().int().min(0),
    extended: z.boolean(),
    milestone: z.number().int().positive().nullable(),
    freezesUsed: z.number().int().min(0),
    freezeEarned: z.boolean(),
    freezes: z.number().int().min(0).max(2),
  }),
})

export type Rewards = z.infer<typeof rewardsSchema>

export type XpSource = "lesson" | "lesson_replay" | "review" | "standup"

/** Whether there is anything worth stopping the learner for. */
export function isCelebration(rewards: Rewards | null | undefined) {
  return Boolean(rewards && (rewards.streak.extended || rewards.goalReached))
}
