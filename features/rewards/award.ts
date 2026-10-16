import "server-only"

import * as Sentry from "@sentry/nextjs"

import { trackServer } from "@/lib/analytics/server"
import type { createClient } from "@/lib/supabase/server"

import { rewardsSchema, type Rewards, type XpSource } from "./payload"

type Supabase = Awaited<ReturnType<typeof createClient>>

/**
 * Awards XP for one activity through earn(), which validates it, sets the amount, settles the
 * streak and pays nuts for goals, quests and pins. `amount` only matters for a lesson's first
 * completion.
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
  const args = { p_source: source, p_ref: ref, p_amount: amount ?? null }
  // earn() wraps award_xp() and pays out the stash; until economy.sql is applied, XP still works.
  let { data, error } = await supabase.rpc("earn", args)
  if (error?.code === "PGRST202")
    ({ data, error } = await supabase.rpc("award_xp", args))
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
  for (const quest of rewards.quests)
    trackServer(userId, "quest_completed", {
      quest: quest.id,
      reward: quest.reward,
    })
  for (const pin of rewards.pins)
    trackServer(userId, "pin_unlocked", { pin: pin.pin, tier: pin.tier })
  return rewards
}
