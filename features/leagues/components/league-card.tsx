import { ArrowRight } from "lucide-react"
import Link from "next/link"

import { ACTIVE_COURSE, TARGET_LANG } from "@/content/courses"

import { divisionName, zoneOf, type League } from "../model"
import { DivisionCrest } from "./division-crest"

/** Home's glance at the league: division, place and what it means right now. */
export function LeagueCard({ league }: { league: League }) {
  const me = league.table.find((row) => row.me)
  const size = league.table.length
  const zone = me ? zoneOf(me.rank, size, league) : null
  const status = league.result
    ? "Last week’s result is in. Open the league to see it."
    : !me
      ? "Earn XP this week to join a table."
      : zone === "promotion"
        ? `You’re ${me.rank} of ${size}: in the promotion places.`
        : zone === "relegation"
          ? `You’re ${me.rank} of ${size}: a lesson or two gets you clear.`
          : `You’re ${me.rank} of ${size}.${league.promote > 0 ? ` The top ${league.promote} go up.` : ""}`

  return (
    <Link
      href="/league"
      className="flex items-center gap-4 rounded-3xl border-2 border-border bg-card p-4 shadow-[0_4px_0_var(--border)] hover:bg-background-subtle"
    >
      <DivisionCrest division={league.division} size={44} />
      <div className="min-w-0 flex-1">
        <p className="font-display text-lg font-semibold">
          <span lang={TARGET_LANG}>{divisionName(league.division)}</span>
          <span className="sr-only"> · {ACTIVE_COURSE.phrases.league}</span>
        </p>
        <p className="text-sm font-semibold text-secondary-text">{status}</p>
      </div>
      <span className="text-right">
        <span className="block font-display text-xl font-semibold tabular-nums">
          {league.xp.toLocaleString("en")}
        </span>
        <span className="text-xs font-bold text-muted-foreground">
          XP this week
        </span>
      </span>
      <ArrowRight
        aria-hidden="true"
        className="size-5 shrink-0 text-muted-foreground"
      />
    </Link>
  )
}
