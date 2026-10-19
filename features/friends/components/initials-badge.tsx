import { initialsFor } from "@/components/learning/team-badge"
import { cn } from "@/lib/utils"

/** A learner's initials in a circle, as in league tables. Yours is in your own colour. */
export function InitialsBadge({
  name,
  me = false,
}: {
  name: string
  me?: boolean
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid size-8 shrink-0 place-items-center rounded-full text-xs font-bold",
        me
          ? "bg-(--person-me) text-(--person-me-foreground)"
          : "bg-muted text-secondary-text"
      )}
    >
      {initialsFor(name)}
    </span>
  )
}
