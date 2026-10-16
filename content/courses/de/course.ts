import type { Course } from "../types"

/** German, Hamstalk's first course: from your first Hallo at Kaffeesatz GmbH towards B2. */
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
    youAreHere: "Du bist hier",
    terminus: "Endstation",
    underConstruction: "Baustelle",
    dailyPlan: "Tagesplan",
    stash: "Vorrat",
    akku: "Akku",
    akkuEmpty: "Akku leer",
    league: "Liga",
    divisions: [
      "Kreisklasse",
      "Kreisliga",
      "Bezirksliga",
      "Landesliga",
      "Verbandsliga",
      "Oberliga",
      "Regionalliga",
      "3. Liga",
      "2. Bundesliga",
      "Bundesliga",
    ],
    promoted: "Aufstieg!",
    stayed: "Klassenerhalt",
    relegated: "Abstieg",
    finalWhistle: "Abpfiff",
  },
  world: { company: "Kaffeesatz GmbH", city: "Berlin" },
  // Paste voice ids from your ElevenLabs Voice Library: native German voices that fit each person.
  // Characters left empty use the narrator's voice.
  voices: {
    narrator: "pFZP5JQG7iQjIQuC4Bku", // Words and prompts: clear, neutral, mid-pace
    lf: "pFZP5JQG7iQjIQuC4Bku", // Lena Fischer, team lead: calm, clear, thirties
    jk: "onwK4e9ZLuTAKqWW03F9", // Jonas Krüger, backend: quick, friendly, late twenties
    ao: "pFZP5JQG7iQjIQuC4Bku", // Aylin Öztürk, design: curious, direct
    aw: "onwK4e9ZLuTAKqWW03F9", // Anna Weber, mobile developer: young, relaxed
    mb: "onwK4e9ZLuTAKqWW03F9", // Mia Braun, reception: warm, welcoming
    bk: "onwK4e9ZLuTAKqWW03F9", // Frau Krüger, bakery: older, polite
    cm: "pFZP5JQG7iQjIQuC4Bku", // Clara Meyer, design: warm, chatty
  },
  pacers: [
    { id: "lf", name: "Lena F.", initials: "LF", role: "Team lead" },
    { id: "jk", name: "Jonas K.", initials: "JK", role: "Backend" },
    { id: "ao", name: "Aylin Ö.", initials: "AÖ", role: "Design" },
    { id: "aw", name: "Anna W.", initials: "AW", role: "Mobile app" },
    { id: "mb", name: "Mia B.", initials: "MB", role: "Reception" },
    { id: "bk", name: "Frau Krüger", initials: "FK", role: "Bakery" },
    { id: "cm", name: "Clara M.", initials: "CM", role: "Design" },
  ],
}
