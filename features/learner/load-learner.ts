import "server-only"

import { redirect } from "next/navigation"

import {
  DatabaseNotReadyError,
  loadPreferences,
} from "@/features/onboarding/data"
import type { Preferences } from "@/features/onboarding/options"
import { loadLessonProgress } from "@/features/path/data"
import type { LessonProgress } from "@/features/path/model"
import { requireUser, type SessionUser } from "@/lib/auth/session"
import { firstName } from "@/lib/auth/user-name"
import { createClient } from "@/lib/supabase/server"

export type Learner = {
  user: SessionUser
  name: string
  firstName: string
  preferences: Preferences
  progress: LessonProgress[]
}

/**
 * Everything a signed-in learner page needs. Sends learners who haven't finished onboarding back to
 * their step, and reports a missing database instead of failing.
 */
export async function loadLearner(
  path: string
): Promise<Learner | "database-not-ready"> {
  const user = await requireUser(path)
  const supabase = await createClient()
  let preferences: Preferences
  let progress: LessonProgress[]
  try {
    ;[preferences, progress] = await Promise.all([
      loadPreferences(supabase, user.id),
      loadLessonProgress(supabase),
    ])
  } catch (error) {
    if (error instanceof DatabaseNotReadyError) return "database-not-ready"
    throw error
  }
  if (!preferences.onboardedAt) redirect(`/onboarding/${preferences.step}`)

  const first = firstName(user)
  return {
    user,
    name: user.fullName || first,
    firstName: first,
    preferences,
    progress,
  }
}
