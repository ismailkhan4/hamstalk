import { getLesson } from "@/content/courses/de/lessons/registry"
import { conceptTag } from "@/features/lessons/pool/records"
import { isGraded, type Lesson } from "@/features/lessons/schema"

import type { Candidate, Picked, PracticeKind } from "./generate"

/** Graded exercises from the given lessons, at the starting difficulty. */
export function registryCandidates(lessonIds: readonly string[]): Candidate[] {
  return lessonIds.flatMap((lessonId) => {
    const lesson = getLesson(lessonId)
    if (!lesson) return []
    return lesson.exercises.flatMap((exercise, position) =>
      isGraded(exercise)
        ? [
            {
              key: `${lessonId}:${position}`,
              lessonId,
              unitId: lessonId.split("-").slice(0, 2).join("-"),
              conceptTag: conceptTag(lessonId, exercise),
              difficulty: 1000,
              exercise,
            },
          ]
        : []
    )
  })
}

const COPY: Record<
  PracticeKind,
  (unit?: number) => { title: string; goal: string; xp: number }
> = {
  smart: () => ({
    title: "Smart practice",
    goal: "Ten exercises picked for you: mostly ones you’ll get, a few that stretch you.",
    xp: 15,
  }),
  mistakes: () => ({
    title: "Your mistakes",
    goal: "The questions you missed, once more. Right first time and they leave your notebook.",
    xp: 15,
  }),
  express: (unit) => ({
    title: `Unit ${unit} Express`,
    goal: "The unit’s hardest exercises. One try each, no hints: get 8 of 10 right first time.",
    xp: 30,
  }),
}

/** A session dressed as a lesson, so the lesson runner can play it. */
export function practiceLesson(
  kind: PracticeKind,
  picked: Picked[],
  unit?: number
): Lesson {
  const copy = COPY[kind](unit)
  return {
    id: kind === "express" ? "express-run" : `${kind}-practice`,
    kind: "lesson",
    title: copy.title,
    titleInTarget: false,
    titleEn: "",
    goal: copy.goal,
    minutes: Math.max(3, Math.round(picked.length * 0.6)),
    xp: copy.xp,
    focus: [...new Set(picked.map((item) => item.lessonId))]
      .map((lessonId) => getLesson(lessonId)?.title)
      .filter(Boolean)
      .join(" · "),
    intro: {
      speaker: { person: "lf", initials: "LF" },
      target: copy.title,
      native: copy.goal,
    },
    phrases: [],
    vocabulary: [],
    practised: [],
    canDo: [],
    exercises: picked.map((item) => item.exercise),
  }
}
