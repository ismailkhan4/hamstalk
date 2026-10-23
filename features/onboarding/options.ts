import { z } from "zod"

export const GOALS = [
  "work",
  "interviews",
  "colleagues",
  "everyday",
  "general",
  "other",
] as const
export const LEVELS = ["beginner", "a1", "a2", "b1", "b2"] as const
export const CONTEXTS = [
  "standups",
  "meetings",
  "technical",
  "interviews",
  "messaging",
  "everyday",
  "listening",
  "speaking",
] as const
export const DAILY_MINUTES = [10, 15, 20, 30] as const
export const REMINDER_TIMES = [
  "07:30",
  "08:30",
  "12:30",
  "18:00",
  "20:00",
] as const

export type Goal = (typeof GOALS)[number]
export type StartLevel = (typeof LEVELS)[number]
export type Context = (typeof CONTEXTS)[number]
export type DailyMinutes = (typeof DAILY_MINUTES)[number]

export const goalOptions: Record<
  Goal,
  { title: string; text: string; short: string }
> = {
  work: {
    title: "Working in Germany",
    text: "Settle into a job where the team speaks German.",
    short: "Working in Germany",
  },
  interviews: {
    title: "Software engineering interviews",
    text: "Introduce yourself and talk about your experience in German.",
    short: "Tech interviews",
  },
  colleagues: {
    title: "Talking with German colleagues",
    text: "Standups, chat and everyday team conversations.",
    short: "Talking with colleagues",
  },
  everyday: {
    title: "Everyday life in Germany",
    text: "Shops, appointments, neighbours and small talk.",
    short: "Everyday life",
  },
  general: {
    title: "Better German in general",
    text: "Solid foundations: sounds, grammar and useful phrases.",
    short: "General German",
  },
  other: {
    title: "Something personal",
    text: "Family, friends, a move you’re planning. We’ll start with a balanced mix.",
    short: "Personal goals",
  },
}

export const goalFocus: Record<Goal, string> = {
  work: "German for your first weeks at work",
  interviews: "Introducing yourself and your experience",
  colleagues: "Everyday team conversations",
  everyday: "Daily life first, work German on top",
  general: "Solid foundations for every situation",
  other: "A balanced mix to start",
}

export const levelOptions: Record<
  StartLevel,
  { code: string; title: string; text: string; short: string }
> = {
  beginner: {
    code: "Start",
    title: "Complete beginner",
    text: "I’m new to German. Perfect: everyone starts here.",
    short: "Complete beginner",
  },
  a1: {
    code: "A1",
    title: "I know a few basics",
    text: "Greetings, numbers and a few simple sentences.",
    short: "A1 · some basics",
  },
  a2: {
    code: "A2",
    title: "I can handle simple conversations",
    text: "Everyday topics, short messages, talking about yesterday.",
    short: "A2 · simple conversations",
  },
  b1: {
    code: "B1",
    title: "I can communicate in familiar situations",
    text: "Work topics, opinions with reasons, longer conversations.",
    short: "B1 · familiar situations",
  },
  b2: {
    code: "B2+",
    title: "I want to improve my professional German",
    text: "Meetings, technical discussions and getting the nuance right.",
    short: "B2 or higher",
  },
}

export const contextOptions: Record<
  Context,
  { title: string; text: string; short: string }
> = {
  standups: {
    title: "Daily standups",
    text: "What you did, what’s next, what’s blocking you.",
    short: "Standups",
  },
  meetings: {
    title: "Team meetings",
    text: "Follow along and add your point.",
    short: "Meetings",
  },
  technical: {
    title: "Technical discussions",
    text: "Bugs, code reviews and trade-offs.",
    short: "Technical talk",
  },
  interviews: {
    title: "Interviews",
    text: "Talk about yourself and your work.",
    short: "Interviews",
  },
  messaging: {
    title: "Messages and emails",
    text: "Clear, polite written German.",
    short: "Messages",
  },
  everyday: {
    title: "Everyday conversations",
    text: "Small talk, errands and appointments.",
    short: "Everyday talk",
  },
  listening: {
    title: "Listening",
    text: "Understand people at natural speed.",
    short: "Listening",
  },
  speaking: {
    title: "Speaking confidence",
    text: "Say it out loud without freezing.",
    short: "Speaking",
  },
}

export const dailyOptions: Record<
  DailyMinutes,
  { text: string; tag?: string }
> = {
  10: { text: "One short lesson. Easy to keep on busy days." },
  15: { text: "A lesson plus a quick review.", tag: "Good place to start" },
  20: { text: "A lesson, a review and a mission step." },
  30: { text: "Deeper practice with speaking and listening." },
}

export function contextsSummary(contexts: readonly Context[]) {
  if (contexts.length === 0) return null
  const names = contexts.map((context) => contextOptions[context].short)
  if (names.length <= 2) return names.join(", ")
  return `${names[0]}, ${names[1]} +${names.length - 2}`
}

export const preferencesSchema = z.object({
  goal: z.enum(GOALS).nullable(),
  startLevel: z.enum(LEVELS).nullable(),
  contexts: z.array(z.enum(CONTEXTS)).max(CONTEXTS.length),
  dailyMinutes: z
    .number()
    .refine((value): value is DailyMinutes =>
      (DAILY_MINUTES as readonly number[]).includes(value)
    )
    .nullable(),
  reminderEnabled: z.boolean(),
  reminderTime: z.enum(REMINDER_TIMES).nullable(),
})

export type Preferences = z.infer<typeof preferencesSchema> & {
  onboardedAt: string | null
  startedAt: string | null
  step: OnboardingStep
}

export const ONBOARDING_STEPS = [
  "welcome",
  "goal",
  "level",
  "context",
  "daily",
  "plan",
] as const
export type OnboardingStep = (typeof ONBOARDING_STEPS)[number]

export const stepLabels: Record<OnboardingStep, string> = {
  welcome: "Welcome",
  goal: "Your goal",
  level: "Your level",
  context: "Where you’ll use German",
  daily: "Daily goal",
  plan: "Your plan",
}

export const emptyPreferences: Preferences = {
  goal: null,
  startLevel: null,
  contexts: [],
  dailyMinutes: null,
  reminderEnabled: false,
  reminderTime: null,
  onboardedAt: null,
  startedAt: null,
  step: "welcome",
}

/** Which answer a step needs before Continue is enabled, with the reason shown beside the button. */
export function missingAnswer(
  step: OnboardingStep,
  preferences: Preferences
): string | null {
  if (step === "goal" && !preferences.goal) return "Choose a goal to continue."
  if (step === "level" && !preferences.startLevel)
    return "Choose a starting point to continue."
  if (step === "context" && preferences.contexts.length === 0)
    return "Choose at least one situation to continue."
  if (step === "daily" && !preferences.dailyMinutes)
    return "Choose a daily goal to continue."
  return null
}
