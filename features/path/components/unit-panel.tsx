import { Check, Hammer, Lock } from "lucide-react"
import Link from "next/link"

import { TARGET_LANG } from "@/content/courses"
import { ArticleWord } from "@/components/learning/article-word"
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button-variants"
import { isLessonAvailable } from "@/content/courses/de/availability"
import type { Unit } from "@/content/courses/de/curriculum"
import type { StartLevel } from "@/features/onboarding/options"
import { cn } from "@/lib/utils"

import {
  completedLessonCount,
  lessonStatus,
  nextLesson,
  unitStatus,
  type LessonProgress,
  type LessonStatus,
  type UnitStatus,
} from "../model"

export const unitStatusLabel: Record<UnitStatus, string> = {
  completed: "Completed",
  in_progress: "In progress",
  up_next: "Up next",
  available: "Available",
  review: "Open for review",
  locked: "Locked",
  preview: "Preview",
}

const lessonStatusLabel: Record<LessonStatus, string> = {
  completed: "Done",
  in_progress: "In progress",
  up_next: "Up next",
  open: "Open",
  locked: "Locked",
  planned: "Planned",
}

type UnitPanelProps = {
  unit: Unit
  level: StartLevel | null
  progress: LessonProgress[]
  firstName: string
  headingLevel?: 1 | 2
}

export function UnitPanel({
  unit,
  level,
  progress,
  firstName,
  headingLevel = 2,
}: UnitPanelProps) {
  const Heading = headingLevel === 1 ? "h1" : "h2"
  const status = unitStatus(unit, level, progress)
  const next = nextLesson(level, progress)
  const target =
    status === "preview" || status === "locked"
      ? null
      : (unit.lessons.find((lesson) => next?.lesson.id === lesson.id) ??
        unit.lessons.find(
          (lesson) => lessonStatus(lesson, unit, level, progress) === "open"
        ) ??
        null)
  const anyOpen = unit.lessons.some((lesson) => isLessonAvailable(lesson.id))
  const done = completedLessonCount(unit, progress)

  return (
    <section
      aria-labelledby={`unit-${unit.id}`}
      className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"
    >
      <p className="flex items-center gap-2 text-[0.8125rem] font-semibold text-primary-text">
        <i aria-hidden="true" className="size-2 rounded-full bg-spark" />
        Unit {unit.number} · {unit.level} · {unitStatusLabel[status]}
      </p>
      <Heading
        id={`unit-${unit.id}`}
        className="mt-2 font-display text-h3 font-bold"
      >
        {unit.title}
      </Heading>
      <p className="mt-1 text-secondary-text">
        {unit.description ?? unit.summary}
      </p>

      {status === "preview" && (
        <p className="mt-4 flex gap-3 rounded-xl border border-primary-border bg-primary-subtle p-3.5 text-sm text-primary-text">
          <Lock aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <span>
            <b className="block">Preview</b>
            Planned, but not built yet. Nothing here can be started.
          </span>
        </p>
      )}

      {unit.canDo && (
        <>
          <h3 className="mt-5 text-sm font-semibold text-secondary-text">
            You’ll be able to
          </h3>
          <ul className="mt-2 flex flex-col gap-1.5">
            {unit.canDo.map((item) => (
              <li key={item} className="flex gap-2.5 text-[0.9375rem]">
                <Check
                  aria-hidden="true"
                  className="mt-1 size-4 shrink-0 text-primary-text"
                />
                {item}
              </li>
            ))}
          </ul>
        </>
      )}
      {unit.words && (
        <>
          <h3 className="mt-5 text-sm font-semibold text-secondary-text">
            Words
          </h3>
          <ul className="mt-2 flex flex-wrap gap-2">
            {unit.words.map((word) => (
              <li
                key={word.word}
                className="rounded-lg bg-card px-2.5 py-1 shadow-[inset_0_0_0_1px_var(--border)]"
              >
                {word.article ? (
                  <ArticleWord
                    article={word.article}
                    word={word.word}
                    className="text-[1.0312rem]"
                  />
                ) : (
                  <span
                    lang={TARGET_LANG}
                    className="font-voice text-[1.0312rem]"
                  >
                    {word.word}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
      {unit.grammar && (
        <>
          <h3 className="mt-5 text-sm font-semibold text-secondary-text">
            Grammar
          </h3>
          <p className="mt-1 text-[0.9375rem]">
            {unit.grammar.replaceAll("%N", firstName)}
          </p>
        </>
      )}
      {unit.skills && (
        <>
          <h3 className="mt-5 text-sm font-semibold text-secondary-text">
            Skills you’ll use
          </h3>
          <ul className="mt-2 flex flex-wrap gap-2">
            {unit.skills.map((skill) => (
              <li
                key={skill}
                className="rounded-md bg-muted px-2.5 py-1 text-sm"
              >
                {skill}
              </li>
            ))}
          </ul>
        </>
      )}

      {unit.lessons.length > 0 && (
        <>
          <h3 className="mt-5 text-sm font-semibold text-secondary-text">
            Lessons{" "}
            <span className="font-normal">
              · {done} of {unit.lessons.length} done
            </span>
          </h3>
          <ol className="mt-2">
            {unit.lessons.map((lesson, i) => {
              const state = lessonStatus(lesson, unit, level, progress)
              const isNext = state === "up_next" || state === "in_progress"
              const title = (
                <span
                  lang={lesson.titleInTarget ? TARGET_LANG : undefined}
                  className={cn(isNext && "font-semibold")}
                >
                  {lesson.title}
                </span>
              )
              return (
                <li
                  key={lesson.id}
                  className="flex items-center gap-3 border-b border-border-subtle py-2.5 last:border-b-0"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "grid size-6 shrink-0 place-items-center rounded-full border-[1.5px] border-input text-xs font-semibold",
                      lesson.kind === "review" && "border-dashed",
                      state === "completed" &&
                        "border-primary bg-primary text-primary-foreground",
                      isNext && "border-spark bg-spark text-primary-foreground"
                    )}
                  >
                    {state === "completed" ? (
                      <Check className="size-3.5" />
                    ) : (
                      i + 1
                    )}
                  </span>
                  <span className="min-w-0 flex-1 text-[0.9375rem]">
                    {state === "open" || isNext ? (
                      <Link
                        href={`/learn/${lesson.id}`}
                        className="hover:underline"
                      >
                        {title}
                      </Link>
                    ) : (
                      title
                    )}
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {lessonStatusLabel[state]}
                    {state !== "completed" && state !== "planned"
                      ? ` · about ${lesson.minutes} min`
                      : ""}
                  </span>
                </li>
              )
            })}
          </ol>
        </>
      )}

      <div className="mt-6">
        {target && isLessonAvailable(target.id) ? (
          <Link
            href={`/learn/${target.id}`}
            className={buttonVariants({ size: "lg", fullWidth: true })}
          >
            {next?.resumeAt != null && next.lesson.id === target.id
              ? `Continue ${target.title}`
              : `Start ${target.kind === "review" ? "the unit review" : `Lesson ${unit.lessons.indexOf(target) + 1} · ${target.title}`}`}
          </Link>
        ) : (
          <Button
            size="lg"
            fullWidth
            disabled
            aria-describedby={`unit-${unit.id}-note`}
          >
            {status === "preview"
              ? "Not built yet"
              : status === "locked"
                ? "Locked"
                : "Lessons are being built"}
          </Button>
        )}
        <p
          id={`unit-${unit.id}-note`}
          className="mt-2 flex justify-center gap-2 text-center text-sm text-muted-foreground"
        >
          {status === "preview" ? (
            "A preview only. Nothing here counts as started."
          ) : status === "locked" ? (
            "Units open in order. The next one opens when you finish the current unit."
          ) : !anyOpen ? (
            <>
              <Hammer aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
              These lessons are planned. They open here as soon as they’re
              ready.
            </>
          ) : status === "available" ? (
            "You can start it now. We recommend finishing the current unit first."
          ) : (
            "Lessons open in order, and you can replay finished ones any time."
          )}
        </p>
      </div>
    </section>
  )
}
