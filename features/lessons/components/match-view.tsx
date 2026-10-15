"use client"

import { Check, ChevronRight, X } from "lucide-react"
import { useState } from "react"

import { GermanText } from "@/components/learning/german-text"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { check, retry, startAttempt, type Attempt } from "../engine/attempt"
import {
  emptyAssignments,
  gradeMatch,
  retryAssignments,
  solvedAssignments,
  unpairedMeanings,
  type Assignments,
} from "../engine/grading"
import { matchMistake } from "../engine/mistakes"
import type { MatchExercise } from "../schema"
import { ExerciseHeading } from "./exercise-heading"
import { ActionFooter, FeedbackFooter, rightTitle } from "./footer"
import type { ExerciseProps } from "./types"

type MatchViewProps = ExerciseProps<MatchExercise> & { lessonId: string }

function nextEmpty(assignments: Assignments, from = 0) {
  const at = assignments.findIndex((value, i) => i >= from && value === null)
  return at === -1 ? assignments.findIndex((value) => value === null) : at
}

export function MatchView({
  exercise,
  index,
  lessonId,
  onMiss,
  onDone,
}: MatchViewProps) {
  const [assignments, setAssignments] = useState<Assignments>(() =>
    emptyAssignments(exercise)
  )
  const [active, setActive] = useState<number | null>(0)
  const [graded, setGraded] = useState<boolean[] | null>(null)
  const [attempt, setAttempt] = useState<Attempt>(startAttempt)

  const answering = attempt.phase === "answering"
  const complete = assignments.every((value) => value !== null)
  const tray = unpairedMeanings(exercise, assignments)

  function pairWith(meaning: string) {
    if (!answering) return
    const target = active ?? nextEmpty(assignments)
    if (target < 0) return
    const next = assignments.map((value, i) => (i === target ? meaning : value))
    setAssignments(next)
    const following = nextEmpty(next, target + 1)
    setActive(following === -1 ? null : following)
  }

  function chooseRow(i: number) {
    if (!answering) return
    if (assignments[i] !== null)
      setAssignments(assignments.map((value, at) => (at === i ? null : value)))
    setActive(i)
  }

  function onCheck() {
    const result = gradeMatch(exercise, assignments)
    const next = check(attempt, result.allCorrect ? "correct" : "wrong")
    setAttempt(next)
    setGraded(result.correct)
    if (next.phase === "wrong")
      onMiss(matchMistake(lessonId, index, exercise, assignments))
    if (next.phase === "shown") setAssignments(solvedAssignments(exercise))
  }

  function onRetry() {
    const kept = retryAssignments(exercise, assignments)
    setAttempt(retry(attempt))
    setAssignments(kept)
    setGraded(null)
    setActive(nextEmpty(kept))
  }

  const wrongSummary = exercise.pairs
    .flatMap((pair, i) =>
      graded && !graded[i]
        ? [`${pair.phrase} ${exercise.labels.joiner.trim()} ${pair.meaning}`]
        : []
    )
    .join(". ")

  return (
    <>
      <main
        id="main"
        className="mx-auto w-full max-w-(--lesson-max) flex-1 px-[clamp(20px,4vw,32px)] py-10 pb-40"
      >
        <ExerciseHeading
          kind={exercise.kind}
          title={exercise.prompt}
          sub={exercise.sub}
        />

        <ul className="mt-8 flex flex-col gap-3">
          {exercise.pairs.map((pair, i) => {
            const meaning = assignments[i]
            const right = graded?.[i]
            const shown = attempt.phase === "shown"
            return (
              <li key={pair.phrase}>
                <button
                  type="button"
                  onClick={() => chooseRow(i)}
                  disabled={!answering}
                  aria-pressed={active === i && answering}
                  aria-label={
                    meaning
                      ? `${pair.phrase} ${exercise.labels.joiner.trim()} ${meaning}. ${answering ? "Press to change." : ""}`
                      : `${pair.phrase}. ${exercise.labels.empty}.`
                  }
                  className={cn(
                    "flex min-h-14 w-full items-center gap-3 rounded-xl border-2 border-border bg-card px-4 py-2.5 text-left transition-[transform,background-color,border-color] duration-(--duration-instant)",
                    answering &&
                      "cursor-pointer hover:border-input hover:bg-background-subtle active:scale-[0.99]",
                    answering &&
                      active === i &&
                      "border-selected-border bg-selected hover:bg-selected",
                    right === true &&
                      "border-success bg-success-subtle motion-safe:animate-bump",
                    right === false &&
                      !shown &&
                      "border-danger bg-danger-subtle motion-safe:animate-shake",
                    shown && "border-success bg-success-subtle"
                  )}
                >
                  <GermanText className="min-w-0 flex-1 text-xl">
                    {pair.phrase}
                  </GermanText>
                  <ChevronRight
                    aria-hidden="true"
                    className="size-4 shrink-0 text-muted-foreground"
                  />
                  <span
                    className={cn(
                      "min-w-0 flex-1 text-[1.0625rem]",
                      !meaning && "text-muted-foreground italic",
                      exercise.meaningsLanguage === "de" && "font-voice"
                    )}
                  >
                    {meaning ?? exercise.labels.empty}
                  </span>
                  {(right === true || shown) && (
                    <Check
                      aria-label="Right"
                      className="size-4 shrink-0 text-success-text"
                    />
                  )}
                  {right === false && !shown && (
                    <X
                      aria-label="Not this one"
                      className="size-4 shrink-0 text-danger-text"
                    />
                  )}
                </button>
              </li>
            )
          })}
        </ul>

        <div className="mt-6">
          <p className="mb-2 text-sm font-semibold text-secondary-text">
            {exercise.labels.meanings}
          </p>
          <ul className="flex flex-wrap gap-2">
            {tray.map((meaning) => (
              <li key={meaning}>
                <button
                  type="button"
                  disabled={!answering}
                  onClick={() => pairWith(meaning)}
                  className="min-h-11 rounded-xl border-2 border-border bg-card px-3.5 text-[1rem] font-semibold transition-[transform,background-color,border-color] duration-(--duration-instant) hover:border-input hover:bg-background-subtle active:scale-[0.97] disabled:opacity-60"
                >
                  {meaning}
                </button>
              </li>
            ))}
            {tray.length === 0 && (
              <li className="text-sm text-muted-foreground">
                Every meaning is paired.
              </li>
            )}
          </ul>
        </div>
      </main>

      {answering && (
        <ActionFooter
          hint={complete ? "Ready to check." : "Pair every phrase to continue."}
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
          {exercise.explanation}
        </FeedbackFooter>
      )}
      {attempt.phase === "wrong" && (
        <FeedbackFooter
          result="incorrect"
          title="Not quite"
          savedToMistakes
          action={
            <Button size="lg" variant="outline" onClick={onRetry}>
              Try again
            </Button>
          }
        >
          {wrongSummary}. Your right pairs stay in place. Have another go.
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
          {exercise.explanation} We’ve saved this one so you can practise it
          again.
        </FeedbackFooter>
      )}
    </>
  )
}
