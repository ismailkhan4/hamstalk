import { Info } from "lucide-react"

import { TARGET_LANG } from "@/content/courses"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

import {
  contextsSummary,
  goalFocus,
  goalOptions,
  LEVELS,
  levelOptions,
  type Preferences,
  type StartLevel,
} from "../options"
import { isPreviewLevel, missionsFor, missionsNote } from "../plan"

const statusBadge = {
  available: { tone: "success", label: "Available" },
  planned: { tone: "neutral", label: "Planned" },
  preview: { tone: "info", label: "Preview" },
} as const

const trackLabels: Record<StartLevel, string> = {
  beginner: "Start",
  a1: "A1",
  a2: "A2",
  b1: "B1",
  b2: "B2",
}

export function PlanStep({
  preferences,
  firstName,
}: {
  preferences: Preferences
  firstName: string
}) {
  const level = preferences.startLevel ?? "beginner"
  const goal = preferences.goal ?? "work"
  const missions = missionsFor(level, firstName)
  const preview = isPreviewLevel(level)
  const daily = preferences.dailyMinutes ?? 15

  const facts = [
    ["Starting level", levelOptions[level].short],
    ["Main goal", goalOptions[goal].short],
    [
      "Daily goal",
      `${daily} min a day${preferences.reminderEnabled && preferences.reminderTime ? `, reminder ${preferences.reminderTime}` : ""}`,
    ],
    [
      "Practising first",
      contextsSummary(preferences.contexts) ?? "A mix of everything",
    ],
  ]

  return (
    <>
      <h1 className="font-display text-h1 font-bold">
        Your journey starts here.
      </h1>
      <p className="mt-3 max-w-[56ch] text-body-lg text-secondary-text">
        Here’s how your first days at Kaffeesatz GmbH begin, built from your
        answers. You can change any of it later.
      </p>
      <dl className="mt-8 grid grid-cols-2 border-y border-border sm:grid-cols-4">
        {facts.map(([label, value]) => (
          <div key={label} className="py-3.5 pr-4">
            <dt className="text-[0.8125rem] text-muted-foreground">{label}</dt>
            <dd className="mt-1 font-semibold">{value}</dd>
          </div>
        ))}
      </dl>

      <section aria-labelledby="missions-title" className="mt-10">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="missions-title" className="font-display text-h3 font-bold">
            {preview ? "Your first units" : "Your first missions"}
          </h2>
          <p className="text-sm text-secondary-text">
            Focus: <b className="text-foreground">{goalFocus[goal]}</b>
          </p>
        </div>
        <p className="mt-2 max-w-[60ch] text-sm text-secondary-text">
          {missionsNote(level, missions)}
        </p>
        <ol className="relative mt-6 flex flex-col gap-1 pl-8">
          <span
            aria-hidden="true"
            className="absolute top-3 bottom-3 left-[9px] w-0.5 bg-border"
          />
          {missions.map((mission, i) => {
            const first = i === 0 && !preview
            const badge = statusBadge[mission.status]
            return (
              <li
                key={mission.place}
                className={cn(
                  "relative rounded-xl px-4 py-3.5",
                  first && "border-[1.5px] border-primary bg-card"
                )}
              >
                <i
                  aria-hidden="true"
                  className={cn(
                    "absolute top-5 -left-[29px] size-3 rounded-full border-2 border-input bg-background",
                    first && "-left-[31px] size-4 border-spark bg-spark"
                  )}
                />
                <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span>
                    {preview ? "" : `Mission ${i + 1} · `}
                    {mission.place}
                  </span>
                  {first && (
                    <span className="font-semibold text-spark-text">
                      Start here
                    </span>
                  )}
                  {first && <span>About {daily} min a day</span>}
                  <Badge tone={badge.tone} size="sm">
                    {badge.label}
                  </Badge>
                </p>
                <p
                  className="mt-1 font-bold"
                  lang={mission.titleInTarget ? TARGET_LANG : undefined}
                >
                  {mission.title}
                </p>
                <p lang={TARGET_LANG} className="font-voice text-[1.0625rem]">
                  {mission.target}
                </p>
                <p className="text-sm text-muted-foreground">
                  {mission.native}
                </p>
              </li>
            )
          })}
        </ol>
      </section>

      <section aria-labelledby="track-title" className="mt-10">
        <h2 id="track-title" className="font-display text-h3 font-bold">
          Where this leads
        </h2>
        <ol
          aria-label={`Learning path from Start through A1, A2 and B1 to B2. You start at ${trackLabels[level]}.`}
          className="relative mt-6 flex justify-between"
        >
          <span
            aria-hidden="true"
            className="absolute inset-x-1 top-[5px] h-0.5 bg-border"
          />
          {LEVELS.map((stop) => (
            <li
              key={stop}
              aria-hidden="true"
              className="relative flex flex-col items-center gap-2"
            >
              <i
                className={cn(
                  "size-3 rounded-full border-2 border-input bg-background",
                  stop === level && "border-spark bg-spark"
                )}
              />
              <span
                className={cn(
                  "text-sm font-semibold",
                  stop === level ? "text-spark-text" : "text-muted-foreground"
                )}
              >
                {trackLabels[stop]}
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-5 flex gap-2.5 text-sm text-secondary-text">
          <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          Each level takes months of steady practice, and everyone moves at
          their own pace. Your plan adapts as you go; there’s no deadline and no
          promised date.
        </p>
      </section>
    </>
  )
}
