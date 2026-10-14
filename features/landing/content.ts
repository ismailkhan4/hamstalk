import type { Person } from "@/components/learning/avatar"
import type { Cefr } from "@/components/learning/level-badge"

type Turn = { person: Person; initials: string; de: string; en: string }

export type Scene = {
  id: string
  dayShort: string
  dayLabel: string
  topic: string
  title: string
  time: string
  level: Cefr
  turns: [Turn, Turn]
  tip: string
}

const lena = { person: "lf", initials: "LF" } as const
const jonas = { person: "jk", initials: "JK" } as const
const aylin = { person: "ao", initials: "AÖ" } as const
const you = { person: "me", initials: "Du" } as const

export const scenes: Scene[] = [
  {
    id: "monday",
    dayShort: "Mo",
    dayLabel: "Monday",
    topic: "Daily standup",
    title: "Montagmorgen, Daily Standup",
    time: "Monday, 09:30",
    level: "A1",
    turns: [
      { ...lena, de: "Was machst du heute?", en: "What are you doing today?" },
      {
        ...you,
        de: "Heute arbeite ich an der Anmeldung.",
        en: "Today I’m working on the sign-in.",
      },
    ],
    tip: "Start with “heute” and the verb still comes second.",
  },
  {
    id: "tuesday",
    dayShort: "Di",
    dayLabel: "Tuesday",
    topic: "Asking for help",
    title: "Ich brauche Hilfe",
    time: "Tuesday, 11:15",
    level: "A2",
    turns: [
      {
        ...you,
        de: "Jonas, kannst du mir kurz helfen? Ich brauche Hilfe bei diesem Problem.",
        en: "Jonas, can you help me for a moment? I need help with this problem.",
      },
      { ...jonas, de: "Klar! Was ist los?", en: "Sure! What’s up?" },
    ],
    tip: "“Kurz” makes a request smaller and friendlier.",
  },
  {
    id: "wednesday",
    dayShort: "Mi",
    dayLabel: "Wednesday",
    topic: "Discussing a bug",
    title: "Der Fehler im Formular",
    time: "Wednesday, 14:00",
    level: "B1",
    turns: [
      {
        ...you,
        de: "Wenn ich auf „Speichern“ klicke, erscheint eine Fehlermeldung.",
        en: "When I click “Save”, an error message appears.",
      },
      {
        ...jonas,
        de: "Okay, ich schaue mir die Logs an.",
        en: "OK, I’ll take a look at the logs.",
      },
    ],
    tip: "“Wenn” sends the verb to the end of its clause: wenn ich klicke.",
  },
  {
    id: "thursday",
    dayShort: "Do",
    dayLabel: "Thursday",
    topic: "A short message",
    title: "Nachricht an das Team",
    time: "Thursday, 08:50",
    level: "A2",
    turns: [
      {
        ...you,
        de: "Hallo zusammen, ich bin heute etwas später da. Bis gleich!",
        en: "Hi all, I’ll be in a bit later today. See you soon!",
      },
      {
        ...aylin,
        de: "Kein Problem, danke für die Info!",
        en: "No problem, thanks for letting us know!",
      },
    ],
    tip: "Written messages follow the same word order as speech.",
  },
  {
    id: "friday",
    dayShort: "Fr",
    dayLabel: "Friday",
    topic: "Reviewing a solution",
    title: "Pull Request #87",
    time: "Friday, 10:30",
    level: "B1",
    turns: [
      {
        ...lena,
        de: "Sieht gut aus. Kannst du noch einen Test hinzufügen?",
        en: "Looks good. Could you add one more test?",
      },
      {
        ...you,
        de: "Guter Punkt, mache ich.",
        en: "Good point, I’ll do that.",
      },
    ],
    tip: "“Kannst du noch …” is a polite way to ask for one more thing.",
  },
]

export const cast = [
  {
    ...lena,
    name: "Lena Fischer",
    bio: "Team lead. Speaks clearly and explains twice if you ask.",
  },
  {
    ...jonas,
    name: "Jonas Krüger",
    bio: "Backend. Talks fast and loves a good bug hunt.",
  },
  {
    ...aylin,
    name: "Aylin Öztürk",
    bio: "Design. Asks “why?” and helps with polite phrasing.",
  },
] as const

export const levels: {
  code: Cefr
  title: string
  role: string
  topics: [string, string, string]
  de: string
  en: string
}[] = [
  {
    code: "A1",
    title: "Get started",
    role: "Beginner, new on the team",
    topics: [
      "Greetings and introductions",
      "Simple questions and answers",
      "Times, numbers, daily routines",
    ],
    de: "Ich heiße Sam.",
    en: "My name is Sam.",
  },
  {
    code: "A2",
    title: "Communicate",
    role: "Elementary, team member",
    topics: [
      "Everyday conversations",
      "Scheduling and short messages",
      "Talking about the past",
    ],
    de: "Gestern habe ich die Tests geschrieben.",
    en: "Yesterday I wrote the tests.",
  },
  {
    code: "B1",
    title: "Work independently",
    role: "Intermediate, contributor",
    topics: [
      "Explaining problems",
      "Asking for clarification",
      "Giving opinions and reasons",
    ],
    de: "Ich glaube, das Problem liegt im Cache.",
    en: "I think the problem is in the cache.",
  },
  {
    code: "B2",
    title: "Communicate professionally",
    role: "Upper-intermediate, core team",
    topics: [
      "Following complex discussions",
      "Presenting technical decisions",
      "Explaining trade-offs",
    ],
    de: "Ich schlage vor, dass wir zuerst die API stabilisieren.",
    en: "I suggest we stabilise the API first.",
  },
]

type Phrase = { situation: string; de: string; en: string; level: Cefr }

export const phrasebookPages: {
  title: string
  page: string
  phrases: Phrase[]
}[] = [
  {
    title: "Everyday work",
    page: "Seite 1",
    phrases: [
      {
        situation: "Introducing yourself",
        de: "Hallo, ich heiße Sam. Ich arbeite im Frontend-Team.",
        en: "Hi, I’m Sam. I work in the frontend team.",
        level: "A1",
      },
      {
        situation: "Saying what you did yesterday",
        de: "Gestern habe ich an der Login-Seite gearbeitet.",
        en: "Yesterday I worked on the login page.",
        level: "A2",
      },
      {
        situation: "Asking for clarification",
        de: "Kannst du das bitte noch einmal erklären?",
        en: "Could you explain that again, please?",
        level: "A2",
      },
      {
        situation: "Joining a planning meeting",
        de: "Ich schätze, dafür brauche ich etwa zwei Tage.",
        en: "I estimate I’ll need about two days for that.",
        level: "B1",
      },
    ],
  },
  {
    title: "When things get technical",
    page: "Seite 2",
    phrases: [
      {
        situation: "Reporting a blocker",
        de: "Ich komme gerade nicht weiter, weil der Server nicht antwortet.",
        en: "I’m stuck right now because the server isn’t responding.",
        level: "A2",
      },
      {
        situation: "Describing a bug",
        de: "Wenn ich auf „Speichern“ klicke, erscheint eine Fehlermeldung.",
        en: "When I click “Save”, an error message appears.",
        level: "B1",
      },
      {
        situation: "Reviewing a pull request",
        de: "Sieht gut aus. Kannst du noch einen Test hinzufügen?",
        en: "Looks good. Could you add one more test?",
        level: "B1",
      },
      {
        situation: "Explaining a decision",
        de: "Wir sollten zuerst die API stabilisieren, weil das Frontend sonst blockiert ist.",
        en: "We should stabilise the API first, because otherwise the frontend is blocked.",
        level: "B2",
      },
    ],
  },
]

export const principles = [
  ["Open development", "Code, content and decisions made in public."],
  ["Transparent content", "See exactly what is taught, and why."],
  [
    "Light and mobile-first",
    "An installable web app, designed to work offline.",
  ],
  ["Reusable materials", "Learning content shared where licensing allows."],
  ["Community contributions", "Lessons, corrections and translations welcome."],
  [
    "Accessible by design",
    "Built to WCAG 2.2 AA, for keyboards and screen readers.",
  ],
] as const

export const faqs = [
  {
    q: "Is Klarlingo for complete beginners?",
    a: "Yes. The path starts at A1 with greetings, introductions and basic sentence structure, and assumes no German at all.",
  },
  {
    q: "Does it teach everyday German, or only workplace German?",
    a: "Both. Grammar, pronunciation, listening and everyday topics like appointments, shopping and housing are the foundation. The workplace gives that language a context; it doesn’t replace it.",
  },
  {
    q: "Do I need to be a software engineer?",
    a: "No. The story is set in a tech team, so engineers will feel at home, but the German is useful for anyone, especially people in design, product, QA or support.",
  },
  {
    q: "Can I use it on my phone?",
    a: "That’s the plan. Klarlingo is designed mobile-first, as a web app you can install on your home screen and use offline for downloaded lessons.",
  },
  {
    q: "Is it free and open source?",
    a: "Open source is a core commitment: the code is released under the MIT License, and the project follows a free-first approach on free or free-tier services. The repository will be linked here once it is public; we won’t promise more than we know today.",
  },
  {
    q: "Will I reach B2?",
    a: "Klarlingo can support your learning, but progress depends on time, practice and real conversations. It can’t guarantee a CEFR level, an exam result or a job. Official certificates come from recognised exams.",
  },
] as const

export const navLinks = [
  { href: "#how", label: "How it works" },
  { href: "#team", label: "The team" },
  { href: "#journey", label: "Journey" },
  { href: "#open-source", label: "Open source" },
] as const
