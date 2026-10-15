import "server-only"

import { z } from "zod"

import { getLesson } from "@/content/courses/de/lessons/registry"
import { lessonLabel, retryQuestion } from "@/features/lessons/lookup"
import { isMissingTable } from "@/features/onboarding/data"
import type { createClient } from "@/lib/supabase/server"

type Supabase = Awaited<ReturnType<typeof createClient>>

export type Mistake = {
  itemKey: string
  lessonId: string
  lessonLabel: string
  topic: string
  prompt: string
  learnerAnswer: string
  correctAnswer: string
  reason: string
  missCount: number
  learned: boolean
  /** The question again, without its answer. Null when it can only be replayed in its lesson. */
  retry: {
    options: { target: string; native?: string }[]
    optionsLanguage: "target" | "native"
    fill?: { before: string; after: string }
  } | null
}

const rowSchema = z.object({
  item_key: z.string(),
  lesson_id: z.string(),
  topic: z.string().nullable(),
  prompt: z.string(),
  learner_answer: z.string(),
  correct_answer: z.string(),
  reason: z.string(),
  miss_count: z.number(),
  learned_at: z.string().nullable(),
})

/** Most missed first, then newest. */
export async function loadMistakes(supabase: Supabase): Promise<Mistake[]> {
  const { data, error } = await supabase
    .from("mistakes")
    .select(
      "item_key, lesson_id, topic, prompt, learner_answer, correct_answer, reason, miss_count, learned_at"
    )
    .order("miss_count", { ascending: false })
    .order("updated_at", { ascending: false })
  if (isMissingTable(error)) return []
  if (error)
    throw new Error(
      `Could not load the mistakes notebook (${error.code ?? "unknown"})`
    )

  return z
    .array(rowSchema)
    .parse(data)
    .map((row) => {
      const question = retryQuestion(row.item_key)
      return {
        itemKey: row.item_key,
        lessonId: row.lesson_id,
        lessonLabel: lessonLabel(getLesson(row.lesson_id), row.lesson_id),
        topic: row.topic ?? "Other",
        prompt: row.prompt,
        learnerAnswer: row.learner_answer,
        correctAnswer: row.correct_answer,
        reason: row.reason,
        missCount: row.miss_count,
        learned: row.learned_at !== null,
        retry: question
          ? {
              options: question.options,
              optionsLanguage: question.optionsLanguage,
              ...(question.fill ? { fill: question.fill } : {}),
            }
          : null,
      }
    })
}
