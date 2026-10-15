import "server-only"

import { z } from "zod"

import { isMissingTable } from "@/features/onboarding/data"
import type { createClient } from "@/lib/supabase/server"

import { outcomeSchema } from "./actions-schema"

type Supabase = Awaited<ReturnType<typeof createClient>>

const rowSchema = z.object({
  status: z.enum(["in_progress", "completed"]),
  step: z.number().int().min(0),
  results: z.array(outcomeSchema),
  started_at: z.string(),
})

export type LessonState = {
  status: "new" | "in_progress" | "completed"
  step: number
  outcomes: z.infer<typeof outcomeSchema>[]
  savedPhraseKeys: string[]
}

export async function loadLessonState(
  supabase: Supabase,
  lessonId: string
): Promise<LessonState> {
  const [progress, phrases] = await Promise.all([
    supabase
      .from("lesson_progress")
      .select("status, step, results, started_at")
      .eq("lesson_id", lessonId)
      .maybeSingle(),
    supabase
      .from("saved_phrases")
      .select("phrase_key")
      .eq("lesson_id", lessonId),
  ])
  for (const result of [progress, phrases]) {
    if (isMissingTable(result.error))
      return { status: "new", step: 0, outcomes: [], savedPhraseKeys: [] }
    if (result.error)
      throw new Error(
        `Could not load the lesson (${result.error.code ?? "unknown"})`
      )
  }
  const row = progress.data ? rowSchema.parse(progress.data) : null
  return {
    status: row?.status ?? "new",
    step: row?.step ?? 0,
    outcomes: row?.results ?? [],
    savedPhraseKeys: (phrases.data ?? []).map((entry) =>
      String(entry.phrase_key)
    ),
  }
}
