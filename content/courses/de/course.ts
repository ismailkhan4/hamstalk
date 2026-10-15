import type { Course } from "../types"

/** German, Klarlingo's first course: from your first Hallo at Kaffeesatz GmbH towards B2. */
export const german: Course = {
  id: "de",
  language: "German",
  endonym: "Deutsch",
  lang: "de",
  locale: "de-DE",
  phrases: {
    right: ["Richtig!", "Genau!", "Sehr gut!"],
    combo: { 3: "Super!", 5: "Fantastisch!", 7: "Unglaublich!" },
    comboBig: "Weltklasse!",
    milestones: {
      3: "Guter Start!",
      7: "Eine ganze Woche!",
      14: "Zwei Wochen!",
      30: "Ein ganzer Monat!",
      50: "Fünfzig!",
      100: "Hundert! Wahnsinn!",
    },
    milestoneOther: "Was für eine Serie!",
    lessonDone: "Lektion geschafft!",
    reviewDone: "Wiederholung geschafft!",
    unitDone: (unit) => `Einheit ${unit} geschafft!`,
    greeting: (name) => `Hallo, ${name}!`,
  },
  world: { company: "Kaffeesatz GmbH", city: "Berlin" },
}
