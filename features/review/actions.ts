"use server"

import { refresh } from "next/cache"
import { z } from "zod"

import { isMissingTable } from "@/features/onboarding/data"
import { requireUser } from "@/lib/auth/session"
import { trackServer } from "@/lib/analytics/server"
import { createClient } from "@/lib/supabase/server"
import { awardXp } from "@/features/rewards/award"
import type { Rewards } from "@/features/rewards/payload"

import { memoryOf } from "./data"
import {
  legacyRate,
  rate,
  strengthOf,
  whenLabel,
  type Strength,
} from "./scheduler"

export type RateResult =
  | { ok: true; strength: Strength; label: string; rewards: Rewards | null }
  | { ok: false; message: string }

const input = z.object({
  itemKey: z.string().min(1).max(120),
  rating: z.enum(["forgot", "hard", "good"]),
})

const FAILED =
  "That answer wasn’t saved. Check your connection and try again; the word stays due."

const COLUMNS =
  "item_key, article, word, en, example_de, example_en, strength, lesson_id, due_at, review_count, last_reviewed_at"

/**
 * The server reads the word's memory from the database and schedules it with FSRS; the browser
 * only says how it went. Before adaptive.sql, the old spacing keeps working.
 */
export async function rateReviewItemAction(raw: unknown): Promise<RateResult> {
  const parsed = input.safeParse(raw)
  if (!parsed.success) return { ok: false, message: FAILED }
  const user = await requireUser("/review")
  const supabase = await createClient()
  const now = new Date()
  const { itemKey, rating } = parsed.data

  const full = await supabase
    .from("review_items")
    .select(
      `${COLUMNS}, stability, difficulty, fsrs_state, lapses, scheduled_days, learning_steps`
    )
    .eq("item_key", itemKey)
    .maybeSingle()
  const legacy = full.error?.code === "42703"
  const { data, error } = legacy
    ? await supabase
        .from("review_items")
        .select(COLUMNS)
        .eq("item_key", itemKey)
        .maybeSingle()
    : full
  if (error || !data)
    return {
      ok: false,
      message: isMissingTable(error)
        ? "The database isn’t set up yet."
        : FAILED,
    }

  let strength: Strength
  let dueAt: Date
  let updateError
  if (legacy) {
    const next = legacyRate(Number(data.strength) as Strength, rating, now)
    strength = next.strength
    dueAt = next.dueAt
    ;({ error: updateError } = await supabase
      .from("review_items")
      .update({
        strength,
        due_at: dueAt.toISOString(),
        last_reviewed_at: now.toISOString(),
        review_count: Number(data.review_count) + 1,
      })
      .eq("item_key", itemKey))
  } else {
    const next = rate(
      memoryOf(data as Parameters<typeof memoryOf>[0]),
      rating,
      now
    )
    strength = strengthOf(next.stability)
    dueAt = new Date(next.due_at)
    ;({ error: updateError } = await supabase
      .from("review_items")
      .update(next)
      .eq("item_key", itemKey))
  }
  if (updateError) return { ok: false, message: FAILED }
  trackServer(user.id, "review_item_rated", { rating, strength })
  const rewards = await awardXp(supabase, user.id, "review", itemKey)
  // XP changed: refresh the page so the shell's streak and goal badges catch up.
  if (rewards?.awarded) refresh()
  return {
    ok: true,
    strength,
    label: `Comes back ${whenLabel(dueAt, now)}`,
    rewards,
  }
}
