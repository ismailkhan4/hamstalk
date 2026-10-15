"use client"

import {
  Check,
  Clock,
  Flame,
  Info,
  NotebookPen,
  Star,
  Target,
  Zap,
  type LucideIcon,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useRef } from "react"

import { Alert } from "@/components/feedback/alert"
import { GermanText } from "@/components/learning/german-text"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button-variants"
import { celebrate } from "@/features/celebrations/confetti"
import { CountUp } from "@/features/celebrations/count-up"
import { playFeedback } from "@/features/celebrations/feedback"
import { Mascot } from "@/features/celebrations/mascot"
import { cn } from "@/lib/utils"

import type { LessonSummary } from "../engine/session"
import type { Lesson } from "../schema"

export type UpNext = {
  href: string | null
  kicker: string
  title: string
  titleIsGerman: boolean
  minutes: number | null
  ctaLabel: string
}

type LessonCompleteProps = {
  lesson: Lesson
  summary: LessonSummary
  minutes: number
  /** The longest run of answers right first time. */
  bestCombo: number
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
}

export function LessonComplete({
  lesson,
  summary,
  minutes,
  bestCombo,
  mistakeCount,
  replay,
  upNext,
  unitProgress,
  pathHref,
  saveProblem,
  saving,
  onRetrySave,
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

  return (
    <main
      id="main"
      className="mx-auto w-full max-w-(--lesson-max) flex-1 px-[clamp(20px,4vw,32px)] py-10 pb-16"
    >
      <div className="flex flex-col items-center text-center">
        <Mascot
          mood={perfect ? "cheer" : "dance"}
          size={148}
          className="motion-safe:animate-pop"
        />
        {/* Entrances are CSS, so reduced motion applies from the first paint, before any script. */}
        <h1
          lang="de"
          style={{ animationDelay: "150ms" }}
          className="mt-4 font-display text-[clamp(36px,6vw,52px)] leading-tight font-semibold text-primary-text motion-safe:animate-rise"
        >
          {review ? "Wiederholung geschafft!" : "Lektion geschafft!"}
        </h1>
        <p className="mt-1 text-lg font-semibold text-secondary-text">
          {review ? "Review complete" : "Lesson complete"}: {lesson.title}
        </p>
        {perfect && (
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-reward px-3.5 py-1 text-sm font-extrabold text-reward-foreground motion-safe:animate-pop">
            <Star aria-hidden="true" className="size-4 fill-current" />
            <span lang="de">Perfekt!</span> Every answer right first time
          </p>
        )}
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

      <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Total XP" icon={Zap} tone="reward" index={0}>
          {replay ? "0" : <CountUp to={summary.xp} prefix="+" />}
        </StatTile>
        <StatTile
          label={perfect ? "Perfect" : "Accuracy"}
          icon={Target}
          tone="primary"
          index={1}
        >
          <CountUp to={accuracy} delay={0.35} />%
        </StatTile>
        <StatTile label="Time" icon={Clock} tone="info" index={2}>
          {minutes} min
        </StatTile>
        <StatTile label="Best combo" icon={Flame} tone="spark" index={3}>
          {bestCombo}
        </StatTile>
      </dl>
      {replay && (
        <p className="mt-2 text-sm text-muted-foreground">
          This was a replay, so it adds no new XP.
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
                        {item.label} · <GermanText>{item.title}</GermanText>
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
          <section aria-labelledby="can-now" className="mt-8">
            <h2 id="can-now" className="font-semibold">
              You can now
            </h2>
            <ul className="mt-3 flex flex-col gap-2">
              {lesson.canDo.map((item) => (
                <li key={item} className="flex gap-3">
                  <Check
                    aria-hidden="true"
                    className="mt-1 size-4 shrink-0 text-primary-text"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </section>
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
                  <GermanText className="text-lg">{phrase}</GermanText>
                </li>
              ))}
            </ul>
          </section>
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
                lang={upNext.titleIsGerman ? "de" : undefined}
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
          Back to learning path
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
    </main>
  )
}

const TILE_TONES = {
  reward: "border-reward bg-reward text-reward-foreground",
  primary: "border-primary bg-primary text-primary-foreground",
  info: "border-info bg-info text-info-foreground",
  spark: "border-spark bg-spark text-spark-foreground",
} as const

const TILE_TEXT = {
  reward: "text-reward-text",
  primary: "text-primary-text",
  info: "text-info-text",
  spark: "text-spark-text",
} as const

/** A stat with a coloured label band, dropping in one after another. */
function StatTile({
  label,
  icon: Icon,
  tone,
  index,
  children,
}: {
  label: string
  icon: LucideIcon
  tone: keyof typeof TILE_TONES
  index: number
  children: React.ReactNode
}) {
  return (
    <div
      style={{ animationDelay: `${350 + index * 120}ms` }}
      className={cn(
        "overflow-hidden rounded-2xl border-2 motion-safe:animate-rise",
        TILE_TONES[tone]
      )}
    >
      <dt className="px-2 py-1 text-center text-[0.75rem] font-extrabold tracking-wide uppercase">
        {label}
      </dt>
      <dd
        className={cn(
          "m-0.5 flex items-center justify-center gap-1.5 rounded-[14px] bg-card px-2 py-3 font-display text-2xl font-semibold tabular-nums",
          TILE_TEXT[tone]
        )}
      >
        <Icon
          aria-hidden="true"
          className="size-5 shrink-0"
          strokeWidth={2.6}
        />
        <span>{children}</span>
      </dd>
    </div>
  )
}
