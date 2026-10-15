import {
  lessonSchema,
  type ChoiceExercise,
  type Lesson,
  type MatchExercise,
  type BuildExercise,
  type TranslateExercise,
  type ConversationExercise,
} from "../schema"

export const mc: ChoiceExercise = {
  type: "choice",
  variant: "multiple-choice",
  kind: "Choose the answer",
  prompt:
    "You’re leaving the bakery. Frau Krüger says „Auf Wiedersehen!“ What can you say?",
  optionsLanguage: "target",
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

export const translate: TranslateExercise = {
  type: "translate",
  kind: "Translate",
  prompt: "What does this sentence mean?",
  source: "Ich bin neu im Team.",
  accept: [
    "I am new on the team",
    "I am new to the team",
    "I am new in the team",
  ],
  feedback: {
    right: "neu means new and im Team means on the team.",
    wrong:
      "neu means new and im Team means on the team. Try: I’m new on the team.",
  },
  topic: "Team",
}

export const fill: ChoiceExercise = {
  type: "choice",
  variant: "fill",
  kind: "Fill in the blank",
  prompt: "Lena arrives and greets everyone at once",
  optionsLanguage: "target",
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
  meaningsLanguage: "native",
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
        { target: "Hallo!", native: "Hello!" },
        { target: "Tschüss!", native: "Bye!" },
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
        { target: "Tschüss, Lena!", native: "Bye, Lena!" },
        { target: "Hallo, Lena!", native: "Hello, Lena!" },
        { target: "Auf Wiedersehen, Lena!", native: "Goodbye, Lena!" },
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
    target: "Tschüss zusammen!",
    native: "Bye, everyone!",
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
      target: "Hallo!",
      native: "Hello!",
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
    titleInTarget: true,
    titleEn: "Hello!",
    goal: "Say hello and goodbye: Hallo, Tschüss, Auf Wiedersehen.",
    minutes: 6,
    xp: 30,
    focus: "Hallo · Tschüss · Auf Wiedersehen",
    intro: {
      speaker: { person: "mb", initials: "MB" },
      target: "Hallo!",
      native: "Mia works at reception.",
    },
    phrases: ["Hallo", "Tschüss"],
    practised: ["Hallo", "Tschüss"],
    vocabulary: [
      {
        word: "Hallo",
        native: "hello",
        example: { target: "Hallo, Lena!", native: "Hello, Lena!" },
      },
      {
        word: "Tschüss",
        native: "bye (friendly)",
        example: { target: "Tschüss, Jonas!", native: "Bye, Jonas!" },
      },
    ],
    canDo: ["Say hello to one person or a whole group"],
    exercises: [discover, mc, match, fill, build, conversation],
    ...overrides,
  })
}
