import { notFound } from "next/navigation"

import { LessonPreview } from "@/features/lessons/components/lesson-preview"
import { devPreviewsEnabled } from "@/lib/dev-preview"

import { sampleLessonStash } from "../sample-economy"
import { CompletePreview } from "./complete-preview"

type Props = {
  searchParams: Promise<{
    id?: string
    replay?: string
    screen?: string
    perfect?: string
    streak?: string
    frozen?: string
    earned?: string
    goal?: string
    stash?: string
    akku?: string
  }>
}

/**
 * Development only: any lesson in the real runner, with no account and nothing saved.
 * `?id=a1-u1-l2`, `&replay=1`; `&screen=complete` (with `&perfect=1`) shows just the end screen,
 * and `&streak=7&frozen=1&earned=1&goal=1&stash=1` fakes what the server would award. `&akku=1`
 * starts the lesson with one Akku bar left (0 shows the empty state).
 */
export default async function DevLessonPage({ searchParams }: Props) {
  if (!devPreviewsEnabled) notFound()
  const params = await searchParams
  const { id, replay, screen, perfect } = params
  if (screen === "complete")
    return (
      <CompletePreview
        lessonId={id ?? "a1-u1-l1"}
        perfect={perfect === "1"}
        rewards={{
          streak: params.streak ? Number(params.streak) : undefined,
          frozen: params.frozen ? Number(params.frozen) : undefined,
          earned: params.earned === "1",
          goal: params.goal === "1",
          stash: params.stash === "1",
        }}
      />
    )
  return (
    <LessonPreview
      lessonId={id}
      replay={replay === "1"}
      stash={
        params.akku === undefined
          ? null
          : sampleLessonStash(Number(params.akku))
      }
    />
  )
}
