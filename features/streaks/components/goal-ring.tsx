import { cn } from "@/lib/utils"

/** Today's XP against the goal, as a ring that fills up. Decorative: callers say it in words. */
export function GoalRing({
  xp,
  goal,
  size = 28,
  className,
}: {
  xp: number
  goal: number
  size?: number
  className?: string
}) {
  const stroke = Math.max(3, size / 8)
  const radius = (size - stroke) / 2
  const length = 2 * Math.PI * radius
  const share = Math.min(1, goal > 0 ? xp / goal : 0)
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={cn("-rotate-90", className)}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--muted)"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={share >= 1 ? "var(--primary)" : "var(--reward)"}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={length}
        strokeDashoffset={length * (1 - share)}
        className="transition-[stroke-dashoffset] duration-(--duration-slower)"
      />
    </svg>
  )
}
