"use server"

import { redirect } from "next/navigation"

import { DEFAULT_SIGNED_IN_PATH, safeNextPath } from "@/lib/auth/routes"
import { getSiteUrl } from "@/lib/site-url"
import { createClient } from "@/lib/supabase/server"

import { configurationError, toAuthError, unexpectedError } from "./errors"
import {
  forgotPasswordSchema,
  resendSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
} from "./schemas"
import type { AuthActionResult } from "./types"

const AFTER_SIGN_UP_PATH = DEFAULT_SIGNED_IN_PATH

async function getClient() {
  try {
    return await createClient()
  } catch {
    return null
  }
}

function invalidInput(): AuthActionResult {
  return {
    ok: false,
    error: {
      title: "Check the highlighted fields",
      message: "Some details need a fix.",
    },
  }
}

export async function signUpAction(input: unknown): Promise<AuthActionResult> {
  const parsed = signUpSchema.safeParse(input)
  if (!parsed.success) return invalidInput()
  const supabase = await getClient()
  if (!supabase) return { ok: false, error: configurationError }

  const { fullName, email, password } = parsed.data
  const siteUrl = await getSiteUrl()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${siteUrl}/auth/confirm?next=${encodeURIComponent(AFTER_SIGN_UP_PATH)}`,
    },
  })
  if (error) return { ok: false, error: toAuthError(error) }

  // With email confirmation on, Supabase returns no session (and, for privacy, the same answer for
  // an address that already has an account), so the learner always lands on "Check your email".
  if (data.session) redirect(AFTER_SIGN_UP_PATH)
  redirect(`/verify-email?email=${encodeURIComponent(email)}`)
}

export async function signInAction(
  next: string | null,
  input: unknown
): Promise<AuthActionResult> {
  const parsed = signInSchema.safeParse(input)
  if (!parsed.success) return invalidInput()
  const supabase = await getClient()
  if (!supabase) return { ok: false, error: configurationError }

  const { error } = await supabase.auth.signInWithPassword(parsed.data)
  if (error?.code === "email_not_confirmed") {
    redirect(`/verify-email?email=${encodeURIComponent(parsed.data.email)}`)
  }
  if (error) return { ok: false, error: toAuthError(error) }
  redirect(safeNextPath(next))
}

export async function resendVerificationAction(
  input: unknown
): Promise<AuthActionResult> {
  const parsed = resendSchema.safeParse(input)
  if (!parsed.success) return invalidInput()
  const supabase = await getClient()
  if (!supabase) return { ok: false, error: configurationError }

  const siteUrl = await getSiteUrl()
  const { error } = await supabase.auth.resend({
    type: "signup",
    email: parsed.data.email,
    options: {
      emailRedirectTo: `${siteUrl}/auth/confirm?next=${encodeURIComponent(AFTER_SIGN_UP_PATH)}`,
    },
  })
  if (error) return { ok: false, error: toAuthError(error) }
  return { ok: true }
}

export async function requestPasswordResetAction(
  input: unknown
): Promise<AuthActionResult> {
  const parsed = forgotPasswordSchema.safeParse(input)
  if (!parsed.success) return invalidInput()
  const supabase = await getClient()
  if (!supabase) return { ok: false, error: configurationError }

  const siteUrl = await getSiteUrl()
  const { error } = await supabase.auth.resetPasswordForEmail(
    parsed.data.email,
    {
      redirectTo: `${siteUrl}/auth/confirm?next=/reset-password`,
    }
  )
  // Only rate limits are reported, so the response never reveals whether an account exists.
  if (
    error &&
    (error.code === "over_email_send_rate_limit" || error.status === 429)
  ) {
    return { ok: false, error: toAuthError(error) }
  }
  return { ok: true }
}

export async function updatePasswordAction(
  input: unknown
): Promise<AuthActionResult> {
  const parsed = resetPasswordSchema.safeParse(input)
  if (!parsed.success) return invalidInput()
  const supabase = await getClient()
  if (!supabase) return { ok: false, error: configurationError }

  const { data } = await supabase.auth.getUser()
  if (!data.user) redirect("/forgot-password?expired=1")

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  })
  if (error) return { ok: false, error: toAuthError(error) }

  // The design promises that other devices are signed out; this device signs in again with the new password.
  const { error: signOutError } = await supabase.auth.signOut({
    scope: "global",
  })
  if (signOutError) return { ok: false, error: unexpectedError }
  redirect("/password-updated")
}

export async function signOutAction(): Promise<void> {
  const supabase = await getClient()
  if (supabase) await supabase.auth.signOut()
  redirect("/signin?notice=signed-out")
}
