import type { Metadata } from "next"

import { HomeView } from "@/features/home/home-view"
import { loadLearner } from "@/features/learner/load-learner"
import { DatabaseNotReady } from "@/features/onboarding/database-not-ready"
import { loadCompletedStandups } from "@/features/team/data"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = { title: "Home" }

export default async function HomePage() {
  const learner = await loadLearner("/home")
  if (learner === "database-not-ready") return <DatabaseNotReady />
  const completedStandups = await loadCompletedStandups(await createClient())
  return (
    <HomeView
      {...learner}
      email={learner.user.email}
      completedStandups={completedStandups}
    />
  )
}
