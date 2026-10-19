"use server"

import { refresh } from "next/cache"
import { z } from "zod"

import { MASCOT_NAME } from "@/features/celebrations/mascot-name"
import { loadMyProfile } from "@/features/leagues/data"
import { pushConfigured, sendPush } from "@/features/reminders/send"
import { trackServer } from "@/lib/analytics/server"
import { requireUser } from "@/lib/auth/session"
import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"

import {
  NUDGE_RESULTS,
  searchResultSchema,
  type NudgeResult,
  type SearchResult,
} from "./model"

const handle = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9-]{3,40}$/)

export type FollowResult = { ok: true } | { ok: false; message: string }

export async function followAction(raw: unknown): Promise<FollowResult> {
  const parsed = handle.safeParse(raw)
  if (!parsed.success)
    return { ok: false, message: "That profile wasn’t found." }
  const user = await requireUser(`/u/${parsed.data}`)
  const supabase = await createClient()
  const { data, error } = await supabase.rpc("follow", {
    p_handle: parsed.data,
  })
  if (error)
    return { ok: false, message: "That didn’t work. Try again in a moment." }
  if (!data)
    return {
      ok: false,
      message: "You can’t follow this profile. It may be private.",
    }
  trackServer(user.id, "friend_followed", {})
  refresh()
  return { ok: true }
}

export async function unfollowAction(raw: unknown): Promise<FollowResult> {
  const parsed = handle.safeParse(raw)
  if (!parsed.success)
    return { ok: false, message: "That profile wasn’t found." }
  await requireUser(`/u/${parsed.data}`)
  const supabase = await createClient()
  const { error } = await supabase.rpc("unfollow", { p_handle: parsed.data })
  if (error)
    return { ok: false, message: "That didn’t work. Try again in a moment." }
  refresh()
  return { ok: true }
}

/** Public profiles whose handle or name starts with the query. */
export async function searchLearnersAction(
  raw: unknown
): Promise<SearchResult[]> {
  const query = z.string().max(40).safeParse(raw)
  if (!query.success || query.data.trim().length < 2) return []
  await requireUser("/league")
  const supabase = await createClient()
  const { data, error } = await supabase.rpc("find_learners", {
    p_query: query.data,
  })
  if (error) return []
  const parsed = z.array(searchResultSchema).safeParse(data)
  return parsed.success ? parsed.data : []
}

export type NudgeOutcome = {
  result: NudgeResult
  message: string
  /** Whether a push actually reached one of their devices. */
  delivered: boolean
}

/**
 * Nudges a friend: nudge() checks it's allowed and records it, then the push goes to every device
 * the friend turned reminders on for. A friend without push still counts as nudged, so the limits
 * hold, and the learner is told it may not reach them.
 */
export async function nudgeAction(raw: unknown): Promise<NudgeOutcome> {
  const parsed = handle.safeParse(raw)
  if (!parsed.success)
    return {
      result: "unknown",
      message: NUDGE_RESULTS.unknown,
      delivered: false,
    }
  const user = await requireUser("/league")
  const supabase = await createClient()
  const { data, error } = await supabase.rpc("nudge", { p_handle: parsed.data })
  const result = (error ? "unknown" : data) as NudgeResult
  if (result !== "sent")
    return {
      result,
      message: NUDGE_RESULTS[result] ?? NUDGE_RESULTS.unknown,
      delivered: false,
    }

  let delivered = false
  const admin = createAdminClient()
  if (admin && pushConfigured()) {
    const [me, target] = await Promise.all([
      loadMyProfile(),
      admin
        .from("profiles")
        .select("user_id")
        .eq("handle", parsed.data)
        .maybeSingle(),
    ])
    const { data: devices } = target.data
      ? await admin
          .from("push_subscriptions")
          .select("id, endpoint, p256dh, auth")
          .eq("user_id", target.data.user_id)
      : { data: [] }
    const message = {
      title: `${me?.displayName ?? "A friend"} nudged you`,
      body: `${MASCOT_NAME} saved you a seat. One short lesson today?`,
      url: "/home",
      tag: "nudge",
    }
    const results = await Promise.all(
      (devices ?? []).map(async (device) => ({
        id: device.id,
        result: await sendPush(device, message),
      }))
    )
    delivered = results.some((r) => r.result === "sent")
    const gone = results.filter((r) => r.result === "gone").map((r) => r.id)
    if (gone.length > 0)
      await admin.from("push_subscriptions").delete().in("id", gone)
  }

  trackServer(user.id, "friend_nudged", { delivered })
  refresh()
  return {
    result,
    message: delivered
      ? NUDGE_RESULTS.sent
      : "Nudge sent, but they haven’t turned on reminders, so it may not reach them.",
    delivered,
  }
}
