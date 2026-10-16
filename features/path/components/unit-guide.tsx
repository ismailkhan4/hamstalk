import { ArrowLeft, Lightbulb, MessageSquareQuote } from "lucide-react"
import Link from "next/link"

import { AppShell } from "@/components/layout/app-shell"
import { ArticleWord } from "@/components/learning/article-word"
import { TargetText } from "@/components/learning/target-text"
import { TARGET_LANG } from "@/content/courses"
import type { Unit } from "@/content/courses/de/curriculum"
import { getLesson } from "@/content/courses/de/lessons/registry"
import type { Learner } from "@/features/learner/load-learner"
import { personalise, type TipExercise } from "@/features/lessons/schema"

import { LINE_NUMBER } from "../transit"
import { LINE_COLOR } from "./transit-line"

type UnitGuideProps = Pick<Learner, "name"> & {
  counts?: Learner["counts"]
  email: string
  unit: Unit
  learner: { firstName: string; initials: string }
}

/**
 * A unit's guide: everything it teaches on one page, to read before a lesson or come back to later.
 * The goals, the words, the grammar in a sentence, and every lesson's rule table with examples.
 */
export function UnitGuide({
  name,
  email,
  counts,
  unit,
  learner,
}: UnitGuideProps) {
  const lineHref = `/path?level=${unit.level.toLowerCase()}#${unit.id}`
  const tips = unit.lessons.flatMap((lesson) => {
    const content = getLesson(lesson.id)
    return (content?.exercises ?? [])
      .filter((exercise): exercise is TipExercise => exercise.type === "tip")
      .map((tip) => ({ lesson, tip }))
  })

  return (
    <AppShell name={name} email={email} counts={counts}>
      <main
        id="main"
        className="mx-auto max-w-(--reading-max) px-4 py-8 sm:px-6"
      >
        <Link
          href={lineHref}
          className="inline-flex min-h-11 items-center gap-2 font-bold text-secondary-text hover:text-foreground"
        >
          <ArrowLeft aria-hidden="true" className="size-[18px]" />
          Back to the line
        </Link>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span
            aria-hidden="true"
            className="grid h-8 min-w-11 place-items-center rounded-md px-1.5 font-display text-sm font-semibold text-[#1d2b33]"
            style={{ background: LINE_COLOR[unit.level] }}
          >
            U{LINE_NUMBER[unit.level]}
          </span>
          <p className="text-sm font-extrabold tracking-wider text-muted-foreground uppercase">
            Unit {unit.number} guide
          </p>
        </div>
        <h1 className="mt-2 font-display text-h1 leading-tight font-semibold">
          {unit.title}
        </h1>
        <p className="mt-2 text-body-lg font-semibold text-secondary-text">
          {unit.description ?? unit.summary}
        </p>

        {unit.canDo && (
          <section aria-labelledby="can-do" className="mt-8">
            <h2 id="can-do" className="font-display text-xl font-semibold">
              By the end of this unit you can
            </h2>
            <ul className="mt-3 flex flex-col gap-2 font-semibold">
              {unit.canDo.map((item) => (
                <li key={item} className="flex gap-2.5">
                  <span aria-hidden="true" className="text-primary-text">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        )}

        {unit.grammar && (
          <section aria-labelledby="grammar" className="mt-8">
            <h2 id="grammar" className="font-display text-xl font-semibold">
              The grammar in one line
            </h2>
            <p className="mt-2 rounded-2xl bg-reward-subtle p-4 font-semibold text-reward-text">
              {unit.grammar.replaceAll("%N", learner.firstName)}
            </p>
          </section>
        )}

        {unit.words && unit.words.length > 0 && (
          <section aria-labelledby="words" className="mt-8">
            <h2 id="words" className="font-display text-xl font-semibold">
              Words you’ll meet
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {unit.words.map((word) => (
                <li
                  key={word.word}
                  className="rounded-xl border-2 border-border bg-card px-3 py-1.5 text-lg"
                >
                  {word.article ? (
                    <ArticleWord article={word.article} word={word.word} />
                  ) : (
                    <TargetText>{word.word}</TargetText>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {tips.length > 0 && (
          <section aria-labelledby="rules" className="mt-10">
            <h2 id="rules" className="font-display text-xl font-semibold">
              Rules, station by station
            </h2>
            <div className="mt-4 flex flex-col gap-6">
              {tips.map(({ lesson, tip }) => (
                <article
                  key={`${lesson.id}-${tip.title}`}
                  className="rounded-2xl border-2 border-border bg-card p-4 sm:p-5"
                >
                  <p className="text-xs font-extrabold tracking-wider text-muted-foreground uppercase">
                    <span lang={lesson.titleInTarget ? TARGET_LANG : undefined}>
                      {lesson.title}
                    </span>
                  </p>
                  <h3 className="mt-1 font-display text-lg font-semibold">
                    {tip.title}
                  </h3>
                  <p className="text-sm font-semibold text-secondary-text">
                    {tip.sub}
                  </p>
                  <div
                    tabIndex={0}
                    role="region"
                    aria-label={tip.title}
                    className="mt-3 overflow-x-auto rounded-xl border-2 border-border-subtle"
                  >
                    <table className="w-full border-collapse text-left">
                      <thead>
                        <tr className="bg-background-subtle text-sm">
                          {tip.columns.map((column, i) => (
                            <th
                              key={i}
                              scope="col"
                              className="px-3 py-2 font-bold"
                            >
                              {column}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {tip.rows.map((row, r) => (
                          <tr
                            key={r}
                            className="border-t-2 border-border-subtle"
                          >
                            {row.map((cell, c) => (
                              <td key={c} className="px-3 py-2.5 align-top">
                                {c === 0 ? (
                                  <span className="text-sm font-semibold text-secondary-text">
                                    {cell}
                                  </span>
                                ) : (
                                  <TargetText className="text-lg">
                                    {personalise(cell, learner)}
                                  </TargetText>
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {tip.examples.length > 0 && (
                    <ul className="mt-3 flex flex-col gap-2">
                      {tip.examples.map((example) => (
                        <li key={example.target}>
                          <TargetText as="p" className="text-lg font-semibold">
                            {personalise(example.target, learner)}
                          </TargetText>
                          <p className="text-sm font-semibold text-muted-foreground">
                            {personalise(example.native, learner)}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="mt-3 flex gap-2.5 rounded-xl bg-reward-subtle p-3 text-sm font-semibold text-reward-text">
                    <Lightbulb
                      aria-hidden="true"
                      className="mt-0.5 size-4 shrink-0"
                    />
                    {personalise(tip.note, learner)}
                  </p>
                </article>
              ))}
            </div>
          </section>
        )}

        {unit.milestone && (
          <section aria-labelledby="standup-line" className="mt-10">
            <h2
              id="standup-line"
              className="font-display text-xl font-semibold"
            >
              Your line at the standup
            </h2>
            <div className="mt-3 flex gap-3 rounded-2xl border-2 border-border bg-card p-4">
              <MessageSquareQuote
                aria-hidden="true"
                className="mt-1 size-5 shrink-0 text-primary-text"
              />
              <div>
                <TargetText as="p" className="text-xl font-semibold">
                  {personalise(unit.milestone.standup.target, learner)}
                </TargetText>
                <p className="font-semibold text-muted-foreground">
                  {personalise(unit.milestone.standup.native, learner)}
                </p>
              </div>
            </div>
          </section>
        )}
      </main>
    </AppShell>
  )
}
