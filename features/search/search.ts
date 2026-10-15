import { levels } from "@/content/courses/de/curriculum"
import { isLessonAvailable } from "@/content/courses/de/availability"
import { lessons } from "@/content/courses/de/lessons/registry"
import { matchesQuery, type Phrase } from "@/features/phrasebook/search"

export const MAX_QUERY_LENGTH = 80

export type LessonHit = {
  id: string
  title: string
  titleInTarget: boolean
  detail: string
  href: string
  available: boolean
}
export type WordHit = {
  key: string
  article: "der" | "die" | "das" | null
  word: string
  native: string
  detail: string
  href: string
}
export type PhraseHit = {
  key: string
  target: string
  native: string
  detail: string
}

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
            titleInTarget: lesson.kind === "lesson" && lesson.titleInTarget,
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
      if (
        !matchesQuery(
          `${entry.word} ${entry.native} ${entry.example.target}`,
          query
        )
      )
        return []
      seen.add(key)
      return [
        {
          key: `${lesson.id}:${entry.word}`,
          article: entry.article ?? null,
          word: entry.word,
          native: entry.native,
          detail: `${entry.native} · from “${lesson.title}”`,
          href: `/learn/${lesson.id}`,
        },
      ]
    })
  )

  const phraseHits = savedPhrases
    .filter((phrase) =>
      matchesQuery(
        `${phrase.target} ${phrase.native} ${phrase.example?.target ?? ""}`,
        query
      )
    )
    .map((phrase) => ({
      key: phrase.key,
      target: phrase.target,
      native: phrase.native,
      detail: `Phrasebook · ${phrase.topic}`,
    }))

  return { lessons: lessonHits, words: wordHits, phrases: phraseHits }
}
