import { levels } from "@/content/curriculum"
import { isLessonAvailable } from "@/content/availability"
import { lessons } from "@/content/lessons/registry"
import { matchesQuery, type Phrase } from "@/features/phrasebook/search"

export const MAX_QUERY_LENGTH = 80

export type LessonHit = {
  id: string
  title: string
  titleIsGerman: boolean
  detail: string
  href: string
  available: boolean
}
export type WordHit = {
  key: string
  article: "der" | "die" | "das" | null
  word: string
  en: string
  detail: string
  href: string
}
export type PhraseHit = { key: string; de: string; en: string; detail: string }

export type SearchResults = {
  lessons: LessonHit[]
  words: WordHit[]
  phrases: PhraseHit[]
}

export function cleanQuery(raw: string | string[] | undefined) {
  const value = typeof raw === "string" ? raw : ""
  return value.replace(/\s+/g, " ").trim().slice(0, MAX_QUERY_LENGTH)
}

export function resultCount(results: SearchResults) {
  return results.lessons.length + results.words.length + results.phrases.length
}

/**
 * Searches what Klarlingo really has: the A1 lessons (planned ones are labelled), the words taught in
 * finished lesson content, and the learner's saved phrases. German matches with or without umlauts.
 */
export function searchAll(
  query: string,
  savedPhrases: Phrase[]
): SearchResults {
  if (!query) return { lessons: [], words: [], phrases: [] }

  const lessonHits = levels
    .filter((level) => level.code === "A1")
    .flatMap((level) => level.units)
    .flatMap((unit) =>
      unit.lessons.flatMap((lesson) => {
        const text = `${lesson.title} ${lesson.goal} ${unit.title}`
        if (!matchesQuery(text, query)) return []
        const available = isLessonAvailable(lesson.id)
        return [
          {
            id: lesson.id,
            title: lesson.title,
            titleIsGerman: lesson.kind === "lesson" && lesson.titleIsGerman,
            detail: `Unit ${unit.number} · ${unit.title}${available ? "" : " · planned"}`,
            href: available ? `/learn/${lesson.id}` : `/path?unit=${unit.id}`,
            available,
          },
        ]
      })
    )

  const seen = new Set<string>()
  const wordHits = lessons.flatMap((lesson) =>
    lesson.vocabulary.flatMap((entry) => {
      const key = `${entry.article ?? ""} ${entry.word}`
      if (seen.has(key)) return []
      if (!matchesQuery(`${entry.word} ${entry.en} ${entry.example.de}`, query))
        return []
      seen.add(key)
      return [
        {
          key: `${lesson.id}:${entry.word}`,
          article: entry.article ?? null,
          word: entry.word,
          en: entry.en,
          detail: `${entry.en} · from “${lesson.title}”`,
          href: `/learn/${lesson.id}`,
        },
      ]
    })
  )

  const phraseHits = savedPhrases
    .filter((phrase) =>
      matchesQuery(
        `${phrase.de} ${phrase.en} ${phrase.example?.de ?? ""}`,
        query
      )
    )
    .map((phrase) => ({
      key: phrase.key,
      de: phrase.de,
      en: phrase.en,
      detail: `Phrasebook · ${phrase.topic}`,
    }))

  return { lessons: lessonHits, words: wordHits, phrases: phraseHits }
}
