import type { Metadata } from "next"

import { loadLearner } from "@/features/learner/load-learner"
import { DatabaseNotReady } from "@/features/onboarding/database-not-ready"
import { SettingsClient } from "@/features/settings/settings-client"

export const metadata: Metadata = { title: "Profile and settings" }

export default async function SettingsPage() {
  const learner = await loadLearner("/settings")
  if (learner === "database-not-ready") return <DatabaseNotReady />

  return (
    <SettingsClient
      shell={{
        name: learner.name,
        email: learner.user.email,
        counts: learner.counts,
      }}
      preferences={learner.preferences}
    />
  )
}
