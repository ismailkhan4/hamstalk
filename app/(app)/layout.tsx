import { Suspense } from "react"

import { loadEconomy } from "@/features/economy/data"
import { EconomyProvider } from "@/features/economy/economy-context"
import { LearnerBeaconSlot } from "@/features/learner/learner-beacon-slot"
import { loadHabit } from "@/features/streaks/data"
import { HabitProvider } from "@/features/streaks/habit-context"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  // One read per navigation for the shell's streak and stash badges; pages that show more reuse it.
  const [habit, economy] = await Promise.all([loadHabit(), loadEconomy()])
  return (
    <HabitProvider habit={habit}>
      <EconomyProvider economy={economy}>
        {children}
        <Suspense fallback={null}>
          <LearnerBeaconSlot />
        </Suspense>
      </EconomyProvider>
    </HabitProvider>
  )
}
