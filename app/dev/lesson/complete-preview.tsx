"use client"

import { getLesson } from "@/content/lessons/registry"
import { LessonComplete } from "@/features/lessons/components/lesson-complete"
import {
  recordOutcome,
  startSession,
  summarise,
} from "@/features/lessons/engine/session"

/** Development only: the end-of-lesson screen, perfect or with a slip, without playing the lesson. */
export function CompletePreview({
  lessonId,
  perfect,
}: {
  lessonId: string
  perfect: boolean
}) {
  const lesson = getLesson(lessonId) ?? getLesson("a1-u1-l1")!
  const state = lesson.exercises.reduce(
    (session, _, index) =>
      recordOutcome(
        session,
        index,
        !perfect && index === lesson.exercises.length - 2
          ? "second_try"
          : "first_try"
      ),
    startSession(lesson)
  )
  return (
    <LessonComplete
      lesson={lesson}
      summary={summarise(lesson, state)}
      minutes={5}
      bestCombo={perfect ? 6 : 4}
      mistakeCount={perfect ? 0 : 1}
      replay={false}
      upNext={{
        href: "/dev/lesson?id=a1-u1-l2",
        kicker: "Up next · Lesson 2",
        title: "Guten Morgen, guten Tag",
        titleIsGerman: true,
        minutes: 6,
        ctaLabel: "Continue to Lesson 2",
      }}
      unitProgress={{
        number: 1,
        done: 2,
        total: 5,
        title: "First day at work",
      }}
      pathHref="/dev/lesson"
      saveProblem={null}
      saving={false}
      onRetrySave={() => {}}
    />
  )
}
