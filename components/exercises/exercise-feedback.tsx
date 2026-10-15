"use client"

import {
  CircleCheck,
  GitPullRequestArrow,
  Lightbulb,
  NotebookPen,
} from "lucide-react"
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

const REVIEW: Record<
  FeedbackResult,
  {
    status: string
    icon: typeof CircleCheck
    mood: MascotMood
    card: string
    head: string
    pill: string
    title: string
  }
> = {
  correct: {
    status: "Approved",
    icon: CircleCheck,
    mood: "happy",
    card: "border-success-border",
    head: "border-success-border bg-success-subtle",
    pill: "bg-success text-success-foreground",
    title: "text-success-text",
  },
  incorrect: {
    status: "Changes requested",
    icon: GitPullRequestArrow,
    mood: "sad",
    card: "border-danger-border",
    head: "border-danger-border bg-danger-subtle",
    pill: "bg-danger text-danger-foreground",
    title: "text-danger-text",
  },
  shown: {
    status: "Suggested change",
    icon: Lightbulb,
    mood: "thinking",
    card: "border-info-border",
    head: "border-info-border bg-info-subtle",
    pill: "bg-info text-info-foreground",
    title: "text-info-text",
  },
}

/**
 * The lesson's feedback, as a code review: Quietschi reviews your answer, approves it or requests
 * a change, and explains why. Docked at the bottom with the next action. Approvals are announced
 * politely, change requests assertively, so screen-reader users hear why before they move on.
 */
function ExerciseFeedback({
  result,
  title,
  titleLang,
  children,
  savedToMistakes = false,
  action,
}: ExerciseFeedbackProps) {
  const review = REVIEW[result]
  const Icon = review.icon

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
      className="border-t-2 border-border-subtle bg-background/95 backdrop-blur motion-safe:animate-sheet-up"
    >
      <div className="mx-auto max-w-185 px-[clamp(12px,3vw,32px)] py-3">
        <article
          role={result === "correct" ? "status" : "alert"}
          className={cn(
            "overflow-hidden rounded-2xl border-2 bg-card",
            review.card
          )}
        >
          <header
            className={cn(
              "flex flex-wrap items-center gap-x-2 gap-y-1 border-b-2 py-1.5 pr-3 pl-1.5",
              review.head
            )}
          >
            <Mascot mood={review.mood} size={34} />
            <p className="text-sm">
              <b className="font-extrabold">Quietschi</b>{" "}
              <span className="font-semibold text-muted-foreground">
                reviewed your answer
              </span>
            </p>
            <span
              className={cn(
                "ml-auto inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-extrabold motion-safe:animate-pop",
                review.pill
              )}
            >
              <Icon aria-hidden="true" className="size-3.5" strokeWidth={3} />
              {review.status}
            </span>
          </header>
          <div className="flex flex-wrap items-end justify-end gap-x-4 gap-y-3 px-4 py-3">
            <div className="min-w-0 flex-[1_1_320px]">
              <p
                className={cn(
                  "font-display text-xl leading-tight font-semibold",
                  review.title
                )}
              >
                <span lang={titleLang}>{title}</span>
              </p>
              <div className="mt-0.5 text-[0.9375rem] leading-normal font-semibold text-secondary-text">
                {children}
              </div>
              {savedToMistakes && (
                <p className="mt-1.5 inline-flex items-center gap-1.5 text-[0.8125rem] font-bold text-muted-foreground">
                  <NotebookPen aria-hidden="true" className="size-3.75" />
                  Saved to your mistakes notebook
                </p>
              )}
            </div>
            <div className="shrink-0">{action}</div>
          </div>
        </article>
      </div>
    </div>
  )
}

export { ExerciseFeedback }
export type { FeedbackResult }
