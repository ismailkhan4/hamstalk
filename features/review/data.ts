import "server-only"

import { z } from "zod"

import { isMissingTable } from "@/features/onboarding/data"
import type { createClient } from "@/lib/supabase/server"

type Supabase = Awaited<ReturnType<typeof createClient>>

export type ReviewCard = {
  itemKey: string
  article: "der" | "die" | "das" | null
  word: string
  en: string
  exampleDe: string | null
  exampleEn: string | null
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
      en: row.en,
      exampleDe: row.example_de,
      exampleEn: row.example_en,
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
