import { isLessonAvailable } from "@/content/courses/de/availability"

import type { StartLevel } from "./options"

export type Mission = {
  id: string | null
  place: string
  title: string
  titleInTarget: boolean
  target: string
  native: string
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
      titleInTarget: true,
      target: "Hallo! Tschüss! Auf Wiedersehen!",
      native: "Say hello and goodbye.",
    },
    {
      id: "a1-u1-l2",
      place: "Unit 1 · Lesson 2",
      title: "Guten Morgen, guten Tag",
      titleInTarget: true,
      target: "Guten Morgen! Guten Tag!",
      native: "Choose the greeting that fits the time of day.",
    },
    {
      id: "a1-u1-l3",
      place: "Unit 1 · Lesson 3",
      title: "Ich bin …",
      titleInTarget: true,
      target: "Ich bin %N. Ich heiße %N.",
      native: "Say your name and catch someone else’s.",
    },
    {
      id: "a1-u1-l4",
      place: "Unit 1 · Lesson 4",
      title: "Danke und bitte",
      titleInTarget: true,
      target: "Danke! – Bitte!",
      native: "Thank someone, reply to thanks and say sorry.",
    },
    {
      id: "a1-u1-review",
      place: "Unit 1 · Review",
      title: "Unit 1 review",
      titleInTarget: false,
      target: "Guten Morgen! Ich bin %N.",
      native:
        "Reception, first morning: listen to four greetings and reply to each.",
    },
  ],
  a1: [
    {
      id: "a1-u3-l1",
      place: "Unit 3 · Lesson 1",
      title: "Wie heißt du?",
      titleInTarget: true,
      target: "Wie heißt du? – Ich heiße %N.",
      native: "Ask for and give names with heißen.",
    },
    {
      id: "a1-u3-l2",
      place: "Unit 3 · Lesson 2",
      title: "Jobs on the team",
      titleInTarget: false,
      target: "Anna ist Softwareentwicklerin.",
      native: "Say your job, with the -in form for women and no article.",
    },
    {
      id: "a1-u3-l3",
      place: "Unit 3 · Lesson 3",
      title: "Meet your team",
      titleInTarget: false,
      target: "Ich heiße %N. Ich bin neu im Team.",
      native: "Introduce yourself with sein and heißen.",
    },
    {
      id: "a1-u3-l4",
      place: "Unit 3 · Lesson 4",
      title: "Woher kommst du?",
      titleInTarget: true,
      target: "Ich komme aus … Ich spreche …",
      native: "Say where you’re from and which languages you speak.",
    },
    {
      id: "a1-u3-review",
      place: "Unit 3 · Review",
      title: "Unit 3 review",
      titleInTarget: false,
      target: "Hallo! Ich heiße %N.",
      native: "Introduce yourself to the whole team, spoken and then written.",
    },
  ],
  a2: [
    {
      id: null,
      place: "A2 · Unit 1",
      title: "Talking about yesterday",
      titleInTarget: false,
      target: "Gestern habe ich die Tests geschrieben.",
      native: "The Perfekt: Gestern habe ich …",
    },
    {
      id: null,
      place: "A2 · Unit 2",
      title: "Plans and appointments",
      titleInTarget: false,
      target: "Können wir den Termin verschieben?",
      native: "Arrange meetings and doctor’s visits.",
    },
    {
      id: null,
      place: "A2 · Unit 3",
      title: "Team chat and short messages",
      titleInTarget: false,
      target: "Ich bin heute etwas später da.",
      native: "Clear, friendly written German.",
    },
    {
      id: null,
      place: "A2 · Unit 4",
      title: "Asking for help",
      titleInTarget: false,
      target: "Kannst du mir kurz helfen?",
      native: "Explain where you’re stuck.",
    },
    {
      id: null,
      place: "A2 · Unit 5",
      title: "Errands and the Bürgeramt",
      titleInTarget: false,
      target: "Ich brauche einen Termin.",
      native: "Forms, appointments and opening hours.",
    },
  ],
  b1: [
    {
      id: null,
      place: "B1 · Unit 1",
      title: "Explaining problems",
      titleInTarget: false,
      target: "Wenn ich auf „Speichern“ klicke, passiert nichts.",
      native: "Wenn …, dann …: cause and effect.",
    },
    {
      id: null,
      place: "B1 · Unit 2",
      title: "Asking for clarification",
      titleInTarget: false,
      target: "Meinst du die alte oder die neue API?",
      native: "Check you understood before you start.",
    },
    {
      id: null,
      place: "B1 · Unit 3",
      title: "Opinions and reasons",
      titleInTarget: false,
      target: "Ich finde das gut, weil es schneller ist.",
      native: "weil, deshalb, trotzdem.",
    },
    {
      id: null,
      place: "B1 · Unit 4",
      title: "Team meetings",
      titleInTarget: false,
      target: "Darf ich kurz etwas ergänzen?",
      native: "Follow along and add your point.",
    },
    {
      id: null,
      place: "B1 · Unit 5",
      title: "Code reviews",
      titleInTarget: false,
      target: "Könntest du hier noch einen Test schreiben?",
      native: "Suggest changes politely.",
    },
  ],
  b2: [
    {
      id: null,
      place: "B2 · Unit 1",
      title: "Following fast discussions",
      titleInTarget: false,
      target: "Moment, habe ich das richtig verstanden?",
      native: "Keep up when three people talk at once.",
    },
    {
      id: null,
      place: "B2 · Unit 2",
      title: "Presenting a decision",
      titleInTarget: false,
      target: "Wir haben uns für Postgres entschieden.",
      native: "Context, decision, consequences.",
    },
    {
      id: null,
      place: "B2 · Unit 3",
      title: "Disagreeing politely",
      titleInTarget: false,
      target: "Ich sehe das etwas anders.",
      native: "Push back without sounding blunt.",
    },
    {
      id: null,
      place: "B2 · Unit 4",
      title: "Explaining trade-offs",
      titleInTarget: false,
      target: "Das ist schneller, aber schwerer zu warten.",
      native: "Weigh options in front of the team.",
    },
    {
      id: null,
      place: "B2 · Unit 5",
      title: "Feedback conversations",
      titleInTarget: false,
      target: "Was können wir beim nächsten Mal besser machen?",
      native: "Give and receive feedback.",
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
    target: mission.target.replaceAll("%N", firstName),
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
      : `The four lessons of Unit 1, then its review. Same order as on your learning path. ${available === 0 ? "They’re being built now and will open here as soon as each one is ready." : `${available} of ${planned.length} are open now; the rest follow.`}`
  }
  if (level === "a1") {
    return "You start at Unit 3. Units 1 and 2 stay open for review. Unit 3 lessons are planned and will open here as soon as they’re ready; Unit 1 is the first to arrive."
  }
  const code = level === "b2" ? "B2" : level.toUpperCase()
  return `${code} is a preview: these are the first units on its path, planned but not built yet. You can start with Unit 1 any time.`
}
