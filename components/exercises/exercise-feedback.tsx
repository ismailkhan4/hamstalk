import { Check, Info, NotebookPen, X } from "lucide-react"

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

/**
 * The sticky lesson footer in its feedback state. Correct answers are announced politely,
 * misses assertively, so screen-reader users hear why before they move on.
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
  return (
    <div
      data-result={result}
      className={cn(
        "border-t",
        result === "correct"
          ? "border-success-border bg-success-subtle"
          : "border-danger-border bg-danger-subtle"
      )}
    >
      <div className="mx-auto flex max-w-[740px] flex-wrap items-center justify-end gap-x-4 gap-y-3 px-[clamp(20px,4vw,32px)] py-4">
        <div
          role={result === "correct" ? "status" : "alert"}
          className="flex min-w-0 flex-[1_1_360px] items-start gap-3.5"
        >
          <span
            className={cn(
              "grid size-10 shrink-0 place-items-center rounded-full",
              result === "correct" && "bg-success text-success-foreground",
              result === "incorrect" && "bg-danger text-danger-foreground",
              result === "shown" && "bg-primary-subtle text-primary-text"
            )}
          >
            <Icon
              aria-hidden="true"
              className="size-[22px]"
              strokeWidth={2.6}
            />
          </span>
          <div className="min-w-0">
            <p
              className={cn(
                "text-[17px] leading-[1.3] font-bold",
                result === "correct" ? "text-success-text" : "text-danger-text"
              )}
            >
              <span lang={titleLang}>{title}</span>
            </p>
            <div className="mt-0.5 text-[15px] leading-normal text-secondary-text">
              {children}
            </div>
            {savedToMistakes && (
              <p className="mt-1.5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted-foreground">
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
