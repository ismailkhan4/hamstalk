"use client"

import { Check, Info, NotebookPen, X } from "lucide-react"
import { useEffect, useRef } from "react"

import { playFeedback } from "@/features/celebrations/feedback"
import { Mascot, type MascotMood } from "@/features/celebrations/mascot"
import { cn } from "@/lib/utils"

type FeedbackResult = "correct" | "incorrect" | "shown"

type ExerciseFeedbackProps = {
  result: FeedbackResult
  title: string
  children: React.ReactNode
  titleLang?: "de"
  /** Shown on a first miss: the item went to the mistakes notebook. */
  savedToMistakes?: boolean
  action: React.ReactNode
}

const icons = { correct: Check, incorrect: X, shown: Info }
const moods: Record<FeedbackResult, MascotMood> = {
  correct: "happy",
  incorrect: "sad",
  shown: "thinking",
}

/**
 * The sticky lesson footer in its feedback state. It slides up with a sound and a reaction from
 * Quietschi. Correct answers are announced politely, misses assertively, so screen-reader users
 * hear why before they move on.
 */
function ExerciseFeedback({
  result,
  title,
  titleLang,
  children,
  savedToMistakes = false,
  action,
}: ExerciseFeedbackProps) {
  const Icon = icons[result]

  // Once per appearance, even when development mode runs effects twice.
  const played = useRef<FeedbackResult | null>(null)
  useEffect(() => {
    if (played.current === result) return
    played.current = result
    playFeedback(result === "correct" ? "correct" : "incorrect")
  }, [result])

  return (
    <div
      data-result={result}
      className={cn(
        "border-t-2 motion-safe:animate-sheet-up",
        result === "correct"
          ? "border-success-border bg-success-subtle"
          : "border-danger-border bg-danger-subtle"
      )}
    >
      <div className="mx-auto flex max-w-[740px] flex-wrap items-center justify-end gap-x-4 gap-y-3 px-[clamp(20px,4vw,32px)] py-4">
        <div
          role={result === "correct" ? "status" : "alert"}
          className="flex min-w-0 flex-[1_1_360px] items-center gap-3.5"
        >
          <span className="relative shrink-0">
            <Mascot mood={moods[result]} size={60} />
            <span
              aria-hidden="true"
              className={cn(
                "absolute -right-1 -bottom-1 grid size-6 place-items-center rounded-full ring-2 motion-safe:animate-pop",
                result === "correct" &&
                  "bg-success text-success-foreground ring-success-subtle",
                result !== "correct" &&
                  "bg-danger text-danger-foreground ring-danger-subtle"
              )}
            >
              <Icon className="size-3.5" strokeWidth={3.2} />
            </span>
          </span>
          <div className="min-w-0">
            <p
              className={cn(
                "font-display text-[1.375rem] leading-[1.2] font-semibold",
                result === "correct" ? "text-success-text" : "text-danger-text"
              )}
            >
              <span lang={titleLang}>{title}</span>
            </p>
            <div className="mt-0.5 text-[0.9375rem] leading-normal text-secondary-text">
              {children}
            </div>
            {savedToMistakes && (
              <p className="mt-1.5 inline-flex items-center gap-1.5 text-[0.8125rem] font-bold text-muted-foreground">
                <NotebookPen aria-hidden="true" className="size-[15px]" />
                Saved to your mistakes notebook
              </p>
            )}
          </div>
        </div>
        <div className="shrink-0">{action}</div>
      </div>
    </div>
  )
}

export { ExerciseFeedback }
export type { FeedbackResult }
