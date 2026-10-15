import { Check, Lightbulb } from "lucide-react"

import { Avatar } from "@/components/learning/avatar"
import { LevelBadge } from "@/components/learning/level-badge"
import { Mascot } from "@/features/celebrations/mascot"
import { MASCOT_NAME } from "@/features/celebrations/mascot-name"
import { cn } from "@/lib/utils"

import { week, weekIntro, type Day } from "./content"

/** The heart of the page: Monday to Friday, one moment and one line of German each. */
export function WeekStory() {
  return (
    <section
      id="week"
      aria-labelledby="week-title"
      className="border-t-2 border-border-subtle bg-background-subtle py-16 md:py-24"
    >
      <div className="mx-auto max-w-200 px-4 sm:px-6">
        <h2
          id="week-title"
          className="font-display text-[clamp(2rem,4.6vw,3.25rem)] leading-[1.08] font-semibold text-balance"
        >
          {weekIntro.title}
        </h2>
        <p className="mt-4 max-w-xl text-lg font-semibold text-secondary-text">
          {weekIntro.lede}
        </p>
        <ol className="relative mt-12 flex flex-col gap-10 before:absolute before:top-6 before:bottom-6 before:left-6.5 before:w-1 before:rounded-full before:bg-border sm:gap-14">
          {week.map((day, i) => (
            <DayEntry key={day.short} day={day} last={i === week.length - 1} />
          ))}
        </ol>
      </div>
    </section>
  )
}

function DayEntry({ day, last }: { day: Day; last: boolean }) {
  return (
    <li className="relative grid grid-cols-[56px_minmax(0,1fr)] gap-4 sm:gap-6">
      <div className="relative z-10 flex flex-col items-center">
        <span
          className={cn(
            "grid size-14 place-items-center rounded-2xl border-2 font-display text-xl font-semibold shadow-[0_4px_0_var(--border-edge)]",
            last
              ? "border-primary-edge bg-primary text-primary-foreground"
              : "border-border bg-card"
          )}
        >
          <abbr title={day.name} className="no-underline">
            {day.short}
          </abbr>
        </span>
      </div>
      <article className="min-w-0 rounded-3xl border-2 border-border bg-card p-5 shadow-[0_4px_0_var(--border)] sm:p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h3 className="font-display text-2xl font-semibold">{day.title}</h3>
          <span className="text-sm font-extrabold text-muted-foreground">
            <span lang="de">{day.name}</span>, {day.time}
          </span>
          <LevelBadge level={day.level} size="sm" className="ml-auto" />
        </div>
        <p className="mt-2 font-semibold text-secondary-text">{day.moment}</p>

        <div className="mt-5 flex flex-col gap-3">
          {day.lines.map((line, i) => {
            const mine = line.from.person === "me"
            return (
              <div
                key={i}
                className={cn(
                  "flex items-end gap-2.5",
                  mine && "flex-row-reverse"
                )}
              >
                <Avatar
                  person={line.from.person}
                  initials={line.from.initials}
                  label={line.from.name}
                />
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl border-2 px-3.5 py-2.5",
                    mine
                      ? "rounded-br-md border-selected-border bg-selected"
                      : "rounded-bl-md border-border bg-background-subtle"
                  )}
                >
                  <p lang="de" className="text-[1.05rem] font-bold">
                    {line.de}
                  </p>
                  <p className="text-sm font-semibold text-muted-foreground">
                    {line.en}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-5 flex items-center gap-3 rounded-2xl bg-reward-subtle p-2 pr-4">
          <Mascot mood={day.mood} size={52} />
          <p className="text-[0.95rem] font-bold text-reward-text">
            <Lightbulb
              aria-hidden="true"
              className="mr-1 inline size-4 align-[-2px]"
              strokeWidth={2.6}
            />
            <span className="sr-only">{MASCOT_NAME}’s tip: </span>
            {day.tip}
          </p>
        </div>

        {last && (
          <p className="mt-4 flex w-fit max-w-full items-start gap-2 rounded-2xl bg-success px-3 py-1.5 text-sm font-extrabold text-success-foreground">
            <Check
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0"
              strokeWidth={3}
            />
            Pull request approved. <span lang="de">Schönes Wochenende!</span>
          </p>
        )}
      </article>
    </li>
  )
}
