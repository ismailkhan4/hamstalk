import {
  BookOpen,
  Check,
  Construction,
  Flag,
  Lock,
  TramFront,
  Users,
} from "lucide-react"
import Link from "next/link"

import { buttonVariants } from "@/components/ui/button-variants"
import { ACTIVE_COURSE, TARGET_LANG } from "@/content/courses"
import { getLevel, type CefrLevel } from "@/content/courses/de/curriculum"
import { Mascot } from "@/features/celebrations/mascot"
import { cn } from "@/lib/utils"

import type { Line, Section, Station } from "../transit"

/** Each level's line colour, as a CSS value. Fills only: text never sits on it at small sizes. */
export const LINE_COLOR: Record<CefrLevel, string> = {
  A1: "var(--line-a1)",
  A2: "var(--line-a2)",
  B1: "var(--line-b1)",
  B2: "var(--line-b2)",
}

type Track = "passed" | "ahead" | "here" | "construction"

/**
 * The path drawn as a transit line: units are stretches of the line, lessons are stations, a unit
 * review is an interchange, the team standup ends each unit and the checkpoint is the terminus.
 * Behind you the line is solid; ahead it is faded; unbuilt stretches are a Baustelle.
 */
export function TransitLine({
  line,
  resumeAt,
  guideHref,
}: {
  line: Line
  /** The exercise the current lesson resumes at, for its button label. */
  resumeAt: number | null
  guideHref: (unitId: string) => string
}) {
  const color = LINE_COLOR[line.level]
  const level = getLevel(line.level)
  const allPassed = line.sections.every((section) => section.passed)

  return (
    <ol
      aria-label={`Line U${line.number}, ${line.level}`}
      className="relative"
      style={{ "--line": color } as React.CSSProperties}
    >
      {line.sections.map((section) => (
        <SectionRows
          key={section.unit.id}
          section={section}
          resumeAt={resumeAt}
          guideHref={guideHref(section.unit.id)}
          lineNumber={line.number}
        />
      ))}
      <li className="relative grid grid-cols-[56px_minmax(0,1fr)] gap-3 pt-2">
        <Rail track={allPassed ? "passed" : "ahead"} end />
        <span
          aria-hidden="true"
          className="relative z-10 mx-auto grid size-11 place-items-center rounded-xl bg-foreground text-background"
        >
          <Flag className="size-5" strokeWidth={2.6} />
        </span>
        <div className="pb-2">
          <p className="text-xs font-extrabold tracking-wider text-muted-foreground uppercase">
            <span lang={TARGET_LANG}>{ACTIVE_COURSE.phrases.terminus}</span>
          </p>
          <h3 className="font-display text-xl font-semibold">
            {level.checkpoint.title}
          </h3>
          <p className="mt-0.5 text-sm font-semibold text-muted-foreground">
            {level.checkpoint.summary}
          </p>
        </div>
      </li>
    </ol>
  )
}

function SectionRows({
  section,
  resumeAt,
  guideHref,
  lineNumber,
}: {
  section: Section
  resumeAt: number | null
  guideHref: string
  lineNumber: number
}) {
  const { unit } = section
  // A passed Express turns the unit's stretch of line gold.
  const gold =
    section.express === "gold"
      ? ({ "--line": "var(--gold)" } as React.CSSProperties)
      : undefined
  // A stretch of line is solid once what it leads to is done, half solid at your station.
  const headTrack: Track = section.underConstruction
    ? "construction"
    : section.done > 0 || section.passed
      ? "passed"
      : "ahead"

  return (
    <>
      <li
        id={unit.id}
        className="relative grid scroll-mt-24 grid-cols-[56px_minmax(0,1fr)] gap-3 pt-5 pb-3"
        style={gold}
      >
        <Rail track={headTrack} />
        <span
          aria-hidden="true"
          className="relative z-10 mx-auto mt-0.5 grid h-8 min-w-11 place-items-center rounded-md bg-(--line) px-1.5 font-display text-sm font-semibold text-[#1d2b33]"
        >
          U{lineNumber}
        </span>
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="min-w-0 font-display text-xl font-semibold">
            <span className="text-muted-foreground">Unit {unit.number}</span> ·{" "}
            {unit.title}
          </h3>
          {section.underConstruction ? (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-reward px-2 py-0.5 text-xs font-extrabold text-reward-foreground">
              <Construction aria-hidden="true" className="size-3.5" />
              <span lang={TARGET_LANG}>
                {ACTIVE_COURSE.phrases.underConstruction}
              </span>
              <span className="sr-only">: not built yet</span>
            </span>
          ) : (
            <>
              <span className="font-mono text-sm font-semibold text-muted-foreground tabular-nums">
                {section.done}/{section.total}
              </span>
              {section.express !== "locked" && (
                <Link
                  href={`/practice/express/${unit.id}`}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-sm font-extrabold",
                    section.express === "gold"
                      ? "bg-reward text-reward-foreground"
                      : "text-reward-text hover:underline"
                  )}
                >
                  <TramFront aria-hidden="true" className="size-4" />
                  {section.express === "gold" ? "Express ★" : "Express"}
                  <span className="sr-only"> run for unit {unit.number}</span>
                </Link>
              )}
              <Link
                href={guideHref}
                className="ml-auto inline-flex items-center gap-1.5 text-sm font-extrabold text-primary-text hover:underline"
              >
                <BookOpen aria-hidden="true" className="size-4" />
                Guide
                <span className="sr-only"> for unit {unit.number}</span>
              </Link>
            </>
          )}
          {section.underConstruction && (
            <p className="w-full text-sm font-semibold text-muted-foreground">
              {unit.summary} Its stations open as soon as the lessons are ready.
            </p>
          )}
        </div>
      </li>

      {!section.underConstruction &&
        section.stations.map((station) => (
          <StationRow
            key={station.lesson.id}
            style={gold}
            station={station}
            track={
              station.here
                ? "here"
                : station.status === "completed"
                  ? "passed"
                  : "ahead"
            }
            resumeAt={resumeAt}
          />
        ))}

      {!section.underConstruction && section.standup !== "planned" && (
        <StandupRow
          style={gold}
          state={section.standup}
          track={section.standup === "done" ? "passed" : "ahead"}
        />
      )}
    </>
  )
}

function Rail({ track, end = false }: { track: Track; end?: boolean }) {
  const part = (kind: "passed" | "ahead" | "construction") =>
    cn(
      "absolute left-[25px] w-[6px]",
      kind === "passed" && "bg-(--line)",
      kind === "ahead" && "bg-(--line) opacity-30",
      kind === "construction" &&
        "bg-[repeating-linear-gradient(to_bottom,var(--border-edge)_0_8px,transparent_8px_15px)]"
    )
  if (track === "here")
    return (
      // An overlay, not a grid cell: it must not take the marker's column.
      <span aria-hidden="true" className="pointer-events-none absolute inset-0">
        <span className={cn(part("passed"), "top-0 h-9")} />
        <span className={cn(part("ahead"), "top-9 bottom-0")} />
      </span>
    )
  return (
    <span
      aria-hidden="true"
      className={cn(part(track), "top-0", end ? "h-6" : "bottom-0")}
    />
  )
}

const STATUS_TEXT: Record<Station["status"], string> = {
  completed: "Done",
  in_progress: "In progress",
  up_next: "Next",
  open: "Open",
  locked: "Locked",
  planned: "Not built yet",
}

function StationRow({
  station,
  track,
  resumeAt,
  style,
}: {
  station: Station
  track: Track
  resumeAt: number | null
  style?: React.CSSProperties
}) {
  const { lesson, status, interchange, here } = station
  const playable = status !== "locked" && status !== "planned"
  const title = (
    <span lang={lesson.titleInTarget ? TARGET_LANG : undefined}>
      {lesson.title}
    </span>
  )

  return (
    <li
      className="relative grid grid-cols-[56px_minmax(0,1fr)] gap-3 py-2"
      style={style}
    >
      <Rail track={track} />
      <span className="relative z-10 flex justify-center pt-1">
        <StationMarker station={station} />
      </span>
      {here ? (
        <div className="min-w-0 rounded-2xl border-2 border-(--line) bg-card p-4 shadow-[0_4px_0_var(--line)]">
          <p className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-reward px-2 py-0.5 text-xs font-extrabold tracking-wide text-reward-foreground uppercase">
              <span lang={TARGET_LANG}>{ACTIVE_COURSE.phrases.youAreHere}</span>
            </span>
            <span className="text-sm font-bold text-muted-foreground">
              {interchange ? "Unit review" : "Next station"} · about{" "}
              {lesson.minutes} min
            </span>
          </p>
          <h4 className="mt-2 font-display text-2xl leading-tight font-semibold">
            {title}
          </h4>
          {lesson.goal && (
            <p className="mt-1 font-semibold text-secondary-text">
              {lesson.goal}
            </p>
          )}
          <Link
            href={`/learn/${lesson.id}`}
            className={cn(buttonVariants({ size: "lg" }), "mt-4")}
          >
            {status === "in_progress" && resumeAt !== null
              ? `Continue at exercise ${resumeAt + 1}`
              : "Start"}
          </Link>
        </div>
      ) : (
        <div className="flex min-h-8 min-w-0 flex-wrap items-baseline gap-x-3 py-1">
          {playable ? (
            <Link
              href={`/learn/${lesson.id}`}
              className="min-w-0 font-bold hover:underline"
            >
              {title}
            </Link>
          ) : (
            <span className="min-w-0 font-bold text-muted-foreground">
              {title}
            </span>
          )}
          <span className="text-sm font-semibold text-muted-foreground">
            {interchange ? "Review · " : ""}
            {STATUS_TEXT[status]}
            {status === "completed" ? " · replay" : ""}
            {status === "open" ? ` · ${lesson.minutes} min` : ""}
          </span>
        </div>
      )}
    </li>
  )
}

function StationMarker({ station }: { station: Station }) {
  const { status, interchange, here } = station
  if (here)
    return (
      <span
        aria-hidden="true"
        className="grid size-12 place-items-center rounded-full border-[5px] border-(--line) bg-card"
      >
        <Mascot mood="happy" size={40} />
      </span>
    )
  const done = status === "completed"
  const muted = status === "locked" || status === "planned"
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid place-items-center bg-card",
        interchange
          ? "mt-0.5 h-5 w-9 rounded-full border-[3px] border-foreground"
          : "size-6 rounded-full border-[5px] border-(--line)",
        done && "bg-(--line)",
        muted && !interchange && "border-border-edge",
        muted && interchange && "border-border-edge"
      )}
    >
      {done && <Check className="size-3.5 text-[#1d2b33]" strokeWidth={3.4} />}
      {status === "locked" && (
        <Lock className="size-2.5 text-muted-foreground" strokeWidth={3} />
      )}
    </span>
  )
}

function StandupRow({
  state,
  track,
  style,
}: {
  state: Section["standup"]
  track: Track
  style?: React.CSSProperties
}) {
  const text =
    state === "done"
      ? "Done"
      : state === "ready"
        ? "Ready: say your line at the 9:30 standup"
        : "Opens when you finish the unit"
  return (
    <li
      className="relative grid grid-cols-[56px_minmax(0,1fr)] gap-3 py-2"
      style={style}
    >
      <Rail track={track} />
      <span className="relative z-10 flex justify-center">
        <span
          aria-hidden="true"
          className={cn(
            "grid size-9 place-items-center rounded-lg border-4 bg-card",
            state === "locked" ? "border-border-edge" : "border-(--line)",
            state === "done" && "bg-(--line)"
          )}
        >
          <Users
            className={cn(
              "size-4",
              state === "locked" ? "text-muted-foreground" : "text-[#1d2b33]",
              state === "ready" && "text-foreground"
            )}
            strokeWidth={2.6}
          />
        </span>
      </span>
      <div className="flex min-h-9 flex-wrap items-baseline gap-x-3 py-1.5">
        {state === "ready" ? (
          <Link href="/team/standup" className="font-bold hover:underline">
            Team standup
          </Link>
        ) : (
          <span
            className={cn(
              "font-bold",
              state === "locked" && "text-muted-foreground"
            )}
          >
            Team standup
          </span>
        )}
        <span className="text-sm font-semibold text-muted-foreground">
          {text}
        </span>
      </div>
    </li>
  )
}
