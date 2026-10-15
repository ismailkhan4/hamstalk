"use client"

import { CircleCheck } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import type { ComboMilestone } from "./combo"
import { Mascot } from "./mascot"
import { useLessMotion } from "./use-less-motion"

/**
 * A combo milestone, delivered like a CI notification: the build is green, here's how many checks
 * passed in a row. Slides in under the header, then leaves on its own.
 */
export function ComboToast({
  milestone,
}: {
  milestone: ComboMilestone | null
}) {
  const still = useLessMotion()
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-[92px] z-(--z-toast) flex justify-center px-4"
    >
      <AnimatePresence>
        {milestone && (
          <motion.div
            key={milestone.count}
            initial={still ? { opacity: 0 } : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={still ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={
              still
                ? { duration: 0.15 }
                : { type: "spring", stiffness: 420, damping: 26 }
            }
            className="flex items-center gap-3 rounded-2xl border-2 border-success-border bg-card py-2 pr-4 pl-2 shadow-lg"
          >
            <Mascot mood="cheer" size={40} />
            <div className="leading-tight">
              <p className="flex items-center gap-1.5 text-sm font-extrabold text-success-text">
                <CircleCheck
                  aria-hidden="true"
                  className="size-4"
                  strokeWidth={3}
                />
                Build passing
              </p>
              <p className="mt-0.5 font-display text-lg font-semibold">
                {milestone.count} green checks ·{" "}
                <span lang="de">{milestone.cheer}</span>
              </p>
            </div>
            <span aria-hidden="true" className="flex gap-0.5 self-end pb-1">
              {Array.from({ length: Math.min(milestone.count, 5) }, (_, i) => (
                <span
                  key={i}
                  className="size-2 rounded-[2px] bg-success motion-safe:animate-pop"
                  style={{ animationDelay: `${i * 70}ms` }}
                />
              ))}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
