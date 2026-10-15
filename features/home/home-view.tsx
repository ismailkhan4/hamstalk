import { Suspense } from "react"

import { ACTIVE_COURSE, TARGET_LANG } from "@/content/courses"
import { AppShell } from "@/components/layout/app-shell"
import { isLessonAvailable } from "@/content/courses/de/availability"
import { HowItWorks, PathStrip, PlanPanel, TeamCard } from "./home-panels"
import { MissionCard } from "./mission-card"
import { dayAtCompany } from "@/features/learner/day-at-company"
import type { Learner } from "@/features/learner/load-learner"
import { isPreviewLevel } from "@/features/onboarding/plan"
import { currentUnitNumber, homeLevel, nextLesson } from "@/features/path/model"
import { TodayPanel } from "@/features/streaks/components/today-panel"

type HomeViewProps = Pick<
  Learner,
  "name" | "firstName" | "preferences" | "progress"
> & { email: string; counts?: Learner["counts"] }

export function HomeView({
  name,
  firstName,
  email,
  preferences,
  progress,
  counts,
}: HomeViewProps) {
  const next = nextLesson(preferences.startLevel, progress)
  const currentUnit = currentUnitNumber(preferences.startLevel, progress)
  const preview = preferences.startLevel
    ? isPreviewLevel(preferences.startLevel)
    : false
  const level = homeLevel(preferences.startLevel)
  const nothingDone = progress.length === 0
  const nextOpen = next ? isLessonAvailable(next.lesson.id) : false

  const message = !next
    ? "You’ve finished every lesson that exists so far."
    : nothingDone && nextOpen
      ? `Welcome to the team. Your first mission takes about ${next.lesson.minutes} minutes.`
      : nothingDone
        ? "Welcome to the team. Your first lessons are being built and open here as soon as they’re ready."
        : next.resumeAt !== null
          ? `Welcome back. ${next.lesson.title} is saved at exercise ${next.resumeAt + 1}.`
          : `Next: ${next.lesson.goal.charAt(0).toLowerCase()}${next.lesson.goal.slice(1)}.`

  return (
    <AppShell name={name} email={email} counts={counts}>
      <main
        id="main"
        className="mx-auto grid max-w-(--content-max) gap-10 px-4 py-8 sm:px-6 lg:px-10 xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-12"
      >
        <div className="flex min-w-0 flex-col gap-6">
          <header className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Day {dayAtCompany(preferences.startedAt)} at Kaffeesatz GmbH
              </p>
              <h1
                lang={TARGET_LANG}
                className="mt-1 font-voice text-[clamp(40px,4.5vw,56px)] leading-tight"
              >
                {ACTIVE_COURSE.phrases.greeting(firstName)}
              </h1>
              <p className="mt-2 max-w-[56ch] text-body-lg text-secondary-text">
                {message}
              </p>
            </div>
            <span className="rounded-lg bg-level-a1-subtle px-3 py-2 text-sm font-bold text-level-a1">
              {preview
                ? `${level} · preview`
                : `A1 · Unit ${Math.min(currentUnit, 8)}`}
            </span>
          </header>
          {preview && (
            <p className="rounded-xl border border-info-border bg-info-subtle p-4 text-sm text-info-text">
              Lessons at {level} are planned but not built yet. Until they are,
              you can start with A1 Unit 1, or look at your {level} path as a
              preview.
            </p>
          )}
          <Suspense fallback={null}>
            <TodayPanel />
          </Suspense>
          {next && (
            <MissionCard
              next={next}
              missionNumber={
                preferences.startLevel === "beginner" && next.unit.number === 1
                  ? next.index + 1
                  : null
              }
              firstName={firstName}
            />
          )}
          <TeamCard name={name} />
        </div>
        <aside
          className="flex flex-col gap-8 xl:border-l xl:border-border-subtle xl:pl-8"
          aria-label="Your plan and path"
        >
          <PlanPanel preferences={preferences} />
          <HowItWorks />
          <PathStrip currentUnit={currentUnit} />
        </aside>
      </main>
    </AppShell>
  )
}
