import { Check, Lightbulb } from "lucide-react"

import { Avatar } from "@/components/learning/avatar"
import { LevelBadge } from "@/components/learning/level-badge"
import { Mascot } from "@/features/celebrations/mascot"
import { cn } from "@/lib/utils"

import type { LandingProps } from "./landing-page"
import { RichText } from "./rich-text"
import { DAY_IDS, schedule, type DayId } from "./stories"

/** The heart of the page: Monday to Friday, one moment and one line of the language each. */
export function WeekStory(props: LandingProps) {
  const { copy } = props
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
          {copy.week.title}
        </h2>
        <p className="mt-4 max-w-xl text-lg font-semibold text-secondary-text">
          {copy.week.lede}
        </p>
        <ol className="relative mt-12 flex flex-col gap-10 before:absolute before:top-6 before:bottom-6 before:left-6.5 before:w-1 before:rounded-full before:bg-border sm:gap-14">
          {DAY_IDS.map((id, i) => (
            <DayEntry
              key={id}
              id={id}
              last={i === DAY_IDS.length - 1}
              {...props}
            />
          ))}
        </ol>
      </div>
    </section>
  )
}

function DayEntry({
  id,
  last,
  copy,
  story,
  locale,
}: LandingProps & { id: DayId; last: boolean }) {
  const day = story.days[id]
  const { time, level, mood } = schedule[id]
  const words = copy.week.days[id]
  const glosses = day.glosses[locale]
  const lang = story.course
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
          <abbr title={day.name} lang={lang} className="no-underline">
            {day.short}
          </abbr>
        </span>
      </div>
      <article className="min-w-0 rounded-3xl border-2 border-border bg-card p-5 shadow-[0_4px_0_var(--border)] sm:p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h3 className="font-display text-2xl font-semibold">{words.title}</h3>
          <span className="text-sm font-extrabold text-muted-foreground">
            <span lang={lang}>{day.name}</span>, {time}
          </span>
          <LevelBadge level={level} size="sm" className="ml-auto" />
        </div>
        <p className="mt-2 font-semibold text-secondary-text">{words.moment}</p>

        <div className="mt-5 flex flex-col gap-3">
          {day.lines.map((line, i) => {
            const mine = line.from.person === "me"
            const gloss = glosses?.[i]
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
                  label={"name" in line.from ? line.from.name : copy.you}
                />
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl border-2 px-3.5 py-2.5",
                    mine
                      ? "rounded-br-md border-selected-border bg-selected"
                      : "rounded-bl-md border-border bg-background-subtle"
                  )}
                >
                  <p lang={lang} className="text-[1.05rem] font-bold">
                    {line.target}
                  </p>
                  {gloss && (
                    <p className="text-sm font-semibold text-muted-foreground">
                      {gloss}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-5 flex items-center gap-3 rounded-2xl bg-reward-subtle p-2 pr-4">
          <Mascot mood={mood} size={52} />
          <p className="text-[0.95rem] font-bold text-reward-text">
            <Lightbulb
              aria-hidden="true"
              className="mr-1 inline size-4 align-[-2px]"
              strokeWidth={2.6}
            />
            <span className="sr-only">{copy.week.tipLabel} </span>
            <RichText text={day.tips[locale]} lang={lang} />
          </p>
        </div>

        {last && (
          <p className="mt-4 flex w-fit max-w-full items-start gap-2 rounded-2xl bg-success px-3 py-1.5 text-sm font-extrabold text-success-foreground">
            <Check
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0"
              strokeWidth={3}
            />
            <span>
              <RichText text={copy.week.approved} lang={lang} />
            </span>
          </p>
        )}
      </article>
    </li>
  )
}
