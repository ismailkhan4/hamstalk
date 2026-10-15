import "server-only"

import { z } from "zod"

import { isMissingTable } from "@/features/onboarding/data"
import type { createClient } from "@/lib/supabase/server"

type Supabase = Awaited<ReturnType<typeof createClient>>

export type ReviewCard = {
  itemKey: string
  article: "der" | "die" | "das" | null
  word: string
  native: string
  exampleTarget: string | null
  exampleNative: string | null
  strength: 1 | 2 | 3
  lessonId: string
}

const rowSchema = z.object({
  item_key: z.string(),
  article: z.enum(["der", "die", "das"]).nullable(),
  word: z.string(),
  en: z.string(),
  example_de: z.string().nullable(),
  example_en: z.string().nullable(),
  strength: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  lesson_id: z.string(),
})

export const SESSION_SIZE = 12

/** Words due now, oldest first. A session is capped so it stays a few minutes long. */
export async function loadDueCards(
  supabase: Supabase,
  now = new Date()
): Promise<ReviewCard[]> {
  const { data, error } = await supabase
    .from("review_items")
    .select(
      "item_key, article, word, en, example_de, example_en, strength, lesson_id"
    )
    .lte("due_at", now.toISOString())
    .order("due_at", { ascending: true })
    .limit(SESSION_SIZE)
  if (isMissingTable(error)) return []
  if (error)
    throw new Error(`Could not load the review (${error.code ?? "unknown"})`)
  return z
    .array(rowSchema)
    .parse(data)
    .map((row) => ({
      itemKey: row.item_key,
      article: row.article,
      word: row.word,
      native: row.en,
      exampleTarget: row.example_de,
      exampleNative: row.example_en,
      strength: row.strength,
      lessonId: row.lesson_id,
    }))
}

export type NotebookCounts = { phrases: number; mistakes: number; due: number }

/** The numbers beside "Phrasebook", "Mistakes" and "Review" in the navigation. */
export async function loadNotebookCounts(
  supabase: Supabase,
  now = new Date()
): Promise<NotebookCounts> {
  const head = { count: "exact" as const, head: true }
  const [phrases, mistakes, due] = await Promise.all([
    supabase.from("saved_phrases").select("id", head),
    supabase.from("mistakes").select("id", head).is("learned_at", null),
    supabase
      .from("review_items")
      .select("id", head)
      .lte("due_at", now.toISOString()),
  ])
  for (const result of [phrases, mistakes, due]) {
    if (isMissingTable(result.error)) return { phrases: 0, mistakes: 0, due: 0 }
    if (result.error) return { phrases: 0, mistakes: 0, due: 0 }
  }
  return {
    phrases: phrases.count ?? 0,
    mistakes: mistakes.count ?? 0,
    due: due.count ?? 0,
  }
}

export type ReviewOverview = {
  due: ReviewCard[]
  /** Words with a review behind them that were last rated "Need more practice". */
  needsPractice: number
  /** Every word in the learner's reviews, due or not. */
  total: number
  /** When the next word comes due, if none is due now. */
  nextDue: string | null
}

export async function loadReviewOverview(
  supabase: Supabase,
  now = new Date()
): Promise<ReviewOverview> {
  const head = { count: "exact" as const, head: true }
  const [due, total, weak, next] = await Promise.all([
    supabase
      .from("review_items")
      .select(
        "item_key, article, word, en, example_de, example_en, strength, lesson_id"
      )
      .lte("due_at", now.toISOString())
      .order("due_at", { ascending: true })
      .limit(50),
    supabase.from("review_items").select("id", head),
    supabase
      .from("review_items")
      .select("id", head)
      .eq("strength", 1)
      .gt("review_count", 0),
    supabase
      .from("review_items")
      .select("due_at")
      .gt("due_at", now.toISOString())
      .order("due_at", { ascending: true })
      .limit(1),
  ])
  for (const result of [due, total, weak, next]) {
    if (isMissingTable(result.error))
      return { due: [], needsPractice: 0, total: 0, nextDue: null }
    if (result.error)
      throw new Error(
        `Could not load the review (${result.error.code ?? "unknown"})`
      )
  }
  return {
    due: z
      .array(rowSchema)
      .parse(due.data)
      .map((row) => ({
        itemKey: row.item_key,
        article: row.article,
        word: row.word,
        native: row.en,
        exampleTarget: row.example_de,
        exampleNative: row.example_en,
        strength: row.strength,
        lessonId: row.lesson_id,
      })),
    needsPractice: weak.count ?? 0,
    total: total.count ?? 0,
    nextDue:
      z.array(z.object({ due_at: z.string() })).parse(next.data)[0]?.due_at ??
      null,
  }
}
