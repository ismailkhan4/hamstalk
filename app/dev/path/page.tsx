import { notFound } from "next/navigation"

import { PathView } from "@/features/path/components/path-view"
import { devPreviewsEnabled } from "@/lib/dev-preview"
import { sampleLearner } from "@/lib/sample-learner"

import { sampleProgress } from "../sample-progress"

type Props = {
  searchParams: Promise<{ level?: string; stage?: string; start?: string }>
}

/** Development only: the line map for a sample learner. `?stage=new|unit2|done&level=a2`. */
export default async function DevPathPage({ searchParams }: Props) {
  if (!devPreviewsEnabled) notFound()
  const params = await searchParams
  const learner = sampleLearner(params.start)
  const { progress, completedStandups } = sampleProgress(params.stage)
  return (
    <PathView
      name={learner.name}
      email={learner.email}
      preferences={learner.preferences}
      progress={progress}
      completedStandups={completedStandups}
      expressPassed={params.stage === "done" ? ["a1-u1"] : []}
      params={{ level: params.level }}
      basePath="/dev/path"
    />
  )
}
