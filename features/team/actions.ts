"use server"

import { z } from "zod"

import { getUnit } from "@/content/curriculum"
import { getStandup } from "@/content/standup"
import { isMissingTable } from "@/features/onboarding/data"
import { loadLessonProgress } from "@/features/path/data"
import { isUnitCompleted } from "@/features/path/model"
import { requireUser } from "@/lib/auth/session"
import { trackServer } from "@/lib/analytics/server"
import { createClient } from "@/lib/supabase/server"
import { awardXp } from "@/features/rewards/award"

export type StandupResult = { ok: true } | { ok: false; message: string }

const input = z.object({ unitId: z.string().min(1).max(32) })

const FAILED =
  "Your standup wasn’t saved. Check your connection and finish it again."

/** Records a finished standup step. The server checks that the step exists and its unit is done. */
export async function completeStandupAction(
  raw: unknown
): Promise<StandupResult> {
  const parsed = input.safeParse(raw)
  if (!parsed.success) return { ok: false, message: FAILED }
  const { unitId } = parsed.data
  const user = await requireUser("/team")
  const unit = getUnit(unitId)
  if (!unit || !getStandup(unitId))
    return { ok: false, message: "That standup step doesn’t exist yet." }

  const supabase = await createClient()
  const progress = await loadLessonProgress(supabase)
  if (!isUnitCompleted(unit, progress))
    return {
      ok: false,
      message: `Finish Unit ${unit.number} to open this standup.`,
    }

  const { error } = await supabase.from("standup_completions").upsert(
    {
      user_id: user.id,
      unit_id: unitId,
      completed_at: new Date().toISOString(),
    },
    { onConflict: "user_id,unit_id" }
  )
  if (error)
    return {
      ok: false,
      message: isMissingTable(error)
        ? "The database isn’t set up yet."
        : FAILED,
    }
  trackServer(user.id, "standup_completed", { unit_id: unitId })
  // No refresh here: the standup page re-picks the next standup on render, which would pull the
  // learner off their finished screen. The badges catch up on the next page.
  await awardXp(supabase, user.id, "standup", unitId)
  return { ok: true }
}
