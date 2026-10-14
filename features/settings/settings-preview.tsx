"use client"

import type { Preferences } from "@/features/onboarding/options"

import type { SettingsResult } from "./actions"
import { SettingsScreen } from "./settings-screen"

const preferences: Preferences = {
  goal: "work",
  startLevel: "beginner",
  contexts: ["standups", "messaging", "everyday"],
  dailyMinutes: 15,
  reminderEnabled: false,
  reminderTime: null,
  onboardedAt: "2026-10-12T08:00:00Z",
  startedAt: "2026-10-12T08:00:00Z",
  step: "plan",
}

/** Development preview: every action succeeds, or fails with a message when `fail` is set. */
export function SettingsPreview({ fail }: { fail: boolean }) {
  const outcome = async (message?: string): Promise<SettingsResult> =>
    fail
      ? {
          ok: false,
          title: "That wasn’t saved",
          message: "Check your connection and try again. Nothing was changed.",
        }
      : { ok: true, message }

  return (
    <SettingsScreen
      shell={{
        name: "Sam Haddad",
        email: "sam@example.com",
        counts: { phrases: 6, mistakes: 3, due: 6 },
      }}
      preferences={preferences}
      exportHref="/icon.svg"
      actions={{
        savePreferences: () => outcome(),
        updateProfile: () => outcome("Your name is updated."),
        changePassword: () =>
          outcome("Password updated. Other devices were signed out."),
        resetProgress: () =>
          outcome("Your progress is reset. Start again from Unit 1."),
        deleteAccount: () => outcome(),
        signOut: async () => {},
      }}
    />
  )
}
