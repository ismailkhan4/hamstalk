import type { Metadata } from "next"

import { loadLearner } from "@/features/learner/load-learner"
import { DatabaseNotReady } from "@/features/onboarding/database-not-ready"
import { loadCompletedStandups } from "@/features/team/data"
import { TeamView } from "@/features/team/team-view"
import { aiEnabled } from "@/lib/ai/claude"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = { title: "Your team" }

export default async function TeamPage() {
  const learner = await loadLearner("/team")
  if (learner === "database-not-ready") return <DatabaseNotReady />
  const completedStandups = await loadCompletedStandups(await createClient())

  return (
    <TeamView
      name={learner.name}
      email={learner.user.email}
      counts={learner.counts}
      startedAt={learner.preferences.startedAt}
      progress={learner.progress}
      completedStandups={completedStandups}
      ai={aiEnabled()}
    />
  )
}
