import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

import { passwordRules } from "../schemas"

type PasswordRulesProps = {
  id?: string
  password: string
  submitted: boolean
}

const labels = {
  length: "At least 8 characters",
  letterAndNumber: "At least one letter and one number",
} as const

export function PasswordRules({ id, password, submitted }: PasswordRulesProps) {
  const rules = passwordRules(password)
  const typed = password.length > 0

  return (
    <ul id={id} className="mt-0.5 flex flex-col gap-[7px]">
      {(Object.keys(labels) as (keyof typeof labels)[]).map((key) => {
        const met = rules[key]
        const state = met ? "met" : submitted ? "missing" : "pending"
        return (
          <li
            key={key}
            data-state={state}
            className={cn(
              "flex items-center gap-[9px] text-sm text-muted-foreground",
              state === "met" && "text-success-text",
              state === "missing" && "text-danger-text"
            )}
          >
            <i
              aria-hidden="true"
              className={cn(
                "grid size-[18px] shrink-0 place-items-center rounded-full border-[1.5px] border-input text-transparent transition-colors duration-(--duration-fast)",
                state === "met" &&
                  "border-success bg-success text-success-foreground",
                state === "missing" && "border-danger text-danger"
              )}
            >
              <Check className="size-[11px]" strokeWidth={3.2} />
            </i>
            {labels[key]}
            <span className="sr-only">
              {state === "met"
                ? " (done)"
                : state === "missing"
                  ? " (still needed)"
                  : typed
                    ? " (not yet)"
                    : ""}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
