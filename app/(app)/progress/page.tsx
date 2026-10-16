import type { Metadata } from "next"

import { loadActivity } from "@/features/activity/data"
import { loadEconomy } from "@/features/economy/data"
import { loadLearner } from "@/features/learner/load-learner"
import { DatabaseNotReady } from "@/features/onboarding/database-not-ready"
import { loadProgressFacts } from "@/features/progress/data"
import { ProgressView } from "@/features/progress/progress-view"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = { title: "Progress" }

export default async function ProgressPage() {
  const learner = await loadLearner("/progress")
  if (learner === "database-not-ready") return <DatabaseNotReady />
  const supabase = await createClient()
  const [facts, activity, economy] = await Promise.all([
    loadProgressFacts(supabase),
    loadActivity(supabase),
    loadEconomy(),
  ])

  return (
    <ProgressView
      name={learner.name}
      email={learner.user.email}
      counts={learner.counts}
      startLevel={learner.preferences.startLevel}
      progress={learner.progress}
      facts={facts}
      activity={activity}
      pins={economy?.pins ?? null}
    />
  )
}
