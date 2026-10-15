"use server"

import { redirect } from "next/navigation"
import { z } from "zod"

import { toAuthError, unexpectedError } from "@/features/auth/errors"
import { profileSchema, resetPasswordSchema } from "@/features/auth/schemas"
import { isMissingTable } from "@/features/onboarding/data"
import { preferencesSchema } from "@/features/onboarding/options"
import { requireUser } from "@/lib/auth/session"
import { trackServer } from "@/lib/analytics/server"
import { getSiteUrl } from "@/lib/site-url"
import { createClient } from "@/lib/supabase/server"
import type { Database } from "@/lib/supabase/database.types"

export type SettingsResult =
  { ok: true; message?: string } | { ok: false; title: string; message: string }

const SAVE_FAILED: SettingsResult = {
  ok: false,
  title: "That wasn’t saved",
  message: "Check your connection and try again. Nothing was changed.",
}

const patchSchema = preferencesSchema.partial().strict()

export async function savePreferencesAction(
  input: unknown
): Promise<SettingsResult> {
  const parsed = patchSchema.safeParse(input)
  if (!parsed.success || Object.keys(parsed.data).length === 0)
    return SAVE_FAILED
  const user = await requireUser("/settings")
  const patch = parsed.data

  const row: Database["public"]["Tables"]["learner_preferences"]["Update"] = {}
  if (patch.goal !== undefined) row.goal = patch.goal
  if (patch.startLevel !== undefined) row.start_level = patch.startLevel
  if (patch.contexts !== undefined) row.contexts = patch.contexts
  if (patch.dailyMinutes !== undefined) row.daily_minutes = patch.dailyMinutes
  if (patch.reminderEnabled !== undefined)
    row.reminder_enabled = patch.reminderEnabled
  if (patch.reminderTime !== undefined) row.reminder_time = patch.reminderTime

  const supabase = await createClient()
  const { error, count } = await supabase
    .from("learner_preferences")
    .update(row, { count: "exact" })
    .eq("user_id", user.id)
  if (error || count === 0) return SAVE_FAILED
  trackServer(user.id, "preferences_saved", {})
  return { ok: true }
}

export async function updateProfileAction(
  input: unknown
): Promise<SettingsResult> {
  const parsed = profileSchema.safeParse(input)
  if (!parsed.success)
    return {
      ok: false,
      title: "Check the highlighted fields",
      message: "Some details need a fix.",
    }
  const user = await requireUser("/settings")
  const { fullName, email } = parsed.data
  const emailChanged = email.toLowerCase() !== user.email.toLowerCase()

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser(
    { data: { full_name: fullName }, ...(emailChanged ? { email } : {}) },
    emailChanged
      ? { emailRedirectTo: `${await getSiteUrl()}/auth/confirm?next=/settings` }
      : undefined
  )
  if (error) return { ok: false, ...toAuthError(error) }
  await supabase.auth.refreshSession()
  return {
    ok: true,
    message: emailChanged
      ? `We sent a confirmation link to ${email}. Your sign-in email changes after you open it.`
      : "Your name is updated.",
  }
}

export async function changePasswordAction(
  input: unknown
): Promise<SettingsResult> {
  const parsed = resetPasswordSchema.safeParse(input)
  if (!parsed.success)
    return {
      ok: false,
      title: "Check the highlighted fields",
      message: "Some details need a fix.",
    }
  await requireUser("/settings")
  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  })
  if (error) return { ok: false, ...toAuthError(error) }
  const { error: signOutError } = await supabase.auth.signOut({
    scope: "others",
  })
  if (signOutError) return { ok: false, ...unexpectedError }
  return {
    ok: true,
    message: "Password updated. Other devices were signed out.",
  }
}

export async function resetProgressAction(): Promise<SettingsResult> {
  const user = await requireUser("/settings")
  const supabase = await createClient()
  const steps = [
    supabase.from("lesson_progress").delete().eq("user_id", user.id),
    supabase.from("mistakes").delete().eq("user_id", user.id),
    supabase
      .from("review_items")
      .delete()
      .eq("user_id", user.id)
      .eq("source", "lesson"),
    supabase.from("standup_completions").delete().eq("user_id", user.id),
  ]
  const results = await Promise.all(steps)
  const failed = results.find((result) => result.error)
  if (failed?.error)
    return {
      ok: false,
      title: isMissingTable(failed.error)
        ? "The database isn’t set up yet"
        : "Your progress wasn’t reset",
      message: isMissingTable(failed.error)
        ? "Apply the database migrations first."
        : "Some of it may have been cleared. Try again to finish.",
    }
  trackServer(user.id, "progress_reset", {})
  return {
    ok: true,
    message: "Your progress is reset. Start again from Unit 1.",
  }
}

const deleteInput = z.object({ confirmation: z.literal("delete") })

export async function deleteAccountAction(
  input: unknown
): Promise<SettingsResult> {
  if (!deleteInput.safeParse(input).success)
    return {
      ok: false,
      title: "Type “delete” to confirm",
      message: "Nothing was deleted.",
    }
  const user = await requireUser("/settings")
  const supabase = await createClient()
  const { error } = await supabase.rpc("delete_my_account")
  if (error)
    return {
      ok: false,
      title: "Your account wasn’t deleted",
      message:
        isMissingTable(error) || error.code === "PGRST202"
          ? "Apply the latest database migration first."
          : "Nothing was removed. Try again in a moment.",
    }
  trackServer(user.id, "account_deleted", {})
  await supabase.auth.signOut()
  redirect("/signin?notice=account-deleted")
}
