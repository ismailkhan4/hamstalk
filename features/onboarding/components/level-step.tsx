import { Compass, Info, Sparkles } from "lucide-react"
import Link from "next/link"

import { ChoiceRow } from "@/components/forms/choice-row"
import { GermanText } from "@/components/learning/german-text"
import { cn } from "@/lib/utils"

import { LEVELS, levelOptions, type StartLevel } from "../options"
import { StepHeading } from "./step-heading"

const codeStyles: Record<StartLevel, string> = {
  beginner: "bg-reward-subtle text-reward-text",
  a1: "bg-level-a1-subtle text-level-a1",
  a2: "bg-level-a2-subtle text-level-a2",
  b1: "bg-level-b1-subtle text-level-b1",
  b2: "bg-level-b2-subtle text-level-b2",
}

const notes: Record<StartLevel, string> = {
  beginner:
    "Great place to start. Your first lesson begins with greetings and one sentence you’ll use all the time:",
  a1: "You’ll start at Unit 3 with names, jobs and countries. Units 1 and 2 stay open for a quick review.",
  a2: "A2 starts with talking about yesterday and team messages. Its lessons are planned; you can preview the path.",
  b1: "B1 starts with explaining problems and giving reasons. Its lessons are planned; you can preview the path.",
  b2: "B2 is about meetings, decisions and nuance. Its lessons are planned; you can preview the path.",
}

type LevelStepProps = {
  value: StartLevel | null
  firstName: string
  onChange: (level: StartLevel) => void
}

export function LevelStep({ value, firstName, onChange }: LevelStepProps) {
  return (
    <>
      <StepHeading
        title="Where are you starting from?"
        lede="Choose what sounds most like you today. There’s no wrong answer."
      />
      <fieldset className="mt-8">
        <legend className="sr-only">Your German today</legend>
        <div className="relative flex flex-col gap-3 pl-7">
          <span
            aria-hidden="true"
            className="absolute top-6 bottom-6 left-[7px] w-0.5 bg-border"
          />
          {LEVELS.map((level) => (
            <div key={level} className="relative">
              <i
                aria-hidden="true"
                className={cn(
                  "absolute top-1/2 -left-[26px] size-3 -translate-y-1/2 rounded-full border-2 border-input bg-background",
                  value === level && "border-spark bg-spark"
                )}
              />
              <ChoiceRow
                type="radio"
                name="level"
                value={level}
                checked={value === level}
                onChange={() => onChange(level)}
                title={levelOptions[level].title}
                description={levelOptions[level].text}
                leading={
                  <span
                    className={cn(
                      "grid h-9 w-12 shrink-0 place-items-center rounded-md text-[13px] font-bold",
                      codeStyles[level]
                    )}
                  >
                    {levelOptions[level].code}
                  </span>
                }
              />
            </div>
          ))}
        </div>
      </fieldset>
      {value && (
        <p
          role="status"
          className="mt-5 flex gap-3 rounded-xl border border-border bg-card p-4 text-[15px]"
        >
          <Sparkles
            aria-hidden="true"
            className="mt-0.5 size-[18px] shrink-0 text-primary-text"
          />
          <span>
            {notes[value]}
            {value === "beginner" && (
              <>
                {" "}
                <GermanText className="text-[17px]">
                  Ich heiße {firstName}.
                </GermanText>
              </>
            )}
          </span>
        </p>
      )}
      <ul className="mt-5 flex flex-col gap-2 text-sm text-secondary-text">
        <li className="flex gap-2.5">
          <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          This is a starting point, not a test or an official CEFR rating. If
          lessons feel too easy or too hard, you can change it any time.
        </li>
        <li className="flex gap-2.5">
          <Compass aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <span>
            Not sure?{" "}
            <Link
              href="/placement"
              className="font-semibold text-primary-text underline underline-offset-[3px]"
            >
              Take the optional 6-minute placement check
            </Link>{" "}
            and we’ll suggest a starting point.
          </span>
        </li>
      </ul>
    </>
  )
}
