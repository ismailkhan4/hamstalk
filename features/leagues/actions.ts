"use server"

import { refresh } from "next/cache"
import { z } from "zod"

import { requireUser } from "@/lib/auth/session"
import { createClient } from "@/lib/supabase/server"

/** The learner has seen last week's result; it won't be shown again. */
export async function markResultSeenAction(raw: unknown) {
  const week = z.iso.date().safeParse(raw)
  if (!week.success) return
  await requireUser("/league")
  const supabase = await createClient()
  await supabase.rpc("league_result_seen", { p_week: week.data })
}

export type ProfileSaveResult = { ok: true } | { ok: false; message: string }

const profileInput = z.object({
  displayName: z
    .string()
    .trim()
    .min(1, "Add a name others will see.")
    .max(40, "Keep it to 40 characters."),
  isPublic: z.boolean(),
})

/** Changes how others see the learner. RLS limits the update to their own row and two columns. */
export async function saveProfileAction(
  raw: unknown
): Promise<ProfileSaveResult> {
  const parsed = profileInput.safeParse(raw)
  if (!parsed.success)
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Check your name.",
    }
  const user = await requireUser("/profile")
  const supabase = await createClient()
  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: parsed.data.displayName,
      is_public: parsed.data.isPublic,
    })
    .eq("user_id", user.id)
  if (error)
    return { ok: false, message: "That didn’t save. Try again in a moment." }
  refresh()
  return { ok: true }
}
