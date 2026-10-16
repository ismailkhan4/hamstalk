import type { Person } from "@/components/learning/avatar"
import type { Cefr } from "@/components/learning/level-badge"
import type { MascotMood } from "@/features/celebrations/mascot"

/**
 * Every word on the landing page. The page tells one story: your first week on a German-speaking
 * team, Monday to Friday. Voice: short, warm, a little cheeky. Nothing here promises a level, an
 * exam result or a job, and nobody learns German in a week: the week is the shape of every unit.
 */

export const cta = { start: "Start Monday", signIn: "Sign in" }

export const hero = {
  kicker: "Monday, 09:00 · Kaffeesatz GmbH, Berlin",
  title: "Your new team speaks German.",
  lede: "Hamstalk teaches you German one workday at a time: the standup, the bug, the coffee break. Five minutes a lesson, with a hamster cheering you on.",
  signInPrompt: "Already on the team?",
}

type Speaker = { person: Person; initials: string; name: string }

const lena: Speaker = { person: "lf", initials: "LF", name: "Lena" }
const jonas: Speaker = { person: "jk", initials: "JK", name: "Jonas" }
const aylin: Speaker = { person: "ao", initials: "AÖ", name: "Aylin" }
const you: Speaker = { person: "me", initials: "Du", name: "You" }

export type Line = { from: Speaker; de: string; en: string }

export type Day = {
  short: string
  name: string
  time: string
  title: string
  /** What happens, in one or two sentences. */
  moment: string
  lines: Line[]
  /** Hamsti's tip: the grammar behind the line that saved you. */
  tip: string
  level: Cefr
  mood: MascotMood
}

export const week: Day[] = [
  {
    short: "Mo",
    name: "Montag",
    time: "09:30",
    title: "The standup",
    moment:
      "Everyone says what they’re working on. You know exactly what you’re doing. You just can’t say it. Yet.",
    lines: [
      {
        from: lena,
        de: "Was machst du heute?",
        en: "What are you doing today?",
      },
      {
        from: you,
        de: "Heute arbeite ich an der Anmeldung.",
        en: "Today I’m working on the sign-in.",
      },
    ],
    tip: "Start with heute and the verb still comes second.",
    level: "A1",
    mood: "thinking",
  },
  {
    short: "Di",
    name: "Dienstag",
    time: "11:15",
    title: "You’re stuck",
    moment:
      "The ticket makes no sense and Jonas looks busy. Asking for help is the most useful sentence you’ll learn.",
    lines: [
      {
        from: you,
        de: "Jonas, kannst du mir kurz helfen?",
        en: "Jonas, can you help me for a sec?",
      },
      { from: jonas, de: "Klar! Was ist los?", en: "Sure! What’s up?" },
    ],
    tip: "Kurz makes any request smaller and friendlier.",
    level: "A1",
    mood: "happy",
  },
  {
    short: "Mi",
    name: "Mittwoch",
    time: "14:00",
    title: "Something’s broken",
    moment:
      "A bug in the sign-up form, and everyone’s looking at you. Describe it clearly and the logs do the rest.",
    lines: [
      {
        from: you,
        de: "Wenn ich auf „Speichern“ klicke, kommt eine Fehlermeldung.",
        en: "When I click “Save”, an error message appears.",
      },
      {
        from: jonas,
        de: "Okay, ich schaue mir die Logs an.",
        en: "OK, I’ll check the logs.",
      },
    ],
    tip: "Wenn kicks the verb to the end of its clause.",
    level: "A2",
    mood: "onFire",
  },
  {
    short: "Do",
    name: "Donnerstag",
    time: "12:30",
    title: "The coffee break",
    moment:
      "Not everything is work. Small talk is where you stop being the new person and start being a colleague.",
    lines: [
      {
        from: aylin,
        de: "Und, wie gefällt dir Berlin?",
        en: "So, how do you like Berlin?",
      },
      {
        from: you,
        de: "Sehr gut! Aber die Wohnungssuche ist anstrengend.",
        en: "A lot! But flat hunting is exhausting.",
      },
    ],
    tip: "Aber joins two ideas without moving the verb.",
    level: "A2",
    mood: "idle",
  },
  {
    short: "Fr",
    name: "Freitag",
    time: "16:00",
    title: "Your first pull request",
    moment:
      "Lena reviews your code, and her comment is in German. You reply without opening a translator.",
    lines: [
      {
        from: lena,
        de: "Sieht gut aus! Kannst du noch einen Test hinzufügen?",
        en: "Looks good! Could you add one more test?",
      },
      { from: you, de: "Guter Punkt, mache ich.", en: "Good point, will do." },
    ],
    tip: "Kannst du noch … asks politely for one more thing.",
    level: "B1",
    mood: "dance",
  },
]

export const weekIntro = {
  title: "One week. Five days you’ll actually have.",
  lede: "Each lesson is one moment from the week. Here’s what Monday to Friday looks like.",
}

export const growth = {
  title: "Next week, a little more German.",
  lede: "Every unit is a week like this one. Your role on the team grows with your German.",
  levels: [
    {
      code: "A1",
      role: "New on the team",
      de: "Ich heiße Sam. Ich bin neu hier.",
    },
    {
      code: "A2",
      role: "Part of the team",
      de: "Gestern habe ich die Tests geschrieben.",
    },
    {
      code: "B1",
      role: "Owns a feature",
      de: "Ich glaube, das Problem liegt im Cache.",
    },
    {
      code: "B2",
      role: "Leads the discussion",
      de: "Ich schlage vor, dass wir zuerst die API stabilisieren.",
    },
  ] as { code: Cefr; role: string; de: string }[],
}

export const buddy = {
  title: "Meet Hamsti, your study buddy.",
  /** Rendered as: before, the German word, after. */
  lede: {
    before: "In German, ",
    word: "hamstern",
    after:
      " means to stockpile. Hamsti stockpiles every word you learn, and its cheeks fill up as your German grows.",
  },
  moods: [
    { mood: "happy", caption: "Puffs its cheeks at every right answer" },
    { mood: "sad", caption: "Sulks a little when you slip" },
    { mood: "sleepy", caption: "Dozes off if you skip a day" },
    { mood: "dance", caption: "Dances when you finish a lesson" },
  ] as { mood: MascotMood; caption: string }[],
}

export const faq = {
  title: "The new-joiner FAQ",
  items: [
    {
      q: "Do I need any German to start?",
      a: "None at all. Your first Monday starts with „Hallo“.",
    },
    {
      q: "Is it only German for work?",
      a: "No. You’ll order coffee, book appointments and hunt for a flat too. The office just gives every lesson a story.",
    },
    {
      q: "Do I have to be a developer?",
      a: "Nope. The team builds software, but the German works for anyone in tech, and for anyone who isn’t.",
    },
    {
      q: "Does it work on my phone?",
      a: "Yes. Hamstalk runs in your browser and installs to your home screen like an app.",
    },
    {
      q: "How long until I’m fluent?",
      a: "Longer than a week, honestly. The path goes up to B2, and how fast you climb depends on how often you practise. Official certificates still come from official exams.",
    },
  ],
}

export const invite = {
  heading: "See you Monday.",
  event: "Daily Standup",
  when: "Monday · 09:30–09:45",
  where: "Kaffeesatz GmbH · Room „Brezel“",
  organiser: "Lena Fischer",
  note: "Bring your German. Even if it’s just „Hallo“.",
  accept: "Accept invite",
}

export const footerNote =
  "Lena, Jonas, Aylin and Kaffeesatz GmbH are made up. Your German won’t be."
