"use client"

import { explainAnswerAction } from "@/features/ai/explain"

import type { Mistake } from "./data"
import { retryMistakeAction } from "./actions"
import { MistakesList } from "./mistakes-list"

export function MistakesClient({
  mistakes,
  lessonFilter,
  ai = false,
}: {
  mistakes: Mistake[]
  lessonFilter: string | null
  /** Whether Hamsti can explain mistakes with AI. */
  ai?: boolean
}) {
  return (
    <MistakesList
      mistakes={mistakes}
      lessonFilter={lessonFilter}
      onRetry={(itemKey, selection) =>
        retryMistakeAction({ itemKey, selection })
      }
      onExplain={
        ai
          ? (mistake) =>
              explainAnswerAction({
                lessonId: mistake.lessonId,
                topic: mistake.topic,
                prompt: mistake.prompt,
                learnerAnswer: mistake.learnerAnswer,
                correctAnswer: mistake.correctAnswer,
                reason: mistake.reason,
              })
          : undefined
      }
    />
  )
}
