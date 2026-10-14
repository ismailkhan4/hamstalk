import "server-only"

import { z } from "zod"

import { createClient } from "@/lib/supabase/server"

import type { LessonProgress } from "./model"

type Supabase = Awaited<ReturnType<typeof createClient>>

const rowSchema = z.object({
  lesson_id: z.string(),
  status: z.enum(["in_progress", "completed"]),
  step: z.number().int().min(0),
  xp: z.number().int().min(0),
})

export async function loadLessonProgress(
  supabase: Supabase
): Promise<LessonProgress[]> {
  const { data, error } = await supabase
    .from("lesson_progress")
    .select("lesson_id, status, step, xp")
  if (error) {
    if (error.code === "PGRST205" || error.code === "42P01") return []
    throw new Error(
      `Could not load lesson progress (${error.code ?? "unknown"})`
    )
  }
  return z
    .array(rowSchema)
    .parse(data)
    .map((row) => ({
      lessonId: row.lesson_id,
      status: row.status,
      step: row.step,
      xp: row.xp,
    }))
}
