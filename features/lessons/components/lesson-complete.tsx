"use client"

import { ACTIVE_COURSE, TARGET_LANG } from "@/content/courses"
import {
  Check as CheckIcon,
  CircleCheck,
  Clock,
  GitMerge,
  Info,
  NotebookPen,
  Star,
  Target,
  Zap,
  type LucideIcon,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

import { Alert } from "@/components/feedback/alert"
import { TargetText } from "@/components/learning/target-text"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button-variants"
import { celebrate } from "@/features/celebrations/confetti"
import { CountUp } from "@/features/celebrations/count-up"
import { playFeedback } from "@/features/celebrations/feedback"
import { StashSummary } from "@/features/economy/components/stash-summary"
import { Mascot } from "@/features/celebrations/mascot"
import { MASCOT_NAME } from "@/features/celebrations/mascot-name"
import { isCelebration, type Rewards } from "@/features/rewards/payload"
import { StreakCelebration } from "@/features/streaks/components/streak-celebration"
import { cn } from "@/lib/utils"

import type { LessonSummary } from "../engine/session"
import type { Lesson } from "../schema"
import { ticketId } from "../ticket"

export type UpNext = {
  href: string | null
  kicker: string
  title: string
  titleInTarget: boolean
  minutes: number | null
  ctaLabel: string
}

type LessonCompleteProps = {
  lesson: Lesson
  summary: LessonSummary
  minutes: number
  /** The longest run of answers right first time. */
  bestCombo: number
  /** What the server awarded, once it has answered. Null while saving or if XP couldn't be saved. */
  rewards: Rewards | null
  mistakeCount: number
  replay: boolean
  /** What happens after this one, decided by the path rules. Null when nothing is next yet. */
  upNext: UpNext | null
  unitProgress: {
    number: number
    done: number
    total: number
    title: string
  } | null
  /** Where "Back to learning path" goes. */
  pathHref: string
  saveProblem: string | null
  saving: boolean
  onRetrySave: () => void
  /** Asks about reminders after a first-time lesson; rendered by the page. */
  reminderPrompt?: React.ReactNode
  /** A practice session, and for an Express run whether it passed (null while saving). */
  practice?: {
    kind: "smart" | "mistakes" | "express"
    unitNumber?: number
    passed: boolean | null
  }
}

export function LessonComplete({
  lesson,
  summary,
  minutes,
  bestCombo,
  rewards,
  mistakeCount,
  replay,
  upNext,
  unitProgress,
  pathHref,
  saveProblem,
  saving,
  onRetrySave,
  reminderPrompt,
  practice,
}: LessonCompleteProps) {
  const review = lesson.kind === "review"
  const perfect = summary.graded > 0 && summary.firstTry === summary.graded
  const accuracy =
    summary.graded > 0
      ? Math.round((summary.firstTry / summary.graded) * 100)
      : 100

  // The moment of the lesson: fanfare and confetti, once.
  const celebrated = useRef(false)
  useEffect(() => {
    if (celebrated.current) return
    celebrated.current = true
    playFeedback(perfect && !replay ? "perfect" : "complete")
    celebrate(replay ? "small" : "big")
  }, [perfect, replay])

  // The streak takes over once the summary has had its moment, and Continue hands it back.
  const [streakOpen, setStreakOpen] = useState(false)
  const [streakSeen, setStreakSeen] = useState(false)
  const shownAt = useRef(0)
  useEffect(() => {
    shownAt.current = performance.now()
  }, [])
  useEffect(() => {
    if (!isCelebration(rewards) || streakSeen) return
    const wait = Math.max(0, 1400 - (performance.now() - shownAt.current))
    const timer = setTimeout(() => setStreakOpen(true), wait)
    return () => clearTimeout(timer)
  }, [rewards, streakSeen])

  // Before the server answers, show what this lesson should earn; then exactly what it did.
  const expectedXp = replay ? 10 : summary.xp + (perfect ? 10 : 0)
  const boosted = rewards?.boosted ?? 0
  const xp = (rewards?.awarded ?? expectedXp) + boosted

  return (
    <main
      id="main"
      className="mx-auto w-full max-w-(--lesson-max) flex-1 px-[clamp(20px,4vw,32px)] py-10 pb-16"
    >
      <div className="flex flex-col items-center text-center">
        <Mascot
          mood={perfect ? "cheer" : "dance"}
          size={132}
          className="motion-safe:animate-pop"
        />
        <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1 text-sm font-extrabold text-primary-foreground motion-safe:animate-pop">
          <GitMerge aria-hidden="true" className="size-4" strokeWidth={3} />
          Merged
          <span className="font-mono text-xs opacity-80">
            {ticketId(lesson.id)}
          </span>
        </p>
        {/* Entrances are CSS, so reduced motion applies from the first paint, before any script. */}
        <h1
          lang={TARGET_LANG}
          style={{ animationDelay: "150ms" }}
          className="mt-3 font-display text-[clamp(36px,6vw,52px)] leading-tight font-semibold text-primary-text motion-safe:animate-rise"
        >
          {review
            ? ACTIVE_COURSE.phrases.reviewDone
            : ACTIVE_COURSE.phrases.lessonDone}
        </h1>
        <p className="mt-1 text-lg font-semibold text-secondary-text">
          {practice
            ? "Practice complete"
            : review
              ? "Review complete"
              : "Lesson complete"}
          : {lesson.title}
        </p>
      </div>

      {saveProblem && (
        <Alert
          tone="warning"
          title="Your progress isn’t saved yet"
          className="mt-8"
          action={
            <Button
              size="sm"
              variant="outline"
              loading={saving}
              onClick={onRetrySave}
            >
              Try saving again
            </Button>
          }
        >
          {saveProblem} XP and the next lesson stay available; nothing is taken
          away.
        </Alert>
      )}

      <section
        aria-labelledby="checks-title"
        className="mt-8 overflow-hidden rounded-3xl border-2 border-border bg-card shadow-[0_4px_0_var(--border)] motion-safe:animate-rise"
        style={{ animationDelay: "300ms" }}
      >
        <header className="flex flex-wrap items-center gap-x-2 gap-y-1 border-b-2 border-border-subtle bg-background-subtle py-2 pr-4 pl-2">
          <Mascot mood="happy" size={36} />
          <p className="text-sm">
            <b className="font-extrabold">{MASCOT_NAME}</b>{" "}
            <span className="font-semibold text-muted-foreground">
              approved these changes
            </span>
          </p>
          {perfect && (
            <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-reward px-2.5 py-0.5 text-xs font-extrabold text-reward-foreground">
              <Star aria-hidden="true" className="size-3.5 fill-current" />
              <span lang={TARGET_LANG}>Perfekt!</span> No changes requested
            </span>
          )}
        </header>
        <h2 id="checks-title" className="sr-only">
          Checks
        </h2>
        <dl className="divide-y-2 divide-border-subtle">
          <Check label="XP earned" icon={Zap} tone="reward">
            <CountUp key={xp} to={xp} prefix="+" /> XP
            {boosted > 0 ? (
              <span className="ml-2 text-xs font-bold text-reward-text">
                doubled
              </span>
            ) : (
              !replay &&
              perfect && (
                <span className="ml-2 text-xs font-bold text-muted-foreground">
                  incl. +10 perfect
                </span>
              )
            )}
          </Check>
          <Check label="Right first time" icon={Target} tone="primary">
            {summary.firstTry}/{summary.graded}
            <span className="ml-1.5 text-sm font-bold text-muted-foreground">
              (<CountUp to={accuracy} delay={0.35} />
              %)
            </span>
          </Check>
          <Check label="Best build streak" icon={CircleCheck} tone="primary">
            {bestCombo} green
          </Check>
          <Check label="Time" icon={Clock} tone="info">
            {minutes} min
          </Check>
        </dl>
        <p className="flex items-center gap-2 border-t-2 border-success-border bg-success-subtle px-4 py-2.5 text-sm font-extrabold text-success-text">
          <CircleCheck aria-hidden="true" className="size-4" strokeWidth={3} />
          All checks have passed
        </p>
      </section>
      {practice?.kind === "express" && practice.passed !== null && (
        <section
          aria-live="polite"
          className={cn(
            "mt-6 flex items-center gap-4 rounded-3xl border-2 p-5 motion-safe:animate-rise",
            practice.passed
              ? "border-reward-border bg-reward-subtle"
              : "border-border bg-card"
          )}
        >
          <Mascot mood={practice.passed ? "cheer" : "thinking"} size={64} />
          <div>
            <h2 className="font-display text-xl font-semibold">
              {practice.passed ? "Express passed!" : "Not this time"}
            </h2>
            <p className="font-semibold text-secondary-text">
              {practice.passed
                ? `Unit ${practice.unitNumber ?? ""} now runs on a gold line on your map.`
                : "You need 8 of 10 right first time. Ride it again whenever you like."}
            </p>
          </div>
        </section>
      )}
      <StashSummary
        rewards={rewards}
        className="mt-6 motion-safe:animate-rise"
        style={{ animationDelay: "450ms" }}
      />
      {!replay && reminderPrompt}
      {replay && (
        <p className="mt-2 text-sm text-muted-foreground">
          Replays earn 10 practice XP, once a day per lesson.
        </p>
      )}

      {review ? (
        <section aria-labelledby="by-lesson" className="mt-8">
          <h2 id="by-lesson" className="font-semibold">
            How each lesson went
          </h2>
          <ul className="mt-3 flex flex-col gap-3">
            {summary.byLesson.map((item) => {
              const strong = item.total > 0 && item.firstTry === item.total
              return (
                <li
                  key={item.lessonId}
                  className="rounded-xl border border-border bg-card p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">
                        {item.label} · <TargetText>{item.title}</TargetText>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.firstTry} of {item.total} right first time
                      </p>
                    </div>
                    <Badge tone={strong ? "success" : "warning"}>
                      {strong ? "Right first time" : "Worth another look"}
                    </Badge>
                  </div>
                </li>
              )
            })}
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">
            Based only on your answers in this review. It isn’t a score, a pass
            mark or a CEFR level.
          </p>
        </section>
      ) : (
        <>
          {lesson.canDo.length > 0 && (
            <section aria-labelledby="can-now" className="mt-8">
              <h2 id="can-now" className="font-semibold">
                You can now
              </h2>
              <ul className="mt-3 flex flex-col gap-2">
                {lesson.canDo.map((item) => (
                  <li key={item} className="flex gap-3">
                    <CheckIcon
                      aria-hidden="true"
                      className="mt-1 size-4 shrink-0 text-primary-text"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}
          {lesson.practised.length > 0 && (
            <section aria-labelledby="practised" className="mt-8">
              <h2 id="practised" className="font-semibold">
                Phrases you practised
              </h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {lesson.practised.map((phrase) => (
                  <li
                    key={phrase}
                    className="rounded-lg bg-card px-3 py-1.5 shadow-[inset_0_0_0_1px_var(--border)]"
                  >
                    <TargetText className="text-lg">{phrase}</TargetText>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}

      {mistakeCount > 0 && (
        <p className="mt-6 flex items-center gap-2 text-[0.9375rem] text-secondary-text">
          <NotebookPen
            aria-hidden="true"
            className="size-4 text-muted-foreground"
          />
          {mistakeCount === 1
            ? "1 mistake from this"
            : `${mistakeCount} mistakes from this`}{" "}
          {review ? "review" : "lesson"} {mistakeCount === 1 ? "is" : "are"}{" "}
          saved to your mistakes notebook.
        </p>
      )}

      {unitProgress && !review && (
        <section aria-label="Unit progress" className="mt-8">
          <p className="font-semibold">
            Unit {unitProgress.number} · {unitProgress.title}
          </p>
          <div
            role="progressbar"
            aria-label="Lessons done in this unit"
            aria-valuemin={0}
            aria-valuemax={unitProgress.total}
            aria-valuenow={unitProgress.done}
            className="mt-2 flex gap-1"
          >
            {Array.from({ length: unitProgress.total }, (_, i) => (
              <i
                key={i}
                className={cn(
                  "h-3 w-10 rounded-full",
                  i < unitProgress.done ? "bg-primary" : "bg-muted"
                )}
              />
            ))}
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {unitProgress.done} of {unitProgress.total} lessons done
          </p>
        </section>
      )}

      {upNext && (
        <section
          aria-label="Up next"
          className="mt-8 rounded-2xl border-2 border-border bg-card p-4"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-muted-foreground">{upNext.kicker}</p>
              <p
                className="font-semibold"
                lang={upNext.titleInTarget ? TARGET_LANG : undefined}
              >
                {upNext.title}
              </p>
            </div>
            {upNext.minutes && (
              <p className="text-sm text-muted-foreground">
                About {upNext.minutes} min
              </p>
            )}
          </div>
        </section>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {upNext?.href && (
          <Link href={upNext.href} className={buttonVariants({ size: "xl" })}>
            {upNext.ctaLabel}
          </Link>
        )}
        <Link
          href={pathHref}
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          {practice ? "More practice" : "Back to learning path"}
        </Link>
        <Link
          href="/home"
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          Back to home
        </Link>
      </div>
      <p className="mx-auto mt-8 flex max-w-prose gap-2 text-sm text-muted-foreground">
        <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
        XP counts the practice you put in. Your level only changes when you pass
        the A1 checkpoint.
      </p>
      {streakOpen && rewards && (
        <StreakCelebration
          rewards={rewards}
          onClose={() => {
            setStreakOpen(false)
            setStreakSeen(true)
          }}
        />
      )}
    </main>
  )
}

const CHECK_TONES = {
  reward: "text-reward-text",
  primary: "text-primary-text",
  info: "text-info-text",
} as const

/** One line of the merge summary: a passed check and its value. */
function Check({
  label,
  icon: Icon,
  tone,
  children,
}: {
  label: string
  icon: LucideIcon
  tone: keyof typeof CHECK_TONES
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Icon
        aria-hidden="true"
        className={cn("size-5 shrink-0", CHECK_TONES[tone])}
        strokeWidth={2.6}
      />
      <dt className="flex-1 font-bold text-secondary-text">{label}</dt>
      <dd className="font-display text-xl font-semibold tabular-nums">
        {children}
      </dd>
    </div>
  )
}
