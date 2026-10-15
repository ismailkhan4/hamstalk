import {
  BookOpen,
  Briefcase,
  Code,
  Compass,
  House,
  Users,
  type LucideIcon,
} from "lucide-react"

import { ChoiceRow } from "@/components/forms/choice-row"

import { GOALS, goalOptions, type Goal } from "../options"
import { StepHeading } from "./step-heading"

const icons: Record<Goal, LucideIcon> = {
  work: Briefcase,
  interviews: Code,
  colleagues: Users,
  everyday: House,
  general: BookOpen,
  other: Compass,
}

export function GoalStep({
  value,
  onChange,
}: {
  value: Goal | null
  onChange: (goal: Goal) => void
}) {
  return (
    <>
      <StepHeading
        title="What are you learning German for?"
        lede="Pick the one that matters most right now. It shapes your first missions, and you can change it later."
      />
      <fieldset className="mt-8">
        <legend className="sr-only">Your main learning goal</legend>
        <div className="flex flex-col gap-3">
          {GOALS.map((goal) => {
            const Icon = icons[goal]
            return (
              <ChoiceRow
                key={goal}
                type="radio"
                name="goal"
                value={goal}
                checked={value === goal}
                onChange={() => onChange(goal)}
                title={goalOptions[goal].title}
                description={goalOptions[goal].text}
                leading={
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-inset text-secondary-text group-has-checked:bg-card">
                    <Icon aria-hidden="true" className="size-[18px]" />
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
