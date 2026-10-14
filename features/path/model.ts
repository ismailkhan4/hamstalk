import { isLessonAvailable } from "@/content/availability"
import {
  getLevel,
  levels,
  type CefrLevel,
  type LessonMeta,
  type Unit,
} from "@/content/curriculum"
import type { StartLevel } from "@/features/onboarding/options"

export type LessonProgress = {
  lessonId: string
  status: "in_progress" | "completed"
  /** Index of the exercise to resume at, for lessons in progress. */
  step: number
  xp: number
}

export type UnitStatus =
  | "completed"
  | "in_progress"
  | "up_next"
  | "available"
  | "review"
  | "locked"
  | "preview"

export type LessonStatus =
  "completed" | "in_progress" | "up_next" | "open" | "locked" | "planned"

/** Placement and onboarding set the starting unit; A2 to B2 start in a preview with Unit 1 open. */
export function startUnitNumber(level: StartLevel | null) {
  return level === "a1" ? 3 : 1
}

export function homeLevel(level: StartLevel | null): CefrLevel {
  if (level === "a2") return "A2"
  if (level === "b1") return "B1"
  if (level === "b2") return "B2"
  return "A1"
}

function byId(progress: LessonProgress[]) {
  return new Map(progress.map((entry) => [entry.lessonId, entry]))
}

export function isUnitCompleted(unit: Unit, progress: LessonProgress[]) {
  return unitCompleted(unit, byId(progress))
}

export function unitHasOpenLessons(unit: Unit) {
  return unit.lessons.some((lesson) => isLessonAvailable(lesson.id))
}

function unitCompleted(unit: Unit, progress: Map<string, LessonProgress>) {
  return (
    unit.lessons.length > 0 &&
    unit.lessons.every(
      (lesson) => progress.get(lesson.id)?.status === "completed"
    )
  )
}

function unitStarted(unit: Unit, progress: Map<string, LessonProgress>) {
  return unit.lessons.some((lesson) => progress.has(lesson.id))
}

/** The A1 unit the learner is working on: the first unfinished one from their starting unit. */
export function currentUnitNumber(
  level: StartLevel | null,
  progress: LessonProgress[]
) {
  const done = byId(progress)
  const units = getLevel("A1").units
  const start = startUnitNumber(level)
  const current = units.find(
    (unit) => unit.number >= start && !unitCompleted(unit, done)
  )
  return current?.number ?? units.length + 1
}

export function unitStatus(
  unit: Unit,
  level: StartLevel | null,
  progress: LessonProgress[]
): UnitStatus {
  if (unit.level !== "A1") return "preview"
  const done = byId(progress)
  if (unitCompleted(unit, done)) return "completed"
  if (unitStarted(unit, done)) return "in_progress"
  const current = currentUnitNumber(level, progress)
  if (unit.number === current) return "up_next"
  if (unit.number === current + 1) return "available"
  if (unit.number < startUnitNumber(level)) return "review"
  return "locked"
}

export function lessonStatus(
  lesson: LessonMeta,
  unit: Unit,
  level: StartLevel | null,
  progress: LessonProgress[]
): LessonStatus {
  const entry = byId(progress).get(lesson.id)
  if (entry?.status === "completed") return "completed"
  if (entry?.status === "in_progress") return "in_progress"
  if (!isLessonAvailable(lesson.id)) return "planned"
  const status = unitStatus(unit, level, progress)
  if (status === "locked" || status === "preview") return "locked"
  const next = nextLesson(level, progress)
  if (next?.lesson.id === lesson.id) return "up_next"
  // Within a unit, lessons open in order; a review opens after the last lesson.
  const index = unit.lessons.indexOf(lesson)
  const previous = unit.lessons[index - 1]
  if (!previous || byId(progress).get(previous.id)?.status === "completed")
    return "open"
  return status === "review" ? "open" : "locked"
}

export type NextLesson = {
  unit: Unit
  lesson: LessonMeta
  index: number
  resumeAt: number | null
}

/**
 * One clear next step, in the blueprint's order: an unfinished lesson first, then the next lesson in
 * path order from the starting unit. Lessons that haven't shipped are still returned, so Home can say
 * honestly that the next mission is being built.
 */
export function nextLesson(
  level: StartLevel | null,
  progress: LessonProgress[]
): NextLesson | null {
  const done = byId(progress)
  const units = getLevel("A1").units

  for (const unit of units) {
    for (const [index, lesson] of unit.lessons.entries()) {
      const entry = done.get(lesson.id)
      if (entry?.status === "in_progress")
        return { unit, lesson, index, resumeAt: entry.step }
    }
  }

  const start = startUnitNumber(level)
  for (const unit of units) {
    if (unit.number < start) continue
    for (const [index, lesson] of unit.lessons.entries()) {
      if (done.get(lesson.id)?.status !== "completed")
        return { unit, lesson, index, resumeAt: null }
    }
  }
  return null
}

export function completedUnitCount(
  level: CefrLevel,
  progress: LessonProgress[]
) {
  const done = byId(progress)
  return getLevel(level).units.filter((unit) => unitCompleted(unit, done))
    .length
}

export function completedLessonCount(unit: Unit, progress: LessonProgress[]) {
  const done = byId(progress)
  return unit.lessons.filter(
    (lesson) => done.get(lesson.id)?.status === "completed"
  ).length
}

export { levels }
