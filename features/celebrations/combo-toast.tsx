"use client"

import { AnimatePresence, motion } from "motion/react"

import type { ComboMilestone } from "./combo"
import { Mascot } from "./mascot"
import { useLessMotion } from "./use-less-motion"

/** "5 in a row!": pops in under the progress bar when a combo hits a milestone, then floats away. */
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
      className="pointer-events-none fixed inset-x-0 top-[72px] z-(--z-toast) flex justify-center px-4"
    >
      <AnimatePresence>
        {milestone && (
          <motion.div
            key={milestone.count}
            initial={
              still ? { opacity: 0 } : { opacity: 0, y: -16, scale: 0.7 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={still ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.9 }}
            transition={
              still
                ? { duration: 0.15 }
                : { type: "spring", stiffness: 380, damping: 18 }
            }
            className="flex items-center gap-2 rounded-2xl border-2 border-spark-border bg-spark-subtle py-1.5 pr-4 pl-1.5 shadow-lg"
          >
            <Mascot mood="cheer" size={44} />
            <p className="leading-tight">
              <span className="block font-display text-lg font-semibold text-spark-text">
                {milestone.count} in a row!
              </span>
              <span
                lang="de"
                className="block text-sm font-bold text-secondary-text"
              >
                {milestone.cheer}
              </span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
