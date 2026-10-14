import type { Metadata } from "next"

import {
  DatabaseNotReadyError,
  loadPlacementAttempt,
  loadPreferences,
} from "@/features/onboarding/data"
import { DatabaseNotReady } from "@/features/onboarding/database-not-ready"
import { PlacementCheck } from "@/features/placement/components/placement-check"
import { requireUser } from "@/lib/auth/session"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = { title: "Placement check" }

const EMPTY = [-1, -1, -1, -1, -1, -1, -1, -1]

export default async function PlacementPage() {
  const user = await requireUser("/placement")
  const supabase = await createClient()
  let attempt
  let preferences
  try {
    ;[attempt, preferences] = await Promise.all([
      loadPlacementAttempt(supabase, user.id),
      loadPreferences(supabase, user.id),
    ])
  } catch (error) {
    if (error instanceof DatabaseNotReadyError) return <DatabaseNotReady />
    throw error
  }

  const onboarded = Boolean(preferences.onboardedAt)
  return (
    <PlacementCheck
      initialAnswers={attempt?.answers ?? EMPTY}
      initialQuestion={attempt?.completed ? 0 : (attempt?.currentQuestion ?? 0)}
      initialPhase={attempt?.completed ? "result" : "intro"}
      levelHref={onboarded ? "/home" : "/onboarding/level"}
      closeHref={onboarded ? "/home" : "/onboarding/level"}
    />
  )
}
