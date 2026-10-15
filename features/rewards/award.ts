import "server-only"

import * as Sentry from "@sentry/nextjs"

import { trackServer } from "@/lib/analytics/server"
import type { createClient } from "@/lib/supabase/server"

import { rewardsSchema, type Rewards, type XpSource } from "./payload"

type Supabase = Awaited<ReturnType<typeof createClient>>

/**
 * Awards XP for one activity through award_xp(), which validates it, sets the amount and settles
 * the streak. `amount` only matters for a lesson's first completion.
 *
 * Never throws: XP is a bonus on top of the learner's work. If it can't be recorded (the migration
 * isn't applied, the network blipped), the activity itself still counts and this returns null.
 */
export async function awardXp(
  supabase: Supabase,
  userId: string,
  source: XpSource,
  ref: string,
  amount?: number
): Promise<Rewards | null> {
  const { data, error } = await supabase.rpc("award_xp", {
    p_source: source,
    p_ref: ref,
    p_amount: amount ?? null,
  })
  if (error) {
    Sentry.captureMessage(`award_xp failed: ${error.code ?? "unknown"}`, {
      level: "warning",
      tags: { source, code: error.code },
    })
    return null
  }
  const parsed = rewardsSchema.safeParse(data)
  if (!parsed.success) return null
  const rewards = parsed.data

  if (rewards.streak.extended)
    trackServer(userId, "streak_extended", {
      streak: rewards.streak.after,
      restarted: rewards.streak.before === 0 && rewards.streak.after === 1,
      freezes_used: rewards.streak.freezesUsed,
      milestone: rewards.streak.milestone,
    })
  if (rewards.goalReached)
    trackServer(userId, "daily_goal_reached", {
      goal_xp: rewards.goalXp,
      source: rewards.source,
    })
  return rewards
}
