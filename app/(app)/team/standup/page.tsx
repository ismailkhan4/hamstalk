import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { getStandup, standups } from "@/content/courses/de/standup"
import { initialsFor } from "@/components/learning/team-badge"
import { loadLearner } from "@/features/learner/load-learner"
import { DatabaseNotReady } from "@/features/onboarding/database-not-ready"
import { playableStandup } from "@/features/team/model"
import { StandupClient } from "@/features/team/standup-client"

export const metadata: Metadata = { title: "Daily standup" }

export default async function StandupPage() {
  const learner = await loadLearner("/team/standup")
  if (learner === "database-not-ready") return <DatabaseNotReady />
  const unitId = playableStandup(
    learner.progress,
    standups.map((standup) => standup.unitId)
  )
  const standup = unitId ? getStandup(unitId) : null
  if (!standup) redirect("/team")

  return (
    <StandupClient
      standup={standup}
      firstName={learner.firstName}
      initials={initialsFor(learner.name) || "?"}
    />
  )
}
