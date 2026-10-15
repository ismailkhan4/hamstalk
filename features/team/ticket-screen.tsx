"use client"

import { ArrowLeft, Info, Languages } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { AppShell } from "@/components/layout/app-shell"
import { ArticleWord } from "@/components/learning/article-word"
import { GermanText } from "@/components/learning/german-text"
import { Button } from "@/components/ui/button"
import { ticket } from "@/content/team-tasks"
import {
  check,
  retry,
  startAttempt,
  type Attempt,
} from "@/features/lessons/engine/attempt"
import type { NotebookCounts } from "@/features/review/data"
import { cn } from "@/lib/utils"

type Props = {
  shell: { name: string; email: string; counts?: NotebookCounts }
  firstName: string
}

const personalise = (text: string, name: string) => text.replaceAll("%N", name)

export function TicketScreen({ shell, firstName }: Props) {
  const [english, setEnglish] = useState(true)
  const [placed, setPlaced] = useState<number[]>([])
  const [attempt, setAttempt] = useState<Attempt>(startAttempt)
  const { task } = ticket
  const answering = attempt.phase === "answering"
  const done = attempt.phase === "right" || attempt.phase === "shown"
  const shown = attempt.phase === "shown" ? task.answer : placed
  const bank = task.tiles.map((_, i) => i).filter((i) => !shown.includes(i))

  function onCheck() {
    const right =
      placed.length === task.answer.length &&
      placed.every((tile, position) => tile === task.answer[position])
    setAttempt(check(attempt, right ? "correct" : "wrong"))
  }

  return (
    <AppShell {...shell}>
      <main
        id="main"
        className="mx-auto max-w-(--content-max) px-4 py-8 sm:px-6 lg:px-10"
      >
        <Link
          href="/team"
          className="inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-semibold text-secondary-text hover:text-foreground"
        >
          <ArrowLeft aria-hidden="true" className="size-[18px]" />
          Team
        </Link>

        <div className="mt-2 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)] xl:gap-12">
          <div className="min-w-0">
            <article
              aria-labelledby="ticket-title"
              className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-sm font-semibold">
                  {ticket.id}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-md bg-info-subtle px-2 py-1 text-sm font-semibold text-info-text">
                  <i
                    aria-hidden="true"
                    className="size-2 rounded-full bg-current"
                  />
                  <span lang="de">{ticket.status.de}</span> · {ticket.status.en}
                </span>
                <span className="grow" />
                <Button
                  variant="outline"
                  size="sm"
                  aria-pressed={english}
                  onClick={() => setEnglish((on) => !on)}
                >
                  <Languages aria-hidden="true" data-icon="inline-start" />
                  English
                </Button>
              </div>
              <h1
                id="ticket-title"
                lang="de"
                className="mt-4 font-voice text-[clamp(1.75rem,4vw,2.25rem)] leading-tight"
              >
                {ticket.title.de}
              </h1>
              {english && (
                <p className="text-secondary-text">{ticket.title.en}</p>
              )}

              <ul className="mt-5 grid gap-4 border-y border-border-subtle py-4 sm:grid-cols-3">
                {ticket.fields.map((field) => (
                  <li key={field.de}>
                    <span
                      lang="de"
                      className="block text-xs text-muted-foreground"
                    >
                      {field.de}
                    </span>
                    <GermanText className="text-lg">
                      {personalise(field.value.de, firstName)}
                    </GermanText>
                    {english && (
                      <span className="block text-xs text-muted-foreground">
                        {field.value.en || field.en}
                      </span>
                    )}
                  </li>
                ))}
              </ul>

              <GermanText as="p" className="mt-5 text-xl leading-relaxed">
                {personalise(ticket.body.de, firstName)}
              </GermanText>
              {english && (
                <p className="mt-2 text-secondary-text">
                  {personalise(ticket.body.en, firstName)}
                </p>
              )}
            </article>

            <section
              aria-labelledby="task-title"
              className="mt-6 rounded-2xl border border-primary-border bg-card p-5 sm:p-6"
            >
              <p className="flex items-center gap-2 text-sm font-semibold text-primary-text">
                <i
                  aria-hidden="true"
                  className="size-2 rounded-full bg-spark"
                />
                Your task
              </p>
              <h2
                id="task-title"
                className="mt-1 font-display text-h3 font-bold"
              >
                {task.title}
              </h2>
              <p className="mt-1 text-secondary-text">{task.prompt}</p>

              <div
                aria-label="Your sentence"
                className={cn(
                  "mt-5 flex min-h-16 flex-wrap items-center gap-2 rounded-xl border-[1.5px] border-dashed border-input p-3",
                  done && "border-solid border-success bg-success-subtle",
                  attempt.phase === "wrong" &&
                    "border-solid border-danger bg-danger-subtle"
                )}
              >
                {shown.length === 0 && (
                  <span className="px-2 text-muted-foreground">
                    Tap the words in order.
                  </span>
                )}
                {shown.map((i, position) => (
                  <button
                    key={i}
                    type="button"
                    disabled={!answering}
                    onClick={() => setPlaced(placed.filter((v) => v !== i))}
                    aria-label={`${task.tiles[i]}, word ${position + 1}${answering ? ". Press to remove." : ""}`}
                    className="min-h-12 rounded-lg border-[1.5px] border-primary bg-primary-subtle px-4 font-voice text-[1.3125rem]"
                  >
                    <span lang="de">{task.tiles[i]}</span>
                  </button>
                ))}
              </div>
              <ul
                aria-label="Words to use"
                className="mt-4 flex flex-wrap gap-2"
              >
                {bank.map((i) => (
                  <li key={i}>
                    <button
                      type="button"
                      disabled={!answering}
                      onClick={() => setPlaced([...placed, i])}
                      className="min-h-12 rounded-lg border-[1.5px] border-border bg-card px-4 font-voice text-[1.3125rem] hover:border-input disabled:opacity-60"
                    >
                      <span lang="de">{task.tiles[i]}</span>
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-5" aria-live="polite">
                {attempt.phase === "right" && (
                  <p className="rounded-lg border border-success-border bg-success-subtle p-3 text-success-text">
                    <b>Richtig!</b> {task.right} Nothing is sent to Lena; this
                    is practice.
                  </p>
                )}
                {attempt.phase === "wrong" && (
                  <p
                    role="alert"
                    className="rounded-lg border border-danger-border bg-danger-subtle p-3 text-danger-text"
                  >
                    <b>Not quite.</b> {task.wrong} Have another go.
                  </p>
                )}
                {attempt.phase === "shown" && (
                  <p
                    role="alert"
                    className="rounded-lg border border-border bg-inset p-3"
                  >
                    <b>Here’s the answer.</b> {task.right}
                  </p>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                {answering && (
                  <Button
                    size="lg"
                    disabled={placed.length !== task.answer.length}
                    onClick={onCheck}
                  >
                    Check sentence
                  </Button>
                )}
                {attempt.phase === "wrong" && (
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
                )}
                {done && (
                  <Link
                    href="/team"
                    className="inline-flex h-12 items-center rounded-lg bg-primary px-5 font-semibold text-primary-foreground"
                  >
                    Back to team
                  </Link>
                )}
              </div>
            </section>
          </div>

          <aside aria-labelledby="words" className="lg:pt-2">
            <h2 id="words" className="font-display text-h3 font-bold">
              Words in this ticket
            </h2>
            <ul className="mt-3 divide-y divide-border-subtle">
              {ticket.words.map((gloss) => (
                <li key={gloss.word} className="py-2.5">
                  <div className="flex items-baseline justify-between gap-3">
                    {gloss.article ? (
                      <ArticleWord
                        article={gloss.article}
                        word={gloss.word}
                        className="text-lg"
                      />
                    ) : (
                      <GermanText className="text-lg">{gloss.word}</GermanText>
                    )}
                    <span className="text-sm text-muted-foreground">
                      {gloss.en}
                    </span>
                  </div>
                  {gloss.forms && (
                    <p lang="de" className="text-xs text-warning-text">
                      {gloss.forms}
                    </p>
                  )}
                </li>
              ))}
            </ul>
            <p className="mt-5 flex gap-2.5 rounded-xl border border-primary-border bg-primary-subtle p-4 text-sm text-primary-text">
              <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
              <span>
                <b className="block">Not a real ticket</b>
                This is a learning task. Nothing here connects to a code
                repository, and nothing is sent to a real person.
              </span>
            </p>
          </aside>
        </div>
      </main>
    </AppShell>
  )
}
