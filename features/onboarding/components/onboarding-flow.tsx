"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"

import { Alert } from "@/components/feedback/alert"
import { TeamBadge } from "@/components/learning/team-badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { finishOnboardingAction, saveOnboardingStepAction } from "../actions"
import {
  contextsSummary,
  goalOptions,
  levelOptions,
  missingAnswer,
  ONBOARDING_STEPS,
  type OnboardingStep,
  type Preferences,
} from "../options"
import { ContextStep } from "./context-step"
import { DailyStep } from "./daily-step"
import { GoalStep } from "./goal-step"
import { LevelStep } from "./level-step"
import { OnboardingHeader } from "./onboarding-header"
import { PlanStep } from "./plan-setup"
import { WelcomeStep } from "./welcome-step"

const helpText: Record<OnboardingStep, string> = {
  welcome: "About 2 minutes. You can change every answer later.",
  goal: "You can change this later.",
  level: "You can change this later.",
  context: "Choose as many as you like.",
  daily: "You can change this any time.",
  plan: "",
}

const continueLabel: Record<OnboardingStep, string> = {
  welcome: "Let’s get started",
  goal: "Continue",
  level: "Continue",
  context: "Continue",
  daily: "See my plan",
  plan: "Start my first mission",
}

type OnboardingFlowProps = {
  step: OnboardingStep
  initial: Preferences
  fullName: string
  firstName: string
}

export function OnboardingFlow({
  step,
  initial,
  fullName,
  firstName,
}: OnboardingFlowProps) {
  const router = useRouter()
  const [preferences, setPreferences] = useState(initial)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const index = ONBOARDING_STEPS.indexOf(step)
  const need = missingAnswer(step, preferences)
  const isPlan = step === "plan"

  function update(patch: Partial<Preferences>) {
    setPreferences((current) => ({ ...current, ...patch }))
    setError(null)
  }

  function goTo(target: OnboardingStep) {
    router.push(`/onboarding/${target}`)
  }

  function onContinue() {
    if (need || pending) return
    startTransition(async () => {
      if (isPlan) {
        const result = await finishOnboardingAction()
        if (!result.ok) setError(result.message)
        return
      }
      const next = ONBOARDING_STEPS[index + 1] ?? "plan"
      const result = await saveOnboardingStepAction({
        step: next,
        patch: {
          goal: preferences.goal,
          startLevel: preferences.startLevel,
          contexts: preferences.contexts,
          dailyMinutes: preferences.dailyMinutes,
          reminderEnabled: preferences.reminderEnabled,
          reminderTime: preferences.reminderTime,
        },
      })
      if (result.ok) goTo(next)
      else setError(result.message)
    })
  }

  const badgeRows = [
    {
      label: "Goal",
      value: preferences.goal ? goalOptions[preferences.goal].short : null,
    },
    {
      label: "Starting level",
      value: preferences.startLevel
        ? levelOptions[preferences.startLevel].short
        : null,
    },
    { label: "Practising", value: contextsSummary(preferences.contexts) },
    {
      label: "Daily",
      value: preferences.dailyMinutes
        ? `${preferences.dailyMinutes} min a day`
        : null,
    },
  ]

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <OnboardingHeader step={step} />
      <main
        id="main"
        className="mx-auto grid w-full max-w-(--content-max) flex-1 gap-12 px-[clamp(20px,4vw,48px)] pt-10 pb-32 xl:grid-cols-[minmax(0,1fr)_310px] xl:gap-[88px]"
      >
        <div className="max-w-[680px] min-w-0">
          {error && (
            <Alert tone="error" title="Not saved yet" className="mb-6">
              {error}
            </Alert>
          )}
          {step === "welcome" && (
            <WelcomeStep firstName={firstName} fullName={fullName} />
          )}
          {step === "goal" && (
            <GoalStep
              value={preferences.goal}
              onChange={(goal) => update({ goal })}
            />
          )}
          {step === "level" && (
            <LevelStep
              value={preferences.startLevel}
              firstName={firstName}
              onChange={(startLevel) => update({ startLevel })}
            />
          )}
          {step === "context" && (
            <ContextStep
              value={preferences.contexts}
              onChange={(contexts) => update({ contexts })}
            />
          )}
          {step === "daily" && (
            <DailyStep
              minutes={preferences.dailyMinutes}
              reminderEnabled={preferences.reminderEnabled}
              reminderTime={preferences.reminderTime}
              onMinutes={(dailyMinutes) => update({ dailyMinutes })}
              onReminder={(reminderEnabled, reminderTime) =>
                update({ reminderEnabled, reminderTime })
              }
            />
          )}
          {step === "plan" && (
            <PlanStep preferences={preferences} firstName={firstName} />
          )}
        </div>
        <aside className="hidden xl:sticky xl:top-28 xl:flex xl:flex-col xl:gap-3.5 xl:self-start">
          <p className="max-w-[30ch] text-[13.5px] text-muted-foreground">
            {isPlan
              ? "Your badge is complete. You can edit it any time from your profile."
              : "Your team badge fills in as you answer."}
          </p>
          <TeamBadge
            name={fullName}
            rows={badgeRows}
            footer={
              isPlan
                ? { text: "Ready for day one", ready: true }
                : { text: "Your answers appear here" }
            }
          />
        </aside>
      </main>

      <footer className="fixed inset-x-0 bottom-0 z-(--z-sticky) border-t border-border-subtle bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-(--content-max) items-center gap-4 px-[clamp(20px,4vw,48px)] py-3.5 pb-[max(0.875rem,env(safe-area-inset-bottom))]">
          {index > 0 && (
            <Button
              variant="ghost"
              size="lg"
              iconLeft={<ArrowLeft />}
              onClick={() => goTo(ONBOARDING_STEPS[index - 1] ?? "welcome")}
            >
              Back
            </Button>
          )}
          <p
            id="step-help"
            aria-live="polite"
            className={cn(
              "min-w-0 flex-1 text-[13px] leading-snug text-muted-foreground sm:text-sm",
              need && "text-secondary-text"
            )}
          >
            {need ??
              (isPlan
                ? `Your first mission takes about ${preferences.dailyMinutes ?? 15} minutes.`
                : helpText[step])}
          </p>
          <Button
            size="lg"
            className="ml-auto"
            disabled={Boolean(need)}
            aria-describedby="step-help"
            loading={pending}
            onClick={onContinue}
          >
            {continueLabel[step]}
          </Button>
        </div>
      </footer>
    </div>
  )
}
