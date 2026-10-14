import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { OnboardingFlow } from "@/features/onboarding/components/onboarding-flow"
import {
  DatabaseNotReadyError,
  loadPreferences,
} from "@/features/onboarding/data"
import { DatabaseNotReady } from "@/features/onboarding/database-not-ready"
import { ONBOARDING_STEPS, stepLabels } from "@/features/onboarding/options"
import { requireUser } from "@/lib/auth/session"
import { firstName } from "@/lib/auth/user-name"
import { createClient } from "@/lib/supabase/server"

type Props = { params: Promise<{ step: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { step } = await params
  const known = ONBOARDING_STEPS.find((value) => value === step)
  return { title: known ? stepLabels[known] : "Onboarding" }
}

export default async function OnboardingStepPage({ params }: Props) {
  const { step: rawStep } = await params
  const step = ONBOARDING_STEPS.find((value) => value === rawStep)
  if (!step) notFound()

  const user = await requireUser(`/onboarding/${step}`)
  const supabase = await createClient()
  let preferences
  try {
    preferences = await loadPreferences(supabase, user.id)
  } catch (error) {
    if (error instanceof DatabaseNotReadyError) return <DatabaseNotReady />
    throw error
  }

  return (
    <OnboardingFlow
      key={step}
      step={step}
      initial={preferences}
      fullName={user.fullName || firstName(user)}
      firstName={firstName(user)}
    />
  )
}
