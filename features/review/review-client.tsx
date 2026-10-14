"use client"

import { rateReviewItemAction } from "./actions"
import type { NotebookCounts, ReviewOverview } from "./data"
import { ReviewScreen } from "./review-screen"

type Props = {
  shell: { name: string; email: string; counts: NotebookCounts }
  overview: ReviewOverview
  sessionSize: number
}

export function ReviewClient({ shell, overview, sessionSize }: Props) {
  return (
    <ReviewScreen
      shell={shell}
      overview={overview}
      sessionSize={sessionSize}
      onRate={async (itemKey, rating) => {
        const result = await rateReviewItemAction({ itemKey, rating })
        return result.ok ? { ok: true, label: result.label } : result
      }}
    />
  )
}
