"use client"

import type { Mistake } from "./data"
import { retryMistakeAction } from "./actions"
import { MistakesList } from "./mistakes-list"

export function MistakesClient({
  mistakes,
  lessonFilter,
}: {
  mistakes: Mistake[]
  lessonFilter: string | null
}) {
  return (
    <MistakesList
      mistakes={mistakes}
      lessonFilter={lessonFilter}
      onRetry={(itemKey, selection) =>
        retryMistakeAction({ itemKey, selection })
      }
    />
  )
}
