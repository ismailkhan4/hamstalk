import Link from "next/link"

import { Logo } from "@/components/brand/logo"
import { cn } from "@/lib/utils"

import { ONBOARDING_STEPS, stepLabels, type OnboardingStep } from "../options"

const timeHints: Record<OnboardingStep, string> = {
  welcome: "About 2 min",
  goal: "About 1 min left",
  level: "About 1 min left",
  context: "Almost done",
  daily: "Almost done",
  plan: "Done",
}

/** The branch rail from the logo: done steps are spruce, the current step is the coral "you" node. */
export function OnboardingHeader({ step }: { step: OnboardingStep }) {
  const index = ONBOARDING_STEPS.indexOf(step)
  const isPlan = step === "plan"

  return (
    <header className="sticky top-0 z-(--z-header) border-b border-border-subtle bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-(--content-max) items-center gap-6 px-[clamp(20px,4vw,48px)]">
        <Link href="/" aria-label="Hamstalk home" className="shrink-0">
          <Logo symbolClassName="size-[30px]" />
        </Link>
        <div className="mx-auto hidden w-full max-w-md flex-col gap-1 sm:flex">
          <ol
            aria-hidden="true"
            className="relative flex items-center justify-between"
          >
            <span className="absolute inset-x-1.5 top-1/2 h-0.5 -translate-y-1/2 bg-border" />
            <span
              className="absolute top-1/2 left-1.5 h-0.5 -translate-y-1/2 bg-primary transition-[width] duration-(--duration-slower) ease-out"
              style={{ width: `calc((100% - 12px) * ${index / 5})` }}
            />
            {ONBOARDING_STEPS.map((key, i) => (
              <li
                key={key}
                className={cn(
                  "relative size-3 rounded-full border-2 border-input bg-background",
                  i < index && "border-primary bg-primary",
                  i === index &&
                    "border-spark bg-spark shadow-[0_0_0_4px_color-mix(in_srgb,var(--spark)_22%,transparent)]",
                  i === 5 && i !== index && "border-dashed"
                )}
              />
            ))}
          </ol>
          <p className="flex justify-between text-xs">
            <span className="font-semibold">{stepLabels[step]}</span>
            <span className="text-muted-foreground">
              {isPlan ? "All set" : `Step ${index + 1} of 5`}
            </span>
          </p>
        </div>
        <p className="ml-auto min-w-0 text-right text-sm text-muted-foreground sm:ml-0 sm:shrink-0">
          <span className="sm:hidden">
            {isPlan ? "All set · " : `Step ${index + 1} of 5 · `}
          </span>
          {timeHints[step]}
        </p>
      </div>
    </header>
  )
}
