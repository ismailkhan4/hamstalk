import { isLessonAvailable } from "@/content/availability"
import { findLesson } from "@/content/curriculum"
import type { StartLevel } from "@/features/onboarding/options"
import {
  completedLessonCount,
  nextLesson,
  type LessonProgress,
} from "@/features/path/model"

import type { UpNext } from "./components/lesson-complete"

function withCompleted(
  progress: LessonProgress[],
  lessonId: string
): LessonProgress[] {
  return [
    ...progress.filter((entry) => entry.lessonId !== lessonId),
    { lessonId, status: "completed", step: 0, xp: 0 },
  ]
}

/** What follows this lesson, by the path rules. Planned lessons are shown, but never offered as a button. */
export function upNextAfter(
  level: StartLevel | null,
  progress: LessonProgress[],
  lessonId: string
): UpNext | null {
  const after = withCompleted(progress, lessonId)
  const next = nextLesson(level, after)
  const current = findLesson(lessonId)
  if (!current) return null

  const unitDone = current.unit.lessons.every((lesson) =>
    after.some(
      (entry) => entry.lessonId === lesson.id && entry.status === "completed"
    )
  )
  if (unitDone && current.unit.milestone) {
    return {
      href: `/unit-complete/${current.unit.id}`,
      kicker: "Next",
      title: `Your Unit ${current.unit.number} milestone`,
      titleIsGerman: false,
      minutes: null,
      ctaLabel: `See your Unit ${current.unit.number} milestone`,
    }
  }
  if (!next || next.lesson.id === lessonId) return null

  const open = isLessonAvailable(next.lesson.id)
  const sameUnit = next.unit.id === current.unit.id
  const position =
    next.lesson.kind === "review" ? "Unit review" : `Lesson ${next.index + 1}`
  const kicker = sameUnit
    ? `Up next · ${position}`
    : `Up next · Unit ${next.unit.number}${open ? "" : " · planned"}`
  return {
    href: open ? `/learn/${next.lesson.id}` : null,
    kicker,
    title: sameUnit ? next.lesson.title : next.unit.title,
    titleIsGerman: sameUnit ? next.lesson.titleIsGerman : false,
    minutes: sameUnit && open ? next.lesson.minutes : null,
    ctaLabel:
      next.lesson.kind === "review"
        ? "Start the unit review"
        : `Continue to ${position}`,
  }
}

export function unitProgressAfter(
  progress: LessonProgress[],
  lessonId: string
) {
  const current = findLesson(lessonId)
  if (!current) return null
  const after = withCompleted(progress, lessonId)
  return {
    number: current.unit.number,
    title: current.unit.title,
    done: completedLessonCount(current.unit, after),
    total: current.unit.lessons.length,
  }
}

export function lessonKicker(lessonId: string) {
  const found = findLesson(lessonId)
  if (!found) return ""
  const place =
    found.lesson.kind === "review" ? "Review" : `Lesson ${found.index + 1}`
  return `Unit ${found.unit.number} · ${place}`
}

export function pathHrefFor(lessonId: string) {
  const found = findLesson(lessonId)
  return found
    ? `/path?level=${found.level.code.toLowerCase()}&unit=${found.unit.id}`
    : "/path"
}
