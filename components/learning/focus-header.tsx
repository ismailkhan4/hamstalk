"use client"

import { CircleCheck, X } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { COMBO_GLOW_AT } from "@/features/celebrations/combo"
import { useLessMotion } from "@/features/celebrations/use-less-motion"
import { cn } from "@/lib/utils"

type FocusHeaderProps = {
  closeLabel: string
  onClose: () => void
  title?: string
  titleLang?: string
  /** A lesson's ticket number, e.g. KLAR-102, shown before the title. */
  ticket?: string
  progress?: { current: number; total: number; done?: boolean }
  /** Answers right first time in a row. From COMBO_GLOW_AT, the build shows as passing. */
  combo?: number
}

/**
 * Focus mode chrome for lessons and checks: close, the ticket you're working on, and the steps
 * as a pipeline, each one turning green as it passes.
 */
export function FocusHeader({
  closeLabel,
  onClose,
  title,
  titleLang,
  ticket,
  progress,
  combo = 0,
}: FocusHeaderProps) {
  const still = useLessMotion()
  const passing = combo >= COMBO_GLOW_AT && !progress?.done

  return (
    <header className="sticky top-0 z-(--z-header) border-b-2 border-border-subtle bg-background">
      <div className="mx-auto flex max-w-(--lesson-max) flex-col gap-2.5 px-[clamp(12px,3vw,32px)] pt-2.5 pb-3">
        <div className="flex min-h-11 items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="-ml-2 grid size-11 shrink-0 place-items-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <X aria-hidden="true" className="size-6" strokeWidth={2.6} />
          </button>
          <p className="flex min-w-0 flex-1 items-center gap-2">
            {ticket && (
              <span className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs font-semibold text-muted-foreground">
                {ticket}
              </span>
            )}
            {title && (
              <span
                lang={titleLang}
                className="truncate font-extrabold text-secondary-text"
              >
                {title}
              </span>
            )}
          </p>
          <AnimatePresence>
            {passing && (
              <motion.span
                key="passing"
                initial={still ? false : { opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="inline-flex shrink-0 items-center gap-1 rounded-full bg-success-subtle px-2.5 py-1 text-xs font-extrabold text-success-text"
              >
                <CircleCheck
                  aria-hidden="true"
                  className="size-3.5"
                  strokeWidth={3}
                />
                build passing · {combo}
              </motion.span>
            )}
          </AnimatePresence>
          {progress && (
            <p
              aria-live="polite"
              className="shrink-0 font-mono text-sm font-semibold text-muted-foreground tabular-nums"
            >
              {progress.done
                ? "done"
                : `${progress.current + 1}/${progress.total}`}
            </p>
          )}
        </div>
        {progress && (
          <ol aria-hidden="true" className="flex gap-1">
            {Array.from({ length: progress.total }, (_, i) => {
              const done = progress.done || i < progress.current
              const current = !progress.done && i === progress.current
              return (
                <li
                  key={i}
                  className={cn(
                    "h-2.5 flex-1 rounded-[3px] transition-colors duration-(--duration-slow)",
                    done ? "bg-success" : "bg-muted",
                    current &&
                      "bg-spark-subtle shadow-[inset_0_0_0_2px_var(--spark)] motion-safe:animate-pulse"
                  )}
                />
              )
            })}
          </ol>
        )}
      </div>
    </header>
  )
}
