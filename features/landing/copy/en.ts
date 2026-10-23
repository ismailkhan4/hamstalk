import type { Course } from "@/lib/i18n"

import type { CopyFor } from "./types"

const names: Record<Course, string> = {
  de: "German",
  en: "English",
  it: "Italian",
}

/** British English, like the rest of the app. */
export const en: CopyFor = (story) => {
  const lang = names[story.course]
  /** "an English-speaking team", "a German-speaking team" */
  const a = /^[AEIOU]/.test(lang) ? "an" : "a"
  const { lead, helper, friend, company } = story
  const city = story.city.en
  return {
    meta: {
      title: `Hamstalk · Learn ${lang}. Join the team.`,
      description: `The ${lang} course for software engineers joining ${a} ${lang}-speaking team.`,
      ogLocale: "en_GB",
    },
    nav: {
      home: "Hamstalk home",
      skipToContent: "Skip to content",
      footer: "Footer",
      language: "Language",
      themeToLight: "Switch to light theme",
      themeToDark: "Switch to dark theme",
    },
    cta: { start: "Start Monday", signIn: "Sign in" },
    courses: {
      label: "I want to learn",
      names,
      comingSoon: "Coming soon",
      notReady: `The ${lang} course is still being written. Until it opens, Hamstalk teaches German.`,
      tryAvailable: "Try the German course",
    },
    hero: {
      kicker: `Monday, 09:00 · ${company}, ${city}`,
      title: `Your new team speaks ${lang}.`,
      lede: `Hamstalk teaches you ${lang} one workday at a time: the standup, the bug, the coffee break. Five minutes a lesson, with a hamster cheering you on.`,
      signInPrompt: "Already on the team?",
      planner: "Your first week",
      now: "Now",
    },
    you: "You",
    week: {
      title: "One week, five real moments.",
      lede: "Each lesson is one moment from the week. Here’s what Monday to Friday looks like.",
      tipLabel: "Hamsti’s tip:",
      approved: `Pull request approved. *${story.weekend}*`,
      days: {
        mon: {
          title: "The standup",
          moment:
            "Everyone says what they’re working on. You know exactly what you’re doing. You just can’t say it. Yet.",
        },
        tue: {
          title: "You’re stuck",
          moment: `The ticket makes no sense, and ${helper.name} looks busy. No sentence will help you more than the one that asks for help.`,
        },
        wed: {
          title: "Something’s broken",
          moment:
            "There’s a bug in the sign-up form, and everyone’s looking at you. Describe it clearly, and the logs will do the rest.",
        },
        thu: {
          title: "The coffee break",
          moment:
            "Not everything is about work. Small talk is where you stop being the new person and start being a colleague.",
        },
        fri: {
          title: "Your first pull request",
          moment: `${lead.name} reviews your code, and her comment is in ${lang}. You reply without opening a translator.`,
        },
      },
    },
    growth: {
      title: `Next week, a little more ${lang}.`,
      lede: `Every unit is a week like this one. Your role on the team grows with your ${lang}.`,
      roles: {
        A1: "New to the team",
        A2: "Part of the team",
        B1: "Owning a feature",
        B2: "Leading the discussion",
      },
    },
    buddy: {
      title: "Meet Hamsti, your study buddy.",
      lede: `In German, *hamstern* means to stockpile. Hamsti stockpiles every word you learn, and its cheeks fill up as your ${lang} grows.`,
      captions: {
        happy: "Puffs up its cheeks at every right answer",
        sad: "Sulks a little when you slip up",
        sleepy: "Dozes off if you skip a day",
        dance: "Dances when you finish a lesson",
      },
    },
    faq: {
      title: "The new-joiner FAQ",
      items: [
        {
          q: `Do I need any ${lang} to start?`,
          a: `None at all. Your first Monday starts with *${story.greeting}*.`,
        },
        {
          q: `Is it only workplace ${lang}?`,
          a: "No. You’ll also order coffee, book appointments and hunt for a flat. The office just gives every lesson a story.",
        },
        {
          q: "Do I have to be a developer?",
          a: `Nope. The team in the story builds software, but the ${lang} you learn works just as well outside tech.`,
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
    },
    invite: {
      heading: "See you on Monday.",
      label: "Invitation",
      when: "Monday · 09:30–09:45",
      where: `${company} · Room “${story.room}”`,
      organiser: "Organiser",
      note: `Bring your ${lang}, even if it’s just *${story.greeting}*.`,
      accept: "Accept invite",
    },
    footer: {
      links: {
        week: "Your first week",
        levels: "Levels",
        buddy: "Hamsti",
        faq: "FAQ",
      },
      note: `${lead.name}, ${helper.name}, ${friend.name} and ${company} are made up. Your ${lang} won’t be.`,
    },
  }
}
