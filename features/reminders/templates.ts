import { ACTIVE_COURSE } from "@/content/courses"
import { MASCOT_NAME } from "@/features/celebrations/mascot-name"

/**
 * What a reminder says. Several wordings per kind; the endpoint picks one with an epsilon-greedy
 * bandit, so wordings that get learners practising are sent more often. Template ids are stored
 * in notification_log: rename one and its history starts again.
 */

export type ReminderKind = "daily" | "streak_saver"

export type ReminderFacts = {
  firstName: string
  streak: number
  freezes: number
  xpToday: number
  goalXp: number
  dueWords: number
}

export type ReminderCopy = { title: string; body: string; href: string }

type Template = {
  id: string
  /** Whether this wording makes sense for these facts. */
  fits?: (facts: ReminderFacts) => boolean
  write: (facts: ReminderFacts) => ReminderCopy
}

const hello = (facts: ReminderFacts) =>
  facts.firstName ? `${facts.firstName}, ` : ""

export const TEMPLATES: Record<ReminderKind, readonly Template[]> = {
  daily: [
    {
      id: "d-short",
      write: (facts) => ({
        title: `${hello(facts)}five minutes?`,
        body: `One short lesson keeps ${MASCOT_NAME}’s cheeks full.`,
        href: "/home",
      }),
    },
    {
      id: "d-goal",
      write: (facts) => ({
        title: `Today’s goal: ${facts.goalXp} XP`,
        body: "One lesson gets you most of the way there.",
        href: "/home",
      }),
    },
    {
      id: "d-team",
      write: () => ({
        title: `Your team at ${ACTIVE_COURSE.world.company} is in`,
        body: "Today’s lesson is ready whenever you are.",
        href: "/home",
      }),
    },
    {
      id: "d-words",
      fits: (facts) => facts.dueWords >= 3,
      write: (facts) => ({
        title: `${facts.dueWords} words are ready for review`,
        body: "A few minutes now and they stick.",
        href: "/review",
      }),
    },
  ],
  streak_saver: [
    {
      id: "s-flame",
      write: (facts) => ({
        title: `Your ${facts.streak}-day streak ends at midnight`,
        body: "One short lesson keeps it going.",
        href: "/home",
      }),
    },
    {
      id: "s-hamsti",
      write: (facts) => ({
        title: `${MASCOT_NAME} is guarding your ${facts.streak}-day streak`,
        body: "But only until midnight. 10 XP saves it.",
        href: "/home",
      }),
    },
    {
      id: "s-quick",
      fits: (facts) => facts.dueWords > 0,
      write: (facts) => ({
        title: `${facts.streak} days. Don’t stop now.`,
        body: "A quick review counts too: 10 XP is all it takes.",
        href: "/review",
      }),
    },
    {
      id: "s-freeze",
      fits: (facts) => facts.freezes > 0,
      write: (facts) => ({
        title: "A streak freeze would cover today",
        body: `But practising keeps your ${facts.streak}-day streak and saves the freeze for later.`,
        href: "/home",
      }),
    },
  ],
}

/** Explore a random wording this often; otherwise send the one with the best record. */
const EXPLORE = 0.2

/**
 * Picks a wording: the best success rate so far (with a prior, so new wordings get a fair go),
 * or now and then a random one to keep learning.
 */
export function pickTemplate(
  kind: ReminderKind,
  facts: ReminderFacts,
  stats: ReadonlyMap<string, { sends: number; wins: number }>,
  random = Math.random
) {
  const options = TEMPLATES[kind].filter(
    (template) => !template.fits || template.fits(facts)
  )
  if (random() < EXPLORE) return options[Math.floor(random() * options.length)]!
  const score = (id: string) => {
    const stat = stats.get(id) ?? { sends: 0, wins: 0 }
    return (stat.wins + 1) / (stat.sends + 2)
  }
  return options.reduce((best, option) =>
    score(option.id) > score(best.id) ? option : best
  )
}
