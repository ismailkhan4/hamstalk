"use client"

import { Repeat } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { TARGET_LANG } from "@/content/courses"
import { EmptyState } from "@/components/feedback/empty-state"
import { Alert } from "@/components/feedback/alert"
import { AppShell } from "@/components/layout/app-shell"
import { ArticleWord } from "@/components/learning/article-word"
import { FocusHeader } from "@/components/learning/focus-header"
import { TargetText } from "@/components/learning/target-text"
import { LocalTime } from "@/components/learning/local-time"
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button-variants"
import { ListenButton } from "@/features/lessons/components/listen-button"
import { useRouter } from "next/navigation"

import type { NotebookCounts, ReviewCard, ReviewOverview } from "./data"
import type { Rating } from "./scheduler"
import { StrengthBars } from "./strength-bars"

type RateResult = { ok: true; label: string } | { ok: false; message: string }

type ReviewScreenProps = {
  shell: { name: string; email: string; counts?: NotebookCounts }
  overview: ReviewOverview
  sessionSize: number
  onRate: (itemKey: string, rating: Rating) => Promise<RateResult>
}

function Word({ card, className }: { card: ReviewCard; className?: string }) {
  return card.article ? (
    <ArticleWord
      article={card.article}
      word={card.word}
      className={className}
    />
  ) : (
    <TargetText className={className}>{card.word}</TargetText>
  )
}

export function ReviewScreen({
  shell,
  overview,
  sessionSize,
  onRate,
}: ReviewScreenProps) {
  const router = useRouter()
  const [phase, setPhase] = useState<"overview" | "card" | "done">("overview")
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<
    { card: ReviewCard; rating: Rating }[]
  >([])

  // The session's deck is fixed when it starts. Rating a card refreshes the page (for the XP
  // badges), which drops that card from "due"; a deck derived from props would skip the next one.
  const [cards] = useState(() => overview.due.slice(0, sessionSize))
  const card = cards[index]

  async function rate(rating: Rating) {
    if (!card) return
    setPending(true)
    setError(null)
    const result = await onRate(card.itemKey, rating)
    setPending(false)
    if (!result.ok) {
      setError(result.message)
      return
    }
    setResults((current) => [...current, { card, rating }])
    if (index + 1 >= cards.length) setPhase("done")
    else {
      setIndex(index + 1)
      setRevealed(false)
    }
  }

  if (phase === "card" && card) {
    return (
      <div className="flex min-h-svh flex-col bg-background">
        <FocusHeader
          closeLabel="Leave the review"
          onClose={() => router.push("/review")}
          progress={{ current: index, total: cards.length }}
        />
        <main
          id="main"
          className="mx-auto w-full max-w-(--lesson-max) flex-1 px-[clamp(20px,4vw,32px)] py-10 pb-44"
        >
          <p className="flex items-center gap-2 text-[0.8438rem] font-semibold text-primary-text">
            <Repeat aria-hidden="true" className="size-4" />
            Vocabulary review
          </p>
          <section
            aria-label={`Card ${index + 1} of ${cards.length}`}
            className="mt-4 rounded-2xl border border-border bg-card p-6 shadow-sm"
          >
            <Word
              card={card}
              className="text-[clamp(36px,6vw,48px)] leading-tight"
            />
            <div className="mt-3 flex items-center gap-3">
              <ListenButton text={card.word} label="Pronunciation" />
              <StrengthBars strength={card.strength} />
            </div>
            {card.exampleTarget && (
              <TargetText as="p" className="mt-5 text-xl">
                {card.exampleTarget}
              </TargetText>
            )}
            {revealed && (
              <div className="mt-5 border-t border-dashed border-border pt-5">
                <p className="text-2xl font-bold">{card.native}</p>
                {card.exampleNative && (
                  <p className="mt-1 text-secondary-text">
                    {card.exampleNative}
                  </p>
                )}
              </div>
            )}
          </section>
          {error && (
            <Alert tone="error" title="Not saved" className="mt-4">
              {error}
            </Alert>
          )}
        </main>
        <footer className="fixed inset-x-0 bottom-0 z-(--z-sticky) border-t border-border-subtle bg-background pb-[env(safe-area-inset-bottom)]">
          <div className="mx-auto max-w-(--lesson-max) px-[clamp(20px,4vw,32px)] py-3.5">
            {!revealed ? (
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">
                  Think of the meaning, then show the answer.
                </p>
                <Button size="lg" onClick={() => setRevealed(true)}>
                  Show answer
                </Button>
              </div>
            ) : (
              <>
                <p className="mb-2 text-center text-sm text-muted-foreground">
                  Be honest. This only decides when the word comes back.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    size="lg"
                    disabled={pending}
                    onClick={() => rate("again")}
                    className="h-auto flex-col py-2.5"
                  >
                    Need more practice
                    <span className="text-xs font-normal text-muted-foreground">
                      Comes back tomorrow
                    </span>
                  </Button>
                  <Button
                    size="lg"
                    disabled={pending}
                    onClick={() => rate("remembered")}
                    className="h-auto flex-col py-2.5"
                  >
                    Remembered
                    <span className="text-xs font-normal opacity-80">
                      Comes back in a few days
                    </span>
                  </Button>
                </div>
              </>
            )}
          </div>
        </footer>
      </div>
    )
  }

  if (phase === "done") {
    const again = results.filter((entry) => entry.rating === "again")
    return (
      <div className="flex min-h-svh flex-col bg-background">
        <FocusHeader
          closeLabel="Close"
          onClose={() => router.push("/home")}
          progress={{ current: cards.length, total: cards.length, done: true }}
        />
        <main
          id="main"
          className="mx-auto w-full max-w-(--lesson-max) flex-1 px-[clamp(20px,4vw,32px)] py-12"
        >
          <div className="text-center">
            <h1
              lang={TARGET_LANG}
              className="font-voice text-[clamp(40px,6vw,60px)] leading-tight"
            >
              Gut gemacht.
            </h1>
            <p className="mt-2 text-lg text-secondary-text">
              Review finished. Every word you rated is scheduled again.
            </p>
          </div>
          <dl className="mt-10 grid grid-cols-3 gap-4 border-y border-border py-4">
            <div>
              <dt className="text-[0.8125rem] text-muted-foreground">
                Words reviewed
              </dt>
              <dd className="mt-1 font-display text-3xl font-bold">
                {results.length}
              </dd>
            </div>
            <div>
              <dt className="text-[0.8125rem] text-muted-foreground">
                Remembered
              </dt>
              <dd className="mt-1 font-display text-3xl font-bold">
                {results.length - again.length}
              </dd>
            </div>
            <div>
              <dt className="text-[0.8125rem] text-muted-foreground">
                Need more practice
              </dt>
              <dd className="mt-1 font-display text-3xl font-bold">
                {again.length}
              </dd>
            </div>
          </dl>
          {again.length > 0 && (
            <section aria-labelledby="back-tomorrow" className="mt-8">
              <h2 id="back-tomorrow" className="font-semibold">
                Coming back tomorrow
              </h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {again.map(({ card: item }) => (
                  <li
                    key={item.itemKey}
                    className="rounded-lg bg-card px-3 py-1.5 shadow-[inset_0_0_0_1px_var(--border)]"
                  >
                    <Word card={item} className="text-lg" />
                  </li>
                ))}
              </ul>
            </section>
          )}
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href="/home" className={buttonVariants({ size: "lg" })}>
              Back to home
            </Link>
            <Link
              href="/path"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Back to learning path
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const dueCount = overview.due.length
  return (
    <AppShell {...shell}>
      <main
        id="main"
        className="mx-auto max-w-(--content-max) px-4 py-8 sm:px-6 lg:px-10"
      >
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-h1 font-bold">
              Vocabulary review
            </h1>
            <p className="mt-2 max-w-[56ch] text-body-lg text-secondary-text">
              Rate yourself honestly. Words you need to practise come back
              sooner; words you remember come back later.
            </p>
          </div>
          {dueCount > 0 && (
            <Button size="lg" onClick={() => setPhase("card")}>
              Start review · {cards.length}{" "}
              {cards.length === 1 ? "word" : "words"}
            </Button>
          )}
        </header>

        {overview.total === 0 ? (
          <EmptyState
            icon={Repeat}
            title="No words to review yet"
            actions={
              <Link
                href="/home"
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                Continue your lesson
              </Link>
            }
          >
            Finish a lesson and its words come here, and any phrase you save
            does too.
          </EmptyState>
        ) : dueCount === 0 ? (
          <EmptyState
            icon={Repeat}
            title="Nothing to review right now"
            actions={
              <Link
                href="/path"
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                Start a new lesson
              </Link>
            }
          >
            {overview.nextDue ? (
              <>
                Your next review is due <LocalTime iso={overview.nextDue} />.
                Spaced repetition works best with a little forgetting, so this
                is a good thing.
              </>
            ) : (
              "Spaced repetition works best with a little forgetting, so this is a good thing."
            )}
          </EmptyState>
        ) : (
          <>
            <dl className="mt-8 grid grid-cols-3 gap-4 border-y border-border py-4">
              <div>
                <dt className="text-[0.8125rem] text-muted-foreground">
                  Due now
                </dt>
                <dd className="mt-1 font-display text-3xl font-bold">
                  {dueCount}{" "}
                  <span className="text-sm font-normal text-muted-foreground">
                    words
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-[0.8125rem] text-muted-foreground">
                  Need more practice
                </dt>
                <dd className="mt-1 font-display text-3xl font-bold">
                  {overview.needsPractice}{" "}
                  <span className="text-sm font-normal text-muted-foreground">
                    words
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-[0.8125rem] text-muted-foreground">
                  Words in review
                </dt>
                <dd className="mt-1 font-display text-3xl font-bold">
                  {overview.total}
                </dd>
              </div>
            </dl>
            <section aria-labelledby="due-now" className="mt-8">
              <div className="flex items-baseline justify-between gap-3">
                <h2 id="due-now" className="font-semibold">
                  Due now
                </h2>
                <p className="text-xs text-muted-foreground">
                  Strength shows how well you knew it last time
                </p>
              </div>
              <ul className="mt-2 border-t border-border">
                {overview.due.map((item) => (
                  <li
                    key={item.itemKey}
                    className="flex items-center gap-4 border-b border-border-subtle py-3"
                  >
                    <Word card={item} className="min-w-0 flex-1 text-xl" />
                    <span className="hidden text-sm text-muted-foreground sm:block">
                      {item.native}
                    </span>
                    <StrengthBars strength={item.strength} />
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}
      </main>
    </AppShell>
  )
}
