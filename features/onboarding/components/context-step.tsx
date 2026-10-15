import {
  CalendarDays,
  Code,
  Coffee,
  Headphones,
  Mail,
  MessagesSquare,
  Mic,
  UserRound,
  type LucideIcon,
} from "lucide-react"

import { ChoiceRow } from "@/components/forms/choice-row"

import { CONTEXTS, contextOptions, type Context } from "../options"
import { StepHeading } from "./step-heading"

const icons: Record<Context, LucideIcon> = {
  standups: MessagesSquare,
  meetings: CalendarDays,
  technical: Code,
  interviews: UserRound,
  messaging: Mail,
  everyday: Coffee,
  listening: Headphones,
  speaking: Mic,
}

type ContextStepProps = {
  value: Context[]
  onChange: (contexts: Context[]) => void
}

export function ContextStep({ value, onChange }: ContextStepProps) {
  function toggle(context: Context, checked: boolean) {
    const next = checked
      ? [...value, context]
      : value.filter((item) => item !== context)
    onChange(CONTEXTS.filter((item) => next.includes(item)))
  }

  return (
    <>
      <StepHeading
        title="Where would you like to use your German?"
        lede="Choose the situations you care about. We’ll practise these first and mix in the everyday German you need anyway."
      />
      <fieldset className="mt-8">
        <legend className="flex w-full justify-between text-sm">
          <span className="text-secondary-text">Choose any that apply</span>
          <span aria-live="polite" className="font-semibold">
            {value.length === 0 ? "None selected" : `${value.length} selected`}
          </span>
        </legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {CONTEXTS.map((context) => {
            const Icon = icons[context]
            return (
              <ChoiceRow
                key={context}
                type="checkbox"
                name="contexts"
                value={context}
                checked={value.includes(context)}
                onChange={(checked) => toggle(context, checked)}
                title={contextOptions[context].title}
                description={contextOptions[context].text}
                leading={
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-inset text-secondary-text group-has-checked:bg-card">
                    <Icon aria-hidden="true" className="size-[17px]" />
                  </span>
                }
              />
            )
          })}
        </div>
      </fieldset>
    </>
  )
}
