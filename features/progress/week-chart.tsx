"use client"

import { useSyncExternalStore } from "react"

import { cn } from "@/lib/utils"

import { weekBars } from "./model"

const subscribe = () => () => {}

/** Lessons finished per day, drawn in the learner's own calendar once the browser can tell it. */
export function WeekChart({ completedAt }: { completedAt: string[] }) {
  const ready = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  )
  if (!ready) return <div className="h-40" aria-hidden="true" />

  const bars = weekBars(completedAt, new Date())
  const total = bars.reduce((sum, bar) => sum + bar.count, 0)
  const max = Math.max(1, ...bars.map((bar) => bar.count))

  return (
    <figure>
      <figcaption className="text-sm text-secondary-text">
        {total === 0
          ? "No lessons finished in the last 7 days."
          : `${total} ${total === 1 ? "lesson" : "lessons"} finished in the last 7 days.`}
      </figcaption>
      <ol className="mt-4 flex h-40 items-end gap-2">
        {bars.map((bar) => (
          <li
            key={bar.key}
            className="flex h-full flex-1 flex-col items-center justify-end gap-1.5"
          >
            <span
              className={cn(
                "text-xs font-semibold tabular-nums",
                bar.count ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {bar.count || "–"}
              <span className="sr-only">
                {" "}
                {bar.count === 1 ? "lesson" : "lessons"} on{" "}
                {bar.today ? "today" : bar.label}
              </span>
            </span>
            <span
              aria-hidden="true"
              style={{ height: `${(bar.count / max) * 100}%` }}
              className={cn(
                "min-h-0.5 w-full rounded-t-md",
                bar.count === 0 && "bg-muted",
                bar.count > 0 && (bar.today ? "bg-spark" : "bg-primary")
              )}
            />
            <span className="text-xs text-muted-foreground" aria-hidden="true">
              {bar.today ? "Today" : bar.label}
            </span>
          </li>
        ))}
      </ol>
    </figure>
  )
}
