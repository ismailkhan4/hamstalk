import { ACTIVE_COURSE } from "@/content/courses"

export function fold(text: string) {
  return text
    .toLocaleLowerCase(ACTIVE_COURSE.locale)
    .replaceAll("ß", "ss")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
}

/** "ae", "oe" and "ue" are how umlauts are written without them. */
function withUmlauts(query: string) {
  return query.replaceAll("ae", "ä").replaceAll("oe", "ö").replaceAll("ue", "ü")
}

export function matchesQuery(text: string, query: string) {
  const needle = query.trim().toLocaleLowerCase(ACTIVE_COURSE.locale)
  if (!needle) return true
  const haystack = fold(text)
  return (
    haystack.includes(fold(needle)) ||
    haystack.includes(fold(withUmlauts(needle)))
  )
}

export type Phrase = {
  key: string
  target: string
  native: string
  article: "der" | "die" | "das" | null
  example: { target: string; native: string } | null
  topic: string
  lessonId: string
  savedAt: string
}

export function filterPhrases(
  phrases: Phrase[],
  topic: string | null,
  query: string
) {
  return phrases.filter(
    (phrase) =>
      (topic === null || phrase.topic === topic) &&
      matchesQuery(
        `${phrase.target} ${phrase.native} ${phrase.example?.target ?? ""} ${phrase.example?.native ?? ""}`,
        query
      )
  )
}

/** Topics with how many phrases each holds, in the order the topics first appear. */
export function topicCounts(phrases: Phrase[]) {
  const counts = new Map<string, number>()
  for (const phrase of phrases)
    counts.set(phrase.topic, (counts.get(phrase.topic) ?? 0) + 1)
  return [...counts].map(([topic, count]) => ({ topic, count }))
}
