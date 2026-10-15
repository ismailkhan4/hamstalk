"use client"

import { FileText } from "lucide-react"
import { useCallback, useMemo, useState } from "react"

import {
  AnswerOption,
  type AnswerOptionState,
} from "@/components/exercises/answer-option"
import { TARGET_LANG } from "@/content/courses"
import { TargetText } from "@/components/learning/target-text"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { check, retry, startAttempt, type Attempt } from "../engine/attempt"
import { choiceNote, gradeChoice } from "../engine/grading"
import { choiceMistake } from "../engine/mistakes"
import { optionOrder } from "../engine/shuffle"
import { personalise, type ChoiceExercise } from "../schema"
import { ExerciseHeading } from "./exercise-heading"
import { ActionFooter, FeedbackFooter, rightTitle } from "./footer"
import { ListenButton } from "./listen-button"
import type { ExerciseProps } from "./types"
import { useDigitKeys } from "./use-digit-keys"

type ChoiceViewProps = ExerciseProps<ChoiceExercise> & { lessonId: string }

export function ChoiceView({
  exercise,
  index,
  lessonId,
  learner,
  onMiss,
  onDone,
}: ChoiceViewProps) {
  const [selection, setSelection] = useState<number | null>(null)
  const [chosen, setChosen] = useState<number | null>(null)
  const [attempt, setAttempt] = useState<Attempt>(startAttempt)
  const [transcriptOpen, setTranscriptOpen] = useState(false)

  const answering = attempt.phase === "answering"
  const german = exercise.optionsLanguage === "target"

  // Selection, grading and feedback all use authored option indexes; only the screen is shuffled.
  const order = useMemo(
    () => optionOrder(exercise.options.length, `${lessonId}:${index}`),
    [exercise.options.length, lessonId, index]
  )
  const pick = useCallback((option: number) => setSelection(option), [])
  const pickShown = useCallback(
    (position: number) => {
      const option = order[position]
      if (option !== undefined) setSelection(option)
    },
    [order]
  )
  useDigitKeys(exercise.options.length, answering, pickShown)

  function onCheck() {
    if (selection === null) return
    const next = check(attempt, gradeChoice(exercise, selection))
    setChosen(selection)
    setAttempt(next)
    if (next.phase === "wrong")
      onMiss(choiceMistake(lessonId, index, exercise, selection))
  }

  function optionState(option: number): AnswerOptionState {
    const isCorrect = option === exercise.correct
    const isAlternative = exercise.alternatives.includes(option)
    switch (attempt.phase) {
      case "answering":
        return selection === option ? "selected" : "idle"
      case "right":
        return chosen === option ? "correct" : "dimmed"
      case "wrong":
        return chosen === option ? "incorrect" : "idle"
      case "shown":
        if (isCorrect) return "correct-answer"
        if (isAlternative) return "also-right"
        return chosen === option ? "your-answer" : "dimmed"
    }
  }

  const feedbackText = chosen === null ? "" : choiceNote(exercise, chosen)
  const correctText = exercise.options[exercise.correct] ?? ""
  const showTranscript =
    exercise.listening && (transcriptOpen || attempt.phase !== "answering")
  const prompt = personalise(exercise.prompt, learner)

  return (
    <>
      <main
        id="main"
        className="mx-auto w-full max-w-(--lesson-max) flex-1 px-[clamp(20px,4vw,32px)] py-10 pb-40"
      >
        <ExerciseHeading kind={exercise.kind} title={prompt} />

        {exercise.listening && (
          <div className="mt-6 rounded-xl border border-border bg-card p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <ListenButton
                text={exercise.listening.clip}
                label="Play"
                slow
                variant="outline"
              />
              <span className="text-sm text-muted-foreground">
                {exercise.listening.meta}
              </span>
            </div>
            {showTranscript ? (
              <div className="mt-3 border-t border-dashed border-border pt-3">
                <p className="text-xs font-semibold text-muted-foreground">
                  Transcript
                </p>
                <TargetText as="p" className="text-xl">
                  „{personalise(exercise.listening.clip, learner)}“
                </TargetText>
                <p className="text-[0.9375rem] text-muted-foreground">
                  {personalise(exercise.listening.translation, learner)}
                </p>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setTranscriptOpen(true)}
                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary-text underline underline-offset-[3px]"
              >
                <FileText aria-hidden="true" className="size-4" />
                Read the transcript
              </button>
            )}
          </div>
        )}

        {exercise.fill && (
          <p
            lang={TARGET_LANG}
            className="mt-6 rounded-xl bg-inset px-5 py-4 font-voice text-2xl"
            aria-label={`${exercise.fill.before} blank ${exercise.fill.after}`}
          >
            {exercise.fill.before}{" "}
            <span
              className={cn(
                "mx-1 inline-block min-w-24 border-b-2 border-dashed border-input px-2 text-center",
                selection !== null &&
                  "border-solid border-primary text-primary-text"
              )}
            >
              {selection !== null ? (exercise.options[selection] ?? "") : " "}
            </span>{" "}
            {exercise.fill.after}
          </p>
        )}

        <div
          role="radiogroup"
          aria-label="Answers"
          className="mt-6 flex flex-col gap-3"
        >
          {order.map((option, position) => (
            <AnswerOption
              key={option}
              index={position}
              language={german ? "target" : "native"}
              state={optionState(option)}
              locked={!answering}
              onSelect={() => pick(option)}
            >
              {personalise(exercise.options[option] ?? "", learner)}
            </AnswerOption>
          ))}
        </div>
      </main>

      {answering && (
        <ActionFooter hint="Choose one answer." hintId={`hint-${index}`}>
          <Button
            size="lg"
            disabled={selection === null}
            aria-describedby={`hint-${index}`}
            onClick={onCheck}
          >
            Check
          </Button>
        </ActionFooter>
      )}
      {attempt.phase === "right" && (
        <FeedbackFooter
          result="correct"
          title={rightTitle(index)}
          titleLang={TARGET_LANG}
          action={
            <Button
              size="lg"
              onClick={() => onDone(attempt.outcome ?? "first_try")}
            >
              Continue
            </Button>
          }
        >
          {personalise(feedbackText, learner)}
        </FeedbackFooter>
      )}
      {attempt.phase === "wrong" && (
        <FeedbackFooter
          result="incorrect"
          title="Not quite"
          savedToMistakes
          action={
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                setAttempt(retry(attempt))
                setSelection(null)
              }}
            >
              Try again
            </Button>
          }
        >
          {personalise(feedbackText, learner)} Have another go.
        </FeedbackFooter>
      )}
      {attempt.phase === "shown" && (
        <FeedbackFooter
          result="shown"
          title="Here’s the answer"
          action={
            <Button size="lg" onClick={() => onDone("shown")}>
              Continue
            </Button>
          }
        >
          {personalise(
            exercise.fill
              ? `${exercise.fill.before} ${correctText} ${exercise.fill.after}`.trim()
              : correctText,
            learner
          )}{" "}
          {personalise(exercise.feedback.right, learner)} We’ve saved this one
          so you can practise it again.
        </FeedbackFooter>
      )}
    </>
  )
}
