"use client"

import { exerciseSchema, lessonSchema } from "../schema"
import {
  build,
  conversation,
  discover,
  fill,
  match,
  mc,
} from "../engine/fixtures"
import { getLesson } from "@/content/lessons/registry"

import { LessonRunner, type LessonActions } from "./lesson-runner"

const listening = exerciseSchema.parse({
  type: "choice",
  variant: "listening",
  kind: "Listen",
  prompt: "It’s 6 pm and Jonas is leaving. What does he say to you?",
  optionsLanguage: "en",
  options: ["Bye", "Hello", "Hello, everyone"],
  correct: 0,
  feedback: {
    right:
      "Tschüss means bye. Jonas is a teammate, so he uses the friendly goodbye.",
    wrong: {
      "1": "Hallo is hello. Jonas is leaving, so listen for the goodbye: Tschüss.",
      "2": "Hallo zusammen greets a group as you arrive.",
    },
  },
  listening: {
    clip: "Tschüss, %N!",
    translation: "Bye, %N!",
    meta: "0:02 · Jonas",
  },
})

const tip = exerciseSchema.parse({
  type: "tip",
  kind: "Good to know",
  title: "Friendly or polite?",
  sub: "Hallo fits everyone. For goodbye, choose by who you’re talking to.",
  columns: ["Who you’re with", "Arriving", "Leaving"],
  rows: [
    ["Teammates and friends", "Hallo!", "Tschüss!"],
    ["Shops, reception, people you don’t know", "Hallo!", "Auf Wiedersehen!"],
  ],
  examples: [
    { de: "Hallo, Lena! – Hallo, %N!", en: "Hello, Lena! – Hello, %N!" },
  ],
  note: "Not sure which goodbye to use? Auf Wiedersehen is always polite.",
})

const previewLesson = lessonSchema.parse({
  id: "a1-u1-l1",
  kind: "lesson",
  title: "Hallo!",
  titleIsGerman: true,
  titleEn: "Hello!",
  goal: "Say hello and goodbye: Hallo, Tschüss, Auf Wiedersehen.",
  minutes: 6,
  xp: 30,
  focus: "Hallo · Tschüss · Auf Wiedersehen",
  intro: {
    speaker: { person: "mb", initials: "MB" },
    de: "Hallo!",
    en: "Mia Braun works at reception. She’s the first person you’ll greet on your first morning.",
  },
  phrases: ["Hallo", "Hallo zusammen", "Tschüss", "Auf Wiedersehen"],
  practised: ["Hallo", "Hallo zusammen", "Tschüss", "Auf Wiedersehen"],
  canDo: [
    "Say hello to one person or to a whole group",
    "Say goodbye in a friendly way or a polite way",
  ],
  exercises: [discover, tip, listening, match, mc, fill, build, conversation],
})

type PreviewProps = {
  failSaves?: boolean
  replay?: boolean
  resume?: boolean
  lessonId?: string
}

/** Development only: the real runner with stand-in actions, so every state can be checked without an account. */
export function LessonPreview({
  failSaves = false,
  replay = false,
  resume = false,
  lessonId,
}: PreviewProps) {
  const lesson = (lessonId ? getLesson(lessonId) : null) ?? previewLesson
  const result = failSaves
    ? {
        ok: false as const,
        message:
          "Your progress isn’t saved yet. It’s kept on this device while you’re here; try saving again.",
      }
    : { ok: true as const }
  const actions: LessonActions = {
    saveProgress: async () => result,
    complete: async () => result,
    recordMistake: async () => ({ ok: true }),
    savePhrase: async () => ({ ok: true }),
  }
  return (
    <LessonRunner
      lesson={lesson}
      kicker={
        lesson.kind === "review"
          ? "Unit 1 · Review"
          : `Unit 1 · ${lesson.title}`
      }
      learner={{ firstName: "Sam", initials: "SH" }}
      initial={{
        step: resume ? 4 : 0,
        outcomes: resume
          ? ["first_try", "first_try", "first_try", "second_try"]
          : [],
        savedPhraseKeys: [],
      }}
      replay={replay}
      upNext={{
        href: null,
        kicker: "Up next · Lesson 2",
        title: "Guten Morgen, guten Tag",
        titleIsGerman: true,
        minutes: null,
        ctaLabel: "Continue to Lesson 2",
      }}
      unitProgress={{
        number: 1,
        done: 1,
        total: 5,
        title: "First day at work",
      }}
      exitHref="/styleguide"
      pathHref="/styleguide/path"
      actions={actions}
    />
  )
}
