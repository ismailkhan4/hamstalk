"use server"

import { refresh } from "next/cache"
import { z } from "zod"

import { trackServer } from "@/lib/analytics/server"
import { requireUser } from "@/lib/auth/session"
import { createClient } from "@/lib/supabase/server"

import { akkuResultSchema, SHOP } from "./model"

export type BuyResult = { ok: true } | { ok: false; message: string }

const REASONS: Record<string, string> = {
  nuts: "You don’t have enough nuts for that yet. Quests in your daily plan pay out more.",
  full: "You already have as many as you can hold.",
  active: "Double XP is already running.",
}

const FAILED = "That didn’t go through. Nothing was spent; try again."

const buyResult = z.object({
  ok: z.boolean(),
  reason: z.string().optional(),
})

/** Buys one shop item. The price and every check live in buy(). */
export async function buyAction(raw: unknown): Promise<BuyResult> {
  const item = SHOP.find((entry) => entry.id === raw)
  if (!item) return { ok: false, message: FAILED }
  const user = await requireUser("/shop")
  const supabase = await createClient()
  const { data, error } = await supabase.rpc("buy", { p_item: item.id })
  const parsed = buyResult.safeParse(data)
  if (error || !parsed.success) return { ok: false, message: FAILED }
  if (!parsed.data.ok)
    return {
      ok: false,
      message: REASONS[parsed.data.reason ?? ""] ?? FAILED,
    }
  trackServer(user.id, "item_bought", { item: item.id, price: item.price })
  refresh()
  return { ok: true }
}

export type AkkuResult = z.infer<typeof akkuResultSchema>

const akkuInput = z.object({
  lessonId: z.string().min(1).max(64),
  bars: z.number().int().min(1).max(10),
})

/**
 * Takes Akku bars for answers missed after their second try. Null when it couldn't be recorded,
 * which never stops the lesson: the Akku paces practice, it doesn't guard anything.
 */
export async function drainAkkuAction(
  raw: unknown
): Promise<AkkuResult | null> {
  const parsed = akkuInput.safeParse(raw)
  if (!parsed.success) return null
  const user = await requireUser(`/learn/${parsed.data.lessonId}`)
  const supabase = await createClient()
  const { data, error } = await supabase.rpc("use_akku", {
    p_ref: parsed.data.lessonId,
    p_count: parsed.data.bars,
  })
  const result = akkuResultSchema.safeParse(data)
  if (error || !result.success) return null
  trackServer(user.id, "akku_used", {
    lesson_id: parsed.data.lessonId,
    bars: parsed.data.bars,
    left: result.data.akku,
  })
  return result.data
}
