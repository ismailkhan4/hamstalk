"use server"

import { createClient } from "@/lib/supabase/server"

import { isKnownTimeZone } from "./timezone"

export async function syncTimezoneAction(zone: unknown): Promise<boolean> {
  if (!isKnownTimeZone(zone)) return false
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  const userId = data?.claims?.sub
  if (!userId) return false

  const { error, count } = await supabase
    .from("learner_preferences")
    .update({ timezone: zone }, { count: "exact" })
    .eq("user_id", userId)
  return !error && count === 1
}
