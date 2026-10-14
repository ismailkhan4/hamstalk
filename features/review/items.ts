import type { Lesson } from "@/features/lessons/schema"

import { firstDue } from "./scheduler"

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
    en: entry.en,
    example_de: entry.example.de,
    example_en: entry.example.en,
    due_at: due,
  }))
}

export type SavedLine = {
  de: string
  en: string
  article?: "der" | "die" | "das" | undefined
  example?: { de: string; en: string } | undefined
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
    word: line.de,
    en: line.en,
    example_de: line.example?.de ?? null,
    example_en: line.example?.en ?? null,
    due_at: firstDue(now).toISOString(),
  }
}
