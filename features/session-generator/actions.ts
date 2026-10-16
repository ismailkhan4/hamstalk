"use server"

import { refresh } from "next/cache"
import { z } from "zod"

import { rewardsSchema, type Rewards } from "@/features/rewards/payload"
import { trackServer } from "@/lib/analytics/server"
import { requireUser } from "@/lib/auth/session"
import { createClient } from "@/lib/supabase/server"

export type PracticeResult =
  | { ok: true; rewards: Rewards | null; passed: boolean | null }
  | { ok: false; message: string }

const input = z.object({
  outcomes: z
    .array(z.enum(["first_try", "second_try", "shown"]))
    .min(1)
    .max(20),
})

const FAILED =
  "Your practice isn’t saved yet. Check your connection and try again."

/**
 * Finishes a practice session (bound to its id by the page). finish_practice() checks the session
 * is the learner's and unfinished, records the answers in the learner model and awards XP.
 */
export async function finishPracticeAction(
  sessionId: string,
  raw: unknown
): Promise<PracticeResult> {
  const parsed = input.safeParse(raw)
  if (!parsed.success || !z.uuid().safeParse(sessionId).success)
    return { ok: false, message: FAILED }
  const user = await requireUser("/practice")
  const supabase = await createClient()
  const { data, error } = await supabase.rpc("finish_practice", {
    p_id: sessionId,
    p_outcomes: parsed.data.outcomes,
  })
  if (error) return { ok: false, message: FAILED }
  const result = z
    .object({ passed: z.boolean().nullable(), rewards: z.unknown() })
    .safeParse(data)
  if (!result.success) return { ok: false, message: FAILED }
  const rewards = rewardsSchema.safeParse(result.data.rewards)
  trackServer(user.id, "practice_completed", {
    exercises: parsed.data.outcomes.length,
    first_try: parsed.data.outcomes.filter((o) => o === "first_try").length,
    passed: result.data.passed,
  })
  refresh()
  return {
    ok: true,
    rewards: rewards.success ? rewards.data : null,
    passed: result.data.passed,
  }
}
