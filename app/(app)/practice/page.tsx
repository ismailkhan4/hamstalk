import type { Metadata } from "next"

import { loadLearner } from "@/features/learner/load-learner"
import { DatabaseNotReady } from "@/features/onboarding/database-not-ready"
import { PracticeView } from "@/features/practice/practice-view"
import { loadReviewOverview } from "@/features/review/data"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = { title: "Practice" }

export default async function PracticePage() {
  const learner = await loadLearner("/practice")
  if (learner === "database-not-ready") return <DatabaseNotReady />
  const overview = await loadReviewOverview(await createClient())

  return (
    <PracticeView
      name={learner.name}
      email={learner.user.email}
      counts={learner.counts}
      overview={overview}
      progress={learner.progress}
    />
  )
}
