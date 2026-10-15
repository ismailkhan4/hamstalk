import { Flame, Snowflake, Trophy } from "lucide-react"

import { cn } from "@/lib/utils"

import type { Habit } from "../data"
import { STREAK_XP, streakCount } from "../model"

const WEEKDAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"]

/** Commit-graph shades: none, under the streak line, a lesson, a big day. */
const LEVELS = [
  "bg-muted",
  "bg-success/30",
  "bg-success/65",
  "bg-success",
] as const

function level(xp: number) {
  if (xp <= 0) return 0
  if (xp < STREAK_XP) return 1
  if (xp < 50) return 2
  return 3
}

function weekdayIndex(date: string) {
  // 0 = Monday … 6 = Sunday.
  return (new Date(`${date}T00:00:00Z`).getUTCDay() + 6) % 7
}

function dayLabel(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`))
}

/** The streak in numbers, and the last five weeks as a calendar of practised and frozen days. */
export function StreakCalendar({ habit }: { habit: Habit }) {
  const count = streakCount(habit.state)
  const lit = habit.state.kind === "done"
  // Pad the start so every row runs Monday to Sunday.
  const lead = weekdayIndex(habit.days[0]?.date ?? habit.today)
  const cells = [...Array.from({ length: lead }, () => null), ...habit.days]

  return (
    <section
      aria-labelledby="streak-title"
      className="rounded-3xl border-2 border-border bg-card p-5 shadow-[0_4px_0_var(--border)] sm:p-6"
    >
      <h2 id="streak-title" className="font-display text-h2 font-semibold">
        Streak
      </h2>
      <p className="mt-1 text-sm font-semibold text-muted-foreground">
        Your practice, committed day by day.
      </p>
      <dl className="mt-4 grid grid-cols-3 gap-3">
        <Figure
          icon={Flame}
          label="Current"
          value={count}
          tone={lit ? "spark" : "muted"}
        />
        <Figure
          icon={Trophy}
          label="Longest"
          value={habit.streak?.longest ?? 0}
          tone="reward"
        />
        <Figure
          icon={Snowflake}
          label="Freezes"
          value={habit.streak?.freezes ?? 1}
          tone="info"
        />
      </dl>

      <div className="mt-6 max-w-72">
        <div
          aria-hidden="true"
          className="grid grid-cols-7 gap-1 text-center font-mono text-[0.7rem] font-semibold text-muted-foreground"
        >
          {WEEKDAYS.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
        <ol
          aria-label="The last five weeks"
          className="mt-1 grid grid-cols-7 gap-1"
        >
          {cells.map((day, i) =>
            day ? (
              <li
                key={day.date}
                className={cn(
                  "grid aspect-square place-items-center rounded-md",
                  day.frozen && day.xp < STREAK_XP
                    ? "bg-info text-info-foreground"
                    : LEVELS[level(day.xp)],
                  day.date === habit.today &&
                    "ring-2 ring-foreground ring-offset-2 ring-offset-card"
                )}
              >
                {day.frozen && day.xp < STREAK_XP && (
                  <Snowflake aria-hidden="true" className="size-3.5" />
                )}
                <span className="sr-only">
                  {dayLabel(day.date)}
                  {day.date === habit.today ? " (today)" : ""}:{" "}
                  {day.xp >= STREAK_XP
                    ? `practised, ${day.xp} XP`
                    : day.frozen
                      ? "covered by a streak freeze"
                      : day.xp > 0
                        ? `${day.xp} XP, not enough for the streak`
                        : "no practice"}
                </span>
              </li>
            ) : (
              <li key={`lead-${i}`} aria-hidden="true" />
            )
          )}
        </ol>
        <div
          aria-hidden="true"
          className="mt-2 flex items-center justify-end gap-1 font-mono text-[0.7rem] font-semibold text-muted-foreground"
        >
          less
          {LEVELS.map((tone) => (
            <span key={tone} className={cn("size-3 rounded-[3px]", tone)} />
          ))}
          more
          <span className="ml-2 size-3 rounded-[3px] bg-info" />
          freeze
        </div>
      </div>
      <p className="mt-4 text-sm font-semibold text-muted-foreground">
        Earn {STREAK_XP} XP in a day to keep your streak. A streak freeze covers
        a missed day automatically, and every seven days earns one more (you can
        hold two).
      </p>
    </section>
  )
}

function Figure({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Flame
  label: string
  value: number
  tone: "spark" | "reward" | "info" | "muted"
}) {
  return (
    <div className="rounded-2xl bg-background-subtle p-3 text-center">
      <dt className="text-xs font-extrabold tracking-wide text-muted-foreground uppercase">
        {label}
      </dt>
      <dd
        className={cn(
          "mt-1 inline-flex items-center gap-1.5 font-display text-3xl font-semibold tabular-nums",
          tone === "spark" && "text-spark-text",
          tone === "reward" && "text-reward-text",
          tone === "info" && "text-info-text",
          tone === "muted" && "text-muted-foreground"
        )}
      >
        <Icon aria-hidden="true" className="size-6" />
        {value}
      </dd>
    </div>
  )
}
