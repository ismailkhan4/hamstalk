import type { Metadata } from "next"

import { loadLearner } from "@/features/learner/load-learner"
import { DatabaseNotReady } from "@/features/onboarding/database-not-ready"
import { PracticeView } from "@/features/practice/practice-view"
import { loadReviewOverview } from "@/features/review/data"
import { loadExpressPassed } from "@/features/session-generator/express"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = { title: "Practice" }

export default async function PracticePage() {
  const learner = await loadLearner("/practice")
  if (learner === "database-not-ready") return <DatabaseNotReady />
  const supabase = await createClient()
  const [overview, expressPassed] = await Promise.all([
    loadReviewOverview(supabase),
    loadExpressPassed(supabase),
  ])

  return (
    <PracticeView
      name={learner.name}
      email={learner.user.email}
      counts={learner.counts}
      overview={overview}
      progress={learner.progress}
      expressPassed={expressPassed}
    />
  )
}
