import "server-only"

import { z } from "zod"

import { createClient } from "@/lib/supabase/server"

import {
  CONTEXTS,
  emptyPreferences,
  GOALS,
  LEVELS,
  ONBOARDING_STEPS,
  REMINDER_TIMES,
  type Preferences,
} from "./options"

type Supabase = Awaited<ReturnType<typeof createClient>>

const rowSchema = z.object({
  goal: z.enum(GOALS).nullable(),
  start_level: z.enum(LEVELS).nullable(),
  contexts: z.array(z.enum(CONTEXTS)),
  daily_minutes: z
    .union([z.literal(10), z.literal(15), z.literal(20), z.literal(30)])
    .nullable(),
  reminder_enabled: z.boolean(),
  reminder_time: z.string().nullable(),
  onboarding_step: z.enum(ONBOARDING_STEPS),
  onboarded_at: z.string().nullable(),
})

export class DatabaseNotReadyError extends Error {
  constructor() {
    super(
      "The learner tables are missing. Apply the migrations in supabase/migrations."
    )
  }
}

/** PostgREST reports a missing table as PGRST205; Postgres itself as 42P01. */
export function isMissingTable(error: { code?: string } | null) {
  return error?.code === "PGRST205" || error?.code === "42P01"
}

function toReminderTime(value: string | null) {
  const hhmm = value?.slice(0, 5)
  return REMINDER_TIMES.find((time) => time === hhmm) ?? null
}

export async function loadPreferences(
  supabase: Supabase,
  userId: string
): Promise<Preferences> {
  const { data, error } = await supabase
    .from("learner_preferences")
    .select(
      "goal, start_level, contexts, daily_minutes, reminder_enabled, reminder_time, onboarding_step, onboarded_at"
    )
    .eq("user_id", userId)
    .maybeSingle()
  if (isMissingTable(error)) throw new DatabaseNotReadyError()
  if (error)
    throw new Error(`Could not load preferences (${error.code ?? "unknown"})`)
  if (!data) return emptyPreferences

  const row = rowSchema.parse(data)
  return {
    goal: row.goal,
    startLevel: row.start_level,
    contexts: row.contexts,
    dailyMinutes: row.daily_minutes,
    reminderEnabled: row.reminder_enabled,
    reminderTime: toReminderTime(row.reminder_time),
    onboardedAt: row.onboarded_at,
    step: row.onboarding_step,
  }
}

const placementRowSchema = z.object({
  answers: z.array(z.number().int().min(-1).max(3)).length(8),
  current_question: z.number().int().min(0).max(7),
  suggested_level: z.enum(["beginner", "a1", "a2", "b1"]).nullable(),
  completed_at: z.string().nullable(),
  updated_at: z.string(),
})

export type PlacementAttempt = {
  answers: number[]
  currentQuestion: number
  suggestedLevel: "beginner" | "a1" | "a2" | "b1" | null
  completed: boolean
}

const PAUSE_LIMIT_MS = 24 * 60 * 60 * 1000

/** A paused check is kept for 24 hours, as the stop dialog promises; after that it starts fresh. */
export async function loadPlacementAttempt(
  supabase: Supabase,
  userId: string
): Promise<PlacementAttempt | null> {
  const { data, error } = await supabase
    .from("placement_attempts")
    .select(
      "answers, current_question, suggested_level, completed_at, updated_at"
    )
    .eq("user_id", userId)
    .maybeSingle()
  if (isMissingTable(error)) throw new DatabaseNotReadyError()
  if (error)
    throw new Error(
      `Could not load the placement check (${error.code ?? "unknown"})`
    )
  if (!data) return null

  const row = placementRowSchema.parse(data)
  const expired =
    !row.completed_at &&
    Date.now() - new Date(row.updated_at).getTime() > PAUSE_LIMIT_MS
  if (expired) return null
  return {
    answers: row.answers,
    currentQuestion: row.current_question,
    suggestedLevel: row.suggested_level,
    completed: Boolean(row.completed_at),
  }
}
