import { Hammer } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { EmptyState } from "@/components/feedback/empty-state"
import { buttonVariants } from "@/components/ui/button-variants"
import { findLesson } from "@/content/curriculum"
import { loadLearner } from "@/features/learner/load-learner"
import { LessonRunner } from "@/features/lessons/components/lesson-runner"
import { loadLessonState } from "@/features/lessons/data"
import {
  completeLessonAction,
  recordMistakeAction,
  saveLessonProgressAction,
  savePhraseAction,
} from "@/features/lessons/actions"
import { initialsOf } from "@/features/lessons/initials"
import { loadRunnableLesson } from "@/features/lessons/source"
import {
  lessonKicker,
  pathHrefFor,
  unitProgressAfter,
  upNextAfter,
} from "@/features/lessons/up-next"
import { DatabaseNotReady } from "@/features/onboarding/database-not-ready"
import { createClient } from "@/lib/supabase/server"

type Props = { params: Promise<{ lessonId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = findLesson((await params).lessonId)
  return { title: found?.lesson.title ?? "Lesson" }
}

export default async function LessonPage({ params }: Props) {
  const { lessonId } = await params
  const meta = findLesson(lessonId)
  if (!meta) notFound()

  const learner = await loadLearner(`/learn/${lessonId}`)
  if (learner === "database-not-ready") return <DatabaseNotReady />

  const supabase = await createClient()
  const lesson = (await loadRunnableLesson(supabase, lessonId))?.lesson
  if (!lesson) {
    return (
      <main
        id="main"
        className="grid min-h-svh place-items-center bg-background px-4"
      >
        <EmptyState
          icon={Hammer}
          tone="offline"
          title="This lesson isn’t ready yet"
          actions={
            <Link
              href={pathHrefFor(lessonId)}
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Back to learning path
            </Link>
          }
        >
          {meta.lesson.title} is planned but not built yet. Nothing you’ve done
          is lost, and it opens here as soon as it’s ready.
        </EmptyState>
      </main>
    )
  }

  const state = await loadLessonState(supabase, lessonId)

  return (
    <LessonRunner
      lesson={lesson}
      kicker={lessonKicker(lessonId)}
      learner={{
        firstName: learner.firstName,
        initials: initialsOf(learner.name),
      }}
      initial={{
        step: state.step,
        outcomes: state.outcomes,
        savedPhraseKeys: state.savedPhraseKeys,
      }}
      replay={state.status === "completed"}
      upNext={upNextAfter(
        learner.preferences.startLevel,
        learner.progress,
        lessonId
      )}
      unitProgress={unitProgressAfter(learner.progress, lessonId)}
      exitHref={pathHrefFor(lessonId)}
      pathHref={pathHrefFor(lessonId)}
      actions={{
        saveProgress: saveLessonProgressAction,
        complete: completeLessonAction,
        recordMistake: recordMistakeAction,
        savePhrase: savePhraseAction,
      }}
    />
  )
}
