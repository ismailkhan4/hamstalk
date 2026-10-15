"use client"

import { Flame, X } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { COMBO_GLOW_AT } from "@/features/celebrations/combo"
import { useLessMotion } from "@/features/celebrations/use-less-motion"
import { cn } from "@/lib/utils"

type FocusHeaderProps = {
  closeLabel: string
  onClose: () => void
  title?: string
  progress?: { current: number; total: number; done?: boolean }
  /** Answers right first time in a row. From COMBO_GLOW_AT, the bar catches fire. */
  combo?: number
}

/** Focus mode chrome for lessons and checks: a close button, a springy progress bar and a count. */
export function FocusHeader({
  closeLabel,
  onClose,
  title,
  progress,
  combo = 0,
}: FocusHeaderProps) {
  const still = useLessMotion()
  const onFire = combo >= COMBO_GLOW_AT && !progress?.done
  const share = progress
    ? (progress.done ? progress.total : progress.current) /
      Math.max(1, progress.total)
    : 0

  return (
    <header className="sticky top-0 z-(--z-header) bg-background">
      <div className="flex min-h-[64px] items-center gap-4 px-[clamp(12px,3vw,32px)]">
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="grid size-11 shrink-0 place-items-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <X aria-hidden="true" className="size-6" strokeWidth={2.6} />
        </button>
        {progress ? (
          <>
            <div
              aria-hidden="true"
              className={cn(
                "relative h-4 flex-1 rounded-full bg-muted",
                onFire && "motion-safe:animate-glow"
              )}
            >
              <motion.div
                className={cn(
                  "absolute inset-y-0 left-0 min-w-4 rounded-full transition-colors duration-(--duration-slow)",
                  onFire ? "bg-spark" : "bg-primary"
                )}
                initial={false}
                animate={{ width: `${Math.max(share * 100, 0)}%` }}
                transition={
                  still
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 140, damping: 18 }
                }
              >
                {/* The glossy highlight that makes the bar look like a tube. */}
                <span className="absolute inset-x-2.5 top-[3px] h-[4px] rounded-full bg-white/35" />
              </motion.div>
              <AnimatePresence>
                {onFire && (
                  <motion.span
                    key="combo"
                    initial={still ? false : { opacity: 0, y: 6, scale: 0.6 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    className="absolute -top-5 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-spark px-2 py-0.5 text-[0.75rem] font-extrabold whitespace-nowrap text-spark-foreground"
                  >
                    <Flame className="size-3.5" strokeWidth={2.6} />
                    {combo} in a row
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <p
              aria-live="polite"
              className="shrink-0 text-sm font-bold text-muted-foreground tabular-nums"
            >
              {progress.done
                ? "Done"
                : `${progress.current + 1} of ${progress.total}`}
            </p>
          </>
        ) : (
          <p className="truncate text-[0.9062rem] font-bold text-secondary-text">
            {title}
          </p>
        )}
      </div>
    </header>
  )
}
