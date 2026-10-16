"use client"

import { signOutAction } from "@/features/auth/actions"
import {
  removePushSubscriptionAction,
  savePushSubscriptionAction,
  saveReminderPrefsAction,
} from "@/features/reminders/actions"
import { ReminderSettings } from "@/features/reminders/components/reminder-settings"
import type { ReminderSetup } from "@/features/reminders/data"

import {
  changePasswordAction,
  deleteAccountAction,
  resetProgressAction,
  savePreferencesAction,
  updateProfileAction,
} from "./actions"
import { SettingsScreen } from "./settings-screen"

type Props = Pick<
  React.ComponentProps<typeof SettingsScreen>,
  "shell" | "preferences"
> & { reminderSetup: ReminderSetup }

export function SettingsClient({ reminderSetup, ...props }: Props) {
  return (
    <SettingsScreen
      {...props}
      reminders={
        reminderSetup.ready && (
          <ReminderSettings
            setup={reminderSetup}
            actions={{
              savePush: savePushSubscriptionAction,
              removePush: removePushSubscriptionAction,
              savePrefs: saveReminderPrefsAction,
            }}
          />
        )
      }
      actions={{
        savePreferences: savePreferencesAction,
        updateProfile: updateProfileAction,
        changePassword: changePasswordAction,
        resetProgress: resetProgressAction,
        deleteAccount: deleteAccountAction,
        signOut: signOutAction,
      }}
    />
  )
}
