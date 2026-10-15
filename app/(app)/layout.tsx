import { Suspense } from "react"

import { LearnerBeaconSlot } from "@/features/learner/learner-beacon-slot"
import { loadHabit } from "@/features/streaks/data"
import { HabitProvider } from "@/features/streaks/habit-context"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  // One read per navigation for the shell's streak badges; pages that show more reuse it.
  const habit = await loadHabit()
  return (
    <HabitProvider habit={habit}>
      {children}
      <Suspense fallback={null}>
        <LearnerBeaconSlot />
      </Suspense>
    </HabitProvider>
  )
}
