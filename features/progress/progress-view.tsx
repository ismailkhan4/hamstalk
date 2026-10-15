import Link from "next/link"
import { Suspense } from "react"

import { AppShell } from "@/components/layout/app-shell"
import { getLevel, levels } from "@/content/curriculum"
import {
  ActivityList,
  type ActivityEntry,
} from "@/features/activity/activity-list"
import { levelOptions, type StartLevel } from "@/features/onboarding/options"
import {
  completedUnitCount,
  currentUnitNumber,
  isUnitCompleted,
  type LessonProgress,
} from "@/features/path/model"
import type { NotebookCounts } from "@/features/review/data"
import { StreakSection } from "@/features/streaks/components/streak-section"
import { cn } from "@/lib/utils"

import type { ProgressFacts } from "./data"
import { strengthTotal } from "./model"
import { WeekChart } from "./week-chart"

type Props = {
  name: string
  email: string
  counts: NotebookCounts
  startLevel: StartLevel | null
  progress: LessonProgress[]
  facts: ProgressFacts
  activity: ActivityEntry[]
}

function Stat({
  label,
  value,
  of,
}: {
  label: string
  value: number
  of?: string
}) {
  return (
    <div>
      <dt className="text-[0.8125rem] text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-display text-3xl font-bold">
        {value}
        {of && (
          <span className="ml-1 font-sans text-sm font-normal text-muted-foreground">
            {of}
          </span>
        )}
      </dd>
    </div>
  )
}

export function ProgressView({
  name,
  email,
  counts,
  startLevel,
  progress,
  facts,
  activity,
}: Props) {
  const a1 = getLevel("A1")
  const doneUnits = completedUnitCount("A1", progress)
  const currentUnit = currentUnitNumber(startLevel, progress)
  const lessonsDone = progress.filter(
    (entry) => entry.status === "completed"
  ).length
  const wordTotal = strengthTotal(facts.strengths)

  const strengthRows = [
    { label: "Needs practice", bars: "1 bar", value: facts.strengths.weak },
    { label: "Getting there", bars: "2 bars", value: facts.strengths.medium },
    { label: "Solid", bars: "3 bars", value: facts.strengths.strong },
  ]

  return (
    <AppShell name={name} email={email} counts={counts}>
      <main
        id="main"
        className="mx-auto max-w-(--content-max) px-4 py-8 sm:px-6 lg:px-10"
      >
        <h1 className="font-display text-h1 font-bold">Progress</h1>
        <p className="mt-2 max-w-[62ch] text-body-lg text-secondary-text">
          What you’ve practised and what you can already do. Course progress and
          your actual level are shown separately on purpose.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <section
            aria-labelledby="course"
            className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"
          >
            <p className="text-sm text-muted-foreground">
              Course progress · A1 {a1.name}
            </p>
            <h2 id="course" className="mt-1 font-display text-h2 font-bold">
              {doneUnits} of {a1.units.length} units completed
            </h2>
            <ol aria-label="A1 units" className="mt-5 grid grid-cols-8 gap-1.5">
              {a1.units.map((unit) => {
                const done = isUnitCompleted(unit, progress)
                const current = !done && unit.number === currentUnit
                return (
                  <li
                    key={unit.id}
                    className="flex flex-col items-center gap-1"
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "h-2 w-full rounded-full bg-muted",
                        done && "bg-primary",
                        current && "bg-spark"
                      )}
                    />
                    <span className="text-xs text-muted-foreground">
                      {unit.number}
                      <span className="sr-only">
                        {done
                          ? ", completed"
                          : current
                            ? ", in progress"
                            : ", not started"}
                      </span>
                    </span>
                  </li>
                )
              })}
            </ol>
            <ul className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {levels.map((level) => (
                <li
                  key={level.code}
                  className={cn(
                    "rounded-lg px-3 py-2.5",
                    level.code === "A1"
                      ? "bg-primary-subtle text-primary-text"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <span className="block font-bold">{level.code}</span>
                  <span className="block text-sm">
                    {level.code === "A1"
                      ? doneUnits === a1.units.length
                        ? "Finished"
                        : "In progress"
                      : "Planned"}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section
            aria-labelledby="level"
            className="rounded-2xl border border-dashed border-input p-5 sm:p-6"
          >
            <p className="text-sm text-muted-foreground">Demonstrated level</p>
            <h2 id="level" className="mt-1 font-display text-h2 font-bold">
              Not assessed yet
            </h2>
            <p className="mt-3 text-secondary-text">
              Only a checkpoint can change your level, never XP, streaks or
              lesson counts. The A1 checkpoint comes after Unit 8, and it isn’t
              built yet, so Klarlingo doesn’t claim a level for you.
            </p>
            {startLevel && (
              <p className="mt-3 text-secondary-text">
                Your self-selected start:{" "}
                <b>{levelOptions[startLevel].title}</b>
              </p>
            )}
          </section>
        </div>

        <dl className="mt-8 grid grid-cols-2 gap-6 border-y border-border py-5 sm:grid-cols-5">
          <Stat label="Lessons completed" value={lessonsDone} />
          <Stat
            label="Units completed"
            value={doneUnits}
            of={`of ${a1.units.length}`}
          />
          <Stat label="Words in review" value={wordTotal} />
          <Stat label="Total XP" value={facts.xp} />
          <Stat label="Standups played" value={facts.standups} />
        </dl>

        <Suspense fallback={null}>
          <div className="mt-10">
            <StreakSection />
          </div>
        </Suspense>

        <section aria-labelledby="recent" className="mt-10">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="recent" className="font-display text-h2 font-bold">
              Recent activity
            </h2>
            <Link
              href="/activity"
              className="text-sm font-semibold text-primary-text underline underline-offset-[3px]"
            >
              See all activity
            </Link>
          </div>
          <ActivityList entries={activity.slice(0, 3)} />
        </section>

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <section aria-labelledby="week">
            <h2 id="week" className="font-display text-h2 font-bold">
              This week
            </h2>
            <div className="mt-3">
              <WeekChart completedAt={facts.completedAt} />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Lessons finished each day this week.
            </p>
          </section>

          <section aria-labelledby="strength">
            <h2 id="strength" className="font-display text-h2 font-bold">
              Vocabulary strength
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              How well you knew each word last time. Practice volume, not a
              level.
            </p>
            {wordTotal === 0 ? (
              <p className="mt-4 text-secondary-text">
                Finish a lesson and its words appear here.
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {strengthRows.map((row) => (
                  <li key={row.label}>
                    <div className="flex items-baseline justify-between text-sm">
                      <span className="font-semibold">
                        {row.label}{" "}
                        <span className="font-normal text-muted-foreground">
                          · {row.bars}
                        </span>
                      </span>
                      <span className="tabular-nums">{row.value}</span>
                    </div>
                    <div
                      aria-hidden="true"
                      className="mt-1 h-2 overflow-hidden rounded-full bg-muted"
                    >
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${(row.value / wordTotal) * 100}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-5 text-sm text-secondary-text">
              Mistakes you’ve learned: <b>{facts.mistakesLearned}</b>
            </p>
          </section>
        </div>
      </main>
    </AppShell>
  )
}
