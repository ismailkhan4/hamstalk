import "server-only"

import { z } from "zod"

import { isMissingTable } from "@/features/onboarding/data"
import type { createClient } from "@/lib/supabase/server"

import type { StrengthCounts } from "./model"

type Supabase = Awaited<ReturnType<typeof createClient>>

export type ProgressFacts = {
  /** When lessons were finished, newest first, for the weekly chart. */
  completedAt: string[]
  xp: number
  strengths: StrengthCounts
  mistakesLearned: number
  standups: number
}

const empty: ProgressFacts = {
  completedAt: [],
  xp: 0,
  strengths: { weak: 0, medium: 0, strong: 0 },
  mistakesLearned: 0,
  standups: 0,
}

const lessonRows = z.array(
  z.object({ xp: z.number(), completed_at: z.string().nullable() })
)

/** Counts taken from the learner's own rows. Row-level security limits every query to them. */
export async function loadProgressFacts(
  supabase: Supabase
): Promise<ProgressFacts> {
  const head = { count: "exact" as const, head: true }
  const [lessons, weak, medium, strong, learned, standups] = await Promise.all([
    supabase
      .from("lesson_progress")
      .select("xp, completed_at")
      .eq("status", "completed")
      .order("completed_at", { ascending: false }),
    supabase.from("review_items").select("id", head).eq("strength", 1),
    supabase.from("review_items").select("id", head).eq("strength", 2),
    supabase.from("review_items").select("id", head).eq("strength", 3),
    supabase.from("mistakes").select("id", head).not("learned_at", "is", null),
    supabase.from("standup_completions").select("unit_id", head),
  ])
  const results = [lessons, weak, medium, strong, learned, standups]
  if (results.some((result) => isMissingTable(result.error))) return empty
  const failed = results.find((result) => result.error)
  if (failed?.error)
    throw new Error(
      `Could not load progress (${failed.error.code ?? "unknown"})`
    )

  const rows = lessonRows.parse(lessons.data)
  return {
    completedAt: rows.flatMap((row) =>
      row.completed_at ? [row.completed_at] : []
    ),
    xp: rows.reduce((sum, row) => sum + row.xp, 0),
    strengths: {
      weak: weak.count ?? 0,
      medium: medium.count ?? 0,
      strong: strong.count ?? 0,
    },
    mistakesLearned: learned.count ?? 0,
    standups: standups.count ?? 0,
  }
}
