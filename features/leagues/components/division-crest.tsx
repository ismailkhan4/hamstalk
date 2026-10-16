import { cn } from "@/lib/utils"

/** Each band of divisions has its crest colour, from the line colours up to gold at the top. */
function crestColor(division: number) {
  if (division >= 10) return "var(--gold)"
  if (division >= 8) return "var(--line-b2)"
  if (division >= 6) return "var(--line-b1)"
  if (division >= 4) return "var(--line-a2)"
  return "var(--line-a1)"
}

/** A club-style crest with the division's number. Decoration: the division is named next to it. */
export function DivisionCrest({
  division,
  size = 48,
  className,
}: {
  division: number
  size?: number
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 40 46"
      width={size}
      height={(size * 46) / 40}
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      <path
        d="M20 2 37 7.5v14.2C37 32.6 29.8 40 20 44 10.2 40 3 32.6 3 21.7V7.5Z"
        fill={crestColor(division)}
        stroke="var(--foreground)"
        strokeOpacity=".8"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M8 12.5h24"
        stroke="#1d2b33"
        strokeOpacity=".35"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <text
        x="20"
        y="32"
        textAnchor="middle"
        fontSize="16"
        fontWeight="800"
        fill="#1d2b33"
        fontFamily="var(--font-display), system-ui, sans-serif"
      >
        {division}
      </text>
    </svg>
  )
}
