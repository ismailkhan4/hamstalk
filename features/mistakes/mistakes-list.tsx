"use client"

import { Check, NotebookPen, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { AnswerOption } from "@/components/exercises/answer-option"
import { EmptyState } from "@/components/feedback/empty-state"
import { TargetText } from "@/components/learning/target-text"
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button-variants"
import { ACTIVE_COURSE, TARGET_LANG } from "@/content/courses"
import { optionOrder } from "@/features/lessons/engine/shuffle"
import { cn } from "@/lib/utils"

import { AskWhy } from "@/features/ai/ask-why"
import type { ExplainResult } from "@/features/ai/explain"

import type { Mistake } from "./data"

type RetryResult =
  { ok: true; correct: boolean; note: string } | { ok: false; message: string }

type MistakesListProps = {
  mistakes: Mistake[]
  /** Asks the question again; the server grades it. */
  onRetry: (itemKey: string, selection: number) => Promise<RetryResult>
  /** Show only one lesson's mistakes, as when arriving from a completion screen. */
  lessonFilter?: string | null
  /** Hamsti explains a mistake with AI; absent when AI isn't switched on. */
  onExplain?: (mistake: Mistake) => Promise<ExplainResult>
}

type CardState = {
  open: boolean
  result: { correct: boolean; note: string } | null
  error: string | null
  learned: boolean
  pending: boolean
}

function Card({
  mistake,
  state,
  onOpen,
  onPick,
  onExplain,
}: {
  mistake: Mistake
  state: CardState
  onOpen: () => void
  onPick: (selection: number) => void
  onExplain?: (mistake: Mistake) => Promise<ExplainResult>
}) {
  const learned = state.learned
  return (
    <li className="border-b border-border-subtle py-6">
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span className="rounded-sm bg-muted px-1.5 py-0.5 text-secondary-text">
          {mistake.topic}
        </span>
        <span>{mistake.lessonLabel}</span>
        <span>
          {mistake.missCount === 1
            ? "Missed once"
            : `Missed ${mistake.missCount} times`}
        </span>
      </p>
      <TargetText as="p" className="mt-2 text-2xl leading-snug">
        {mistake.prompt}
      </TargetText>
      <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[0.9375rem]">
        <dt className="text-muted-foreground">You answered</dt>
        <dd className="text-danger-text line-through decoration-1">
          {mistake.learnerAnswer}
        </dd>
        <dt className="text-muted-foreground">Correct</dt>
        <dd className="font-semibold text-success-text">
          {mistake.correctAnswer}
        </dd>
      </dl>
      <p className="mt-3 max-w-[64ch] text-[0.9375rem] text-secondary-text">
        {mistake.reason}
      </p>
      {onExplain && <AskWhy explain={() => onExplain(mistake)} />}

      {learned ? (
        <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-success-text">
          <Check aria-hidden="true" className="size-4" />
          Learned
        </p>
      ) : (
        <div className="mt-4">
          {!state.open ? (
            <div className="flex flex-wrap items-center gap-4">
              {mistake.retry ? (
                <Button
                  variant="outline"
                  size="lg"
                  iconLeft={<RefreshCw />}
                  onClick={onOpen}
                  aria-label={`Try again: ${mistake.prompt}`}
                >
                  Try again
                </Button>
              ) : null}
              <Link
                href={`/learn/${mistake.lessonId}`}
                className="text-sm font-semibold text-primary-text underline underline-offset-[3px]"
              >
                {mistake.retry
                  ? "Practise this lesson"
                  : "Replay this lesson to practise it"}
              </Link>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm font-semibold text-secondary-text">
                Try it again:
              </p>
              {mistake.retry?.fill && (
                <p lang={TARGET_LANG} className="mt-2 font-voice text-xl">
                  {mistake.retry.fill.before} … {mistake.retry.fill.after}
                </p>
              )}
              <div
                role="radiogroup"
                aria-label="Answers"
                className="mt-3 flex flex-col gap-2"
              >
                {(mistake.retry
                  ? optionOrder(mistake.retry.options.length, mistake.itemKey)
                  : []
                ).map((i, position) => {
                  const option = mistake.retry?.options[i]
                  if (!option) return null
                  return (
                    <AnswerOption
                      key={option.target}
                      index={position}
                      language={mistake.retry?.optionsLanguage ?? "native"}
                      {...(option.native ? { translation: option.native } : {})}
                      state="idle"
                      locked={state.pending}
                      onSelect={() => onPick(i)}
                    >
                      {option.target}
                    </AnswerOption>
                  )
                })}
              </div>
              <p
                role="status"
                aria-live="polite"
                className={cn(
                  "mt-3 text-sm",
                  state.result?.correct
                    ? "text-success-text"
                    : "text-danger-text"
                )}
              >
                {state.error ??
                  (state.result
                    ? `${state.result.correct ? `${ACTIVE_COURSE.phrases.right[0]} ` : "Not quite. "}${state.result.note}`
                    : "")}
              </p>
            </div>
          )}
        </div>
      )}
    </li>
  )
}

export function MistakesList({
  mistakes,
  onRetry,
  lessonFilter = null,
  onExplain,
}: MistakesListProps) {
  const [topic, setTopic] = useState<string | null>(null)
  const [states, setStates] = useState<Record<string, CardState>>({})

  const base = lessonFilter
    ? mistakes.filter((mistake) => mistake.lessonId === lessonFilter)
    : mistakes
  const stateOf = (mistake: Mistake): CardState =>
    states[mistake.itemKey] ?? {
      open: false,
      result: null,
      error: null,
      learned: mistake.learned,
      pending: false,
    }
  const open = base.filter((mistake) => !stateOf(mistake).learned)
  const learned = base.filter((mistake) => stateOf(mistake).learned)
  const topics = [...new Set(open.map((mistake) => mistake.topic))]
  const shown = topic ? open.filter((mistake) => mistake.topic === topic) : open

  function update(mistake: Mistake, patch: Partial<CardState>) {
    setStates((current) => ({
      ...current,
      [mistake.itemKey]: {
        ...stateOf(mistake),
        ...(current[mistake.itemKey] ?? {}),
        ...patch,
      },
    }))
  }

  async function pick(mistake: Mistake, selection: number) {
    update(mistake, { pending: true, error: null })
    const result = await onRetry(mistake.itemKey, selection)
    if (!result.ok) update(mistake, { pending: false, error: result.message })
    else
      update(mistake, {
        pending: false,
        result: { correct: result.correct, note: result.note },
        learned: result.correct,
      })
  }

  return (
    <>
      <h1 className="font-display text-h1 font-bold">Mistakes notebook</h1>
      <p className="mt-2 max-w-[60ch] text-body-lg text-secondary-text">
        Every answer you missed lands here with the right answer and the reason.
        Try them again until they stick.
      </p>

      {open.length === 0 ? (
        <EmptyState
          icon={NotebookPen}
          title="Nothing to look at again"
          actions={
            <Link
              href="/home"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Back to home
            </Link>
          }
        >
          {learned.length > 0
            ? "You’ve worked through every mistake so far. "
            : "You haven’t missed anything yet. "}
          New ones appear here after lessons and reviews.
        </EmptyState>
      ) : (
        <>
          <p
            role="status"
            aria-live="polite"
            className="mt-6 flex gap-3 rounded-xl border border-border bg-card p-4"
          >
            <NotebookPen
              aria-hidden="true"
              className="mt-0.5 size-[18px] shrink-0 text-primary-text"
            />
            <span>
              <b className="block">
                {open.length === 1
                  ? "1 answer to look at again"
                  : `${open.length} answers to look at again`}
              </b>
              <span className="text-[0.9375rem] text-secondary-text">
                Mistakes are where the learning happens. Answer one right and
                it’s marked as learned.
              </span>
            </span>
          </p>
          <div
            role="group"
            aria-label="Topics"
            className="mt-5 flex flex-wrap items-center gap-2"
          >
            {[null, ...topics].map((entry) => (
              <button
                key={entry ?? "all"}
                type="button"
                aria-pressed={topic === entry}
                onClick={() => setTopic(entry)}
                className={cn(
                  "min-h-9 rounded-lg border-[1.5px] border-border bg-card px-3 text-sm font-medium hover:border-input",
                  topic === entry &&
                    "border-foreground font-semibold shadow-[inset_0_0_0_1px_var(--foreground)]"
                )}
              >
                {entry ?? "All"}{" "}
                <span className="text-muted-foreground tabular-nums">
                  {entry
                    ? open.filter((mistake) => mistake.topic === entry).length
                    : open.length}
                </span>
              </button>
            ))}
            <span className="ml-auto text-xs text-muted-foreground">
              Most missed first
            </span>
          </div>
        </>
      )}

      {shown.length > 0 && (
        <ul className="mt-2 border-t border-border">
          {shown.map((mistake) => (
            <Card
              key={mistake.itemKey}
              mistake={mistake}
              state={stateOf(mistake)}
              onOpen={() => update(mistake, { open: true })}
              onPick={(selection) => void pick(mistake, selection)}
              onExplain={onExplain}
            />
          ))}
        </ul>
      )}

      {learned.length > 0 && (
        <section aria-labelledby="learned" className="mt-8">
          <h2 id="learned" className="font-semibold">
            Learned · {learned.length}
          </h2>
          <ul className="mt-2 border-t border-border">
            {learned.map((mistake) => (
              <Card
                key={mistake.itemKey}
                mistake={mistake}
                state={stateOf(mistake)}
                onOpen={() => {}}
                onPick={() => {}}
              />
            ))}
          </ul>
        </section>
      )}
    </>
  )
}
