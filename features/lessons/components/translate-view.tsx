"use client"

import { useState } from "react"

import { TARGET_LANG } from "@/content/courses"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { check, retry, startAttempt, type Attempt } from "../engine/attempt"
import { useMaxTries } from "../engine/tries-context"
import { gradeTranslate } from "../engine/grading"
import { translateMistake } from "../engine/mistakes"
import { personalise, type TranslateExercise } from "../schema"
import { ExerciseHeading } from "./exercise-heading"
import { ActionFooter, FeedbackFooter, rightTitle } from "./footer"
import { ListenButton } from "./listen-button"
import type { ExerciseProps } from "./types"

type TranslateViewProps = ExerciseProps<TranslateExercise> & {
  lessonId: string
}

export function TranslateView({
  exercise,
  index,
  lessonId,
  learner,
  onMiss,
  onDone,
}: TranslateViewProps) {
  const [text, setText] = useState("")
  const [attempt, setAttempt] = useState<Attempt>(startAttempt)
  const maxTries = useMaxTries()
  const answering = attempt.phase === "answering"
  const source = personalise(exercise.source, learner)
  const answerText = personalise(exercise.accept[0] ?? "", learner)

  function onCheck() {
    const next = check(attempt, gradeTranslate(exercise, text), maxTries)
    setAttempt(next)
    if (next.phase === "wrong")
      onMiss(translateMistake(lessonId, index, exercise, text))
    if (next.phase === "shown") setText(answerText)
  }

  const state =
    attempt.phase === "right" || attempt.phase === "shown"
      ? "ok"
      : attempt.phase === "wrong"
        ? "bad"
        : null

  return (
    <>
      <main
        id="main"
        className="mx-auto w-full max-w-(--lesson-max) flex-1 px-[clamp(20px,4vw,32px)] py-10 pb-40"
      >
        <ExerciseHeading
          kind={exercise.kind}
          title={personalise(exercise.prompt, learner)}
        />

        <div className="mt-8 flex items-start gap-3 rounded-xl border border-border bg-card p-5">
          <p
            lang={TARGET_LANG}
            className="min-w-0 flex-1 font-voice text-2xl leading-snug"
          >
            {source}
          </p>
          <ListenButton text={source} label="Listen" />
        </div>

        <label
          htmlFor={`translate-${index}`}
          className="mt-6 block font-semibold"
        >
          Your English translation
        </label>
        <textarea
          id={`translate-${index}`}
          value={text}
          readOnly={!answering}
          rows={2}
          lang="en"
          autoComplete="off"
          autoCapitalize="sentences"
          spellCheck={false}
          onChange={(event) => setText(event.target.value)}
          aria-invalid={state === "bad" || undefined}
          className={cn(
            "mt-2 w-full resize-none rounded-lg border-[1.5px] border-input bg-card p-3 text-lg read-only:bg-inset focus-visible:border-primary focus-visible:shadow-[0_0_0_4px_color-mix(in_srgb,var(--primary)_20%,transparent)] focus-visible:outline-none",
            state === "ok" && "border-success bg-success-subtle",
            state === "bad" && "border-danger bg-danger-subtle"
          )}
        />
      </main>

      {answering && (
        <ActionFooter
          hint="Write it in English. Capitals and punctuation don’t matter."
          hintId={`hint-${index}`}
        >
          <Button
            size="lg"
            disabled={text.trim().length === 0}
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
          {personalise(exercise.feedback.right, learner)}
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
              onClick={() => setAttempt(retry(attempt))}
            >
              Try again
            </Button>
          }
        >
          {personalise(exercise.feedback.wrong, learner)} Edit your answer and
          have another go.
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
          {answerText}. {personalise(exercise.feedback.right, learner)} We’ve
          saved this one so you can practise it again.
        </FeedbackFooter>
      )}
    </>
  )
}
