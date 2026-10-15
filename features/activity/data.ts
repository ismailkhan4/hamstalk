import "server-only"

import { z } from "zod"

import { findLesson } from "@/content/curriculum"
import { getLesson } from "@/content/lessons/registry"
import { isMissingTable } from "@/features/onboarding/data"
import type { createClient } from "@/lib/supabase/server"

import type { ActivityEntry } from "./activity-list"

type Supabase = Awaited<ReturnType<typeof createClient>>

const rowSchema = z.object({
  lesson_id: z.string(),
  status: z.enum(["in_progress", "completed"]),
  step: z.number(),
  xp: z.number(),
  started_at: z.string(),
  completed_at: z.string().nullable(),
  updated_at: z.string(),
})

/** Lessons the learner started or finished, newest first. */
export async function loadActivity(
  supabase: Supabase
): Promise<ActivityEntry[]> {
  const { data, error } = await supabase
    .from("lesson_progress")
    .select("lesson_id, status, step, xp, started_at, completed_at, updated_at")
    .order("updated_at", { ascending: false })
    .limit(60)
  if (isMissingTable(error)) return []
  if (error)
    throw new Error(`Could not load activity (${error.code ?? "unknown"})`)

  return z
    .array(rowSchema)
    .parse(data)
    .flatMap((row) => {
      const found = findLesson(row.lesson_id)
      if (!found) return []
      const place =
        found.lesson.kind === "review"
          ? "Unit review"
          : `Lesson ${found.index + 1}`
      const content = getLesson(row.lesson_id)
      return [
        {
          id: row.lesson_id,
          at: row.completed_at ?? row.updated_at,
          title: `${place} · ${content?.title ?? found.lesson.title}`,
          titleIsGerman:
            found.lesson.kind === "lesson" && found.lesson.titleIsGerman,
          detail:
            row.status === "completed"
              ? `Unit ${found.unit.number} · completed${row.xp > 0 ? ` · +${row.xp} XP` : ""}`
              : `Unit ${found.unit.number} · stopped at exercise ${row.step + 1} of ${content?.exercises.length ?? found.lesson.exercises}`,
          status: row.status,
          href: `/learn/${row.lesson_id}`,
        },
      ]
    })
}
