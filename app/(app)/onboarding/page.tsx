import { redirect } from "next/navigation"

import {
  DatabaseNotReadyError,
  loadPreferences,
} from "@/features/onboarding/data"
import { DatabaseNotReady } from "@/features/onboarding/database-not-ready"
import { requireUser } from "@/lib/auth/session"
import { createClient } from "@/lib/supabase/server"

/** Resumes onboarding at the step the learner reached last time. */
export default async function OnboardingPage() {
  const user = await requireUser("/onboarding")
  const supabase = await createClient()
  let step
  try {
    step = (await loadPreferences(supabase, user.id)).step
  } catch (error) {
    if (error instanceof DatabaseNotReadyError) return <DatabaseNotReady />
    throw error
  }
  redirect(`/onboarding/${step}`)
}
