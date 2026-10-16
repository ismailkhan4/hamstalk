import { notFound } from "next/navigation"

import { EconomyProvider } from "@/features/economy/economy-context"
import { HomeView } from "@/features/home/home-view"
import { HabitProvider } from "@/features/streaks/habit-context"
import { devPreviewsEnabled } from "@/lib/dev-preview"
import { sampleLearner } from "@/lib/sample-learner"

import { sampleEconomy } from "../sample-economy"
import { sampleLeague } from "../sample-league"
import { sampleProgress } from "../sample-progress"

type Props = {
  searchParams: Promise<{
    stage?: string
    start?: string
    stash?: string
    league?: string
  }>
}

/**
 * Development only: Home for a sample learner. `?stage=new|unit2|done`, and
 * `&stash=fresh|busy|low|empty` for the nuts, Akku and plan, and `&league=mid|top|…` for the
 * league card.
 */
export default async function DevHomePage({ searchParams }: Props) {
  if (!devPreviewsEnabled) notFound()
  const params = await searchParams
  const learner = sampleLearner(params.start)
  const { progress, completedStandups } = sampleProgress(params.stage)
  const economy = { ...sampleEconomy(params.stash), nuts: 1245 }
  return (
    // A wide streak and goal, so the phone header is checked at its fullest.
    <HabitProvider
      habit={{
        today: "2026-10-16",
        state: { kind: "done", count: 128 },
        streak: null,
        xpToday: 120,
        goalXp: 45,
        days: [],
      }}
    >
      <EconomyProvider economy={economy}>
        <HomeView
          name={learner.name}
          firstName={learner.firstName}
          email={learner.email}
          preferences={learner.preferences}
          progress={progress}
          completedStandups={completedStandups}
          economy={economy}
          league={sampleLeague(params.league)}
        />
      </EconomyProvider>
    </HabitProvider>
  )
}
