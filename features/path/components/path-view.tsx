import { Compass } from "lucide-react"
import Link from "next/link"

import { AppShell } from "@/components/layout/app-shell"
import {
  getLevel,
  getUnit,
  levels,
  type CefrLevel,
} from "@/content/courses/de/curriculum"
import type { Learner } from "@/features/learner/load-learner"

import { completedUnitCount, homeLevel, nextLesson } from "../model"
import { transitLine } from "../transit"
import { LevelTabs } from "./level-tabs"
import { LineLegend } from "./line-legend"
import { LINE_COLOR, TransitLine } from "./transit-line"

type PathViewProps = Pick<Learner, "name" | "preferences" | "progress"> & {
  email: string
  counts?: Learner["counts"]
  completedStandups: string[]
  params: { level?: string | string[]; unit?: string | string[] }
  /** Where the path lives, so links stay inside development previews. */
  basePath?: string
}

/** The learning path as a line map: one line per level, the learner's station marked. */
export function PathView({
  name,
  email,
  preferences,
  progress,
  counts,
  completedStandups,
  params,
  basePath = "/path",
}: PathViewProps) {
  const home = homeLevel(preferences.startLevel)
  // An older link may name a unit instead of a level: open that unit's line.
  const linkedUnit =
    typeof params.unit === "string" ? getUnit(params.unit) : null
  const requested = levels.find(
    (level) => level.code.toLowerCase() === params.level
  )?.code
  const selectedLevel: CefrLevel = requested ?? linkedUnit?.level ?? home
  const level = getLevel(selectedLevel)
  const line = transitLine(
    selectedLevel,
    preferences.startLevel,
    progress,
    completedStandups
  )
  const next = nextLesson(preferences.startLevel, progress)
  const doneUnits = completedUnitCount(selectedLevel, progress)

  return (
    <AppShell name={name} email={email} counts={counts}>
      <main
        id="main"
        className="mx-auto max-w-(--content-max) px-4 py-8 sm:px-6 lg:px-10"
      >
        <h1 className="font-display text-h1 font-semibold">Learning path</h1>
        <p className="mt-2 max-w-[62ch] text-body-lg font-semibold text-secondary-text">
          Your route from the first Hallo to B2. Each level is a line, each
          lesson a station, and every unit ends at the team standup.
        </p>
        <div className="mt-6 max-w-3xl">
          <LevelTabs selected={selectedLevel} home={home} basePath={basePath} />
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)] xl:gap-14">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <span
                aria-hidden="true"
                className="grid h-9 min-w-12 place-items-center rounded-lg px-2 font-display text-lg font-semibold text-[#1d2b33]"
                style={{ background: LINE_COLOR[selectedLevel] }}
              >
                U{line.number}
              </span>
              <h2 className="font-display text-h2 font-semibold">
                {level.code} · {level.name}
              </h2>
            </div>
            <p className="mt-2 font-semibold text-secondary-text">
              {level.description}
            </p>
            <p className="mt-2 text-sm font-bold text-muted-foreground">
              {doneUnits} of {level.units.length} units completed
            </p>

            {selectedLevel !== "A1" && (
              <p className="mt-5 rounded-2xl border-2 border-primary-border bg-primary-subtle p-4 text-sm font-semibold text-primary-text">
                <b className="block">Preview</b>
                {selectedLevel === home
                  ? `This is your suggested starting level. ${selectedLevel} lessons are planned but not built yet, so its line is still under construction. A1 lessons open first.`
                  : `${selectedLevel} lessons are planned but not built yet. This shows the route the line will take.`}
              </p>
            )}

            <div className="mt-4">
              <TransitLine
                line={line}
                resumeAt={next?.resumeAt ?? null}
                guideHref={(unitId) => `${basePath}/guide/${unitId}`}
              />
            </div>
          </div>

          <aside className="flex flex-col gap-6 lg:sticky lg:top-6 lg:self-start">
            <LineLegend level={selectedLevel} />
            {selectedLevel === "A1" && (
              <p className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-2xl border-2 border-dashed border-input p-4 text-sm font-semibold">
                <Compass
                  aria-hidden="true"
                  className="size-4 text-primary-text"
                />
                Not sure A1 is your stop?
                <Link
                  href="/placement"
                  className="font-extrabold text-primary-text underline underline-offset-[3px]"
                >
                  Take the 6-minute placement check
                </Link>
              </p>
            )}
          </aside>
        </div>
      </main>
    </AppShell>
  )
}
