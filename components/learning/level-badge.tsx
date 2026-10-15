import { Lock } from "lucide-react"

import { cn } from "@/lib/utils"

type Cefr = "A1" | "A2" | "B1" | "B2"

const levelStyles: Record<Cefr, string> = {
  A1: "bg-level-a1-subtle text-level-a1",
  A2: "bg-level-a2-subtle text-level-a2",
  B1: "bg-level-b1-subtle text-level-b1",
  B2: "bg-level-b2-subtle text-level-b2",
}

type LevelBadgeProps = {
  level: Cefr
  status?: "current" | "achieved" | "locked"
  size?: "sm" | "md"
  className?: string
}

function LevelBadge({
  level,
  status = "current",
  size = "md",
  className,
}: LevelBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-sm font-display font-bold tracking-tight",
        size === "sm" ? "h-6 px-2 text-xs" : "h-8 px-2.5 text-sm",
        status === "locked"
          ? "bg-muted text-muted-foreground"
          : levelStyles[level],
        className
      )}
    >
      {status === "locked" && <Lock aria-hidden="true" className="size-3" />}
      {level}
      {status === "locked" && <span className="sr-only"> (locked)</span>}
    </span>
  )
}

export { LevelBadge }
export type { Cefr }
