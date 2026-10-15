import type { Lesson } from "@/features/lessons/schema"

import { firstDue } from "./scheduler"

/** A row of public.review_items. Its columns keep their original names (`en`, `example_de`); the
 * app's own objects say `target` and `native`. */
export type ReviewItemRow = {
  user_id: string
  item_key: string
  source: "lesson" | "saved"
  lesson_id: string
  article: string | null
  word: string
  en: string
  example_de: string | null
  example_en: string | null
  due_at: string
}

/** The lesson's words enter reviews when it is finished; the first one comes back tomorrow. */
export function lessonVocabularyRows(
  userId: string,
  lesson: Lesson,
  now: Date
): ReviewItemRow[] {
  const due = firstDue(now).toISOString()
  return lesson.vocabulary.map((entry) => ({
    user_id: userId,
    item_key: `word:${lesson.id}:${entry.word}`,
    source: "lesson",
    lesson_id: lesson.id,
    article: entry.article ?? null,
    word: entry.word,
    en: entry.native,
    example_de: entry.example.target,
    example_en: entry.example.native,
    due_at: due,
  }))
}

export type SavedLine = {
  target: string
  native: string
  article?: "der" | "die" | "das" | undefined
  example?: { target: string; native: string } | undefined
}

export function savedPhraseRow(
  userId: string,
  lessonId: string,
  phraseKey: string,
  line: SavedLine,
  now: Date
): ReviewItemRow {
  return {
    user_id: userId,
    item_key: `phrase:${phraseKey}`,
    source: "saved",
    lesson_id: lessonId,
    article: line.article ?? null,
    word: line.target,
    en: line.native,
    example_de: line.example?.target ?? null,
    example_en: line.example?.native ?? null,
    due_at: firstDue(now).toISOString(),
  }
}
