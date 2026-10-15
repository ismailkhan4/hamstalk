import "server-only"

import * as Sentry from "@sentry/nextjs"

import { getLesson } from "@/content/lessons/registry"
import type { createClient } from "@/lib/supabase/server"

import { loadPoolLesson } from "./pool/data"
import type { Lesson } from "./schema"

type Supabase = Awaited<ReturnType<typeof createClient>>

export type LessonSource = "pool" | "registry"

/**
 * Where lessons are read from. `pool` (the default) reads published exercises from
 * public.exercises_pool and falls back to content/lessons whenever the pool can't serve the lesson;
 * `registry` skips the database entirely, which is the rollback (see docs/exercise-pool.md).
 */
export function lessonSource(): LessonSource {
  return process.env.LESSON_SOURCE === "registry" ? "registry" : "pool"
}

/** A lesson ready to run, and where its exercises actually came from. */
export type RunnableLesson = { lesson: Lesson; source: LessonSource }

/**
 * The lesson a learner runs, and the one its server actions grade against, so the two always agree.
 * Lesson metadata (title, XP, vocabulary) still comes from the typed lesson; only the exercises come
 * from the pool. Null when the lesson isn't built.
 */
export async function loadRunnableLesson(
  supabase: Supabase,
  lessonId: string
): Promise<RunnableLesson | null> {
  const lesson = getLesson(lessonId)
  if (!lesson) return null
  if (lessonSource() === "registry") return { lesson, source: "registry" }

  const pooled = await loadPoolLesson(supabase, lesson)
  if (pooled.ok) return { lesson: pooled.data, source: "pool" }

  // "not-found" means the lesson hasn't been imported yet, which is expected while content is being
  // written; anything else means the pool is broken and someone should look.
  if (pooled.reason !== "not-found")
    Sentry.captureMessage(`Lesson pool fallback: ${pooled.message}`, {
      level: "warning",
      tags: { lessonId, reason: pooled.reason },
    })
  return { lesson, source: "registry" }
}
