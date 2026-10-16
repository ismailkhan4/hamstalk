import {
  Flame,
  ListChecks,
  Megaphone,
  TramFront,
  Zap,
  type LucideIcon,
} from "lucide-react"

import { MASCOT_NAME } from "@/features/celebrations/mascot-name"
import { cn } from "@/lib/utils"

import { PINS, pinTiers, type Economy, type PinId } from "../model"
import { Nut } from "./nut"

const ICONS: Record<PinId, LucideIcon | "nut"> = {
  streak: Flame,
  stations: TramFront,
  xp: Zap,
  cheeks: "nut",
  standups: Megaphone,
  planner: ListChecks,
}

/** Each tier's enamel colour, from the line colours up to gold. */
const TIER_COLORS = [
  "var(--line-a1)",
  "var(--line-a2)",
  "var(--line-b1)",
  "var(--line-b2)",
  "var(--gold)",
]

/**
 * Hamsti's lanyard: one pin per kind of effort, each upgrading through its tiers. Earned pins show
 * their tier's colour; the next tier's goal sits underneath.
 */
export function Lanyard({ pins }: { pins: Economy["pins"] }) {
  const tiers = pinTiers(pins)
  const earned = PINS.filter((pin) => tiers[pin.id] > 0).length

  return (
    <section
      aria-labelledby="lanyard-title"
      className="relative overflow-hidden rounded-3xl border-2 border-border bg-card p-5 pt-8"
    >
      {/* The strap the pins hang on. */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-3 bg-[repeating-linear-gradient(90deg,var(--primary)_0_14px,var(--primary-edge)_14px_16px)]"
      />
      <div className="flex flex-wrap items-baseline gap-x-3">
        <h2 id="lanyard-title" className="font-display text-xl font-semibold">
          {MASCOT_NAME}’s lanyard
        </h2>
        <p className="text-sm font-semibold text-muted-foreground">
          {earned} of {PINS.length} pins
        </p>
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3">
        {PINS.map((pin) => {
          const tier = tiers[pin.id]
          const max = pin.tiers.length
          const next = pin.tiers[tier]
          const Icon = ICONS[pin.id]
          const color = tier > 0 ? TIER_COLORS[tier - 1] : undefined
          return (
            <li key={pin.id} className="flex flex-col items-center text-center">
              <span
                aria-hidden="true"
                className={cn(
                  "relative grid size-16 place-items-center rounded-full border-4",
                  tier > 0
                    ? "border-foreground/80 shadow-[0_3px_0_var(--border-edge)]"
                    : "border-dashed border-border-edge bg-background-subtle"
                )}
                style={color ? { background: color } : undefined}
              >
                {Icon === "nut" ? (
                  <Nut
                    className={cn(
                      "size-8",
                      tier === 0 && "opacity-40 grayscale"
                    )}
                  />
                ) : (
                  <Icon
                    className={cn(
                      "size-7",
                      tier > 0 ? "text-[#1d2b33]" : "text-muted-foreground"
                    )}
                    strokeWidth={2.4}
                  />
                )}
              </span>
              <span aria-hidden="true" className="mt-1.5 flex gap-1">
                {Array.from({ length: max }, (_, i) => (
                  <i
                    key={i}
                    className={cn(
                      "size-1.5 rounded-full",
                      i < tier ? "bg-foreground" : "bg-border-edge"
                    )}
                  />
                ))}
              </span>
              <p className="mt-1 font-extrabold">{pin.name}</p>
              <p className="text-xs font-semibold text-muted-foreground">
                {tier > 0 && (
                  <span className="sr-only">
                    Tier {tier} of {max}.{" "}
                  </span>
                )}
                {next !== undefined
                  ? `${tier > 0 ? "Next: " : ""}${pin.goal(next)}`
                  : "Every tier earned"}
              </p>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
