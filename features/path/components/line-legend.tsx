import { Check, Construction, Flag, Users } from "lucide-react"

import { ACTIVE_COURSE, TARGET_LANG } from "@/content/courses"
import type { CefrLevel } from "@/content/courses/de/curriculum"
import { Mascot } from "@/features/celebrations/mascot"

import { LINE_COLOR } from "./transit-line"

/** How to read the line map, like the key in the corner of a station's network plan. */
export function LineLegend({ level }: { level: CefrLevel }) {
  const line = LINE_COLOR[level]
  const row = "flex items-center gap-3"
  const icon = "grid w-10 shrink-0 place-items-center"
  return (
    <section
      aria-labelledby="legend-title"
      className="rounded-2xl border-2 border-border bg-card p-4"
      style={{ "--line": line } as React.CSSProperties}
    >
      <h2
        id="legend-title"
        className="text-xs font-extrabold tracking-wider text-muted-foreground uppercase"
      >
        How to read the line
      </h2>
      <ul className="mt-3 flex flex-col gap-2.5 text-sm font-semibold">
        <li className={row}>
          <span className={icon} aria-hidden="true">
            <span className="grid size-6 place-items-center rounded-full bg-(--line)">
              <Check className="size-3.5 text-[#1d2b33]" strokeWidth={3.4} />
            </span>
          </span>
          Station done (tap to replay)
        </li>
        <li className={row}>
          <span className={icon} aria-hidden="true">
            <span className="size-6 rounded-full border-[5px] border-(--line) bg-card" />
          </span>
          Station open
        </li>
        <li className={row}>
          <span className={icon} aria-hidden="true">
            <Mascot mood="happy" size={34} />
          </span>
          <span>
            <span lang={TARGET_LANG}>{ACTIVE_COURSE.phrases.youAreHere}</span>:
            your next lesson
          </span>
        </li>
        <li className={row}>
          <span className={icon} aria-hidden="true">
            <span className="h-5 w-9 rounded-full border-[3px] border-foreground bg-card" />
          </span>
          Interchange: the unit review
        </li>
        <li className={row}>
          <span className={icon} aria-hidden="true">
            <span className="grid size-8 place-items-center rounded-lg border-4 border-(--line) bg-card">
              <Users className="size-4" strokeWidth={2.6} />
            </span>
          </span>
          Team standup at the end of a unit
        </li>
        <li className={row}>
          <span className={icon} aria-hidden="true">
            <Construction className="size-5 text-reward-text" />
          </span>
          <span>
            <span lang={TARGET_LANG}>
              {ACTIVE_COURSE.phrases.underConstruction}
            </span>
            : lessons still being built
          </span>
        </li>
        <li className={row}>
          <span className={icon} aria-hidden="true">
            <span className="grid size-8 place-items-center rounded-lg bg-foreground text-background">
              <Flag className="size-4" strokeWidth={2.6} />
            </span>
          </span>
          <span>
            <span lang={TARGET_LANG}>{ACTIVE_COURSE.phrases.terminus}</span>:
            the level checkpoint
          </span>
        </li>
      </ul>
    </section>
  )
}
