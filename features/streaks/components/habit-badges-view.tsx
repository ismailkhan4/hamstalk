import { Flame } from "lucide-react"
import Link from "next/link"

import { cn } from "@/lib/utils"

import type { Habit } from "../data"
import { streakCount } from "../model"
import { GoalRing } from "./goal-ring"

/**
 * The streak flame and today's goal ring, for the app shell. The flame is lit once today's
 * practice is done and grey while it's still needed. Pure, so client components can render it.
 */
export function HabitBadgesView({
  habit,
  className,
}: {
  habit: Habit
  className?: string
}) {
  const count = streakCount(habit.state)
  const lit = habit.state.kind === "done"
  const goalDone = habit.xpToday >= habit.goalXp

  return (
    <Link
      href="/progress"
      className={cn(
        "inline-flex items-center gap-3 rounded-xl px-2.5 py-1.5 font-extrabold hover:bg-accent",
        className
      )}
    >
      <span
        className={cn(
          "inline-flex items-center gap-1 tabular-nums",
          lit ? "text-spark-text" : "text-muted-foreground"
        )}
      >
        <Flame
          aria-hidden="true"
          className={cn(
            "size-5",
            lit ? "fill-spark text-spark" : "fill-muted text-muted-foreground"
          )}
        />
        {count}
        <span className="sr-only">
          {" "}
          day streak
          {habit.state.kind === "at-risk" ? ", practise today to keep it" : ""}
        </span>
      </span>
      <span className="inline-flex items-center gap-1.5 text-sm text-secondary-text tabular-nums">
        <GoalRing xp={habit.xpToday} goal={habit.goalXp} size={22} />
        {/* Phones show the ring alone, to leave room in the top bar. */}
        <span aria-hidden="true" className="max-sm:hidden">
          {Math.min(habit.xpToday, 999)}/{habit.goalXp}
        </span>
        <span className="sr-only">
          {habit.xpToday} of {habit.goalXp} XP today
          {goalDone ? ", daily goal reached" : ""}
        </span>
      </span>
    </Link>
  )
}
