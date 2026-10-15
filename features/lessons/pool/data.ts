import "server-only"

import { isMissingTable } from "@/features/onboarding/data"
import type { createClient } from "@/lib/supabase/server"

import type { Exercise, Lesson } from "../schema"
import {
  lessonExercisesFromRows,
  unitLessonsFromRows,
  withPoolExercises,
  type PoolFailure,
  type PoolLesson,
  type PoolResult,
} from "./records"

type Supabase = Awaited<ReturnType<typeof createClient>>

const COLUMNS =
  "source_key, unit_id, lesson_id, lesson_position, exercise_position, exercise_type, concept_tag, content"

function databaseFailure(error: { code?: string }): PoolFailure {
  return isMissingTable(error)
    ? {
        ok: false,
        reason: "not-set-up",
        message:
          "The exercise pool isn’t set up. Apply supabase/migrations/exercises_pool.sql.",
      }
    : {
        ok: false,
        reason: "database",
        message: `Could not load exercises (${error.code ?? "unknown"})`,
      }
}

/** A lesson's published exercises, in authored order. */
export async function loadLessonExercises(
  supabase: Supabase,
  lessonId: string
): Promise<PoolResult<Exercise[]>> {
  const { data, error } = await supabase
    .from("exercises_pool")
    .select(COLUMNS)
    .eq("lesson_id", lessonId)
    .eq("is_active", true)
    .order("exercise_position")
  if (error) return databaseFailure(error)
  return lessonExercisesFromRows(lessonId, data)
}

/** A unit's lessons in path order, each with its published exercises. */
export async function loadUnitExercises(
  supabase: Supabase,
  unitId: string
): Promise<PoolResult<PoolLesson[]>> {
  const { data, error } = await supabase
    .from("exercises_pool")
    .select(COLUMNS)
    .eq("unit_id", unitId)
    .eq("is_active", true)
    .order("lesson_position")
    .order("exercise_position")
  if (error) return databaseFailure(error)
  return unitLessonsFromRows(unitId, data)
}

/** The typed lesson with its exercises replaced by the published ones. */
export async function loadPoolLesson(
  supabase: Supabase,
  lesson: Lesson
): Promise<PoolResult<Lesson>> {
  const exercises = await loadLessonExercises(supabase, lesson.id)
  return exercises.ok ? withPoolExercises(lesson, exercises.data) : exercises
}
