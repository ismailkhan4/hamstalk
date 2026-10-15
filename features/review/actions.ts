"use server"

import { z } from "zod"

import { isMissingTable } from "@/features/onboarding/data"
import { requireUser } from "@/lib/auth/session"
import { trackServer } from "@/lib/analytics/server"
import { createClient } from "@/lib/supabase/server"

import { nextDueLabel, rate, type Strength } from "./scheduler"

export type RateResult =
  | { ok: true; strength: Strength; label: string }
  | { ok: false; message: string }

const input = z.object({
  itemKey: z.string().min(1).max(120),
  rating: z.enum(["again", "remembered"]),
})

const FAILED =
  "That answer wasn’t saved. Check your connection and try again; the word stays due."

/** The server reads the item's strength from the database and applies the spacing; the browser only says how it went. */
export async function rateReviewItemAction(raw: unknown): Promise<RateResult> {
  const parsed = input.safeParse(raw)
  if (!parsed.success) return { ok: false, message: FAILED }
  const user = await requireUser("/review")
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("review_items")
    .select("strength, review_count")
    .eq("item_key", parsed.data.itemKey)
    .maybeSingle()
  if (error || !data)
    return {
      ok: false,
      message: isMissingTable(error)
        ? "The database isn’t set up yet."
        : FAILED,
    }

  const now = new Date()
  const next = rate(Number(data.strength) as Strength, parsed.data.rating, now)
  const { error: updateError } = await supabase
    .from("review_items")
    .update({
      strength: next.strength,
      due_at: next.dueAt.toISOString(),
      last_reviewed_at: now.toISOString(),
      review_count: Number(data.review_count) + 1,
    })
    .eq("item_key", parsed.data.itemKey)
  if (updateError) return { ok: false, message: FAILED }
  trackServer(user.id, "review_item_rated", {
    rating: parsed.data.rating,
    strength: next.strength,
  })
  return {
    ok: true,
    strength: next.strength,
    label: nextDueLabel(parsed.data.rating, next.strength),
  }
}
