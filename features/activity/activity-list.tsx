"use client"

import { Route } from "lucide-react"
import Link from "next/link"
import { useSyncExternalStore } from "react"

import { EmptyState } from "@/components/feedback/empty-state"
import { buttonVariants } from "@/components/ui/button-variants"

export type ActivityEntry = {
  id: string
  at: string
  title: string
  titleInTarget: boolean
  detail: string
  status: "in_progress" | "completed"
  href: string
}

const subscribe = () => () => {}

/** Day headings use the learner's own calendar once the browser is ready, and UTC before that. */
export function dayLabel(iso: string, local: boolean, now = new Date()) {
  const date = new Date(iso)
  const timeZone = local ? undefined : "UTC"
  const key = (d: Date) => d.toLocaleDateString("en-CA", { timeZone })
  const today = key(now)
  const yesterday = key(new Date(now.getTime() - 86_400_000))
  const day = date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone,
  })
  if (key(date) === today) return `Today · ${day}`
  if (key(date) === yesterday) return `Yesterday · ${day}`
  return day
}

export function ActivityList({ entries }: { entries: ActivityEntry[] }) {
  const local = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  )

  if (entries.length === 0) {
    return (
      <EmptyState
        icon={Route}
        title="No activity yet"
        actions={
          <Link href="/path" className={buttonVariants({ size: "lg" })}>
            Open the learning path
          </Link>
        }
      >
        Finish your first lesson and it shows up here, with a link to practise
        it again.
      </EmptyState>
    )
  }

  const groups: { label: string; items: ActivityEntry[] }[] = []
  for (const entry of entries) {
    const label = dayLabel(entry.at, local)
    const last = groups.at(-1)
    if (last?.label === label) last.items.push(entry)
    else groups.push({ label, items: [entry] })
  }

  return (
    <div className="mt-6 flex flex-col gap-8">
      {groups.map((group) => (
        <section key={group.label} aria-label={group.label}>
          <h2 className="text-sm font-semibold text-secondary-text">
            {group.label}
          </h2>
          <ul className="mt-2 border-t border-border">
            {group.items.map((entry) => (
              <li
                key={entry.id}
                className="flex items-center gap-4 border-b border-border-subtle py-3.5"
              >
                <span
                  aria-hidden="true"
                  className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary-subtle text-primary-text"
                >
                  <Route className="size-[18px]" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{entry.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {entry.detail}
                  </p>
                </div>
                <Link
                  href={entry.href}
                  className="shrink-0 text-sm font-semibold text-primary-text underline underline-offset-[3px]"
                >
                  {entry.status === "completed" ? "Practise again" : "Continue"}
                  <span className="sr-only">: {entry.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
