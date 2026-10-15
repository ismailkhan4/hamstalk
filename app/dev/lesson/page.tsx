import { notFound } from "next/navigation"

import { LessonPreview } from "@/features/lessons/components/lesson-preview"
import { devPreviewsEnabled } from "@/lib/dev-preview"

import { CompletePreview } from "./complete-preview"

type Props = {
  searchParams: Promise<{
    id?: string
    replay?: string
    screen?: string
    perfect?: string
  }>
}

/**
 * Development only: any lesson in the real runner, with no account and nothing saved.
 * `?id=a1-u1-l2`, `&replay=1`; `&screen=complete` (with `&perfect=1`) shows just the end screen.
 */
export default async function DevLessonPage({ searchParams }: Props) {
  if (!devPreviewsEnabled) notFound()
  const { id, replay, screen, perfect } = await searchParams
  if (screen === "complete")
    return (
      <CompletePreview lessonId={id ?? "a1-u1-l1"} perfect={perfect === "1"} />
    )
  return <LessonPreview lessonId={id} replay={replay === "1"} />
}
