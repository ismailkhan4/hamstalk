import { Check, X } from "lucide-react"

import { TARGET_LANG } from "@/content/courses"
import { cn } from "@/lib/utils"

type AnswerOptionState =
  | "idle"
  | "selected"
  | "correct"
  | "incorrect"
  | "correct-answer"
  | "also-right"
  | "your-answer"
  | "dimmed"

const statusLabel: Partial<Record<AnswerOptionState, string>> = {
  correct: "Correct",
  incorrect: "Not this one",
  "correct-answer": "Correct answer",
  "also-right": "Also right",
  "your-answer": "Your answer",
}

const positive = new Set<AnswerOptionState>([
  "correct",
  "correct-answer",
  "also-right",
])
const negative = new Set<AnswerOptionState>(["incorrect", "your-answer"])
const learnerChoice = new Set<AnswerOptionState>([
  "selected",
  "correct",
  "incorrect",
  "your-answer",
])

type AnswerOptionProps = {
  index: number
  state: AnswerOptionState
  /** Whose language the option is in: the course's target language, or the learner's own. */
  language?: "target" | "native"
  locked?: boolean
  onSelect?: () => void
  children: React.ReactNode
  translation?: string
  keyLabel?: string
}

/**
 * One choice in a radiogroup, drawn as a line in a diff. The gutter shows its number (the key that
 * picks it); once checked, a right answer gets a green + and a wrong one a red −. Every state pairs
 * colour with a symbol and a word.
 */
function AnswerOption({
  index,
  state,
  language = "native",
  locked = false,
  onSelect,
  children,
  translation,
  keyLabel,
}: AnswerOptionProps) {
  const label = statusLabel[state]
  const isPositive = positive.has(state)
  const isNegative = negative.has(state)
  const gutter = isPositive
    ? "+"
    : isNegative
      ? "−"
      : (keyLabel ?? String(index + 1))

  return (
    <button
      type="button"
      role="radio"
      aria-checked={learnerChoice.has(state)}
      aria-disabled={locked || undefined}
      data-state={state}
      onClick={locked ? undefined : onSelect}
      className={cn(
        "flex min-h-14 w-full items-stretch overflow-hidden rounded-xl border-2 border-border bg-card text-left text-[1.0625rem] leading-[1.35] font-semibold text-foreground transition-[border-color,background-color,transform] duration-(--duration-instant) ease-out",
        !locked &&
          "cursor-pointer hover:border-input hover:bg-background-subtle active:scale-[0.99]",
        locked && "cursor-default",
        state === "selected" &&
          "border-selected-border bg-selected text-selected-text hover:border-selected-border hover:bg-selected",
        isPositive && "border-success bg-success-subtle text-success-text",
        isNegative && "border-danger bg-danger-subtle text-danger-text",
        state === "incorrect" && "motion-safe:animate-shake",
        state === "correct" && "motion-safe:animate-bump",
        state === "dimmed" && "opacity-55"
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "grid w-11 shrink-0 place-items-center border-r-2 border-border bg-background-subtle font-mono text-sm font-semibold text-muted-foreground",
          state === "selected" && "border-info bg-info text-info-foreground",
          isPositive &&
            "border-success bg-success text-base text-success-foreground",
          isNegative &&
            "border-danger bg-danger text-base text-danger-foreground"
        )}
      >
        {gutter}
      </span>
      <span className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3">
        <span className="min-w-0 flex-1">
          <span
            lang={language === "target" ? TARGET_LANG : "en"}
            className={cn(
              "block",
              language === "target" && "font-voice text-lg",
              state === "your-answer" && "line-through decoration-2"
            )}
          >
            {children}
          </span>
          {translation && (
            <span className="mt-0.5 block text-sm font-normal text-muted-foreground">
              {translation}
            </span>
          )}
        </span>
        {label && (
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 text-[0.8438rem] font-bold whitespace-nowrap",
              isPositive && "text-success-text",
              isNegative && "text-danger-text"
            )}
          >
            {isPositive ? (
              <Check aria-hidden="true" className="size-4" strokeWidth={3} />
            ) : (
              <X aria-hidden="true" className="size-4" strokeWidth={3} />
            )}
            {label}
          </span>
        )}
      </span>
    </button>
  )
}

export { AnswerOption }
export type { AnswerOptionState }
