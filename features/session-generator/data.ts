import "server-only"

import { getUnit } from "@/content/courses/de/curriculum"
import type { Lesson } from "@/features/lessons/schema"
import { isUnitCompleted, type LessonProgress } from "@/features/path/model"
import type { createClient } from "@/lib/supabase/server"

import {
  generate,
  type Candidate,
  type Picked,
  type PracticeKind,
} from "./generate"
import { practiceLesson, registryCandidates } from "./practice-lesson"

type Supabase = Awaited<ReturnType<typeof createClient>>

export type PracticeSession =
  | { ok: true; sessionId: string; lesson: Lesson; picked: Picked[] }
  | { ok: false; reason: "empty" | "locked" | "not-set-up" }

/** '<lesson>:<position>' from a mistake key, which may add ':<turn>' for conversations. */
const exerciseKey = (itemKey: string) =>
  itemKey.split(":").slice(0, 2).join(":")

/** Graded exercises from the given lessons, with what the pool has learned about them. */
async function candidatesFrom(
  supabase: Supabase,
  lessonIds: readonly string[]
): Promise<Candidate[]> {
  const candidates = registryCandidates(lessonIds)
  if (candidates.length === 0) return candidates
  const { data } = await supabase
    .from("exercises_pool")
    .select("source_key, base_difficulty")
    .in("lesson_id", [...lessonIds])
  const difficulty = new Map(
    (data ?? []).map((row) => [row.source_key, Number(row.base_difficulty)])
  )
  return candidates.map((candidate) => ({
    ...candidate,
    difficulty: difficulty.get(candidate.key) ?? candidate.difficulty,
  }))
}

/**
 * Builds and records a practice session for the learner. Exercises come from lessons they have
 * finished (for an Express run, from one finished unit) and are picked by the session generator.
 */
export async function startPractice(
  supabase: Supabase,
  userId: string,
  kind: PracticeKind,
  progress: LessonProgress[],
  unitId?: string
): Promise<PracticeSession> {
  const finished = progress
    .filter((entry) => entry.status === "completed")
    .map((entry) => entry.lessonId)
  const unit = unitId ? getUnit(unitId) : undefined
  if (kind === "express" && (!unit || !isUnitCompleted(unit, progress)))
    return { ok: false, reason: "locked" }
  const lessonIds = unit ? unit.lessons.map((lesson) => lesson.id) : finished

  const [candidates, skills, mistakes, recent] = await Promise.all([
    candidatesFrom(supabase, lessonIds),
    supabase.from("learner_skills").select("concept_tag, rating, attempts"),
    supabase
      .from("mistakes")
      .select("item_key, miss_count")
      .is("learned_at", null),
    supabase
      .from("exercise_attempts")
      .select("source_key")
      .gte("attempted_at", new Date(Date.now() - 86_400_000).toISOString()),
  ])

  const missed = new Map<string, number>()
  for (const row of mistakes.data ?? []) {
    const key = exerciseKey(row.item_key)
    missed.set(key, (missed.get(key) ?? 0) + Number(row.miss_count))
  }
  const picked = generate(kind, {
    candidates,
    skills: new Map(
      (skills.data ?? []).map((row) => [
        row.concept_tag,
        { rating: Number(row.rating), attempts: Number(row.attempts) },
      ])
    ),
    mistakes: missed,
    recent: new Set((recent.data ?? []).map((row) => row.source_key)),
  })
  if (picked.length === 0) return { ok: false, reason: "empty" }

  const { data: session, error } = await supabase
    .from("practice_sessions")
    .insert({
      user_id: userId,
      kind,
      unit_id: unit?.id ?? null,
      exercise_keys: picked.map((item) => item.key),
    })
    .select("id")
    .single()
  if (error || !session) return { ok: false, reason: "not-set-up" }

  return {
    ok: true,
    sessionId: session.id,
    picked,
    lesson: practiceLesson(kind, picked, unit?.number),
  }
}
