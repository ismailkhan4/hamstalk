import { ACTIVE_COURSE, TARGET_LANG } from "@/content/courses"
import { cn } from "@/lib/utils"

import { AKKU_MAX } from "../model"
import { AkkuMeter } from "./akku-meter"

/**
 * The Akku in a lesson's header. `drains` counts the times it dropped this lesson: each change
 * remounts the badge, so it shakes once per drop.
 */
export function AkkuBadge({ akku, drains }: { akku: number; drains: number }) {
  return (
    <span
      key={drains}
      role="status"
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-1 text-sm font-extrabold tabular-nums",
        akku <= 1 ? "bg-danger-subtle text-danger-text" : "text-secondary-text",
        drains > 0 && "motion-safe:animate-shake"
      )}
    >
      <AkkuMeter akku={akku} size="md" />
      <span aria-hidden="true">{akku}</span>
      <span className="sr-only">
        <span lang={TARGET_LANG}>{ACTIVE_COURSE.phrases.akku}</span>: {akku} of{" "}
        {AKKU_MAX} bars left
      </span>
    </span>
  )
}
