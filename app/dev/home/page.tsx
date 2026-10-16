import { notFound } from "next/navigation"

import { HomeView } from "@/features/home/home-view"
import { devPreviewsEnabled } from "@/lib/dev-preview"
import { sampleLearner } from "@/lib/sample-learner"

import { sampleProgress } from "../sample-progress"

type Props = { searchParams: Promise<{ stage?: string; start?: string }> }

/** Development only: Home for a sample learner. `?stage=new|unit2|done`. */
export default async function DevHomePage({ searchParams }: Props) {
  if (!devPreviewsEnabled) notFound()
  const params = await searchParams
  const learner = sampleLearner(params.start)
  const { progress, completedStandups } = sampleProgress(params.stage)
  return (
    <HomeView
      name={learner.name}
      firstName={learner.firstName}
      email={learner.email}
      preferences={learner.preferences}
      progress={progress}
      completedStandups={completedStandups}
    />
  )
}
