"use client"

import { savePhraseAction } from "@/features/lessons/actions"

import { PhrasebookList } from "./phrasebook-list"
import type { Phrase } from "./search"

/** The real list, wired to the server action. */
export function PhrasebookClient({
  phrases,
  due,
}: {
  phrases: Phrase[]
  due: number
}) {
  return (
    <PhrasebookList
      phrases={phrases}
      due={due}
      onToggleSave={async (phrase, save) => {
        const result = await savePhraseAction({
          lessonId: phrase.lessonId,
          saveKey: phrase.key.slice(phrase.lessonId.length + 1),
          save,
        })
        return result.ok ? null : "Try again in a moment."
      }}
    />
  )
}
