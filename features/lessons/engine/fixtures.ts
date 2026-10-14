import {
  lessonSchema,
  type ChoiceExercise,
  type Lesson,
  type MatchExercise,
  type BuildExercise,
  type ConversationExercise,
} from "../schema"

export const mc: ChoiceExercise = {
  type: "choice",
  variant: "multiple-choice",
  kind: "Choose the answer",
  prompt:
    "You’re leaving the bakery. Frau Krüger says „Auf Wiedersehen!“ What can you say?",
  optionsLanguage: "de",
  options: ["Auf Wiedersehen!", "Tschüss!", "Hallo zusammen!", "Hallo!"],
  correct: 0,
  alternatives: [1],
  feedback: {
    right: "Auf Wiedersehen: polite, and the same goodbye she used.",
    alternative: { "1": "Tschüss works too. It’s friendly." },
    wrong: {
      "2": "Hallo zusammen says hello to a group.",
      "3": "Hallo is for when you arrive.",
    },
  },
  topic: "Greetings",
}

export const fill: ChoiceExercise = {
  type: "choice",
  variant: "fill",
  kind: "Fill in the blank",
  prompt: "Lena arrives and greets everyone at once",
  optionsLanguage: "de",
  options: ["zusammen!", "Tschüss!", "Wiedersehen!"],
  correct: 0,
  alternatives: [],
  feedback: {
    right: "Hallo zusammen! means hello, everyone.",
    alternative: {},
    wrong: {
      "1": "Tschüss is goodbye.",
      "2": "Wiedersehen only comes in Auf Wiedersehen.",
    },
  },
  fill: { before: "Hallo", after: "" },
}

export const match: MatchExercise = {
  type: "match",
  kind: "Match the meaning",
  prompt: "Match each phrase with its meaning",
  sub: "Choose a phrase, then what it means.",
  pairs: [
    { phrase: "Hallo!", meaning: "Hello" },
    { phrase: "Tschüss!", meaning: "Bye (friendly)" },
    { phrase: "Auf Wiedersehen!", meaning: "Goodbye (polite)" },
    { phrase: "Hallo zusammen!", meaning: "Hello, everyone" },
  ],
  meaningOrder: [
    "Goodbye (polite)",
    "Hello, everyone",
    "Hello",
    "Bye (friendly)",
  ],
  labels: {
    phrases: "Phrases",
    meanings: "Meanings",
    empty: "Choose a meaning",
    joiner: " means ",
  },
  meaningsLanguage: "en",
  explanation:
    "Hallo and Hallo zusammen say hello. Tschüss and Auf Wiedersehen say goodbye.",
  topic: "Greetings",
}

export const build: BuildExercise = {
  type: "build",
  kind: "Build the sentence",
  prompt: "Lena brings you a coffee. Thank her warmly",
  sub: "Thank you, Lena!",
  tiles: ["schön,", "Danke", "Lena!", "Bitte"],
  answer: [1, 0, 2],
  feedback: {
    right: "Danke schön, Lena!",
    wrong: "Danke comes first, then schön, then her name.",
  },
  topic: "Thanks and sorry",
}

const voice = (person: "mb" | "lf", initials: string, label: string) => ({
  person,
  initials,
  label,
})

export const conversation: ConversationExercise = {
  type: "conversation",
  kind: "Your first day",
  prompt: "From reception to the end of the day",
  sub: "Choose what you’d say.",
  turns: [
    {
      speaker: voice("mb", "MB", "Mia · reception"),
      line: "Hallo!",
      translation: "Hello!",
      task: "Say hello back",
      options: [
        { de: "Hallo!", en: "Hello!" },
        { de: "Tschüss!", en: "Bye!" },
      ],
      correct: 0,
      alternatives: [],
      feedback: {
        right: "You’re arriving, so Hallo! is right.",
        alternative: {},
        wrong: { "1": "Tschüss is for leaving." },
      },
      revisits: 0,
    },
    {
      speaker: voice("lf", "LF", "Lena · 18:00"),
      line: "Tschüss, %N!",
      translation: "Bye, %N!",
      task: "Say bye to Lena",
      options: [
        { de: "Tschüss, Lena!", en: "Bye, Lena!" },
        { de: "Hallo, Lena!", en: "Hello, Lena!" },
        { de: "Auf Wiedersehen, Lena!", en: "Goodbye, Lena!" },
      ],
      correct: 0,
      alternatives: [2],
      feedback: {
        right: "Friendly, just like hers.",
        alternative: { "2": "That works, if a bit formal." },
        wrong: { "1": "Hallo is for arriving." },
      },
      revisits: 1,
    },
  ],
  closing: {
    speaker: voice("lf", "LF", "Lena"),
    de: "Tschüss zusammen!",
    en: "Bye, everyone!",
  },
  topic: "Greetings",
}

export const discover = {
  type: "discover" as const,
  kind: "New phrases",
  title: "Your first morning",
  sub: "Play each line as often as you like.",
  lines: [
    {
      speaker: voice("mb", "MB", "Mia · reception"),
      de: "Hallo!",
      en: "Hello!",
      saveKey: "U1a",
      note: "Works any time of day.",
    },
  ],
}

export function makeLesson(overrides: Partial<Lesson> = {}): Lesson {
  return lessonSchema.parse({
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
      en: "Mia works at reception.",
    },
    phrases: ["Hallo", "Tschüss"],
    practised: ["Hallo", "Tschüss"],
    canDo: ["Say hello to one person or a whole group"],
    exercises: [discover, mc, match, fill, build, conversation],
    ...overrides,
  })
}
