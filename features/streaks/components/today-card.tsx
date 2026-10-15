import { Flame, Snowflake } from "lucide-react"

import { Mascot, type MascotMood } from "@/features/celebrations/mascot"
import { MASCOT_NAME } from "@/features/celebrations/mascot-name"
import { cn } from "@/lib/utils"

import type { Habit } from "../data"
import { streakCount, type StreakState } from "../model"

function copy(state: StreakState): {
  mood: MascotMood
  title: string
  text: string
} {
  switch (state.kind) {
    case "none":
      return {
        mood: "idle",
        title: "Start your streak today",
        text: "Finish a lesson and the flame lights up. Keep it going one day at a time.",
      }
    case "done":
      return {
        mood: "onFire",
        title: `${state.count} day streak!`,
        text: "Today’s practice is done. See you tomorrow.",
      }
    case "at-risk":
      return {
        mood: "sleepy",
        title: `Your ${state.count} day streak needs you`,
        text:
          state.freezing > 0
            ? "Practise today and a streak freeze covers the day you missed."
            : `One lesson today keeps the flame alive. ${MASCOT_NAME} is dozing off.`,
      }
    case "lost":
      return {
        mood: "sad",
        title: "Your streak ended",
        text: `${state.previous} days is still something to be proud of. Start a new one today.`,
      }
  }
}

/** Today at a glance: the streak, how Hamsti feels about it, and the daily goal. */
export function TodayCard({ habit }: { habit: Habit }) {
  const { mood, title, text } = copy(habit.state)
  const count = streakCount(habit.state)
  const lit = habit.state.kind === "done"
  const share = Math.min(1, habit.xpToday / habit.goalXp)
  const goalDone = habit.xpToday >= habit.goalXp
  const freezes = habit.streak?.freezes ?? 1

  return (
    <section
      aria-labelledby="today-title"
      className="flex flex-col gap-4 rounded-3xl border-2 border-border bg-card p-5 shadow-[0_4px_0_var(--border)] sm:flex-row sm:items-center"
    >
      <Mascot mood={mood} size={92} className="self-center" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h2
            id="today-title"
            className="font-display text-2xl leading-tight font-semibold"
          >
            {title}
          </h2>
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-sm font-extrabold tabular-nums",
              lit
                ? "bg-spark text-spark-foreground"
                : "bg-muted text-muted-foreground"
            )}
          >
            <Flame
              aria-hidden="true"
              className={cn("size-4", lit && "fill-current")}
            />
            {count}
            <span className="sr-only"> day streak</span>
          </span>
          {freezes > 0 && (
            <span
              title="Streak freezes cover a missed day automatically."
              className="inline-flex items-center gap-1 rounded-full bg-info-subtle px-2.5 py-0.5 text-sm font-extrabold text-info-text"
            >
              <Snowflake aria-hidden="true" className="size-4" />
              {freezes}
              <span className="sr-only">
                {" "}
                streak {freezes === 1 ? "freeze" : "freezes"} ready
              </span>
            </span>
          )}
        </div>
        <p className="mt-1 font-semibold text-secondary-text">{text}</p>

        <div className="mt-3">
          <div className="flex items-baseline justify-between gap-2 text-sm font-extrabold">
            <span id="goal-label">Daily goal</span>
            <span
              className={cn(
                "tabular-nums",
                goalDone ? "text-primary-text" : "text-reward-text"
              )}
            >
              {habit.xpToday} / {habit.goalXp} XP
            </span>
          </div>
          <div
            role="progressbar"
            aria-labelledby="goal-label"
            aria-valuemin={0}
            aria-valuemax={habit.goalXp}
            aria-valuenow={Math.min(habit.xpToday, habit.goalXp)}
            className="mt-1.5 h-3.5 overflow-hidden rounded-full bg-muted"
          >
            <div
              className={cn(
                "h-full rounded-full transition-[width] duration-(--duration-slower)",
                goalDone ? "bg-primary" : "bg-reward"
              )}
              style={{ width: `${share * 100}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
