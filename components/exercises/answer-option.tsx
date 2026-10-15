import { Check, X } from "lucide-react"

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
  lang?: "de" | "en"
  locked?: boolean
  onSelect?: () => void
  children: React.ReactNode
  translation?: string
  keyLabel?: string
}

/** One choice in a radiogroup. Every state pairs colour with a border change, an icon and a word. */
function AnswerOption({
  index,
  state,
  lang = "en",
  locked = false,
  onSelect,
  children,
  translation,
  keyLabel,
}: AnswerOptionProps) {
  const key = keyLabel ?? String.fromCharCode(65 + index)
  const label = statusLabel[state]
  const isPositive = positive.has(state)
  const isNegative = negative.has(state)

  return (
    <button
      type="button"
      role="radio"
      aria-checked={learnerChoice.has(state)}
      aria-disabled={locked || undefined}
      data-state={state}
      onClick={locked ? undefined : onSelect}
      className={cn(
        "flex min-h-14 w-full items-center gap-3.5 rounded-lg border-[1.5px] border-border bg-card px-4 py-3 text-left text-[1.0625rem] leading-[1.35] font-medium text-foreground transition-[border-color,background-color,box-shadow] duration-(--duration-fast) ease-out",
        !locked && "cursor-pointer hover:border-input",
        locked && "cursor-default",
        state === "selected" &&
          "border-primary bg-primary-subtle shadow-[inset_0_0_0_1px_var(--primary)]",
        isPositive &&
          "border-success bg-success-subtle shadow-[inset_0_0_0_1px_var(--success)]",
        isNegative &&
          "border-danger bg-danger-subtle shadow-[inset_0_0_0_1px_var(--danger)]",
        state === "incorrect" && "motion-safe:animate-nudge",
        state === "dimmed" && "opacity-55"
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "grid size-[30px] shrink-0 place-items-center rounded-md text-[0.8125rem] font-semibold text-muted-foreground shadow-[inset_0_0_0_1.5px_var(--border)]",
          state === "selected" &&
            "bg-primary text-primary-foreground shadow-none",
          isPositive && "bg-success text-success-foreground shadow-none",
          isNegative && "bg-danger text-danger-foreground shadow-none"
        )}
      >
        {key}
      </span>
      <span className="min-w-0 flex-1">
        <span
          lang={lang}
          className={cn(
            "block",
            lang === "de" && "font-voice text-lg font-normal"
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
            "inline-flex shrink-0 items-center gap-1.5 text-[0.8438rem] font-semibold whitespace-nowrap",
            isPositive && "text-success-text",
            isNegative && "text-danger-text"
          )}
        >
          {isPositive ? (
            <Check aria-hidden="true" className="size-4" />
          ) : (
            <X aria-hidden="true" className="size-4" />
          )}
          {label}
        </span>
      )}
    </button>
  )
}

export { AnswerOption }
export type { AnswerOptionState }
