import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { getUnit } from "@/content/courses/de/curriculum"
import { loadLearner } from "@/features/learner/load-learner"
import { initialsOf } from "@/features/lessons/initials"
import { DatabaseNotReady } from "@/features/onboarding/database-not-ready"
import { UnitGuide } from "@/features/path/components/unit-guide"

type Props = { params: Promise<{ unitId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const unit = getUnit((await params).unitId)
  return { title: unit ? `Unit ${unit.number} guide` : "Unit guide" }
}

export default async function UnitGuidePage({ params }: Props) {
  const { unitId } = await params
  const unit = getUnit(unitId)
  if (!unit || unit.lessons.length === 0) notFound()
  const learner = await loadLearner(`/path/guide/${unitId}`)
  if (learner === "database-not-ready") return <DatabaseNotReady />
  return (
    <UnitGuide
      name={learner.name}
      email={learner.user.email}
      counts={learner.counts}
      unit={unit}
      learner={{
        firstName: learner.firstName,
        initials: initialsOf(learner.name),
      }}
    />
  )
}
