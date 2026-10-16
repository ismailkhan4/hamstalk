import {
  ArrowRight,
  Bookmark,
  Headphones,
  Mic,
  NotebookPen,
  Repeat,
} from "lucide-react"
import Link from "next/link"

import { AppShell } from "@/components/layout/app-shell"
import { ArticleWord } from "@/components/learning/article-word"
import { TargetText } from "@/components/learning/target-text"
import { LocalTime } from "@/components/learning/local-time"
import { buttonVariants } from "@/components/ui/button-variants"
import { findLesson } from "@/content/courses/de/curriculum"
import { getLesson } from "@/content/courses/de/lessons/registry"
import type { NotebookCounts, ReviewOverview } from "@/features/review/data"
import { StrengthBars } from "@/features/review/strength-bars"
import { PracticeModes } from "@/features/session-generator/components/practice-modes"
import type { LessonProgress } from "@/features/path/model"
import { cn } from "@/lib/utils"

type PracticeViewProps = {
  name: string
  email: string
  counts: NotebookCounts
  overview: ReviewOverview
  progress: LessonProgress[]
  /** Units whose Express run is passed. */
  expressPassed?: string[]
}

function finishedLessons(progress: LessonProgress[]) {
  return progress
    .filter((entry) => entry.status === "completed")
    .flatMap((entry) => {
      const found = findLesson(entry.lessonId)
      const content = getLesson(entry.lessonId)
      if (!found || !content) return []
      return [
        {
          id: entry.lessonId,
          title: content.title,
          place: `Unit ${found.unit.number} · ${found.lesson.kind === "review" ? "Unit review" : `Lesson ${found.index + 1}`}`,
        },
      ]
    })
}

function NoteRow({
  href,
  icon,
  title,
  text,
  detail,
}: {
  href: string
  icon: React.ReactElement
  title: string
  text: string
  detail: string
}) {
  return (
    <li>
      <Link
        href={href}
        className="flex items-center gap-4 py-4 hover:bg-background-subtle sm:px-2"
      >
        <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-inset text-secondary-text [&_svg]:size-5">
          {icon}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm text-muted-foreground">
            Your notes
          </span>
          <span className="block font-semibold">{title}</span>
          <span className="block text-sm text-secondary-text">{text}</span>
        </span>
        <span className="shrink-0 text-sm text-muted-foreground">{detail}</span>
        <ArrowRight
          aria-hidden="true"
          className="size-4 shrink-0 text-muted-foreground"
        />
      </Link>
    </li>
  )
}

export function PracticeView({
  name,
  email,
  counts,
  overview,
  progress,
  expressPassed = [],
}: PracticeViewProps) {
  const due = overview.due.length
  const lessons = finishedLessons(progress)

  return (
    <AppShell name={name} email={email} counts={counts}>
      <main
        id="main"
        className="mx-auto max-w-(--content-max) px-4 py-8 sm:px-6 lg:px-10"
      >
        <h1 className="font-display text-h1 font-bold">Practice</h1>
        <p className="mt-2 max-w-[62ch] text-body-lg text-secondary-text">
          Short sessions for what you need today. Everything here uses words you
          have already met.
        </p>

        <PracticeModes
          progress={progress}
          mistakes={counts.mistakes}
          expressPassed={expressPassed}
        />

        <section
          aria-labelledby="review-title"
          className="mt-8 grid gap-6 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6 lg:grid-cols-2"
        >
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-primary-text">
              <Repeat aria-hidden="true" className="size-4" />
              Vocabulary review
            </p>
            {due > 0 ? (
              <>
                <h2
                  id="review-title"
                  className="mt-2 font-display text-h2 font-bold"
                >
                  {due} {due === 1 ? "word" : "words"} due
                </h2>
                <p className="mt-2 text-secondary-text">
                  Words come back just before you would forget them. A session
                  takes a few minutes.
                </p>
                <div className="mt-5">
                  <Link
                    href="/review"
                    className={buttonVariants({ size: "lg" })}
                  >
                    Start review
                  </Link>
                </div>
              </>
            ) : (
              <>
                <h2
                  id="review-title"
                  className="mt-2 font-display text-h2 font-bold"
                >
                  {overview.total === 0
                    ? "No words to review yet"
                    : "Nothing due right now"}
                </h2>
                <p className="mt-2 text-secondary-text">
                  {overview.total === 0 ? (
                    "Finish a lesson and its words arrive here. Phrases you save do too."
                  ) : overview.nextDue ? (
                    <>
                      Your next word comes back{" "}
                      <LocalTime iso={overview.nextDue} />.
                    </>
                  ) : (
                    "Come back after your next lesson."
                  )}
                </p>
                <div className="mt-5">
                  <Link
                    href="/path"
                    className={buttonVariants({
                      variant: "outline",
                      size: "lg",
                    })}
                  >
                    Open the learning path
                  </Link>
                </div>
              </>
            )}
          </div>
          {due > 0 && (
            <ul
              aria-label="Next words"
              className="divide-y divide-border-subtle"
            >
              {overview.due.slice(0, 4).map((card) => (
                <li
                  key={card.itemKey}
                  className="flex items-center gap-3 py-2.5"
                >
                  {card.article ? (
                    <ArticleWord
                      article={card.article}
                      word={card.word}
                      className="min-w-0 flex-1 text-lg"
                    />
                  ) : (
                    <TargetText className="min-w-0 flex-1 text-lg">
                      {card.word}
                    </TargetText>
                  )}
                  <span className="hidden text-sm text-muted-foreground sm:block">
                    {card.native}
                  </span>
                  <StrengthBars strength={card.strength} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <ul className="mt-6 divide-y divide-border-subtle border-y border-border-subtle">
          <NoteRow
            href="/mistakes"
            icon={<NotebookPen aria-hidden="true" />}
            title="Mistakes notebook"
            text="Answers you missed, with the right answer and why."
            detail={`${counts.mistakes} to try again`}
          />
          <NoteRow
            href="/phrasebook"
            icon={<Bookmark aria-hidden="true" />}
            title="Phrasebook"
            text="Words and sentences you saved from lessons."
            detail={`${counts.phrases} saved`}
          />
        </ul>

        <section aria-labelledby="studios" className="mt-10">
          <h2 id="studios" className="sr-only">
            Listening and speaking studios
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                icon: <Headphones aria-hidden="true" />,
                title: "Listening studio",
                text: "Planned. It will use recorded voicemails and clips, which don’t exist yet. Listening exercises inside lessons work today with your browser’s German voice.",
              },
              {
                icon: <Mic aria-hidden="true" />,
                title: "Speaking studio",
                text: "Planned. It needs microphone recording, and Hamstalk doesn’t record or send your voice anywhere today.",
              },
            ].map((studio) => (
              <div
                key={studio.title}
                className="rounded-2xl border border-dashed border-input p-5"
              >
                <p
                  className={cn(
                    "flex items-center gap-2 text-sm font-semibold text-muted-foreground [&_svg]:size-4"
                  )}
                >
                  {studio.icon}
                  {studio.title} · planned
                </p>
                <p className="mt-2 text-sm text-secondary-text">
                  {studio.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {lessons.length > 0 && (
          <section aria-labelledby="replay" className="mt-10">
            <h2 id="replay" className="font-display text-h2 font-bold">
              Practise a finished lesson
            </h2>
            <p className="mt-1 text-secondary-text">
              Replays earn a little practice XP and don’t change your progress.
            </p>
            <ul className="mt-4 divide-y divide-border-subtle border-y border-border-subtle">
              {lessons.map((lesson) => (
                <li key={lesson.id}>
                  <Link
                    href={`/learn/${lesson.id}`}
                    className="flex items-center justify-between gap-4 py-3.5 hover:bg-background-subtle sm:px-2"
                  >
                    <span className="min-w-0">
                      <span className="block text-sm text-muted-foreground">
                        {lesson.place}
                      </span>
                      <span className="block truncate font-semibold">
                        {lesson.title}
                      </span>
                    </span>
                    <span className="shrink-0 text-sm font-semibold text-primary-text">
                      Practise again
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </AppShell>
  )
}
