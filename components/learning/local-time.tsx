"use client"

import { useSyncExternalStore } from "react"

const subscribe = () => () => {}

/** "tomorrow at 09:00" in the learner's own time zone. Shows a neutral phrase until the browser can say. */
export function whenLabel(iso: string, now: Date, locale = "en-GB") {
  const due = new Date(iso)
  const time = due.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  })
  const startOfDay = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
  const days = Math.round((startOfDay(due) - startOfDay(now)) / 86_400_000)
  if (days <= 0) return `today at ${time}`
  if (days === 1) return `tomorrow at ${time}`
  return `${due.toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long" })} at ${time}`
}

export function LocalTime({ iso }: { iso: string }) {
  const label = useSyncExternalStore(
    subscribe,
    () => whenLabel(iso, new Date()),
    () => "soon"
  )
  return <>{label}</>
}
