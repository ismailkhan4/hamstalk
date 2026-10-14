"use client"

import { useCallback, useState } from "react"

import {
  AnswerOption,
  type AnswerOptionState,
} from "@/components/exercises/answer-option"
import { Avatar } from "@/components/learning/avatar"
import { GermanText } from "@/components/learning/german-text"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import {
  check,
  collapseOutcomes,
  retry,
  startAttempt,
  type Attempt,
  type Outcome,
} from "../engine/attempt"
import { choiceNote, gradeChoice } from "../engine/grading"
import { turnMistake } from "../engine/mistakes"
import { personalise, type ConversationExercise } from "../schema"
import { ExerciseHeading } from "./exercise-heading"
import { ActionFooter, FeedbackFooter, rightTitle } from "./footer"
import { ListenButton } from "./listen-button"
import type { ExerciseProps } from "./types"
import { useDigitKeys } from "./use-digit-keys"

type Said = {
  person: ConversationExercise["turns"][number]["speaker"]["person"]
  initials: string
  label: string
  de: string
  en: string
}

type ConversationViewProps = ExerciseProps<ConversationExercise> & {
  lessonId: string
}

export function ConversationView({
  exercise,
  index,
  lessonId,
  learner,
  onMiss,
  onDone,
}: ConversationViewProps) {
  const [turnIndex, setTurnIndex] = useState(0)
  const [selection, setSelection] = useState<number | null>(null)
  const [chosen, setChosen] = useState<number | null>(null)
  const [attempt, setAttempt] = useState<Attempt>(startAttempt)
  const [turnOutcomes, setTurnOutcomes] = useState<Outcome[]>([])
  const [history, setHistory] = useState<Said[]>([])

  const turn = exercise.turns[turnIndex]
  const last = turnIndex === exercise.turns.length - 1
  const answering = attempt.phase === "answering"
  const finished = attempt.phase === "right" || attempt.phase === "shown"

  const pick = useCallback((option: number) => setSelection(option), [])
  useDigitKeys(turn?.options.length ?? 0, answering, pick)

  if (!turn) return null

  function onCheck() {
    if (selection === null || !turn) return
    const next = check(attempt, gradeChoice(turn, selection))
    setChosen(selection)
    setAttempt(next)
    if (next.phase === "wrong")
      onMiss(turnMistake(lessonId, index, turnIndex, exercise, turn, selection))
  }

  function onContinue() {
    if (!turn || !attempt.outcome) return
    const outcomes = [...turnOutcomes, attempt.outcome]
    if (last) {
      onDone(collapseOutcomes(outcomes), outcomes)
      return
    }
    const answer = turn.options[turn.correct]
    setHistory((current) => [
      ...current,
      { ...turn.speaker, de: turn.line, en: turn.translation },
      {
        person: "me",
        initials: learner.initials,
        label: "You",
        de: answer?.de ?? "",
        en: answer?.en ?? "",
      },
    ])
    setTurnOutcomes(outcomes)
    setTurnIndex(turnIndex + 1)
    setSelection(null)
    setChosen(null)
    setAttempt(startAttempt())
  }

  function optionState(option: number): AnswerOptionState {
    const isCorrect = option === turn!.correct
    const isAlternative = turn!.alternatives.includes(option)
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

  const bubbles: Said[] = [
    ...history,
    { ...turn.speaker, de: turn.line, en: turn.translation },
  ]
  if (finished && last) {
    const answer = turn.options[turn.correct]
    bubbles.push(
      {
        person: "me",
        initials: learner.initials,
        label: "You",
        de: answer?.de ?? "",
        en: answer?.en ?? "",
      },
      {
        ...exercise.closing.speaker,
        de: exercise.closing.de,
        en: exercise.closing.en,
      }
    )
  }
  const note =
    chosen === null ? "" : personalise(choiceNote(turn, chosen), learner)
  const correct = turn.options[turn.correct]

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
        <ol
          aria-label="The conversation so far"
          className="mt-6 flex flex-col gap-4"
        >
          {bubbles.map((said, i) => (
            <li key={i} className="flex items-start gap-3">
              <Avatar
                person={said.person}
                initials={personalise(said.initials, learner)}
                size="md"
              />
              <div>
                <p className="text-xs text-muted-foreground">
                  {personalise(said.label, learner)}
                </p>
                <GermanText
                  as="p"
                  className={cn(
                    "text-[22px] leading-snug",
                    said.person === "me" && "text-primary-text"
                  )}
                >
                  {personalise(said.de, learner)}
                </GermanText>
                <p className="text-[15px] text-muted-foreground">
                  {personalise(said.en, learner)}
                </p>
              </div>
            </li>
          ))}
        </ol>

        {!(finished && last) && (
          <section
            aria-labelledby={`turn-${turnIndex}`}
            className="mt-8 rounded-2xl border border-border bg-card p-4 sm:p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 id={`turn-${turnIndex}`} className="font-semibold">
                Your turn · {turn.task}
              </h2>
              <ListenButton
                text={personalise(turn.line, learner)}
                label={`Hear ${turn.speaker.label.split(" ")[0]} again`}
              />
            </div>
            <div
              role="radiogroup"
              aria-labelledby={`turn-${turnIndex}`}
              className="mt-4 flex flex-col gap-3"
            >
              {turn.options.map((option, i) => (
                <AnswerOption
                  key={option.de}
                  index={i}
                  lang="de"
                  translation={personalise(option.en, learner)}
                  state={optionState(i)}
                  locked={!answering}
                  onSelect={() => pick(i)}
                >
                  {personalise(option.de, learner)}
                </AnswerOption>
              ))}
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Question {turnIndex + 1} of {exercise.turns.length}
            </p>
          </section>
        )}
      </main>

      {answering && (
        <ActionFooter hint="Ready when you are." hintId={`hint-${index}`}>
          <Button
            size="lg"
            disabled={selection === null}
            aria-describedby={`hint-${index}`}
            onClick={onCheck}
          >
            Say it
          </Button>
        </ActionFooter>
      )}
      {attempt.phase === "right" && (
        <FeedbackFooter
          result="correct"
          title={rightTitle(index + turnIndex)}
          titleLang="de"
          action={
            <Button size="lg" onClick={onContinue}>
              {last ? "Continue" : "Next"}
            </Button>
          }
        >
          {note}
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
          {note} Have another go.
        </FeedbackFooter>
      )}
      {attempt.phase === "shown" && (
        <FeedbackFooter
          result="shown"
          title="Here’s the answer"
          action={
            <Button size="lg" onClick={onContinue}>
              {last ? "Continue" : "Next"}
            </Button>
          }
        >
          {personalise(correct?.de ?? "", learner)}{" "}
          {personalise(turn.feedback.right, learner)} We’ve saved this one so
          you can practise it again.
        </FeedbackFooter>
      )}
    </>
  )
}
