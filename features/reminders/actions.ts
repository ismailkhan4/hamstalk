"use server"

import { z } from "zod"

import { REMINDER_TIMES } from "@/features/onboarding/options"
import { trackServer } from "@/lib/analytics/server"
import { requireUser } from "@/lib/auth/session"
import { createClient } from "@/lib/supabase/server"

export type ReminderResult = { ok: true } | { ok: false; message: string }

const FAILED: ReminderResult = {
  ok: false,
  message: "That didn’t save. Check your connection and try again.",
}

const subscriptionInput = z.object({
  endpoint: z.url().startsWith("https://").max(999),
  keys: z.object({
    p256dh: z.string().min(1).max(199),
    auth: z.string().min(1).max(99),
  }),
})

/** Remembers this device for reminders. Saving the same device again changes nothing. */
export async function savePushSubscriptionAction(
  raw: unknown,
  userAgent?: string
): Promise<ReminderResult> {
  const parsed = subscriptionInput.safeParse(raw)
  if (!parsed.success) return FAILED
  const user = await requireUser("/settings")
  const supabase = await createClient()
  const { data: existing } = await supabase
    .from("push_subscriptions")
    .select("id")
    .eq("endpoint", parsed.data.endpoint)
    .maybeSingle()
  if (!existing) {
    const { error } = await supabase.from("push_subscriptions").insert({
      user_id: user.id,
      endpoint: parsed.data.endpoint,
      p256dh: parsed.data.keys.p256dh,
      auth: parsed.data.keys.auth,
      user_agent: userAgent?.slice(0, 299) ?? null,
    })
    if (error) return FAILED
  }
  trackServer(user.id, "push_enabled", {})
  return { ok: true }
}

/** Forgets a device. */
export async function removePushSubscriptionAction(
  raw: unknown
): Promise<ReminderResult> {
  const endpoint = z.url().max(999).safeParse(raw)
  if (!endpoint.success) return FAILED
  const user = await requireUser("/settings")
  const supabase = await createClient()
  const { error } = await supabase
    .from("push_subscriptions")
    .delete()
    .eq("endpoint", endpoint.data)
  if (error) return FAILED
  trackServer(user.id, "push_disabled", {})
  return { ok: true }
}

const prefsInput = z
  .object({ streakSaver: z.boolean(), emailReminders: z.boolean() })
  .partial()

/** The reminder switches that live beside the daily reminder time. */
export async function saveReminderPrefsAction(
  raw: unknown
): Promise<ReminderResult> {
  const parsed = prefsInput.safeParse(raw)
  if (!parsed.success) return FAILED
  const user = await requireUser("/settings")
  const supabase = await createClient()
  const { error, count } = await supabase
    .from("learner_preferences")
    .update(
      {
        ...(parsed.data.streakSaver !== undefined && {
          streak_saver: parsed.data.streakSaver,
        }),
        ...(parsed.data.emailReminders !== undefined && {
          email_reminders: parsed.data.emailReminders,
        }),
      },
      { count: "exact" }
    )
    .eq("user_id", user.id)
  return error || count === 0 ? FAILED : { ok: true }
}

const enableInput = z.object({
  subscription: subscriptionInput,
  time: z.enum(REMINDER_TIMES),
})

/** From the after-lesson prompt: this device gets notifications, and the daily reminder is on. */
export async function enableRemindersAction(
  raw: unknown,
  userAgent?: string
): Promise<ReminderResult> {
  const parsed = enableInput.safeParse(raw)
  if (!parsed.success) return FAILED
  const saved = await savePushSubscriptionAction(
    parsed.data.subscription,
    userAgent
  )
  if (!saved.ok) return saved
  const user = await requireUser("/home")
  const supabase = await createClient()
  const { error } = await supabase
    .from("learner_preferences")
    .update({ reminder_enabled: true, reminder_time: parsed.data.time })
    .eq("user_id", user.id)
  return error ? FAILED : { ok: true }
}
