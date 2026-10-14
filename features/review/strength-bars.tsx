import { cn } from "@/lib/utils"

/** One to three bars: how well the word was known last time. Never colour alone. */
export function StrengthBars({ strength }: { strength: 1 | 2 | 3 }) {
  return (
    <span
      role="img"
      aria-label={`Strength ${strength} of 3`}
      className="inline-flex items-end gap-0.5"
    >
      {[1, 2, 3].map((bar) => (
        <i
          key={bar}
          aria-hidden="true"
          className={cn(
            "w-1.5 rounded-[1px] bg-muted",
            bar === 1 ? "h-2" : bar === 2 ? "h-3" : "h-4",
            bar <= strength &&
              (strength === 1
                ? "bg-danger"
                : strength === 2
                  ? "bg-warning"
                  : "bg-success")
          )}
        />
      ))}
    </span>
  )
}
