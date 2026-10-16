import { z } from "zod"

import { findLesson, levels } from "@/content/courses/de/curriculum"

import {
  exerciseSchema,
  lessonSchema,
  type Exercise,
  type Lesson,
} from "../schema"

/**
 * How typed lessons map to rows of public.exercises_pool, and back. Pure, so the import script, the
 * database loader and the tests all share one definition of the mapping.
 */

export const EXERCISE_TYPES = [
  "discover",
  "tip",
  "choice",
  "match",
  "build",
  "translate",
  "conversation",
] as const satisfies readonly Exercise["type"][]

export type PoolRecord = {
  source_key: string
  unit_id: string
  lesson_id: string
  lesson_position: number
  exercise_position: number
  exercise_type: Exercise["type"]
  concept_tag: string
  content: Exercise
}

export type PoolIssue = {
  lessonId: string
  /** The exercise's index in its lesson, or null for a problem with the lesson as a whole. */
  exercise: number | null
  message: string
}

export type PoolFailure = {
  ok: false
  reason: "database" | "not-set-up" | "not-found" | "invalid-content"
  message: string
}
export type PoolResult<T> = { ok: true; data: T } | PoolFailure

/** Same shape as the item keys of the mistakes notebook, so a mistake points at its exercise row. */
export function sourceKey(lessonId: string, exercisePosition: number) {
  return `${lessonId}:${exercisePosition}`
}

function slug(text: string) {
  return text
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/**
 * The exercise's own topic, as authored. Discover and tip exercises, and any exercise without a
 * topic, fall back to the lesson they belong to: that records where the exercise came from and
 * makes no further claim about what it teaches.
 */
export function conceptTag(lessonId: string, exercise: Exercise) {
  const topic =
    exercise.type === "discover" || exercise.type === "tip"
      ? undefined
      : exercise.topic
  const topicSlug = topic ? slug(topic) : ""
  return topicSlug ? `topic:${topicSlug}` : `lesson:${lessonId}`
}

const CONCEPT_TAG = /^[a-z]+:[a-z0-9-]{1,64}$/

/** Keys sorted at every depth: equal values give equal strings, whatever order jsonb keeps keys in. */
export function canonicalJson(value: unknown): string {
  return JSON.stringify(value, (_key, inner: unknown) =>
    inner && typeof inner === "object" && !Array.isArray(inner)
      ? Object.fromEntries(
          Object.entries(inner).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
        )
      : inner
  )
}

function hasNul(value: unknown): boolean {
  if (typeof value === "string") return value.includes("\u0000")
  if (Array.isArray(value)) return value.some(hasNul)
  if (value && typeof value === "object")
    return Object.entries(value).some(
      ([key, inner]) => hasNul(key) || hasNul(inner)
    )
  return false
}

function issueMessages(error: z.ZodError) {
  return error.issues.map((issue) =>
    issue.path.length
      ? `${issue.path.join(".")}: ${issue.message}`
      : issue.message
  )
}

export type LessonPlace = { unitId: string; lessonPosition: number }

/** Where a lesson sits in content/courses/de/curriculum.ts. */
export function locateInCurriculum(lessonId: string): LessonPlace | null {
  const found = findLesson(lessonId)
  return found ? { unitId: found.unit.id, lessonPosition: found.index } : null
}

/** Lessons on the curriculum map that have no content yet. They are never imported. */
export function plannedLessonIds(registered: readonly Lesson[]) {
  const built = new Set(registered.map((lesson) => lesson.id))
  return levels
    .flatMap((level) => level.units)
    .flatMap((unit) => unit.lessons)
    .map((lesson) => lesson.id)
    .filter((id) => !built.has(id))
}

/**
 * Validates every lesson and exercise against the real schema and maps each exercise to a row.
 * Every problem is reported with its lesson and exercise; records are only usable when there are none.
 */
export function buildPoolRecords(
  lessons: readonly Lesson[],
  locate: (lessonId: string) => LessonPlace | null = locateInCurriculum
): { records: PoolRecord[]; issues: PoolIssue[] } {
  const records: PoolRecord[] = []
  const issues: PoolIssue[] = []
  const seen = new Set<string>()

  for (const lesson of lessons) {
    const lessonId = String(lesson.id)
    if (seen.has(lessonId)) {
      issues.push({ lessonId, exercise: null, message: "Registered twice." })
      continue
    }
    seen.add(lessonId)

    const parsedLesson = lessonSchema.safeParse(lesson)
    if (!parsedLesson.success) {
      for (const issue of parsedLesson.error.issues) {
        const [first, second] = issue.path
        const exercise =
          first === "exercises" && typeof second === "number" ? second : null
        const at = issue.path.slice(exercise === null ? 0 : 2).join(".")
        issues.push({
          lessonId,
          exercise,
          message: at ? `${at}: ${issue.message}` : issue.message,
        })
      }
      continue
    }

    const place = locate(lessonId)
    if (!place) {
      issues.push({
        lessonId,
        exercise: null,
        message:
          "Not on the curriculum map in content/courses/de/curriculum.ts.",
      })
      continue
    }

    parsedLesson.data.exercises.forEach((content, position) => {
      const authored = lesson.exercises[position]
      const fail = (message: string) =>
        issues.push({ lessonId, exercise: position, message })

      // Validation must not change what was authored: no stripped keys, no filled-in defaults.
      if (canonicalJson(content) !== canonicalJson(authored)) {
        fail(
          "Validation changed the exercise; it has unknown or missing fields."
        )
        return
      }
      if (hasNul(content)) {
        fail("Contains a NUL character, which jsonb cannot store.")
        return
      }
      const tag = conceptTag(lessonId, content)
      if (!CONCEPT_TAG.test(tag)) {
        fail(`Its concept tag "${tag}" is not a valid tag.`)
        return
      }
      records.push({
        source_key: sourceKey(lessonId, position),
        unit_id: place.unitId,
        lesson_id: lessonId,
        lesson_position: place.lessonPosition,
        exercise_position: position,
        exercise_type: content.type,
        concept_tag: tag,
        content,
      })
    })
  }

  return { records, issues }
}

export const poolRowSchema = z.object({
  source_key: z.string(),
  unit_id: z.string(),
  lesson_id: z.string(),
  lesson_position: z.number().int().min(0),
  exercise_position: z.number().int().min(0),
  exercise_type: z.enum(EXERCISE_TYPES),
  concept_tag: z.string(),
  content: z.unknown(),
})

export type PoolRow = z.infer<typeof poolRowSchema>

/** A row as the parity check reads it, published or not. */
/**
 * Rows imported before content was made course-neutral name text fields `de` and `en`; today they
 * are `target` and `native`, and the language enums say "target"/"native". This reads either shape,
 * so lessons keep coming from the pool until `bun run curriculum:ingest` rewrites the rows. Remove it
 * once every environment has been re-imported.
 */
function withCourseNeutralKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(withCourseNeutralKeys)
  if (!value || typeof value !== "object") return value
  return Object.fromEntries(
    Object.entries(value).map(([key, inner]) => {
      if (key === "optionsLanguage" || key === "meaningsLanguage")
        return [
          key,
          inner === "de" ? "target" : inner === "en" ? "native" : inner,
        ]
      const renamed =
        key === "de"
          ? "target"
          : key === "en"
            ? "native"
            : key === "titleIsGerman"
              ? "titleInTarget"
              : key
      return [renamed, withCourseNeutralKeys(inner)]
    })
  )
}

export const storedRowSchema = poolRowSchema.extend({ is_active: z.boolean() })

export type StoredRow = z.infer<typeof storedRowSchema>

const invalid = (message: string): PoolFailure => ({
  ok: false,
  reason: "invalid-content",
  message,
})

/** Checks rows read from the database and turns them back into records. */
export function recordsFromRows(
  rows: readonly unknown[]
): PoolResult<PoolRecord[]> {
  const records: PoolRecord[] = []
  for (const raw of rows) {
    const row = poolRowSchema.safeParse(raw)
    if (!row.success)
      return invalid(
        `A row is malformed: ${issueMessages(row.error).join("; ")}`
      )
    const { content: rawContent, ...columns } = row.data
    const content = exerciseSchema.safeParse(withCourseNeutralKeys(rawContent))
    if (!content.success) {
      return invalid(
        `${columns.source_key} is not a valid exercise: ${issueMessages(content.error).join("; ")}`
      )
    }
    if (
      columns.source_key !==
      sourceKey(columns.lesson_id, columns.exercise_position)
    )
      return invalid(
        `${columns.source_key} does not match its lesson and position.`
      )
    if (content.data.type !== columns.exercise_type)
      return invalid(
        `${columns.source_key} is stored as ${columns.exercise_type} but is ${content.data.type}.`
      )
    records.push({
      ...columns,
      exercise_type: content.data.type,
      content: content.data,
    })
  }
  return { ok: true, data: records }
}

/** One lesson's exercises in authored order. Gaps mean part of the lesson is unpublished. */
export function lessonExercisesFromRows(
  lessonId: string,
  rows: readonly unknown[]
): PoolResult<Exercise[]> {
  const parsed = recordsFromRows(rows)
  if (!parsed.ok) return parsed
  const records = parsed.data
    .filter((record) => record.lesson_id === lessonId)
    .sort((a, b) => a.exercise_position - b.exercise_position)
  if (records.length !== rows.length)
    return invalid(`Rows for other lessons were returned for ${lessonId}.`)
  if (records.length === 0) {
    return {
      ok: false,
      reason: "not-found",
      message: `${lessonId} has no published exercises.`,
    }
  }
  if (records.some((record, index) => record.exercise_position !== index))
    return invalid(`${lessonId} has gaps in its published exercises.`)
  return { ok: true, data: records.map((record) => record.content) }
}

export type PoolLesson = { lessonId: string; exercises: Exercise[] }

/** A unit's lessons in path order, each with its exercises in authored order. */
export function unitLessonsFromRows(
  unitId: string,
  rows: readonly unknown[]
): PoolResult<PoolLesson[]> {
  const parsed = recordsFromRows(rows)
  if (!parsed.ok) return parsed
  if (parsed.data.some((record) => record.unit_id !== unitId))
    return invalid(`Rows from other units were returned for ${unitId}.`)

  const byLesson = new Map<string, { position: number; rows: PoolRecord[] }>()
  for (const record of parsed.data) {
    const entry = byLesson.get(record.lesson_id)
    if (entry && entry.position !== record.lesson_position)
      return invalid(
        `${record.lesson_id} has more than one place in ${unitId}.`
      )
    if (entry) entry.rows.push(record)
    else
      byLesson.set(record.lesson_id, {
        position: record.lesson_position,
        rows: [record],
      })
  }
  if (byLesson.size === 0) {
    return {
      ok: false,
      reason: "not-found",
      message: `${unitId} has no published exercises.`,
    }
  }

  const lessons: PoolLesson[] = []
  const ordered = [...byLesson.entries()].sort(
    ([, a], [, b]) => a.position - b.position
  )
  for (const [lessonId, entry] of ordered) {
    const exercises = lessonExercisesFromRows(lessonId, entry.rows)
    if (!exercises.ok) return exercises
    lessons.push({ lessonId, exercises: exercises.data })
  }
  return { ok: true, data: lessons }
}

/**
 * The lesson as the app represents it, with its exercises from the database. Lesson details
 * (title, intro, vocabulary, XP) still come from the typed lesson during this migration.
 */
export function withPoolExercises(
  lesson: Lesson,
  exercises: readonly Exercise[]
): PoolResult<Lesson> {
  const parsed = lessonSchema.safeParse({ ...lesson, exercises })
  if (!parsed.success)
    return invalid(
      `${lesson.id} is not a valid lesson: ${issueMessages(parsed.error).join("; ")}`
    )
  return { ok: true, data: parsed.data }
}

export type ParityReport = {
  matching: number
  /** One line per difference, naming the source key. */
  differences: string[]
}

/**
 * Compares the records built from the typed lessons with rows read back from the database.
 * Inactive rows count only when the source still has them, which is itself a difference.
 */
export function parityReport(
  expected: readonly PoolRecord[],
  rows: readonly StoredRow[]
): ParityReport {
  const differences: string[] = []
  const stored = new Map(rows.map((row) => [row.source_key, row]))
  const lessonIds = new Set(expected.map((record) => record.lesson_id))
  let matching = 0

  for (const record of expected) {
    const row = stored.get(record.source_key)
    if (!row) {
      differences.push(`${record.source_key}: not imported`)
      continue
    }
    if (!row.is_active) {
      differences.push(`${record.source_key}: imported but not published`)
      continue
    }
    const back = recordsFromRows([row])
    if (!back.ok) {
      differences.push(`${record.source_key}: ${back.message}`)
      continue
    }
    const [restored] = back.data
    if (canonicalJson(restored) !== canonicalJson(record)) {
      differences.push(
        `${record.source_key}: stored row differs from the source`
      )
      continue
    }
    matching++
  }

  const expectedKeys = new Set(expected.map((record) => record.source_key))
  for (const row of rows) {
    if (
      row.is_active &&
      lessonIds.has(row.lesson_id) &&
      !expectedKeys.has(row.source_key)
    )
      differences.push(
        `${row.source_key}: published but no longer in the source`
      )
  }
  return { matching, differences }
}

/** One published exercise, or null when its stored content doesn't validate. */
export function exerciseFromContent(content: unknown): Exercise | null {
  const parsed = exerciseSchema.safeParse(withCourseNeutralKeys(content))
  return parsed.success ? parsed.data : null
}
