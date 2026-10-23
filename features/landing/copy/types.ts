import type { Cefr } from "@/components/learning/level-badge"
import type { Course } from "@/lib/i18n"

import type { BuddyMood, DayId, Story } from "../stories"

/**
 * Every word a visitor reads on the landing page, in one language, for one course. Each language
 * builds it from the course's story, so the name of the language, the team and the city slot into
 * sentences written for that language's grammar. A missing field fails type-checking instead of
 * showing up blank.
 *
 * Voice: short, warm, a little cheeky. Nothing promises a level, an exam result or a job, and
 * nobody learns a language in a week: the week is the shape of every unit.
 *
 * Words in the course's language are wrapped in *asterisks*: they render in italics and are
 * tagged with that language for screen readers (see RichText).
 */
export type LandingCopy = {
  meta: {
    title: string
    description: string
    /** Open Graph locale, e.g. en_GB. */
    ogLocale: string
  }
  nav: {
    home: string
    skipToContent: string
    footer: string
    /** Accessible name of the language switcher, e.g. "Language". */
    language: string
    themeToLight: string
    themeToDark: string
  }
  cta: { start: string; signIn: string }
  /** The course picker in the hero. */
  courses: {
    /** e.g. "I want to learn" */
    label: string
    /** Each course's language, as this page's language names it. */
    names: Record<Course, string>
    comingSoon: string
    /** Shown in place of the sign-up buttons while a course isn't ready. */
    notReady: string
    /** The button that leads to a course you can take today. */
    tryAvailable: string
  }
  hero: {
    kicker: string
    title: string
    lede: string
    signInPrompt: string
    planner: string
    now: string
  }
  /** The learner's name on their own chat avatar. */
  you: string
  week: {
    title: string
    lede: string
    /** Read by screen readers before each tip, e.g. "Hamsti’s tip:". */
    tipLabel: string
    /** Under Friday, once the pull request is through. */
    approved: string
    days: Record<DayId, { title: string; moment: string }>
  }
  growth: {
    title: string
    lede: string
    roles: Record<Cefr, string>
  }
  buddy: {
    title: string
    lede: string
    captions: Record<BuddyMood, string>
  }
  faq: { title: string; items: { q: string; a: string }[] }
  invite: {
    heading: string
    label: string
    when: string
    where: string
    organiser: string
    note: string
    accept: string
  }
  footer: {
    links: { week: string; levels: string; buddy: string; faq: string }
    note: string
  }
}

/** Builds one language's landing page for a course. */
export type CopyFor = (story: Story) => LandingCopy
