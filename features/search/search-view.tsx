import { Book, Bookmark, ChevronRight, Route, Search, X } from "lucide-react"
import Link from "next/link"

import { EmptyState } from "@/components/feedback/empty-state"
import { AppShell } from "@/components/layout/app-shell"
import { ArticleWord } from "@/components/learning/article-word"
import { TargetText } from "@/components/learning/target-text"
import { buttonVariants } from "@/components/ui/button-variants"
import type { NotebookCounts } from "@/features/review/data"

import { MAX_QUERY_LENGTH, resultCount, type SearchResults } from "./search"

type SearchViewProps = {
  name: string
  email: string
  counts: NotebookCounts
  query: string
  results: SearchResults
}

function Group({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="mt-8" aria-label={title}>
      <h2 className="text-sm font-semibold text-muted-foreground">{title}</h2>
      <ul className="mt-2 divide-y divide-border-subtle">{children}</ul>
    </section>
  )
}

function Row({
  href,
  icon,
  children,
  detail,
}: {
  href: string
  icon: React.ReactElement
  children: React.ReactNode
  detail: string
}) {
  return (
    <li>
      <Link
        href={href}
        className="flex items-center gap-4 py-3 hover:bg-background-subtle sm:px-2"
      >
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-inset text-secondary-text [&_svg]:size-[18px]">
          {icon}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-xl">{children}</span>
          <span className="block text-sm text-secondary-text">{detail}</span>
        </span>
        <ChevronRight
          aria-hidden="true"
          className="size-4 shrink-0 text-muted-foreground"
        />
      </Link>
    </li>
  )
}

export function SearchView({
  name,
  email,
  counts,
  query,
  results,
}: SearchViewProps) {
  const total = resultCount(results)

  return (
    <AppShell name={name} email={email} counts={counts}>
      <main
        id="main"
        className="mx-auto max-w-(--content-max) px-4 py-8 sm:px-6 lg:px-10"
      >
        <h1 className="font-display text-h1 font-bold">Search</h1>
        <p className="mt-2 text-body-lg text-secondary-text">
          Lessons, words you have met and your saved phrases.
        </p>

        <form role="search" action="/search" className="mt-6 max-w-2xl">
          <label htmlFor="search-q" className="sr-only">
            Search lessons, words and saved phrases
          </label>
          <div className="relative">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2 text-muted-foreground"
            />
            <input
              id="search-q"
              name="q"
              type="search"
              defaultValue={query}
              maxLength={MAX_QUERY_LENGTH}
              placeholder="Try “Besprechung” or “meeting”"
              autoComplete="off"
              className="h-12 w-full rounded-lg border-[1.5px] border-input bg-card pr-12 pl-11 text-base placeholder:text-placeholder hover:border-muted-foreground focus-visible:border-primary focus-visible:shadow-[0_0_0_4px_color-mix(in_srgb,var(--primary)_20%,transparent)] focus-visible:outline-none [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <Link
                href="/search"
                aria-label="Clear the search field"
                className="absolute top-1/2 right-1.5 grid size-10 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <X aria-hidden="true" className="size-[18px]" />
              </Link>
            )}
          </div>
        </form>

        {!query ? (
          <p className="mt-8 max-w-[56ch] text-secondary-text">
            German words work with or without umlauts: “schoen” finds “schön”.
            You can search in German or English.
          </p>
        ) : total === 0 ? (
          <EmptyState
            icon={Search}
            title={`No results for “${query}”`}
            className="mx-0 items-start px-0 text-left"
            actions={
              <>
                <Link
                  href="/search"
                  className={buttonVariants({ variant: "outline", size: "lg" })}
                >
                  Clear search
                </Link>
                <Link
                  href="/path"
                  className={buttonVariants({ variant: "ghost", size: "lg" })}
                >
                  Browse the learning path
                </Link>
              </>
            }
          >
            Check the spelling, or try the English word. Search covers lessons,
            the words taught so far and your saved phrases.
          </EmptyState>
        ) : (
          <>
            <p role="status" className="mt-6 text-sm text-secondary-text">
              {total} {total === 1 ? "result" : "results"} for “{query}”
            </p>
            {results.words.length > 0 && (
              <Group title="Vocabulary">
                {results.words.map((word) => (
                  <Row
                    key={word.key}
                    href={word.href}
                    icon={<Book aria-hidden="true" />}
                    detail={word.detail}
                  >
                    {word.article ? (
                      <ArticleWord article={word.article} word={word.word} />
                    ) : (
                      <TargetText>{word.word}</TargetText>
                    )}
                  </Row>
                ))}
              </Group>
            )}
            {results.lessons.length > 0 && (
              <Group title="Lessons">
                {results.lessons.map((lesson) => (
                  <Row
                    key={lesson.id}
                    href={lesson.href}
                    icon={<Route aria-hidden="true" />}
                    detail={lesson.detail}
                  >
                    {lesson.titleInTarget ? (
                      <TargetText>{lesson.title}</TargetText>
                    ) : (
                      <span className="text-lg font-semibold">
                        {lesson.title}
                      </span>
                    )}
                  </Row>
                ))}
              </Group>
            )}
            {results.phrases.length > 0 && (
              <Group title="Saved phrases">
                {results.phrases.map((phrase) => (
                  <Row
                    key={phrase.key}
                    href="/phrasebook"
                    icon={<Bookmark aria-hidden="true" />}
                    detail={`${phrase.native} · ${phrase.detail}`}
                  >
                    <TargetText>{phrase.target}</TargetText>
                  </Row>
                ))}
              </Group>
            )}
          </>
        )}
      </main>
    </AppShell>
  )
}
