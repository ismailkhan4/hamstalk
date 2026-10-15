import { Check, Info } from "lucide-react"

import { cn } from "@/lib/utils"

import {
  DAILY_MINUTES,
  dailyOptions,
  REMINDER_TIMES,
  type DailyMinutes,
} from "../options"
import { StepHeading } from "./step-heading"

type DailyStepProps = {
  minutes: DailyMinutes | null
  reminderEnabled: boolean
  reminderTime: (typeof REMINDER_TIMES)[number] | null
  onMinutes: (minutes: DailyMinutes) => void
  onReminder: (
    enabled: boolean,
    time: (typeof REMINDER_TIMES)[number] | null
  ) => void
}

export function DailyStep({
  minutes,
  reminderEnabled,
  reminderTime,
  onMinutes,
  onReminder,
}: DailyStepProps) {
  return (
    <>
      <StepHeading
        title="Let’s make German part of your day."
        lede="Pick a daily goal you can keep on a busy day. Small and steady works better than long and rare."
      />
      <fieldset className="mt-8">
        <legend className="sr-only">Daily learning goal</legend>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {DAILY_MINUTES.map((value) => {
            const checked = minutes === value
            const option = dailyOptions[value]
            return (
              <label
                key={value}
                className={cn(
                  "relative flex cursor-pointer flex-col rounded-xl border-[1.5px] border-border bg-card p-3.5 transition-[border-color,background-color] duration-(--duration-fast) hover:border-input",
                  "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring",
                  checked &&
                    "border-primary bg-primary-subtle shadow-[inset_0_0_0_1px_var(--primary)] hover:border-primary"
                )}
              >
                <input
                  type="radio"
                  name="daily"
                  value={value}
                  checked={checked}
                  onChange={() => onMinutes(value)}
                  className="sr-only"
                />
                <span className="flex items-start justify-between">
                  <span className="font-display text-[2.5rem] leading-none font-bold tracking-tight">
                    {value}
                    <span className="ml-1 font-sans text-sm font-normal text-muted-foreground">
                      min
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "grid size-[22px] place-items-center rounded-full border-[1.5px] border-input text-transparent",
                      checked &&
                        "border-primary bg-primary text-primary-foreground"
                    )}
                  >
                    <Check className="size-3.5" strokeWidth={3} />
                  </span>
                </span>
                {option.tag && (
                  <span className="mt-3 w-fit rounded-sm bg-reward-subtle px-1.5 py-0.5 text-[0.7188rem] font-semibold text-reward-text">
                    {option.tag}
                  </span>
                )}
                <span className="mt-3 text-sm text-secondary-text">
                  {option.text}
                </span>
              </label>
            )
          })}
        </div>
      </fieldset>

      <div className="mt-5 rounded-xl border border-border bg-card p-4">
        <label className="flex cursor-pointer items-start gap-3.5">
          <input
            type="checkbox"
            role="switch"
            checked={reminderEnabled}
            onChange={(event) =>
              onReminder(event.target.checked, reminderTime ?? "08:30")
            }
            className="peer sr-only"
          />
          <span
            aria-hidden="true"
            className={cn(
              "relative mt-0.5 h-6 w-11 shrink-0 rounded-full bg-input transition-colors duration-(--duration-fast) peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring",
              reminderEnabled && "bg-primary"
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 left-0.5 size-5 rounded-full bg-card shadow-sm transition-transform duration-(--duration-fast)",
                reminderEnabled && "translate-x-5"
              )}
            />
          </span>
          <span>
            <span className="font-semibold">Daily reminder</span>{" "}
            <span className="text-muted-foreground">· optional</span>
            <span className="mt-0.5 block text-sm text-muted-foreground">
              Nothing is switched on yet. You’ll confirm reminders later in
              Settings.
            </span>
          </span>
        </label>
        {reminderEnabled && (
          <label className="mt-4 ml-[58px] flex items-center gap-3 text-sm font-semibold">
            Remind me at
            <select
              value={reminderTime ?? "08:30"}
              onChange={(event) =>
                onReminder(
                  true,
                  REMINDER_TIMES.find((time) => time === event.target.value) ??
                    "08:30"
                )
              }
              className="h-10 rounded-md border-[1.5px] border-input bg-card px-3 text-base font-normal"
            >
              {REMINDER_TIMES.map((time) => (
                <option key={time}>{time}</option>
              ))}
            </select>
          </label>
        )}
      </div>
      <p className="mt-5 flex gap-2.5 text-sm text-secondary-text">
        <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
        You can change your daily goal any time. Rest days are part of the plan;
        missing one never resets your progress.
      </p>
    </>
  )
}
