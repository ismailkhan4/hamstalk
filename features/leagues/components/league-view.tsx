"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"

import { buttonVariants } from "@/components/ui/button-variants"
import { ACTIVE_COURSE, TARGET_LANG } from "@/content/courses"
import { Mascot } from "@/features/celebrations/mascot"
import { MASCOT_NAME } from "@/features/celebrations/mascot-name"
import { useNow } from "@/features/economy/use-now"

import { divisionName, DIVISIONS, timeLeft, type League } from "../model"
import { DivisionCrest } from "./division-crest"
import { LigaTable } from "./liga-table"
import { ResultCard } from "./result-card"

/** The league page: this week's division and table, last week's result, and how it works. */
export function LeagueView({
  league,
  onResultSeen,
  profileBase,
}: {
  league: League
  onResultSeen: (week: string) => Promise<void> | void
  profileBase?: string
}) {
  const now = useNow(60_000)
  const left = Date.parse(league.endsAt) - now
  const me = league.table.find((row) => row.me)
  const pacers = league.table.some((row) => row.kind === "pacer")

  return (
    <main
      id="main"
      className="mx-auto flex max-w-(--reading-max) flex-col gap-6 px-4 py-8 sm:px-6"
    >
      {league.result && (
        <ResultCard result={league.result} onSeen={onResultSeen} />
      )}

      <header className="flex items-center gap-4">
        <DivisionCrest division={league.division} size={64} />
        <div className="min-w-0">
          <p className="text-sm font-extrabold tracking-wider text-muted-foreground uppercase">
            <span lang={TARGET_LANG}>{ACTIVE_COURSE.phrases.league}</span> ·
            division {league.division} of {DIVISIONS}
          </p>
          <h1
            lang={TARGET_LANG}
            className="font-display text-h1 leading-tight font-semibold"
          >
            {divisionName(league.division)}
          </h1>
          <p className="font-semibold text-secondary-text">
            <span lang={TARGET_LANG}>{ACTIVE_COURSE.phrases.finalWhistle}</span>{" "}
            in {timeLeft(left)}
            {me ? ` · you’re ${me.rank} of ${league.table.length}` : ""}
          </p>
        </div>
      </header>

      {league.joined ? (
        <LigaTable league={league} profileBase={profileBase} />
      ) : (
        <section className="flex flex-col items-center rounded-3xl border-2 border-dashed border-border p-8 text-center">
          <Mascot mood="thinking" size={96} />
          <h2 className="mt-3 font-display text-xl font-semibold">
            Earn your first XP this week to join a table
          </h2>
          <p className="mt-1 max-w-[46ch] font-semibold text-muted-foreground">
            Any lesson or review counts. You’ll be placed with other learners in{" "}
            <span lang={TARGET_LANG}>{divisionName(league.division)}</span>, and
            your XP this week decides where you finish.
          </p>
          <Link
            href="/home"
            className={buttonVariants({ size: "lg", className: "mt-5" })}
          >
            Start a lesson
            <ArrowRight aria-hidden="true" />
          </Link>
        </section>
      )}

      <section
        aria-labelledby="how-league"
        className="rounded-3xl bg-background-subtle p-5"
      >
        <h2 id="how-league" className="font-display text-lg font-semibold">
          How the <span lang={TARGET_LANG}>{ACTIVE_COURSE.phrases.league}</span>{" "}
          works
        </h2>
        <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-5 text-sm font-semibold text-secondary-text">
          <li>
            Every week is a season: Monday to Sunday, and {MASCOT_NAME} blows
            the final whistle at midnight UTC.
          </li>
          <li>
            The XP you earn this week are your points. The top places move up a
            division, the bottom places move down.
          </li>
          <li>
            Ten divisions, from{" "}
            <span lang={TARGET_LANG}>{divisionName(1)}</span> up to the{" "}
            <span lang={TARGET_LANG}>{divisionName(DIVISIONS)}</span>.
          </li>
          {pacers && (
            <li>
              While a table has few learners, characters from your course team
              fill the empty places and earn XP at a steady pace. They’re always
              marked as team characters, never real people.
            </li>
          )}
        </ul>
      </section>
    </main>
  )
}
