import "server-only"

import { createClient } from "@/lib/supabase/server"

import { emailConfigured, pushConfigured } from "./send"

export type ReminderSetup = {
  /** False until reminders.sql is applied: the reminder switches then stay hidden. */
  ready: boolean
  streakSaver: boolean
  emailReminders: boolean
  /** Push keys are set on the server. */
  push: boolean
  /** Email sending is set up on the server. */
  email: boolean
}

/** The reminder switches and what the server can send. */
export async function loadReminderSetup(
  userId: string
): Promise<ReminderSetup> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("learner_preferences")
    .select("streak_saver, email_reminders")
    .eq("user_id", userId)
    .maybeSingle()
  return {
    ready: !error,
    streakSaver: data?.streak_saver ?? true,
    emailReminders: data?.email_reminders ?? false,
    push: pushConfigured(),
    email: emailConfigured(),
  }
}
