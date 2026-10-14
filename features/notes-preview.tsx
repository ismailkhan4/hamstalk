"use client"

import { AppShell } from "@/components/layout/app-shell"

import { ActivityList, type ActivityEntry } from "./activity/activity-list"
import type { Mistake } from "./mistakes/data"
import { MistakesList } from "./mistakes/mistakes-list"
import { PhrasebookList } from "./phrasebook/phrasebook-list"
import type { Phrase } from "./phrasebook/search"
import type { ReviewCard, ReviewOverview } from "./review/data"
import { ReviewScreen } from "./review/review-screen"

const counts = { phrases: 6, mistakes: 3, due: 6 }
export const sampleShell = {
  name: "Sam Haddad",
  email: "sam@example.com",
  counts,
}

export const samplePhrases: Phrase[] = [
  {
    key: "a1-u1-l1:U1a",
    lessonId: "a1-u1-l1",
    de: "Hallo!",
    en: "Hello!",
    article: null,
    example: { de: "Hallo, Lena!", en: "Hello, Lena!" },
    topic: "Greetings",
    savedAt: "2026-10-13T09:00:00Z",
  },
  {
    key: "a1-u1-l4:U4e",
    lessonId: "a1-u1-l4",
    de: "Entschuldigung!",
    en: "Sorry! / Excuse me!",
    article: null,
    example: {
      de: "Entschuldigung! – Kein Problem!",
      en: "Sorry! – No problem!",
    },
    topic: "Everyday",
    savedAt: "2026-10-13T08:00:00Z",
  },
  {
    key: "a1-u1-l4:U4d",
    lessonId: "a1-u1-l4",
    de: "Gern!",
    en: "You’re welcome! (happy to)",
    article: null,
    example: null,
    topic: "Team",
    savedAt: "2026-10-13T07:00:00Z",
  },
  {
    key: "a1-u1-l2:U2a",
    lessonId: "a1-u1-l2",
    de: "Guten Morgen!",
    en: "Good morning!",
    article: null,
    example: { de: "Guten Morgen, zusammen!", en: "Good morning, everyone!" },
    topic: "Greetings",
    savedAt: "2026-10-12T07:00:00Z",
  },
  {
    key: "p2",
    lessonId: "a1-u1-l2",
    de: "Besprechung",
    en: "meeting",
    article: "die",
    example: {
      de: "Die Besprechung beginnt um zehn.",
      en: "The meeting starts at ten.",
    },
    topic: "Work",
    savedAt: "2026-10-12T06:00:00Z",
  },
  {
    key: "p5",
    lessonId: "a1-u1-l2",
    de: "Feierabend",
    en: "the end of the working day",
    article: "der",
    example: { de: "Schönen Feierabend!", en: "Have a nice evening!" },
    topic: "Everyday",
    savedAt: "2026-10-12T05:00:00Z",
  },
]

export const sampleMistakes: Mistake[] = [
  {
    itemKey: "a1-u1-l1:4",
    lessonId: "a1-u1-l1",
    lessonLabel: "Unit 1 · Lesson 1",
    topic: "Greetings",
    prompt:
      "You’re leaving the bakery. Frau Krüger says „Auf Wiedersehen!“ What can you say?",
    learnerAnswer: "Hallo!",
    correctAnswer: "Auf Wiedersehen!",
    reason: "Hallo is for when you arrive. You’re leaving, so say goodbye.",
    missCount: 3,
    learned: false,
    retry: {
      options: [
        { de: "Auf Wiedersehen!" },
        { de: "Tschüss!" },
        { de: "Hallo zusammen!" },
        { de: "Hallo!" },
      ],
      optionsLanguage: "de",
    },
  },
  {
    itemKey: "a1-u1-l2:6",
    lessonId: "a1-u1-l2",
    lessonLabel: "Unit 1 · Lesson 2",
    topic: "Greetings",
    prompt: "It’s 19:00. Your neighbour comes home as you do.",
    learnerAnswer: "Guten Morgen",
    correctAnswer: "Guten Abend",
    reason: "Guten Morgen is for the morning. At 19:00 it’s evening.",
    missCount: 2,
    learned: false,
    retry: {
      options: [{ de: "Abend!" }, { de: "Morgen!" }, { de: "Nacht!" }],
      optionsLanguage: "de",
      fill: { before: "Guten", after: "" },
    },
  },
  {
    itemKey: "a1-u1-l1:2",
    lessonId: "a1-u1-l1",
    lessonLabel: "Unit 1 · Lesson 1",
    topic: "Greetings",
    prompt: "Match each phrase with its meaning",
    learnerAnswer: "Tschüss! → Hello",
    correctAnswer: "Tschüss! → Bye (friendly)",
    reason:
      "Hallo and Hallo zusammen say hello. Tschüss and Auf Wiedersehen say goodbye.",
    missCount: 1,
    learned: false,
    retry: null,
  },
]

export const sampleCards: ReviewCard[] = [
  {
    itemKey: "a",
    article: "die",
    word: "Besprechung",
    en: "meeting",
    exampleDe: "Die Besprechung beginnt um zehn.",
    exampleEn: "The meeting starts at ten.",
    strength: 2,
    lessonId: "a1-u1-l2",
  },
  {
    itemKey: "b",
    article: "der",
    word: "Fehler",
    en: "bug, mistake",
    exampleDe: "Da ist ein Fehler im Code.",
    exampleEn: "There’s a bug in the code.",
    strength: 1,
    lessonId: "a1-u1-l2",
  },
  {
    itemKey: "c",
    article: null,
    word: "arbeiten",
    en: "to work",
    exampleDe: "Ich arbeite im Frontend.",
    exampleEn: "I work in the frontend.",
    strength: 3,
    lessonId: "a1-u1-l2",
  },
]

export const sampleActivity: ActivityEntry[] = [
  {
    id: "a1-u1-l3",
    at: "2026-10-13T10:00:00Z",
    title: "Lesson 3 · Ich bin …",
    titleIsGerman: true,
    detail: "Unit 1 · stopped at exercise 4 of 7",
    status: "in_progress",
    href: "/learn/a1-u1-l3",
  },
  {
    id: "a1-u1-l2",
    at: "2026-10-13T09:00:00Z",
    title: "Lesson 2 · Guten Morgen, guten Tag",
    titleIsGerman: true,
    detail: "Unit 1 · completed · +30 XP",
    status: "completed",
    href: "/learn/a1-u1-l2",
  },
  {
    id: "a1-u1-l1",
    at: "2026-10-12T09:00:00Z",
    title: "Lesson 1 · Hallo!",
    titleIsGerman: true,
    detail: "Unit 1 · completed · +30 XP",
    status: "completed",
    href: "/learn/a1-u1-l1",
  },
]

export type NotesView =
  | "phrasebook"
  | "phrasebook-empty"
  | "mistakes"
  | "mistakes-empty"
  | "review"
  | "review-empty"
  | "review-none"
  | "review-session"
  | "activity"
  | "activity-empty"

const overview = (over: Partial<ReviewOverview>): ReviewOverview => ({
  due: sampleCards,
  needsPractice: 1,
  total: 9,
  nextDue: null,
  ...over,
})

export function NotesPreview({ view }: { view: NotesView }) {
  const wrap = (children: React.ReactNode) => (
    <AppShell {...sampleShell}>
      <main
        id="main"
        className="mx-auto max-w-(--content-max) px-4 py-8 sm:px-6 lg:px-10"
      >
        <div className="max-w-3xl">{children}</div>
      </main>
    </AppShell>
  )
  switch (view) {
    case "phrasebook":
      return wrap(
        <PhrasebookList
          phrases={samplePhrases}
          due={6}
          onToggleSave={async () => null}
        />
      )
    case "phrasebook-empty":
      return wrap(
        <PhrasebookList phrases={[]} due={0} onToggleSave={async () => null} />
      )
    case "mistakes":
      return wrap(
        <MistakesList
          mistakes={sampleMistakes}
          onRetry={async (_, selection) =>
            selection === 0
              ? {
                  ok: true,
                  correct: true,
                  note: "Auf Wiedersehen: polite, and the same goodbye she used.",
                }
              : {
                  ok: true,
                  correct: false,
                  note: "Hallo is for when you arrive. You’re leaving, so say goodbye.",
                }
          }
        />
      )
    case "mistakes-empty":
      return wrap(
        <MistakesList
          mistakes={[]}
          onRetry={async () => ({ ok: false, message: "" })}
        />
      )
    case "activity":
      return wrap(
        <>
          <h1 className="font-display text-h1 font-bold">Activity</h1>
          <ActivityList entries={sampleActivity} />
        </>
      )
    case "activity-empty":
      return wrap(
        <>
          <h1 className="font-display text-h1 font-bold">Activity</h1>
          <ActivityList entries={[]} />
        </>
      )
    case "review":
    case "review-session":
      return (
        <ReviewScreen
          shell={sampleShell}
          overview={overview({})}
          sessionSize={12}
          onRate={async () => ({ ok: true, label: "" })}
        />
      )
    case "review-empty":
      return (
        <ReviewScreen
          shell={sampleShell}
          overview={overview({ due: [], nextDue: "2026-10-14T07:00:00Z" })}
          sessionSize={12}
          onRate={async () => ({ ok: true, label: "" })}
        />
      )
    case "review-none":
      return (
        <ReviewScreen
          shell={sampleShell}
          overview={overview({ due: [], total: 0 })}
          sessionSize={12}
          onRate={async () => ({ ok: true, label: "" })}
        />
      )
  }
}
