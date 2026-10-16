"use client"

import { useRouter } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"

import { TARGET_LANG } from "@/content/courses"
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
import {
  comboMilestone,
  nextCombo,
  type ComboMilestone,
} from "@/features/celebrations/combo"
import { ComboToast } from "@/features/celebrations/combo-toast"
import { playFeedback } from "@/features/celebrations/feedback"
import type { AkkuResult, BuyResult } from "@/features/economy/actions"
import { AkkuBadge } from "@/features/economy/components/akku-badge"
import { AkkuEmpty } from "@/features/economy/components/akku-empty"
import { akkuAt, AKKU_MAX, SHOP } from "@/features/economy/model"
import type { Rewards } from "@/features/rewards/payload"
import { track } from "@/lib/analytics/client"

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
import { TriesProvider } from "../engine/tries-context"
import { isGraded, type Lesson } from "../schema"
import { ticketId } from "../ticket"
import { BuildView } from "./build-view"
import { TranslateView } from "./translate-view"
import { ChoiceView } from "./choice-view"
import { ConversationView } from "./conversation-view"
import { DiscoverView } from "./discover-view"
import { LessonComplete, type UpNext } from "./lesson-complete"
import { LessonIntro } from "./lesson-intro"
import { MatchView } from "./match-view"
import { SpeakView } from "./speak-view"
import { TipView } from "./tip-view"
import type { Learner } from "./types"

type SaveResult = { ok: true } | { ok: false; message: string }
type CompleteResult =
  | { ok: true; rewards?: Rewards | null; passed?: boolean | null }
  | { ok: false; message: string }

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
  }) => Promise<CompleteResult>
  recordMistake: (
    input: MistakeRecord & { lessonId: string }
  ) => Promise<SaveResult>
  savePhrase: (input: {
    lessonId: string
    saveKey: string
    save: boolean
  }) => Promise<SaveResult>
  /** Takes Akku bars for missed answers. Null when it couldn't be recorded. */
  drainAkku: (input: {
    lessonId: string
    bars: number
  }) => Promise<AkkuResult | null>
  rechargeAkku: () => Promise<BuyResult>
}

export type LessonRunnerProps = {
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
  /** Asks about reminders at the end of a first-time lesson. */
  reminderPrompt?: React.ReactNode
  /** Tries per answer: 2 in lessons, 1 in an Express run. */
  tries?: number
  /** Set for practice sessions, which end differently from lessons. */
  practice?: { kind: "smart" | "mistakes" | "express"; unitNumber?: number }
  /** The Akku and nut balance as the lesson opened; null until economy.sql is applied. */
  stash: { akku: number; nextBarAt: string | null; nuts: number } | null
}

type Phase = "intro" | "exercise" | "empty" | "complete"

const RECHARGE_PRICE = SHOP.find((item) => item.id === "recharge")?.price ?? 0

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
  stash,
  reminderPrompt,
  tries = 2,
  practice,
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
  const [rewards, setRewards] = useState<Rewards | null>(null)
  const [passed, setPassed] = useState<boolean | null>(null)
  const [combo, setCombo] = useState(0)
  const [bestCombo, setBestCombo] = useState(0)
  const [milestone, setMilestone] = useState<ComboMilestone | null>(null)
  const milestoneTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(
    () => () => {
      if (milestoneTimer.current) clearTimeout(milestoneTimer.current)
    },
    []
  )
  // The Akku: null when there's no stash. One bar goes for each answer missed after the hint.
  const [akku, setAkku] = useState<{
    bars: number
    nextBarAt: number | null
  } | null>(() =>
    stash
      ? (({ akku: bars, nextBarAt }) => ({ bars, nextBarAt }))(
          akkuAt(stash, Date.now())
        )
      : null
  )
  const [drains, setDrains] = useState(0)
  const [nuts, setNuts] = useState(stash?.nuts ?? null)
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

  // A replay saves no progress, but still earns practice XP and can keep the streak going.
  const finishLesson = useCallback(
    async (state: SessionState) => {
      setSaving(true)
      const result = await actions.complete({
        lessonId: lesson.id,
        outcomes: outcomesOf(state),
      })
      setSaving(false)
      if (result.ok) {
        setRewards(result.rewards ?? null)
        setPassed(result.passed ?? null)
        setCompleteProblem(null)
      } else if (!replay) setCompleteProblem(result.message)
    },
    [actions, lesson.id, replay]
  )

  async function advance(state: SessionState, left = akku) {
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
    if (left && left.bars === 0) setPhase("empty")
    if (!replay) {
      const result = await actions.saveProgress({
        lessonId: lesson.id,
        step: nextIndex,
        outcomes: outcomesOf(state),
      })
      setWarning(result.ok ? null : result.message)
    }
  }

  function updateCombo(outcome: Outcome) {
    if (!exercise) return
    const next = nextCombo(combo, outcome, isGraded(exercise))
    if (next === combo) return
    setCombo(next)
    setBestCombo((best) => Math.max(best, next))
    const reached = comboMilestone(next)
    if (!reached) return
    setMilestone(reached)
    playFeedback("combo")
    if (milestoneTimer.current) clearTimeout(milestoneTimer.current)
    milestoneTimer.current = setTimeout(() => setMilestone(null), 1900)
  }

  /** Answers still wrong after the hint each take a bar. Returns the bars left. */
  function drain(missed: number) {
    if (!akku || missed === 0) return akku
    const bars = Math.max(0, akku.bars - missed)
    const next = {
      bars,
      nextBarAt:
        akku.bars === AKKU_MAX ? Date.now() + 4 * 3_600_000 : akku.nextBarAt,
    }
    setAkku(next)
    setDrains((count) => count + 1)
    void actions
      .drainAkku({ lessonId: lesson.id, bars: missed })
      .then((result) => {
        if (result)
          setAkku({
            bars: result.akku,
            nextBarAt: result.nextBarAt ? Date.parse(result.nextBarAt) : null,
          })
      })
    return next
  }

  function onDone(outcome: Outcome, turnOutcomes?: Outcome[]) {
    updateCombo(outcome)
    const left = drain(
      (turnOutcomes ?? [outcome]).filter((o) => o === "shown").length
    )
    if (exercise)
      track("exercise_answered", {
        lesson_id: lesson.id,
        exercise_type: exercise.type,
        position: index,
        outcome,
      })
    void advance(
      turnOutcomes
        ? recordConversation(session, index, turnOutcomes)
        : recordOutcome(session, index, outcome),
      left
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

  function onRecharged() {
    setAkku({ bars: AKKU_MAX, nextBarAt: null })
    setNuts((count) => (count === null ? null : count - RECHARGE_PRICE))
    setPhase("exercise")
  }

  function start(fromSaved: boolean) {
    track("lesson_started", {
      lesson_id: lesson.id,
      resumed: fromSaved,
      replay,
    })
    setCombo(0)
    setBestCombo(0)
    if (!fromSaved) {
      setIndex(0)
      setSession(startSession(lesson))
    }
    setStartedAt(Date.now())
    setPhase(akku && akku.bars === 0 ? "empty" : "exercise")
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
          ticket={ticketId(lesson.id)}
          title={lesson.title}
          titleLang={lesson.titleInTarget ? TARGET_LANG : undefined}
        />
        <LessonIntro
          lesson={lesson}
          kicker={kicker}
          learner={learner}
          resumeAt={hasSavedPlace ? index + 1 : null}
          replay={replay}
          onStart={() => start(false)}
          practice={practice?.kind}
          onResume={() => start(true)}
        />
      </div>
    )
  }

  if (phase === "empty" && akku) {
    return (
      <div className="flex min-h-svh flex-col bg-background">
        <FocusHeader
          closeLabel="Leave lesson"
          onClose={() => router.push(exitHref)}
          ticket={ticketId(lesson.id)}
          title={lesson.title}
          titleLang={lesson.titleInTarget ? TARGET_LANG : undefined}
          progress={progress}
          status={<AkkuBadge akku={akku.bars} drains={drains} />}
        />
        <AkkuEmpty
          nuts={nuts}
          nextBarAt={akku.nextBarAt}
          exitHref={exitHref}
          buy={actions.rechargeAkku}
          onRecharged={onRecharged}
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
          ticket={ticketId(lesson.id)}
          title={lesson.title}
          titleLang={lesson.titleInTarget ? TARGET_LANG : undefined}
          progress={progress}
        />
        <LessonComplete
          lesson={lesson}
          summary={summarise(lesson, state)}
          minutes={minutes}
          bestCombo={bestCombo}
          rewards={rewards}
          mistakeCount={mistakes}
          replay={replay}
          upNext={upNext}
          unitProgress={unitProgress}
          pathHref={pathHref}
          saveProblem={completeProblem}
          saving={saving}
          onRetrySave={() => void finishLesson(state)}
          reminderPrompt={reminderPrompt}
          practice={practice && { ...practice, passed }}
        />
      </div>
    )
  }

  const common = { index, learner, lessonId: lesson.id, onMiss }

  return (
    <TriesProvider tries={tries}>
      <div className="flex min-h-svh flex-col bg-background">
        <FocusHeader
          closeLabel="Leave lesson"
          onClose={() => setExitOpen(true)}
          ticket={ticketId(lesson.id)}
          title={lesson.title}
          titleLang={lesson.titleInTarget ? TARGET_LANG : undefined}
          progress={progress}
          combo={combo}
          status={
            akku ? <AkkuBadge akku={akku.bars} drains={drains} /> : undefined
          }
        />
        <ComboToast milestone={milestone} />
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
        {exercise?.type === "speak" && (
          <SpeakView
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
    </TriesProvider>
  )
}
