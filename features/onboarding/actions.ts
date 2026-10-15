"use server"

import { redirect } from "next/navigation"
import { z } from "zod"

import { requireUser } from "@/lib/auth/session"
import { createClient } from "@/lib/supabase/server"
import type { Database } from "@/lib/supabase/database.types"

import { isMissingTable } from "./data"
import { ONBOARDING_STEPS, preferencesSchema } from "./options"

export type SaveResult = { ok: true } | { ok: false; message: string }

const DATABASE_NOT_READY =
  "Your answers can’t be saved yet because the database isn’t set up. If you run this copy of Klarlingo, apply the migrations in supabase/migrations."
const SAVE_FAILED =
  "Your answer wasn’t saved. Check your connection and try again; nothing you chose is lost."

type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"]

const saveStepInput = z.object({
  patch: preferencesSchema.partial(),
  step: z.enum(ONBOARDING_STEPS),
})

/** Saves the answers so far and where the learner is, so onboarding resumes after a break. */
export async function saveOnboardingStepAction(
  input: unknown
): Promise<SaveResult> {
  const parsed = saveStepInput.safeParse(input)
  if (!parsed.success) return { ok: false, message: SAVE_FAILED }
  const user = await requireUser("/onboarding")
  const supabase = await createClient()

  const { patch, step } = parsed.data
  const row: TablesInsert<"learner_preferences"> = {
    user_id: user.id,
    onboarding_step: step,
  }
  if (patch.goal !== undefined) row.goal = patch.goal
  if (patch.startLevel !== undefined) row.start_level = patch.startLevel
  if (patch.contexts !== undefined) row.contexts = patch.contexts
  if (patch.dailyMinutes !== undefined) row.daily_minutes = patch.dailyMinutes
  if (patch.reminderEnabled !== undefined)
    row.reminder_enabled = patch.reminderEnabled
  if (patch.reminderTime !== undefined) row.reminder_time = patch.reminderTime

  const { error } = await supabase
    .from("learner_preferences")
    .upsert(row, { onConflict: "user_id" })
  if (isMissingTable(error)) return { ok: false, message: DATABASE_NOT_READY }
  if (error) return { ok: false, message: SAVE_FAILED }
  return { ok: true }
}

/** The database refuses to mark onboarding finished unless every answer is present. */
export async function finishOnboardingAction(): Promise<SaveResult> {
  const user = await requireUser("/onboarding/plan")
  const supabase = await createClient()
  const { error } = await supabase
    .from("learner_preferences")
    .update({ onboarded_at: new Date().toISOString(), onboarding_step: "plan" })
    .eq("user_id", user.id)
  if (isMissingTable(error)) return { ok: false, message: DATABASE_NOT_READY }
  if (error) return { ok: false, message: SAVE_FAILED }
  redirect("/onboarding/ready")
}
