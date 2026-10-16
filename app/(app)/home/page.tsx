import type { Metadata } from "next"

import { loadEconomy } from "@/features/economy/data"
import { HomeView } from "@/features/home/home-view"
import { loadLeague } from "@/features/leagues/data"
import { loadLearner } from "@/features/learner/load-learner"
import { DatabaseNotReady } from "@/features/onboarding/database-not-ready"
import { loadCompletedStandups } from "@/features/team/data"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = { title: "Home" }

export default async function HomePage() {
  const learner = await loadLearner("/home")
  if (learner === "database-not-ready") return <DatabaseNotReady />
  const [completedStandups, economy, league] = await Promise.all([
    createClient().then(loadCompletedStandups),
    loadEconomy(),
    loadLeague(),
  ])
  return (
    <HomeView
      {...learner}
      email={learner.user.email}
      completedStandups={completedStandups}
      economy={economy}
      league={league}
    />
  )
}
