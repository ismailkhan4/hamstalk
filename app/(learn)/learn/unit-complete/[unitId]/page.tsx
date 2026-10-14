import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"

import { FocusHeaderLink } from "@/components/learning/focus-header-link"
import { getUnit } from "@/content/curriculum"
import { isLessonAvailable } from "@/content/availability"
import { getLesson } from "@/content/lessons/registry"
import { loadLearner } from "@/features/learner/load-learner"
import { UnitComplete } from "@/features/lessons/components/unit-complete"
import { pathHrefFor } from "@/features/lessons/up-next"
import { DatabaseNotReady } from "@/features/onboarding/database-not-ready"
import { getLevel } from "@/content/curriculum"

type Props = { params: Promise<{ unitId: string }> }

export const metadata: Metadata = { title: "Unit complete" }

export default async function UnitCompletePage({ params }: Props) {
  const { unitId } = await params
  const unit = getUnit(unitId)
  if (!unit?.milestone) notFound()

  const learner = await loadLearner(`/unit-complete/${unitId}`)
  if (learner === "database-not-ready") return <DatabaseNotReady />

  const done = new Map(learner.progress.map((entry) => [entry.lessonId, entry]))
  const finished = unit.lessons.every(
    (lesson) => done.get(lesson.id)?.status === "completed"
  )
  if (!finished)
    redirect(`/path?level=${unit.level.toLowerCase()}&unit=${unit.id}`)

  const xp = unit.lessons.reduce(
    (sum, lesson) => sum + (done.get(lesson.id)?.xp ?? 0),
    0
  )
  const phrases = unit.lessons.reduce(
    (sum, lesson) => sum + (getLesson(lesson.id)?.practised.length ?? 0),
    0
  )
  const next = getLevel(unit.level).units.find(
    (candidate) => candidate.number === unit.number + 1
  )

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <FocusHeaderLink
        href={pathHrefFor(unit.lessons[0]!.id)}
        closeLabel="Close"
        title={`Unit ${unit.number} complete`}
      />
      <UnitComplete
        unit={unit}
        xp={xp}
        phrases={phrases}
        nextUnit={
          next
            ? {
                title: next.title,
                open: next.lessons.some((lesson) =>
                  isLessonAvailable(lesson.id)
                ),
                href: null,
              }
            : null
        }
        pathHref={pathHrefFor(unit.lessons[0]!.id)}
      />
    </div>
  )
}
