"use client"

import { Bookmark, BookmarkCheck, Search, X } from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"

import { EmptyState } from "@/components/feedback/empty-state"
import { ArticleWord } from "@/components/learning/article-word"
import { GermanText } from "@/components/learning/german-text"
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button-variants"
import { cn } from "@/lib/utils"

import { filterPhrases, topicCounts, type Phrase } from "./search"

type PhrasebookListProps = {
  phrases: Phrase[]
  due: number
  /** Saves or removes a phrase; resolves to an error message when it didn't work. */
  onToggleSave: (phrase: Phrase, save: boolean) => Promise<string | null>
}

export function PhrasebookList({
  phrases,
  due,
  onToggleSave,
}: PhrasebookListProps) {
  const [query, setQuery] = useState("")
  const [topic, setTopic] = useState<string | null>(null)
  const [removed, setRemoved] = useState<Set<string>>(new Set())
  const [error, setError] = useState<string | null>(null)

  const topics = useMemo(() => topicCounts(phrases), [phrases])
  const visible = filterPhrases(phrases, topic, query)
  const filtering = query.trim() !== "" || topic !== null

  async function toggle(phrase: Phrase) {
    const save = removed.has(phrase.key)
    setError(null)
    setRemoved((current) => {
      const next = new Set(current)
      if (save) next.delete(phrase.key)
      else next.add(phrase.key)
      return next
    })
    const problem = await onToggleSave(phrase, save)
    if (problem) {
      setRemoved((current) => {
        const next = new Set(current)
        if (save) next.add(phrase.key)
        else next.delete(phrase.key)
        return next
      })
      setError(
        `Couldn’t ${save ? "save" : "remove"} “${phrase.de}”. ${problem}`
      )
    }
  }

  return (
    <>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-h1 font-bold">Phrasebook</h1>
          <p className="mt-2 max-w-[56ch] text-body-lg text-secondary-text">
            Words and sentences you saved. Saved phrases join your vocabulary
            reviews.
          </p>
        </div>
        {due > 0 && (
          <Link href="/review" className={buttonVariants({ size: "lg" })}>
            Review words · {due} due
          </Link>
        )}
      </header>

      {phrases.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="Your phrasebook is empty"
          actions={
            <Link
              href="/home"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Continue your lesson
            </Link>
          }
        >
          Tap “Save” on a word or sentence in any lesson and it appears here,
          ready to review.
        </EmptyState>
      ) : (
        <>
          <div className="relative mt-6 max-w-md">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 size-[18px] -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="search"
              aria-label="Search German or English"
              placeholder="Search German or English"
              autoComplete="off"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-11 w-full rounded-md border-[1.5px] border-input bg-card pr-10 pl-10 text-base placeholder:text-placeholder focus-visible:border-primary focus-visible:shadow-[0_0_0_4px_color-mix(in_srgb,var(--primary)_20%,transparent)] focus-visible:outline-none [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setQuery("")}
                className="absolute top-1/2 right-1.5 grid size-8 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:bg-accent"
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            )}
          </div>

          <div
            role="group"
            aria-label="Topics"
            className="mt-4 flex flex-wrap gap-2"
          >
            {[
              { topic: null, count: phrases.length, label: "All" },
              ...topics.map((entry) => ({ ...entry, label: entry.topic })),
            ].map((entry) => (
              <button
                key={entry.label}
                type="button"
                aria-pressed={topic === entry.topic}
                onClick={() => setTopic(entry.topic)}
                className={cn(
                  "min-h-9 rounded-lg border-[1.5px] border-border bg-card px-3 text-sm font-medium hover:border-input",
                  topic === entry.topic &&
                    "border-foreground font-semibold shadow-[inset_0_0_0_1px_var(--foreground)]"
                )}
              >
                {entry.label}{" "}
                <span className="text-muted-foreground tabular-nums">
                  {entry.count}
                </span>
              </button>
            ))}
          </div>

          <p role="status" aria-live="polite" className="sr-only">
            {visible.length === 1 ? "1 phrase" : `${visible.length} phrases`}
            {filtering ? " match" : " saved"}
          </p>
          <p
            role="status"
            aria-live="polite"
            className="mt-3 min-h-5 text-sm text-danger-text"
          >
            {error}
          </p>

          {visible.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No saved phrases match"
              headingLevel={2}
              actions={
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    setQuery("")
                    setTopic(null)
                  }}
                >
                  Clear search and filters
                </Button>
              }
            >
              {query.trim()
                ? `Nothing for “${query.trim()}” in ${topic ?? "any topic"}.`
                : `Nothing saved under ${topic}.`}{" "}
              Try another word or show all topics.
            </EmptyState>
          ) : (
            <ul className="mt-2 border-t border-border">
              {visible.map((phrase) => {
                const saved = !removed.has(phrase.key)
                return (
                  <li
                    key={phrase.key}
                    className="flex items-start gap-4 border-b border-border-subtle py-4"
                  >
                    <div className="min-w-0 flex-1">
                      {phrase.article ? (
                        <ArticleWord
                          article={phrase.article}
                          word={phrase.de}
                          className="text-2xl"
                        />
                      ) : (
                        <GermanText as="p" className="text-2xl">
                          {phrase.de}
                        </GermanText>
                      )}
                      <p className="text-[0.9375rem] text-secondary-text">
                        {phrase.en}
                      </p>
                      {phrase.example && (
                        <div className="mt-2.5">
                          <GermanText as="p" className="text-[1.0625rem]">
                            {phrase.example.de}
                          </GermanText>
                          <p className="text-sm text-muted-foreground">
                            {phrase.example.en}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <span className="rounded-sm bg-muted px-1.5 py-0.5 text-xs text-secondary-text">
                        {phrase.topic}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        aria-pressed={saved}
                        aria-label={`${saved ? "Saved" : "Save"}: ${phrase.de}`}
                        iconLeft={saved ? <BookmarkCheck /> : <Bookmark />}
                        className={cn(
                          saved &&
                            "border-reward-border bg-reward-subtle text-reward-text shadow-none"
                        )}
                        onClick={() => toggle(phrase)}
                      >
                        {saved ? "Saved" : "Save"}
                      </Button>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </>
      )}
    </>
  )
}
