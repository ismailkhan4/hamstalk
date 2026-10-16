import { ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"

import { Avatar, type Person } from "@/components/learning/avatar"
import { initialsFor } from "@/components/learning/team-badge"
import { cn } from "@/lib/utils"

import { pacerOf, zoneOf, type League } from "../model"

/**
 * The week's table, like a football league table: place, learner, points (XP). The promotion places
 * sit above a line, the relegation places below one. Team characters pacing a small table say so
 * on their row.
 */
export function LigaTable({
  league,
  profileBase = "/u/",
}: {
  league: League
  /** Where a learner's profile lives: the handle is appended. */
  profileBase?: string
}) {
  const size = league.table.length
  const lastUp = league.promote
  const firstDown = size - league.relegate + 1

  return (
    <div className="overflow-hidden rounded-3xl border-2 border-border bg-card">
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">
          This week’s table, {size} places. The top {league.promote} move up
          {league.relegate > 0
            ? `, the bottom ${league.relegate} move down`
            : ""}
          .
        </caption>
        <thead>
          <tr className="border-b-2 border-border-subtle bg-background-subtle text-xs font-extrabold tracking-wider text-muted-foreground uppercase">
            <th scope="col" className="w-14 py-2 pl-4">
              Pl.
            </th>
            <th scope="col" className="py-2">
              Learner
            </th>
            <th scope="col" className="py-2 pr-4 text-right">
              XP
            </th>
          </tr>
        </thead>
        <tbody>
          {league.table.map((row) => {
            const zone = zoneOf(row.rank, size, league)
            const pacer = row.kind === "pacer" ? pacerOf(row.ref) : null
            const name = pacer?.name ?? row.name ?? "Learner"
            return (
              <tr
                key={`${row.kind}-${row.ref ?? row.name}-${row.rank}`}
                className={cn(
                  "border-b border-border-subtle last:border-b-0",
                  row.me && "bg-primary-subtle",
                  // The lines under the last promotion place and above the first relegation place.
                  row.rank === lastUp &&
                    lastUp < size &&
                    "border-b-2 border-b-success-border",
                  row.rank === firstDown - 1 &&
                    league.relegate > 0 &&
                    "border-b-2 border-b-danger-border"
                )}
              >
                <td className="py-2.5 pl-4">
                  <span
                    className={cn(
                      "inline-flex items-center gap-0.5 font-display text-lg font-semibold tabular-nums",
                      zone === "promotion" && "text-success-text",
                      zone === "relegation" && "text-danger-text"
                    )}
                  >
                    {row.rank}
                    {zone === "promotion" && (
                      <ChevronUp
                        aria-label="promotion place"
                        className="size-4"
                        strokeWidth={3}
                      />
                    )}
                    {zone === "relegation" && (
                      <ChevronDown
                        aria-label="relegation place"
                        className="size-4"
                        strokeWidth={3}
                      />
                    )}
                  </span>
                </td>
                <td className="py-2.5">
                  <span className="flex min-w-0 items-center gap-2.5">
                    {pacer ? (
                      <Avatar
                        person={pacer.id as Person}
                        initials={pacer.initials}
                        size="sm"
                      />
                    ) : (
                      <span
                        aria-hidden="true"
                        className={cn(
                          "grid size-8 shrink-0 place-items-center rounded-full text-xs font-bold",
                          row.me
                            ? "bg-(--person-me) text-(--person-me-foreground)"
                            : "bg-muted text-secondary-text"
                        )}
                      >
                        {initialsFor(name)}
                      </span>
                    )}
                    <span className="min-w-0">
                      {row.kind === "learner" && row.ref && !row.me ? (
                        <Link
                          href={`${profileBase}${row.ref}`}
                          className="block truncate font-bold hover:underline"
                        >
                          {name}
                        </Link>
                      ) : (
                        <span className="block truncate font-bold">
                          {name}
                          {row.me && (
                            <span className="ml-1.5 rounded-md bg-primary px-1.5 py-0.5 text-[0.7rem] font-extrabold text-primary-foreground">
                              You
                            </span>
                          )}
                        </span>
                      )}
                      {pacer && (
                        <span className="block truncate text-xs font-semibold text-muted-foreground">
                          Team character · {pacer.role}
                        </span>
                      )}
                    </span>
                  </span>
                </td>
                <td className="py-2.5 pr-4 text-right font-display text-lg font-semibold tabular-nums">
                  {row.xp.toLocaleString("en")}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
