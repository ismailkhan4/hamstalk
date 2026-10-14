import { Check, Info, Route } from "lucide-react"
import Link from "next/link"

import { Avatar } from "@/components/learning/avatar"
import { GermanText } from "@/components/learning/german-text"
import { buttonVariants } from "@/components/ui/button-variants"
import type { Unit } from "@/content/curriculum"

type UnitCompleteProps = {
  unit: Unit
  xp: number
  phrases: number
  /** The next unit on the path, shown as planned until its lessons exist. */
  nextUnit: { title: string; open: boolean; href: string | null } | null
  pathHref: string
}

export function UnitComplete({
  unit,
  xp,
  phrases,
  nextUnit,
  pathHref,
}: UnitCompleteProps) {
  const lessons = unit.lessons.filter((lesson) => lesson.kind === "lesson")
  const review = unit.lessons.find((lesson) => lesson.kind === "review")
  const milestone = unit.milestone

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
          Einheit {unit.number} geschafft!
        </h1>
        <p className="mt-1 text-lg text-secondary-text">
          Unit {unit.number} complete: {unit.title}
        </p>
      </div>

      <dl className="mt-10 grid grid-cols-2 gap-4 border-y border-border py-4 sm:grid-cols-4">
        <div>
          <dt className="text-[13px] text-muted-foreground">
            XP from Unit {unit.number}
          </dt>
          <dd className="mt-1 font-display text-3xl font-bold text-reward-text">
            {xp} <span className="text-sm font-normal">XP</span>
          </dd>
        </div>
        <div>
          <dt className="text-[13px] text-muted-foreground">Lessons</dt>
          <dd className="mt-1 font-display text-3xl font-bold">
            {lessons.length}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              of {lessons.length}
            </span>
          </dd>
        </div>
        <div>
          <dt className="text-[13px] text-muted-foreground">Unit review</dt>
          <dd className="mt-1 font-display text-3xl font-bold">Done</dd>
        </div>
        <div>
          <dt className="text-[13px] text-muted-foreground">
            Phrases practised
          </dt>
          <dd className="mt-1 font-display text-3xl font-bold">{phrases}</dd>
        </div>
      </dl>

      {milestone && (
        <section aria-labelledby="can-now" className="mt-8">
          <h2 id="can-now" className="font-semibold">
            You can now
          </h2>
          <ul className="mt-3 flex flex-col gap-2">
            {milestone.canDo.map((item) => (
              <li key={item} className="flex gap-3">
                <Check
                  aria-hidden="true"
                  className="mt-1 size-4 shrink-0 text-primary-text"
                />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-muted-foreground">
            {milestone.summary}
          </p>
        </section>
      )}

      <section aria-labelledby="steps" className="mt-8">
        <h2 id="steps" className="font-semibold">
          Unit {unit.number}, step by step
        </h2>
        <ol className="mt-3 flex flex-col gap-2">
          {[...lessons, ...(review ? [review] : [])].map((lesson, i) => (
            <li
              key={lesson.id}
              className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3"
            >
              <span
                aria-hidden="true"
                className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground"
              >
                <Check className="size-3.5" />
              </span>
              <span className="w-24 shrink-0 text-sm text-muted-foreground">
                {lesson.kind === "review"
                  ? `Unit ${unit.number} review`
                  : `Lesson ${i + 1}`}
              </span>
              <span
                lang={lesson.titleIsGerman ? "de" : undefined}
                className={
                  lesson.titleIsGerman
                    ? "min-w-0 flex-1 font-voice text-lg"
                    : "min-w-0 flex-1 font-semibold"
                }
              >
                {lesson.kind === "review"
                  ? "Reception, first morning"
                  : lesson.title}
              </span>
              <span className="shrink-0 text-xs font-semibold text-primary-text">
                Done
              </span>
            </li>
          ))}
        </ol>
      </section>

      {milestone && (
        <section aria-labelledby="standup" className="mt-8">
          <h2 id="standup" className="font-semibold">
            New for the 9:30 standup
          </h2>
          <div className="mt-3 flex items-start gap-4 rounded-xl bg-inset p-4">
            <Avatar person="lf" initials="LF" />
            <div>
              <GermanText as="p" className="text-2xl">
                {milestone.standup.de}
              </GermanText>
              <p className="text-[15px] text-muted-foreground">
                {milestone.standup.en} Each unit adds one more line you can say
                at the standup.
              </p>
            </div>
          </div>
        </section>
      )}

      {nextUnit && (
        <section
          aria-label="Up next"
          className="mt-8 rounded-xl border border-border bg-card p-4"
        >
          <div className="flex items-center gap-3">
            <Route
              aria-hidden="true"
              className="size-5 shrink-0 text-muted-foreground"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground">
                Up next · Unit {unit.number + 1}
              </p>
              <p className="font-semibold">{nextUnit.title}</p>
            </div>
            <p className="shrink-0 text-sm text-muted-foreground">
              {nextUnit.open ? "Available" : "Planned · not built yet"}
            </p>
          </div>
        </section>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href={pathHref} className={buttonVariants({ size: "lg" })}>
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
        Unit {unit.number} is one of eight A1 units. XP counts the practice you
        put in; your level only changes when you pass the A1 checkpoint after
        Unit 8.
      </p>
    </main>
  )
}
