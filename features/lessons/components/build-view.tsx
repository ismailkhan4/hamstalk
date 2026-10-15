"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { check, retry, startAttempt, type Attempt } from "../engine/attempt"
import { buildText, gradeBuild } from "../engine/grading"
import { buildMistake } from "../engine/mistakes"
import { personalise, type BuildExercise } from "../schema"
import { ExerciseHeading } from "./exercise-heading"
import { ActionFooter, FeedbackFooter, rightTitle } from "./footer"
import type { ExerciseProps } from "./types"

type BuildViewProps = ExerciseProps<BuildExercise> & { lessonId: string }

export function BuildView({
  exercise,
  index,
  lessonId,
  learner,
  onMiss,
  onDone,
}: BuildViewProps) {
  const [placed, setPlaced] = useState<number[]>([])
  const [attempt, setAttempt] = useState<Attempt>(startAttempt)
  const answering = attempt.phase === "answering"
  const need = exercise.answer.length
  const complete = placed.length === need
  const tile = (i: number) => personalise(exercise.tiles[i] ?? "", learner)
  const bank = exercise.tiles
    .map((_, i) => i)
    .filter((i) => !placed.includes(i))
  const answerText = personalise(buildText(exercise, exercise.answer), learner)

  function onCheck() {
    const next = check(attempt, gradeBuild(exercise, placed))
    setAttempt(next)
    if (next.phase === "wrong")
      onMiss(buildMistake(lessonId, index, exercise, placed))
    if (next.phase === "shown") setPlaced(exercise.answer)
  }

  const slotState =
    attempt.phase === "right"
      ? "ok"
      : attempt.phase === "wrong"
        ? "bad"
        : attempt.phase === "shown"
          ? "ok"
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
          sub={personalise(exercise.sub, learner)}
        />

        <div
          aria-label="Your sentence"
          className={cn(
            "mt-8 flex min-h-20 flex-wrap items-center gap-2 rounded-2xl border-2 border-dashed border-input p-3",
            slotState === "ok" &&
              "border-solid border-success bg-success-subtle",
            slotState === "bad" && "border-solid border-danger bg-danger-subtle"
          )}
        >
          {placed.length === 0 && (
            <span className="px-2 text-muted-foreground">
              Tap the words in order.
            </span>
          )}
          {placed.map((i, position) => (
            <button
              key={i}
              type="button"
              disabled={!answering}
              onClick={() => setPlaced(placed.filter((value) => value !== i))}
              aria-label={`${tile(i)}, word ${position + 1}${answering ? ". Press to remove." : ""}`}
              className="min-h-12 rounded-xl border-2 border-selected-border bg-selected px-4 font-voice text-[1.3125rem] font-semibold text-selected-text transition-transform duration-(--duration-instant) active:scale-[0.97] motion-safe:animate-bump"
            >
              <span lang="de">{tile(i)}</span>
            </button>
          ))}
        </div>

        <ul aria-label="Words to use" className="mt-6 flex flex-wrap gap-2">
          {bank.map((i) => (
            <li key={i}>
              <button
                type="button"
                disabled={!answering}
                onClick={() => setPlaced([...placed, i])}
                className="min-h-12 rounded-xl border-2 border-border bg-card px-4 font-voice text-[1.3125rem] font-semibold transition-[transform,background-color,border-color] duration-(--duration-instant) hover:border-input hover:bg-background-subtle active:scale-[0.97] disabled:opacity-60"
              >
                <span lang="de">{tile(i)}</span>
              </button>
            </li>
          ))}
        </ul>
      </main>

      {answering && (
        <ActionFooter
          hint={
            complete
              ? "Ready to check."
              : `Use ${need} words to build the sentence.`
          }
          hintId={`hint-${index}`}
        >
          <Button
            size="lg"
            disabled={!complete}
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
          titleLang="de"
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
              onClick={() => {
                setAttempt(retry(attempt))
                setPlaced([])
              }}
            >
              Try again
            </Button>
          }
        >
          {personalise(exercise.feedback.wrong, learner)} Have another go.
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
          {answerText} {personalise(exercise.feedback.right, learner)} We’ve
          saved this one so you can practise it again.
        </FeedbackFooter>
      )}
    </>
  )
}
