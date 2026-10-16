"use client"

import { getLesson } from "@/content/courses/de/lessons/registry"
import { LessonComplete } from "@/features/lessons/components/lesson-complete"
import { rewardsSchema, type Rewards } from "@/features/rewards/payload"
import {
  recordOutcome,
  startSession,
  summarise,
} from "@/features/lessons/engine/session"

/** Development only: the end-of-lesson screen, perfect or with a slip, without playing the lesson. */
export type PreviewRewards = {
  /** The streak after this lesson; omit for no streak change. */
  streak?: number
  frozen?: number
  earned?: boolean
  goal?: boolean
  /** Nuts, finished quests and a new pin. */
  stash?: boolean
}

const MILESTONES = [3, 7, 14, 30, 50, 100]

function previewRewards(input: PreviewRewards): Rewards | null {
  if (input.streak === undefined && !input.goal && !input.stash) return null
  const after = input.streak ?? 4
  return rewardsSchema.parse({
    awarded: 30,
    source: "lesson",
    xpToday: 30,
    goalXp: 30,
    goalReached: Boolean(input.goal),
    streak: {
      before: after - 1,
      after,
      extended: input.streak !== undefined,
      milestone: MILESTONES.includes(after) ? after : null,
      freezesUsed: input.frozen ?? 0,
      freezeEarned: Boolean(input.earned),
      freezes: input.earned ? 1 : 0,
    },
    nuts: input.stash ? { earned: 55, balance: 240 } : null,
    quests: input.stash
      ? [
          { id: "xp-30", reward: 15 },
          { id: "lessons-1", reward: 10 },
        ]
      : [],
    pins: input.stash ? [{ pin: "stations", tier: 1 }] : [],
  })
}

export function CompletePreview({
  lessonId,
  perfect,
  rewards,
}: {
  lessonId: string
  perfect: boolean
  rewards: PreviewRewards
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
      rewards={previewRewards(rewards)}
      mistakeCount={perfect ? 0 : 1}
      replay={false}
      upNext={{
        href: "/dev/lesson?id=a1-u1-l2",
        kicker: "Up next · Lesson 2",
        title: "Guten Morgen, guten Tag",
        titleInTarget: true,
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
