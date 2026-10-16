import { ArrowRight, Check, Users } from "lucide-react"
import Link from "next/link"

import { ACTIVE_COURSE, TARGET_LANG } from "@/content/courses"
import { Mascot } from "@/features/celebrations/mascot"
import { cn } from "@/lib/utils"

import type { Line, Section } from "../transit"
import { LINE_COLOR } from "./transit-line"

/**
 * Home's piece of the line map: the stretch of the unit the learner is in, left to right, with
 * their station marked. The full map is one tap away.
 */
export function LineStrip({ line, section }: { line: Line; section: Section }) {
  const stops = [
    ...section.stations.map((station) => ({
      key: station.lesson.id,
      label: station.lesson.title,
      inTarget: station.lesson.titleInTarget,
      done: station.status === "completed",
      here: station.here,
      interchange: station.interchange,
      standup: false,
    })),
    ...(section.standup === "planned"
      ? []
      : [
          {
            key: "standup",
            label: "Standup",
            inTarget: false,
            done: section.standup === "done",
            here: false,
            interchange: false,
            standup: true,
          },
        ]),
  ]
  const hereIndex = stops.findIndex((stop) => stop.here)
  const reached =
    hereIndex >= 0 ? hereIndex : stops.filter((s) => s.done).length - 1

  return (
    <section
      aria-labelledby="line-strip-title"
      className="rounded-3xl border-2 border-border bg-card p-5 shadow-[0_4px_0_var(--border)]"
      style={{ "--line": LINE_COLOR[line.level] } as React.CSSProperties}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span
          aria-hidden="true"
          className="grid h-7 min-w-10 place-items-center rounded-md bg-(--line) px-1.5 font-display text-sm font-semibold text-[#1d2b33]"
        >
          U{line.number}
        </span>
        <h2
          id="line-strip-title"
          className="font-display text-lg font-semibold"
        >
          Unit {section.unit.number} · {section.unit.title}
        </h2>
        <Link
          href={`/path?level=${line.level.toLowerCase()}#${section.unit.id}`}
          className="ml-auto inline-flex items-center gap-1 text-sm font-extrabold text-primary-text hover:underline"
        >
          Line map
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>

      <ol
        aria-label={`Unit ${section.unit.number}: ${section.done} of ${section.total} stations done`}
        className="relative mt-5 grid"
        style={{
          gridTemplateColumns: `repeat(${stops.length}, minmax(0, 1fr))`,
        }}
      >
        {/* The track: solid up to your station, faded after it. */}
        <span
          aria-hidden="true"
          className="absolute top-[22px] h-[6px] rounded-full bg-(--line) opacity-30"
          style={{
            left: `${50 / stops.length}%`,
            right: `${50 / stops.length}%`,
          }}
        />
        {reached > 0 && (
          <span
            aria-hidden="true"
            className="absolute top-[22px] h-[6px] rounded-full bg-(--line)"
            style={{
              left: `${50 / stops.length}%`,
              width: `${(reached / stops.length) * 100}%`,
            }}
          />
        )}
        {stops.map((stop) => (
          <li
            key={stop.key}
            className="relative flex min-w-0 flex-col items-center gap-1.5 text-center"
          >
            <span
              aria-hidden="true"
              className="grid h-[50px] place-items-center"
            >
              {stop.here ? (
                <span className="grid size-12 place-items-center rounded-full border-[5px] border-(--line) bg-card">
                  <Mascot mood="happy" size={38} />
                </span>
              ) : stop.standup ? (
                <span
                  className={cn(
                    "grid size-8 place-items-center rounded-lg border-4 border-(--line) bg-card",
                    stop.done && "bg-(--line)"
                  )}
                >
                  <Users className="size-4" strokeWidth={2.6} />
                </span>
              ) : (
                <span
                  className={cn(
                    "grid place-items-center bg-card",
                    stop.interchange
                      ? "h-5 w-8 rounded-full border-[3px] border-foreground"
                      : "size-6 rounded-full border-[5px] border-(--line)",
                    stop.done && "bg-(--line)"
                  )}
                >
                  {stop.done && (
                    <Check
                      className="size-3.5 text-[#1d2b33]"
                      strokeWidth={3.4}
                    />
                  )}
                </span>
              )}
            </span>
            <span
              lang={stop.inTarget ? TARGET_LANG : undefined}
              className={cn(
                "line-clamp-2 text-xs leading-tight font-bold",
                stop.here ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {stop.label}
            </span>
            {stop.here && (
              <span className="rounded-md bg-reward px-1.5 py-0.5 text-[0.65rem] font-extrabold tracking-wide whitespace-nowrap text-reward-foreground uppercase">
                <span lang={TARGET_LANG}>
                  {ACTIVE_COURSE.phrases.youAreHere}
                </span>
              </span>
            )}
            <span className="sr-only">
              {stop.done ? "done" : stop.here ? "your next stop" : "ahead"}
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}
