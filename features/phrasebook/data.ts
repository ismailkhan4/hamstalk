import "server-only"

import { z } from "zod"

import { getLesson } from "@/content/lessons/registry"
import { isMissingTable } from "@/features/onboarding/data"
import type { createClient } from "@/lib/supabase/server"

import type { Phrase } from "./search"

type Supabase = Awaited<ReturnType<typeof createClient>>

const rowSchema = z.object({
  phrase_key: z.string(),
  lesson_id: z.string(),
  de: z.string(),
  en: z.string(),
  created_at: z.string(),
})

/** Saved phrases, newest first, with the topic and example sentence read from the lesson they came from. */
export async function loadPhrasebook(supabase: Supabase): Promise<Phrase[]> {
  const { data, error } = await supabase
    .from("saved_phrases")
    .select("phrase_key, lesson_id, de, en, created_at")
    .order("created_at", { ascending: false })
  if (isMissingTable(error)) return []
  if (error)
    throw new Error(
      `Could not load the phrasebook (${error.code ?? "unknown"})`
    )

  return z
    .array(rowSchema)
    .parse(data)
    .map((row) => {
      const saveKey = row.phrase_key.slice(row.lesson_id.length + 1)
      const line = getLesson(row.lesson_id)
        ?.exercises.flatMap((exercise) =>
          exercise.type === "discover" ? exercise.lines : []
        )
        .find((candidate) => candidate.saveKey === saveKey)
      return {
        key: row.phrase_key,
        de: row.de,
        en: row.en,
        article: line?.article ?? null,
        example: line?.example ?? null,
        topic: line?.topic ?? "Other",
        lessonId: row.lesson_id,
        savedAt: row.created_at,
      }
    })
}
