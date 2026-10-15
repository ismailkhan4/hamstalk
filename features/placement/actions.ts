"use server"

import { redirect } from "next/navigation"
import { z } from "zod"

import { isMissingTable, loadPreferences } from "@/features/onboarding/data"
import { requireUser } from "@/lib/auth/session"
import { createClient } from "@/lib/supabase/server"

import { suggestLevel } from "./scoring"

export type PlacementSaveResult = { ok: true } | { ok: false; message: string }

const answersSchema = z.array(z.number().int().min(-1).max(3)).length(8)
const progressSchema = z.object({
  answers: answersSchema,
  currentQuestion: z.number().int().min(0).max(7),
})

const NOT_SAVED =
  "Your answers weren’t saved. Check your connection and try again; they’re still on this screen."
const DATABASE_NOT_READY =
  "Answers can’t be saved yet because the database isn’t set up. If you run this copy of Klarlingo, apply the migrations in supabase/migrations."

export async function savePlacementProgressAction(
  input: unknown
): Promise<PlacementSaveResult> {
  const parsed = progressSchema.safeParse(input)
  if (!parsed.success) return { ok: false, message: NOT_SAVED }
  const user = await requireUser("/placement")
  const supabase = await createClient()

  const { error } = await supabase.from("placement_attempts").upsert(
    {
      user_id: user.id,
      answers: parsed.data.answers,
      current_question: parsed.data.currentQuestion,
      suggested_level: null,
      completed_at: null,
    },
    { onConflict: "user_id" }
  )
  if (isMissingTable(error)) return { ok: false, message: DATABASE_NOT_READY }
  if (error) return { ok: false, message: NOT_SAVED }
  return { ok: true }
}

/** The suggestion is computed here from the stored answers, never taken from the browser. */
export async function completePlacementAction(
  input: unknown
): Promise<PlacementSaveResult> {
  const parsed = answersSchema.safeParse(input)
  if (!parsed.success) return { ok: false, message: NOT_SAVED }
  const user = await requireUser("/placement")
  const supabase = await createClient()

  const { error } = await supabase.from("placement_attempts").upsert(
    {
      user_id: user.id,
      answers: parsed.data,
      current_question: 7,
      suggested_level: suggestLevel(parsed.data),
      completed_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  )
  if (isMissingTable(error)) return { ok: false, message: DATABASE_NOT_READY }
  if (error) return { ok: false, message: NOT_SAVED }
  return { ok: true }
}

export async function restartPlacementAction(): Promise<void> {
  const user = await requireUser("/placement")
  const supabase = await createClient()
  await supabase.from("placement_attempts").delete().eq("user_id", user.id)
  redirect("/placement")
}

/** Uses the stored suggestion as the starting level, then continues onboarding or returns home. */
export async function applyPlacementAction(): Promise<PlacementSaveResult> {
  const user = await requireUser("/placement")
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("placement_attempts")
    .select("suggested_level")
    .eq("user_id", user.id)
    .maybeSingle()
  if (isMissingTable(error)) return { ok: false, message: DATABASE_NOT_READY }
  const level = z
    .enum(["beginner", "a1", "a2", "b1"])
    .safeParse(data?.suggested_level)
  if (error || !level.success) return { ok: false, message: NOT_SAVED }

  const preferences = await loadPreferences(supabase, user.id)
  const nextStep = preferences.onboardedAt ? preferences.step : "context"
  const { error: saveError } = await supabase
    .from("learner_preferences")
    .upsert(
      { user_id: user.id, start_level: level.data, onboarding_step: nextStep },
      { onConflict: "user_id" }
    )
  if (saveError) return { ok: false, message: NOT_SAVED }

  redirect(preferences.onboardedAt ? "/home" : "/onboarding/context")
}
