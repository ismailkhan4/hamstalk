import { Hammer } from "lucide-react"
import Link from "next/link"

import { TARGET_LANG } from "@/content/courses"
import { Avatar } from "@/components/learning/avatar"
import { TargetText } from "@/components/learning/target-text"
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button-variants"
import { isLessonAvailable } from "@/content/courses/de/availability"
import type { NextLesson } from "@/features/path/model"
import { cn } from "@/lib/utils"

type MissionCardProps = {
  next: NextLesson
  missionNumber: number | null
  firstName: string
}

export function MissionCard({
  next,
  missionNumber,
  firstName,
}: MissionCardProps) {
  const { unit, lesson, index, resumeAt } = next
  const open = isLessonAvailable(lesson.id)
  const place =
    lesson.kind === "review"
      ? `Unit ${unit.number}, Review`
      : `Unit ${unit.number}, Lesson ${index + 1}`
  const kicker = missionNumber ? `Mission ${missionNumber} · ${place}` : place
  const quote = lesson.mission?.quote
  const isFirst = missionNumber === 1 && resumeAt === null
  const cta =
    resumeAt !== null
      ? `Continue at exercise ${resumeAt + 1}`
      : isFirst
        ? "Start your first mission"
        : lesson.kind === "review"
          ? `Start the Unit ${unit.number} review`
          : `Start Lesson ${index + 1}`

  return (
    <section
      aria-labelledby="mission-title"
      className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"
    >
      <p className="flex items-center gap-2 text-[0.8438rem] font-semibold text-primary-text">
        <i aria-hidden="true" className="size-2 rounded-full bg-spark" />
        {kicker}
      </p>
      <h2
        id="mission-title"
        lang={lesson.titleInTarget ? TARGET_LANG : undefined}
        className={cn(
          "mt-2",
          lesson.titleInTarget
            ? "font-voice text-[2.5rem] leading-tight"
            : "font-display text-h2 font-bold"
        )}
      >
        {lesson.title}
      </h2>
      {lesson.goal && (
        <p className="text-[0.9375rem] text-muted-foreground">{lesson.goal}</p>
      )}
      {lesson.mission && (
        <p className="mt-3 max-w-[56ch] text-body text-secondary-text">
          {lesson.mission.description}
        </p>
      )}
      {quote && (
        <div className="mt-5 flex items-center gap-4 rounded-xl bg-inset p-4">
          <Avatar person={quote.person} initials={quote.initials} />
          <div>
            <TargetText as="p" className="text-xl">
              {quote.target.replaceAll("%N", firstName)}
            </TargetText>
            <p className="text-sm text-muted-foreground">{quote.native}</p>
          </div>
        </div>
      )}
      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
        {open ? (
          <Link
            href={`/learn/${lesson.id}`}
            className={buttonVariants({ size: "lg" })}
          >
            {cta}
          </Link>
        ) : (
          <Button size="lg" disabled aria-describedby="mission-status">
            {cta}
          </Button>
        )}
        <span aria-hidden="true" className="flex gap-1">
          {unit.lessons.map((item, i) => (
            <i
              key={item.id}
              className={cn(
                "h-1.5 w-6 rounded-full bg-muted",
                i < index && "bg-primary",
                i === index && "bg-spark"
              )}
            />
          ))}
        </span>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        About {lesson.minutes} min · {lesson.exercises} exercises
      </p>
      {!open && (
        <p
          id="mission-status"
          className="mt-4 flex gap-2.5 rounded-lg bg-reward-subtle p-3 text-sm text-reward-text"
        >
          <Hammer aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          This lesson is being built. It opens here as soon as it’s ready;
          nothing you do now is lost.
        </p>
      )}
    </section>
  )
}
