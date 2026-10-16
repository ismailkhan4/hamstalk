import { notFound } from "next/navigation"

import { getUnit } from "@/content/courses/de/curriculum"
import { UnitGuide } from "@/features/path/components/unit-guide"
import { devPreviewsEnabled } from "@/lib/dev-preview"
import { sampleLearner } from "@/lib/sample-learner"

type Props = { params: Promise<{ unitId: string }> }

/** Development only: a unit's guide for a sample learner. */
export default async function DevGuidePage({ params }: Props) {
  if (!devPreviewsEnabled) notFound()
  const unit = getUnit((await params).unitId)
  if (!unit || unit.lessons.length === 0) notFound()
  const learner = sampleLearner(undefined)
  return (
    <UnitGuide
      name={learner.name}
      email={learner.email}
      unit={unit}
      learner={{ firstName: learner.firstName, initials: "SH" }}
    />
  )
}
