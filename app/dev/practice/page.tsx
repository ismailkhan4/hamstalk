import { notFound } from "next/navigation"

import { LessonPreview } from "@/features/lessons/components/lesson-preview"
import { generate } from "@/features/session-generator/generate"
import {
  practiceLesson,
  registryCandidates,
} from "@/features/session-generator/practice-lesson"
import { devPreviewsEnabled } from "@/lib/dev-preview"

import { sampleLessonStash } from "../sample-economy"

type Props = { searchParams: Promise<{ kind?: string; pass?: string }> }

const UNIT_1 = ["a1-u1-l1", "a1-u1-l2", "a1-u1-l3", "a1-u1-l4", "a1-u1-review"]

/**
 * Development only: a practice session built by the session generator from Unit 1, with a new
 * learner's model and nothing saved. `?kind=smart|mistakes|express`, `&pass=1|0` for the Express
 * result.
 */
export default async function DevPracticePage({ searchParams }: Props) {
  if (!devPreviewsEnabled) notFound()
  const params = await searchParams
  const kind =
    params.kind === "express" || params.kind === "mistakes"
      ? params.kind
      : "smart"
  const candidates = registryCandidates(UNIT_1)
  const picked = generate(kind, {
    candidates,
    skills: new Map(),
    mistakes: new Map(candidates.slice(0, 4).map((c) => [c.key, 2])),
    recent: new Set(),
  })
  return (
    <LessonPreview
      lesson={practiceLesson(kind, picked, 1)}
      tries={kind === "express" ? 1 : 2}
      practice={{ kind, unitNumber: 1 }}
      passed={kind === "express" ? params.pass !== "0" : null}
      stash={kind === "express" ? sampleLessonStash(5) : null}
    />
  )
}
