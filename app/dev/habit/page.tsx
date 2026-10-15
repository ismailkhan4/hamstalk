import { notFound } from "next/navigation"

import type { Habit } from "@/features/streaks/data"
import { HabitBadgesView } from "@/features/streaks/components/habit-badges-view"
import { StreakCalendar } from "@/features/streaks/components/streak-calendar"
import { TodayCard } from "@/features/streaks/components/today-card"
import { addDays, type StreakState } from "@/features/streaks/model"
import { devPreviewsEnabled } from "@/lib/dev-preview"

const TODAY = "2026-10-16"

/** Five weeks with a twelve-day run, one frozen day inside it, and a few scattered days before. */
function habit(state: StreakState, xpToday: number): Habit {
  const since = addDays(TODAY, -34)
  const days = Array.from({ length: 35 }, (_, i) => {
    const date = addDays(since, i)
    const ago = 34 - i
    const frozen = ago === 5
    const xp =
      ago === 0
        ? xpToday
        : frozen
          ? 0
          : ago <= 12 || [20, 21, 24].includes(ago)
            ? 40
            : 0
    return { date, xp, frozen }
  })
  return {
    today: TODAY,
    state,
    streak: {
      current: 12,
      longest: 19,
      lastActive: TODAY,
      freezes: 1,
      frozenDates: [addDays(TODAY, -5)],
    },
    xpToday,
    goalXp: 45,
    days,
  }
}

const STATES: { label: string; habit: Habit }[] = [
  { label: "Done today", habit: habit({ kind: "done", count: 12 }, 50) },
  {
    label: "At risk",
    habit: habit({ kind: "at-risk", count: 12, freezing: 0 }, 0),
  },
  {
    label: "At risk, freeze will cover",
    habit: habit({ kind: "at-risk", count: 12, freezing: 1 }, 6),
  },
  { label: "Lost", habit: habit({ kind: "lost", previous: 12 }, 0) },
  { label: "New learner", habit: habit({ kind: "none" }, 0) },
]

/** Development only: the streak UI in every state, with made-up data. */
export default function DevHabitPage() {
  if (!devPreviewsEnabled) notFound()
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 bg-background p-4 sm:p-8">
      <section className="flex flex-wrap gap-3">
        {STATES.slice(0, 2).map((item) => (
          <HabitBadgesView
            key={item.label}
            habit={item.habit}
            className="border-2 border-border"
          />
        ))}
      </section>
      {STATES.map((item) => (
        <section key={item.label} data-state={item.label}>
          <p className="mb-2 text-sm font-extrabold text-muted-foreground uppercase">
            {item.label}
          </p>
          <TodayCard habit={item.habit} />
        </section>
      ))}
      <StreakCalendar habit={STATES[0]!.habit} />
    </main>
  )
}
