import { isLessonAvailable } from "@/content/availability"

import type { StartLevel } from "./options"

export type Mission = {
  id: string | null
  place: string
  title: string
  titleIsGerman: boolean
  de: string
  en: string
}

export type PlannedMission = Mission & {
  status: "available" | "planned" | "preview"
}

const missions: Record<StartLevel, Mission[]> = {
  beginner: [
    {
      id: "a1-u1-l1",
      place: "Unit 1 · Lesson 1",
      title: "Hallo!",
      titleIsGerman: true,
      de: "Hallo! Tschüss! Auf Wiedersehen!",
      en: "Say hello and goodbye.",
    },
    {
      id: "a1-u1-l2",
      place: "Unit 1 · Lesson 2",
      title: "Guten Morgen, guten Tag",
      titleIsGerman: true,
      de: "Guten Morgen! Guten Tag!",
      en: "Choose the greeting that fits the time of day.",
    },
    {
      id: "a1-u1-l3",
      place: "Unit 1 · Lesson 3",
      title: "Ich bin …",
      titleIsGerman: true,
      de: "Ich bin %N. Ich heiße %N.",
      en: "Say your name and catch someone else’s.",
    },
    {
      id: "a1-u1-l4",
      place: "Unit 1 · Lesson 4",
      title: "Danke und bitte",
      titleIsGerman: true,
      de: "Danke! – Bitte!",
      en: "Thank someone, reply to thanks and say sorry.",
    },
    {
      id: "a1-u1-review",
      place: "Unit 1 · Review",
      title: "Unit 1 review",
      titleIsGerman: false,
      de: "Guten Morgen! Ich bin %N.",
      en: "Reception, first morning: listen to four greetings and reply to each.",
    },
  ],
  a1: [
    {
      id: "a1-u3-l1",
      place: "Unit 3 · Lesson 1",
      title: "Wie heißt du?",
      titleIsGerman: true,
      de: "Wie heißt du? – Ich heiße %N.",
      en: "Ask for and give names with heißen.",
    },
    {
      id: "a1-u3-l2",
      place: "Unit 3 · Lesson 2",
      title: "Jobs on the team",
      titleIsGerman: false,
      de: "Anna ist Softwareentwicklerin.",
      en: "Say your job, with the -in form for women and no article.",
    },
    {
      id: "a1-u3-l3",
      place: "Unit 3 · Lesson 3",
      title: "Meet your team",
      titleIsGerman: false,
      de: "Ich heiße %N. Ich bin neu im Team.",
      en: "Introduce yourself with sein and heißen.",
    },
    {
      id: "a1-u3-l4",
      place: "Unit 3 · Lesson 4",
      title: "Woher kommst du?",
      titleIsGerman: true,
      de: "Ich komme aus … Ich spreche …",
      en: "Say where you’re from and which languages you speak.",
    },
    {
      id: "a1-u3-review",
      place: "Unit 3 · Review",
      title: "Unit 3 review",
      titleIsGerman: false,
      de: "Hallo! Ich heiße %N.",
      en: "Introduce yourself to the whole team, spoken and then written.",
    },
  ],
  a2: [
    {
      id: null,
      place: "A2 · Unit 1",
      title: "Talking about yesterday",
      titleIsGerman: false,
      de: "Gestern habe ich die Tests geschrieben.",
      en: "The Perfekt: Gestern habe ich …",
    },
    {
      id: null,
      place: "A2 · Unit 2",
      title: "Plans and appointments",
      titleIsGerman: false,
      de: "Können wir den Termin verschieben?",
      en: "Arrange meetings and doctor’s visits.",
    },
    {
      id: null,
      place: "A2 · Unit 3",
      title: "Team chat and short messages",
      titleIsGerman: false,
      de: "Ich bin heute etwas später da.",
      en: "Clear, friendly written German.",
    },
    {
      id: null,
      place: "A2 · Unit 4",
      title: "Asking for help",
      titleIsGerman: false,
      de: "Kannst du mir kurz helfen?",
      en: "Explain where you’re stuck.",
    },
    {
      id: null,
      place: "A2 · Unit 5",
      title: "Errands and the Bürgeramt",
      titleIsGerman: false,
      de: "Ich brauche einen Termin.",
      en: "Forms, appointments and opening hours.",
    },
  ],
  b1: [
    {
      id: null,
      place: "B1 · Unit 1",
      title: "Explaining problems",
      titleIsGerman: false,
      de: "Wenn ich auf „Speichern“ klicke, passiert nichts.",
      en: "Wenn …, dann …: cause and effect.",
    },
    {
      id: null,
      place: "B1 · Unit 2",
      title: "Asking for clarification",
      titleIsGerman: false,
      de: "Meinst du die alte oder die neue API?",
      en: "Check you understood before you start.",
    },
    {
      id: null,
      place: "B1 · Unit 3",
      title: "Opinions and reasons",
      titleIsGerman: false,
      de: "Ich finde das gut, weil es schneller ist.",
      en: "weil, deshalb, trotzdem.",
    },
    {
      id: null,
      place: "B1 · Unit 4",
      title: "Team meetings",
      titleIsGerman: false,
      de: "Darf ich kurz etwas ergänzen?",
      en: "Follow along and add your point.",
    },
    {
      id: null,
      place: "B1 · Unit 5",
      title: "Code reviews",
      titleIsGerman: false,
      de: "Könntest du hier noch einen Test schreiben?",
      en: "Suggest changes politely.",
    },
  ],
  b2: [
    {
      id: null,
      place: "B2 · Unit 1",
      title: "Following fast discussions",
      titleIsGerman: false,
      de: "Moment, habe ich das richtig verstanden?",
      en: "Keep up when three people talk at once.",
    },
    {
      id: null,
      place: "B2 · Unit 2",
      title: "Presenting a decision",
      titleIsGerman: false,
      de: "Wir haben uns für Postgres entschieden.",
      en: "Context, decision, consequences.",
    },
    {
      id: null,
      place: "B2 · Unit 3",
      title: "Disagreeing politely",
      titleIsGerman: false,
      de: "Ich sehe das etwas anders.",
      en: "Push back without sounding blunt.",
    },
    {
      id: null,
      place: "B2 · Unit 4",
      title: "Explaining trade-offs",
      titleIsGerman: false,
      de: "Das ist schneller, aber schwerer zu warten.",
      en: "Weigh options in front of the team.",
    },
    {
      id: null,
      place: "B2 · Unit 5",
      title: "Feedback conversations",
      titleIsGerman: false,
      de: "Was können wir beim nächsten Mal besser machen?",
      en: "Give and receive feedback.",
    },
  ],
}

export function isPreviewLevel(level: StartLevel) {
  return level === "a2" || level === "b1" || level === "b2"
}

/** The plan's first five missions, read from the curriculum map, with their real availability. */
export function missionsFor(
  level: StartLevel,
  firstName: string
): PlannedMission[] {
  return missions[level].map((mission) => ({
    ...mission,
    de: mission.de.replaceAll("%N", firstName),
    status: isPreviewLevel(level)
      ? "preview"
      : mission.id && isLessonAvailable(mission.id)
        ? "available"
        : "planned",
  }))
}

export function missionsNote(level: StartLevel, planned: PlannedMission[]) {
  const available = planned.filter(
    (mission) => mission.status === "available"
  ).length
  if (level === "beginner") {
    return available === planned.length
      ? "The four lessons of Unit 1, then its review. Same order as on your learning path."
      : `The four lessons of Unit 1, then its review. Same order as on your learning path. ${available === 0 ? "They’re being built now and open here as soon as each one is ready." : `${available} of ${planned.length} are open now; the rest follow.`}`
  }
  if (level === "a1") {
    return "You start at Unit 3. Units 1 and 2 stay open for review. Unit 3 lessons are planned and open here as soon as they’re ready; Unit 1 is the first to arrive."
  }
  const code = level === "b2" ? "B2" : level.toUpperCase()
  return `${code} is a preview: these are the first units on its path, planned but not built yet. You can start with Unit 1 any time.`
}
