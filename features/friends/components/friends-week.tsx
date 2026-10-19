"use client"

import { BellRing, Flame } from "lucide-react"
import Link from "next/link"
import { useState, useTransition } from "react"

import { Button } from "@/components/ui/button"
import { MASCOT_NAME } from "@/features/celebrations/mascot-name"
import { cn } from "@/lib/utils"

import { nudgeAction, type NudgeOutcome } from "../actions"
import type { FriendWeek } from "../model"
import { FriendSearch } from "./friend-search"
import { InitialsBadge } from "./initials-badge"
import { ShareProfile } from "./share-profile"

/**
 * The league page's friends table: you and everyone you follow, by XP this week. Friends who follow
 * you back and haven't practised today can be nudged.
 */
export function FriendsWeek({
  rows,
  myHandle,
  onNudge = nudgeAction,
}: {
  rows: FriendWeek[]
  myHandle: string | null
  /** The real action, or a stand-in for previews. */
  onNudge?: (handle: string) => Promise<NudgeOutcome>
}) {
  const friends = rows.filter((row) => !row.me).length

  return (
    <section
      id="friends"
      aria-labelledby="friends-title"
      className="flex scroll-mt-20 flex-col gap-4 rounded-3xl border-2 border-border bg-card p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="friends-title" className="font-display text-xl font-semibold">
          Friends this week
        </h2>
        {myHandle && <ShareProfile handle={myHandle} variant="secondary" />}
      </div>

      {friends === 0 ? (
        <p className="font-semibold text-muted-foreground">
          Follow learners to race them here every week. Share your profile link
          with a colleague, or search for them below.
        </p>
      ) : (
        <ol className="flex flex-col">
          {rows.map((row, i) => (
            <FriendRow
              key={row.handle}
              row={row}
              place={i + 1}
              onNudge={onNudge}
            />
          ))}
        </ol>
      )}

      <div className="border-t-2 border-border-subtle pt-4">
        <FriendSearch />
      </div>
    </section>
  )
}

function FriendRow({
  row,
  place,
  onNudge,
}: {
  row: FriendWeek
  place: number
  onNudge: (handle: string) => Promise<NudgeOutcome>
}) {
  const [message, setMessage] = useState<string | null>(null)
  const [nudged, setNudged] = useState(false)
  const [pending, startTransition] = useTransition()

  function nudge() {
    startTransition(async () => {
      const outcome = await onNudge(row.handle)
      setNudged(true)
      setMessage(outcome.message)
    })
  }

  return (
    <li
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-border-subtle py-2.5 last:border-b-0",
        row.me && "-mx-2 rounded-xl bg-primary-subtle px-2"
      )}
    >
      <span className="w-6 font-display text-lg font-semibold tabular-nums">
        {place}
      </span>
      <InitialsBadge name={row.displayName} me={row.me} />
      <span className="min-w-0 flex-1">
        {row.me ? (
          <span className="block truncate font-bold">
            {row.displayName}
            <span className="ml-1.5 rounded-md bg-primary px-1.5 py-0.5 text-[0.7rem] font-extrabold text-primary-foreground">
              You
            </span>
          </span>
        ) : (
          <Link
            href={`/u/${row.handle}`}
            className="block truncate font-bold hover:underline"
          >
            {row.displayName}
          </Link>
        )}
        <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
          <Flame
            aria-hidden="true"
            className={cn("size-3.5", row.streak > 0 && "text-spark-text")}
          />
          {row.streak}-day streak
          {!row.practisedToday && !row.me && " · not yet today"}
        </span>
      </span>
      <span className="font-display text-lg font-semibold tabular-nums">
        {row.xp.toLocaleString("en")} XP
      </span>
      {row.canNudge && !nudged && (
        // Its own line on phones, so the name keeps its room; beside the XP from sm up.
        <span className="order-last w-full pl-[4.25rem] sm:order-none sm:w-auto sm:pl-0">
          <Button
            size="sm"
            variant="secondary"
            iconLeft={<BellRing />}
            loading={pending}
            aria-label={`Nudge ${row.displayName}`}
            title={`${MASCOT_NAME} sends them a reminder from you`}
            onClick={nudge}
          >
            Nudge
          </Button>
        </span>
      )}
      {message && (
        <p
          role="status"
          className="order-last w-full pl-[4.25rem] text-sm font-semibold text-secondary-text"
        >
          {message}
        </p>
      )}
    </li>
  )
}
