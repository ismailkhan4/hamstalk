"use server"

import { getLesson } from "@/content/lessons/registry"
import { isMissingTable } from "@/features/onboarding/data"
import { requireUser } from "@/lib/auth/session"
import { firstName } from "@/lib/auth/user-name"
import { createClient } from "@/lib/supabase/server"

import {
  completeInput,
  mistakeInput,
  saveProgressInput,
  savePhraseInput,
} from "./actions-schema"
import { initialsOf } from "./initials"
import { personalise } from "./schema"

export type LessonSaveResult = { ok: true } | { ok: false; message: string }

const FAILED =
  "Your progress isn’t saved yet. It’s kept on this device while you’re here; try saving again."
const NOT_READY =
  "Progress can’t be saved yet because the database isn’t set up. If you run this copy of Klarlingo, apply the migrations in supabase/migrations."

const failure = (error: { code?: string } | null): LessonSaveResult =>
  isMissingTable(error)
    ? { ok: false, message: NOT_READY }
    : { ok: false, message: FAILED }

async function context(lessonId: string) {
  const lesson = getLesson(lessonId)
  if (!lesson) return null
  const user = await requireUser(`/learn/${lessonId}`)
  return { lesson, user, supabase: await createClient() }
}

/** Saves where the learner is, so they can leave and resume. A finished lesson stays finished. */
export async function saveLessonProgressAction(
  input: unknown
): Promise<LessonSaveResult> {
  const parsed = saveProgressInput.safeParse(input)
  if (!parsed.success) return { ok: false, message: FAILED }
  const ctx = await context(parsed.data.lessonId)
  if (!ctx || parsed.data.step >= ctx.lesson.exercises.length)
    return { ok: false, message: FAILED }

  const { data: existing, error: readError } = await ctx.supabase
    .from("lesson_progress")
    .select("status")
    .eq("lesson_id", parsed.data.lessonId)
    .maybeSingle()
  if (readError) return failure(readError)
  if (existing?.status === "completed") return { ok: true }

  const { error } = await ctx.supabase.from("lesson_progress").upsert(
    {
      user_id: ctx.user.id,
      lesson_id: parsed.data.lessonId,
      status: "in_progress",
      step: parsed.data.step,
      results: parsed.data.outcomes,
    },
    { onConflict: "user_id,lesson_id" }
  )
  return error ? failure(error) : { ok: true }
}

/** XP comes from the lesson's own content, never from the browser. Completing again awards nothing. */
export async function completeLessonAction(
  input: unknown
): Promise<LessonSaveResult> {
  const parsed = completeInput.safeParse(input)
  if (!parsed.success) return { ok: false, message: FAILED }
  const ctx = await context(parsed.data.lessonId)
  if (!ctx || parsed.data.outcomes.length !== ctx.lesson.exercises.length)
    return { ok: false, message: FAILED }

  const { data: existing, error: readError } = await ctx.supabase
    .from("lesson_progress")
    .select("status")
    .eq("lesson_id", parsed.data.lessonId)
    .maybeSingle()
  if (readError) return failure(readError)
  if (existing?.status === "completed") return { ok: true }

  const { error } = await ctx.supabase.from("lesson_progress").upsert(
    {
      user_id: ctx.user.id,
      lesson_id: parsed.data.lessonId,
      status: "completed",
      step: ctx.lesson.exercises.length - 1,
      results: parsed.data.outcomes,
      xp: ctx.lesson.xp,
      completed_at: new Date().toISOString(),
    },
    { onConflict: "user_id,lesson_id" }
  )
  return error ? failure(error) : { ok: true }
}

/** A first miss goes to the mistakes notebook. A repeated miss on the same item updates one row. */
export async function recordMistakeAction(
  input: unknown
): Promise<LessonSaveResult> {
  const parsed = mistakeInput.safeParse(input)
  if (!parsed.success) return { ok: false, message: FAILED }
  const ctx = await context(parsed.data.lessonId)
  if (!ctx || !parsed.data.itemKey.startsWith(`${parsed.data.lessonId}:`))
    return { ok: false, message: FAILED }

  const { data: existing, error: readError } = await ctx.supabase
    .from("mistakes")
    .select("miss_count")
    .eq("item_key", parsed.data.itemKey)
    .maybeSingle()
  if (readError) return failure(readError)

  const record = {
    topic: parsed.data.topic,
    prompt: parsed.data.prompt,
    learner_answer: parsed.data.learnerAnswer,
    correct_answer: parsed.data.correctAnswer,
    reason: parsed.data.reason,
  }
  const { error } = existing
    ? await ctx.supabase
        .from("mistakes")
        .update({
          ...record,
          miss_count: Number(existing.miss_count) + 1,
          learned_at: null,
        })
        .eq("item_key", parsed.data.itemKey)
    : await ctx.supabase.from("mistakes").insert({
        user_id: ctx.user.id,
        lesson_id: parsed.data.lessonId,
        item_key: parsed.data.itemKey,
        ...record,
      })
  return error ? failure(error) : { ok: true }
}

/** Saves or removes a phrase. The text comes from the lesson's content, not from the request. */
export async function savePhraseAction(
  input: unknown
): Promise<LessonSaveResult> {
  const parsed = savePhraseInput.safeParse(input)
  if (!parsed.success) return { ok: false, message: FAILED }
  const ctx = await context(parsed.data.lessonId)
  if (!ctx) return { ok: false, message: FAILED }

  const line = ctx.lesson.exercises
    .flatMap((exercise) => (exercise.type === "discover" ? exercise.lines : []))
    .find((candidate) => candidate.saveKey === parsed.data.saveKey)
  if (!line) return { ok: false, message: FAILED }

  const phraseKey = `${parsed.data.lessonId}:${parsed.data.saveKey}`
  if (!parsed.data.save) {
    const { error } = await ctx.supabase
      .from("saved_phrases")
      .delete()
      .eq("phrase_key", phraseKey)
    return error ? failure(error) : { ok: true }
  }

  const learner = {
    firstName: firstName(ctx.user),
    initials: initialsOf(ctx.user.fullName || ctx.user.email),
  }
  const { error } = await ctx.supabase.from("saved_phrases").upsert(
    {
      user_id: ctx.user.id,
      phrase_key: phraseKey,
      lesson_id: parsed.data.lessonId,
      de: personalise(line.de, learner),
      en: personalise(line.en, learner),
    },
    { onConflict: "user_id,phrase_key" }
  )
  return error ? failure(error) : { ok: true }
}
