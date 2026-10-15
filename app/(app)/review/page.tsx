import type { Metadata } from "next"

import { loadLearner } from "@/features/learner/load-learner"
import { DatabaseNotReady } from "@/features/onboarding/database-not-ready"
import { SESSION_SIZE, loadReviewOverview } from "@/features/review/data"
import { ReviewClient } from "@/features/review/review-client"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = { title: "Vocabulary review" }

export default async function ReviewPage() {
  const learner = await loadLearner("/review")
  if (learner === "database-not-ready") return <DatabaseNotReady />
  const overview = await loadReviewOverview(await createClient())

  return (
    <ReviewClient
      shell={{
        name: learner.name,
        email: learner.user.email,
        counts: learner.counts,
      }}
      overview={overview}
      sessionSize={SESSION_SIZE}
    />
  )
}
