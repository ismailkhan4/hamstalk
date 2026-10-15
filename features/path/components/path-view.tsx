import { ArrowLeft, Compass } from "lucide-react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { AppShell } from "@/components/layout/app-shell"
import { getLevel, getUnit, levels, type CefrLevel } from "@/content/curriculum"
import type { Learner } from "@/features/learner/load-learner"
import { LevelTabs } from "./level-tabs"
import { PathList } from "./path-list"
import { UnitPanel } from "./unit-panel"
import { completedUnitCount, currentUnitNumber, homeLevel } from "../model"

type PathViewProps = Pick<
  Learner,
  "name" | "firstName" | "preferences" | "progress"
> & {
  email: string
  counts?: Learner["counts"]
  params: { level?: string | string[]; unit?: string | string[] }
  /** Where the path lives, so links stay inside development previews. */
  basePath?: string
}

export function PathView({
  name,
  firstName,
  email,
  preferences,
  progress,
  counts,
  params,
  basePath = "/path",
}: PathViewProps) {
  const home = homeLevel(preferences.startLevel)
  const requested = levels.find(
    (level) => level.code.toLowerCase() === params.level
  )?.code
  const selectedLevel: CefrLevel = requested ?? home
  const level = getLevel(selectedLevel)

  const requestedUnit =
    typeof params.unit === "string" ? getUnit(params.unit) : null
  const current = level.units.find(
    (unit) =>
      unit.number === currentUnitNumber(preferences.startLevel, progress)
  )
  const unit =
    requestedUnit && requestedUnit.level === selectedLevel
      ? requestedUnit
      : (current ?? level.units[0])
  const unitChosen = Boolean(
    requestedUnit && requestedUnit.level === selectedLevel
  )
  const doneUnits = completedUnitCount(selectedLevel, progress)

  return (
    <AppShell name={name} email={email} counts={counts}>
      <main
        id="main"
        className="mx-auto max-w-(--content-max) px-4 py-8 sm:px-6 lg:px-10"
      >
        <h1 className="font-display text-h1 font-bold">Learning path</h1>
        <p className="mt-2 max-w-[62ch] text-body-lg text-secondary-text">
          From your first Hallo to explaining trade-offs. The four levels follow
          the CEFR, and each ends with a checkpoint that shows what you can
          actually do.
        </p>
        <div className="mt-6 max-w-3xl">
          <LevelTabs selected={selectedLevel} home={home} basePath={basePath} />
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,400px)] xl:gap-14">
          <div className={cn("min-w-0", unitChosen && "hidden lg:block")}>
            <h2 className="font-display text-h2 font-bold">
              {level.code} · {level.name}
            </h2>
            <p className="mt-1 text-secondary-text">{level.description}</p>
            <p className="mt-3 text-sm text-muted-foreground">
              {doneUnits} of {level.units.length} units completed
            </p>
            <div
              role="progressbar"
              aria-label={`${level.code} units completed`}
              aria-valuemin={0}
              aria-valuemax={level.units.length}
              aria-valuenow={doneUnits}
              className="mt-2 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-muted"
            >
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${(doneUnits / level.units.length) * 100}%` }}
              />
            </div>

            {selectedLevel !== "A1" ? (
              <p className="mt-6 rounded-xl border border-primary-border bg-primary-subtle p-4 text-sm text-primary-text">
                <b className="block">Preview</b>
                {selectedLevel === home
                  ? `This is your suggested starting level. ${selectedLevel} lessons are planned but not built yet, so nothing here can be started. A1 lessons open first.`
                  : `${selectedLevel} lessons are planned but not built yet. This shows what the level will cover.`}
              </p>
            ) : (
              <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-dashed border-input p-4 text-sm">
                <Compass
                  aria-hidden="true"
                  className="size-4 text-primary-text"
                />
                Not sure A1 is the right place for you?
                <Link
                  href="/placement"
                  className="font-semibold text-primary-text underline underline-offset-[3px]"
                >
                  Take the 6-minute placement check
                </Link>
              </p>
            )}

            <div className="mt-6">
              <PathList
                level={level}
                startLevel={preferences.startLevel}
                progress={progress}
                selectedUnitId={unit?.id ?? null}
                basePath={basePath}
              />
            </div>
          </div>
          {unit && (
            <div
              className={cn(
                "lg:sticky lg:top-6 lg:block lg:self-start",
                !unitChosen && "hidden"
              )}
            >
              <Link
                href={`${basePath}?level=${selectedLevel.toLowerCase()}`}
                className="mb-4 inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-semibold text-secondary-text hover:text-foreground lg:hidden"
              >
                <ArrowLeft aria-hidden="true" className="size-[18px]" />
                Learning path
              </Link>
              <UnitPanel
                unit={unit}
                level={preferences.startLevel}
                progress={progress}
                firstName={firstName}
              />
            </div>
          )}
        </div>
      </main>
    </AppShell>
  )
}
