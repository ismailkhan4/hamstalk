"use client"

import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

import { Alert } from "@/components/feedback/alert"
import { FocusHeader } from "@/components/learning/focus-header"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"

import type { Outcome } from "../engine/attempt"
import type { MistakeRecord } from "../engine/mistakes"
import {
  isComplete,
  recordConversation,
  recordOutcome,
  resumeIndex,
  startSession,
  summarise,
  type SessionState,
} from "../engine/session"
import type { Lesson } from "../schema"
import { BuildView } from "./build-view"
import { TranslateView } from "./translate-view"
import { ChoiceView } from "./choice-view"
import { ConversationView } from "./conversation-view"
import { DiscoverView } from "./discover-view"
import { LessonComplete, type UpNext } from "./lesson-complete"
import { LessonIntro } from "./lesson-intro"
import { MatchView } from "./match-view"
import { TipView } from "./tip-view"
import type { Learner } from "./types"

type SaveResult = { ok: true } | { ok: false; message: string }

/** What the runner needs from the server. The real actions or a stand-in for previews and tests. */
export type LessonActions = {
  saveProgress: (input: {
    lessonId: string
    step: number
    outcomes: Outcome[]
  }) => Promise<SaveResult>
  complete: (input: {
    lessonId: string
    outcomes: Outcome[]
  }) => Promise<SaveResult>
  recordMistake: (
    input: MistakeRecord & { lessonId: string }
  ) => Promise<SaveResult>
  savePhrase: (input: {
    lessonId: string
    saveKey: string
    save: boolean
  }) => Promise<SaveResult>
}

type LessonRunnerProps = {
  lesson: Lesson
  kicker: string
  learner: Learner
  initial: { step: number; outcomes: Outcome[]; savedPhraseKeys: string[] }
  /** The lesson was finished before: it can be replayed, but earns no XP and saves no progress. */
  replay: boolean
  upNext: UpNext | null
  unitProgress: {
    number: number
    done: number
    total: number
    title: string
  } | null
  exitHref: string
  pathHref: string
  actions: LessonActions
}

type Phase = "intro" | "exercise" | "complete"

export function LessonRunner({
  lesson,
  kicker,
  learner,
  initial,
  replay,
  upNext,
  unitProgress,
  exitHref,
  pathHref,
  actions,
}: LessonRunnerProps) {
  const router = useRouter()
  const savedOutcomes = replay ? [] : initial.outcomes
  const hasSavedPlace =
    !replay &&
    savedOutcomes.length > 0 &&
    savedOutcomes.length < lesson.exercises.length
  const [phase, setPhase] = useState<Phase>("intro")
  const [index, setIndex] = useState(() =>
    hasSavedPlace ? resumeIndex(lesson, savedOutcomes) : 0
  )
  const [session, setSession] = useState<SessionState>(() =>
    startSession(lesson, hasSavedPlace ? savedOutcomes : [])
  )
  const [mistakes, setMistakes] = useState(0)
  const [warning, setWarning] = useState<string | null>(null)
  const [exitOpen, setExitOpen] = useState(false)
  const [completeProblem, setCompleteProblem] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [startedAt, setStartedAt] = useState(() => Date.now())
  const [finished, setFinished] = useState<{
    state: SessionState
    minutes: number
  } | null>(null)

  const exercise = lesson.exercises[index]
  const total = lesson.exercises.length
  const done = session.outcomes.filter(Boolean).length

  useEffect(() => {
    if (phase !== "exercise") return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !exitOpen) setExitOpen(true)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [phase, exitOpen])

  const outcomesOf = (state: SessionState) =>
    state.outcomes.filter((value): value is Outcome => value !== null)

  const finishLesson = useCallback(
    async (state: SessionState) => {
      if (replay) return
      setSaving(true)
      const result = await actions.complete({
        lessonId: lesson.id,
        outcomes: outcomesOf(state),
      })
      setSaving(false)
      setCompleteProblem(result.ok ? null : result.message)
    },
    [actions, lesson.id, replay]
  )

  async function advance(state: SessionState) {
    setSession(state)
    const nextIndex = index + 1
    if (isComplete(state) && nextIndex >= total) {
      setFinished({
        state,
        minutes: Math.max(1, Math.round((Date.now() - startedAt) / 60_000)),
      })
      setPhase("complete")
      await finishLesson(state)
      return
    }
    setIndex(nextIndex)
    if (!replay) {
      const result = await actions.saveProgress({
        lessonId: lesson.id,
        step: nextIndex,
        outcomes: outcomesOf(state),
      })
      setWarning(result.ok ? null : result.message)
    }
  }

  function onDone(outcome: Outcome, turnOutcomes?: Outcome[]) {
    void advance(
      turnOutcomes
        ? recordConversation(session, index, turnOutcomes)
        : recordOutcome(session, index, outcome)
    )
  }

  function onMiss(record: MistakeRecord) {
    setMistakes((count) => count + 1)
    void actions
      .recordMistake({ ...record, lessonId: lesson.id })
      .then((result) => {
        if (!result.ok) setWarning(result.message)
      })
  }

  async function onToggleSave(saveKey: string, save: boolean) {
    const result = await actions.savePhrase({
      lessonId: lesson.id,
      saveKey,
      save,
    })
    return result.ok ? null : "Try again in a moment."
  }

  function start(fromSaved: boolean) {
    if (!fromSaved) {
      setIndex(0)
      setSession(startSession(lesson))
    }
    setStartedAt(Date.now())
    setPhase("exercise")
  }

  const progress = {
    current: Math.min(index, total - 1),
    total,
    done: phase === "complete",
  }

  if (phase === "intro") {
    return (
      <div className="flex min-h-svh flex-col bg-background">
        <FocusHeader
          closeLabel="Close lesson"
          onClose={() => router.push(exitHref)}
          title={lesson.title}
        />
        <LessonIntro
          lesson={lesson}
          kicker={kicker}
          learner={learner}
          resumeAt={hasSavedPlace ? index + 1 : null}
          replay={replay}
          onStart={() => start(false)}
          onResume={() => start(true)}
        />
      </div>
    )
  }

  if (phase === "complete" && finished) {
    const { state, minutes } = finished
    return (
      <div className="flex min-h-svh flex-col bg-background">
        <FocusHeader
          closeLabel="Leave"
          onClose={() => router.push(exitHref)}
          progress={progress}
        />
        <LessonComplete
          lesson={lesson}
          summary={summarise(lesson, state)}
          minutes={minutes}
          mistakeCount={mistakes}
          replay={replay}
          upNext={upNext}
          unitProgress={unitProgress}
          pathHref={pathHref}
          saveProblem={completeProblem}
          saving={saving}
          onRetrySave={() => void finishLesson(state)}
        />
      </div>
    )
  }

  const common = { index, learner, lessonId: lesson.id, onMiss }

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <FocusHeader
        closeLabel="Leave lesson"
        onClose={() => setExitOpen(true)}
        progress={progress}
      />
      {warning && (
        <div className="mx-auto w-full max-w-(--lesson-max) px-[clamp(20px,4vw,32px)] pt-4">
          <Alert tone="warning" title="Not saved yet">
            {warning}
          </Alert>
        </div>
      )}
      {exercise?.type === "discover" && (
        <DiscoverView
          key={index}
          exercise={exercise}
          learner={learner}
          savedKeys={initial.savedPhraseKeys}
          onToggleSave={onToggleSave}
          onDone={() => onDone("first_try")}
        />
      )}
      {exercise?.type === "tip" && (
        <TipView
          key={index}
          exercise={exercise}
          learner={learner}
          onDone={() => onDone("first_try")}
        />
      )}
      {exercise?.type === "choice" && (
        <ChoiceView
          key={index}
          {...common}
          exercise={exercise}
          onDone={onDone}
        />
      )}
      {exercise?.type === "match" && (
        <MatchView
          key={index}
          {...common}
          exercise={exercise}
          onDone={onDone}
        />
      )}
      {exercise?.type === "build" && (
        <BuildView
          key={index}
          {...common}
          exercise={exercise}
          onDone={onDone}
        />
      )}
      {exercise?.type === "translate" && (
        <TranslateView
          key={index}
          {...common}
          exercise={exercise}
          onDone={onDone}
        />
      )}
      {exercise?.type === "conversation" && (
        <ConversationView
          key={index}
          {...common}
          exercise={exercise}
          onDone={onDone}
        />
      )}

      <Dialog open={exitOpen} onOpenChange={setExitOpen}>
        <DialogContent size="sm">
          <DialogTitle>Leave this lesson?</DialogTitle>
          <DialogDescription>
            {replay
              ? "You can replay it any time. Nothing from a replay changes your progress."
              : `You’ve done ${done} of ${total} exercises. Your place is saved, so you can continue from exercise ${Math.min(done + 1, total)} later.`}
          </DialogDescription>
          <DialogActions>
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push(exitHref)}
            >
              Leave lesson
            </Button>
            <Button size="lg" onClick={() => setExitOpen(false)}>
              Keep learning
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  )
}
