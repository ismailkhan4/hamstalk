import { cn } from "@/lib/utils"

import { AKKU_MAX } from "../model"

/**
 * The Akku as a battery of five bars. Green while there's charge, red on the last bar, and a
 * hollow shell when it's empty. Decoration: callers say the number in words.
 */
export function AkkuMeter({
  akku,
  size = "md",
  className,
}: {
  akku: number
  size?: "sm" | "md" | "lg"
  className?: string
}) {
  const low = akku <= 1
  return (
    <span
      aria-hidden="true"
      className={cn("inline-flex shrink-0 items-center", className)}
    >
      <span
        className={cn(
          "grid grid-cols-5 rounded-[5px] border-2 bg-card",
          size === "sm" && "h-3.5 w-7 gap-px p-px",
          size === "md" && "h-[18px] w-9 gap-[1.5px] p-[1.5px]",
          size === "lg" &&
            "h-8 w-[72px] gap-[3px] rounded-lg border-[3px] p-[3px]",
          akku === 0
            ? "border-muted-foreground"
            : low
              ? "border-danger"
              : "border-foreground/70"
        )}
      >
        {Array.from({ length: AKKU_MAX }, (_, i) => (
          <i
            key={i}
            className={cn(
              "rounded-[2px] transition-colors",
              i < akku ? (low ? "bg-danger" : "bg-success") : "bg-transparent"
            )}
          />
        ))}
      </span>
      <span
        className={cn(
          "rounded-r-[2px]",
          size === "sm" && "h-1.5 w-[2px]",
          size === "md" && "h-2 w-[3px]",
          size === "lg" && "h-3.5 w-1",
          akku === 0
            ? "bg-muted-foreground"
            : low
              ? "bg-danger"
              : "bg-foreground/70"
        )}
      />
    </span>
  )
}
