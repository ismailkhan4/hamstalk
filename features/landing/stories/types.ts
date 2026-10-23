import type { Person } from "@/components/learning/avatar"
import type { Cefr } from "@/components/learning/level-badge"
import type { MascotMood } from "@/features/celebrations/mascot"
import type { Course, Locale } from "@/lib/i18n"

/**
 * A course's story on the landing page: your first week on a team that speaks the language,
 * Monday to Friday. Each course has its own team, city and lines; the shape of the week is the same.
 * Words that depend on the reader's language (glosses, tips, the city's name) are given per
 * language. Everything else a visitor reads is in ../copy.
 */

export type DayId = "mon" | "tue" | "wed" | "thu" | "fri"

export type Speaker = { person: Person; initials: string; name: string }

/** The learner. Their name on the avatar comes from the copy ("You", "Du", "Tu"). */
export type Learner = { person: "me"; initials: string }

export type Line = { from: Speaker | Learner; target: string }

export type StoryDay = {
  /** The day as the office calendar shows it, in the course's language. */
  short: string
  name: string
  lines: [Line, Line]
  /** The two lines in the reader's language. None for readers of the course's own language. */
  glosses: Partial<Record<Locale, [string, string]>>
  /** Hamsti's tip: the grammar behind the line that saved you. *Words* in the course's language. */
  tips: Record<Locale, string>
}

export type Story = {
  course: Course
  /** Whether learners can take this course yet. Until then the page says it's coming soon. */
  available: boolean
  company: string
  city: Record<Locale, string>
  /** The meeting room on the standup invite. */
  room: string
  /** The first word you learn, as in "Your first Monday starts with Hallo". */
  greeting: string
  /** Under Friday, once the pull request is through. */
  weekend: string
  /** Runs the standup and reviews your code. Always a woman: the copy says "her comment". */
  lead: Speaker & { fullName: string }
  /** The colleague you ask for help. */
  helper: Speaker
  /** The colleague at the coffee machine. */
  friend: Speaker
  you: Learner
  days: Record<DayId, StoryDay>
  /** The path up, one line per level. */
  levels: Record<Cefr, string>
}

export const DAY_IDS: DayId[] = ["mon", "tue", "wed", "thu", "fri"]

/** What every course's week has in common: when things happen, how hard, and Hamsti's mood. */
export const schedule: Record<
  DayId,
  { time: string; level: Cefr; mood: MascotMood }
> = {
  mon: { time: "09:30", level: "A1", mood: "thinking" },
  tue: { time: "11:15", level: "A1", mood: "happy" },
  wed: { time: "14:00", level: "A2", mood: "onFire" },
  thu: { time: "12:30", level: "A2", mood: "idle" },
  fri: { time: "16:00", level: "B1", mood: "dance" },
}

export const LEVELS: Cefr[] = ["A1", "A2", "B1", "B2"]

export type BuddyMood = "happy" | "sad" | "sleepy" | "dance"

export const buddyMoods: BuddyMood[] = ["happy", "sad", "sleepy", "dance"]

/** The calendar title of your first standup. Teams say it in English everywhere. */
export const STANDUP_EVENT = "Daily Standup"
