import { Check, Info, NotebookPen } from "lucide-react"
import Link from "next/link"

import { Alert } from "@/components/feedback/alert"
import { GermanText } from "@/components/learning/german-text"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button-variants"

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
  return (
    <main
      id="main"
      className="mx-auto w-full max-w-(--lesson-max) flex-1 px-[clamp(20px,4vw,32px)] py-12 pb-16"
    >
      <div className="text-center">
        <span
          aria-hidden="true"
          className="relative mx-auto grid size-[72px] place-items-center rounded-full border-[3px] border-primary text-primary-text"
        >
          <Check className="size-9" strokeWidth={2.6} />
          <i className="absolute -top-1 -right-1 size-3.5 rounded-full bg-spark" />
        </span>
        <h1
          lang="de"
          className="mt-6 font-voice text-[clamp(40px,6vw,60px)] leading-tight"
        >
          {review ? "Wiederholung geschafft!" : "Lektion geschafft!"}
        </h1>
        <p className="mt-1 text-lg text-secondary-text">
          {review ? "Review complete" : "Lesson complete"}: {lesson.title}
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

      <dl className="mt-10 grid grid-cols-2 gap-4 border-y border-border py-4 sm:grid-cols-4">
        <div>
          <dt className="text-[0.8125rem] text-muted-foreground">
            XP for this session
          </dt>
          <dd className="mt-1 font-display text-3xl font-bold text-reward-text">
            {replay ? "0" : `+${summary.xp}`}{" "}
            <span className="text-sm font-normal">XP</span>
          </dd>
        </div>
        <div>
          <dt className="text-[0.8125rem] text-muted-foreground">
            Right first time
          </dt>
          <dd className="mt-1 font-display text-3xl font-bold">
            {summary.firstTry}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              of {summary.graded}
            </span>
          </dd>
        </div>
        <div>
          <dt className="text-[0.8125rem] text-muted-foreground">Time</dt>
          <dd className="mt-1 font-display text-3xl font-bold">
            {minutes}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              min
            </span>
          </dd>
        </div>
        <div>
          <dt className="text-[0.8125rem] text-muted-foreground">
            {review ? "Lessons revisited" : "Phrases"}
          </dt>
          <dd className="mt-1 font-display text-3xl font-bold">
            {review ? summary.byLesson.length : lesson.practised.length}
          </dd>
        </div>
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
                className={
                  i < unitProgress.done
                    ? "h-1.5 w-10 rounded-full bg-primary"
                    : "h-1.5 w-10 rounded-full bg-muted"
                }
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
          className="mt-8 rounded-xl border border-border bg-card p-4"
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
          <Link href={upNext.href} className={buttonVariants({ size: "lg" })}>
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
