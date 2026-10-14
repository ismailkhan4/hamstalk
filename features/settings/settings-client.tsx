"use client"

import { signOutAction } from "@/features/auth/actions"

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
>

export function SettingsClient(props: Props) {
  return (
    <SettingsScreen
      {...props}
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
