export type PlacementSkill = "Vocabulary" | "Grammar" | "Reading" | "Listening"

export type PlacementQuestion = {
  skill: PlacementSkill
  level: "A1" | "A2" | "B1"
  prompt: string
  /** German shown with the question; options are German too when germanOptions is set. */
  german?: string
  sign?: string
  mail?: { from: string; text: string }
  /** Spoken with the browser's German voice; the transcript is offered when no voice is available. */
  listening?: string
  germanOptions?: boolean
  options: [string, string, string]
  correct: 0 | 1 | 2
}

export const IDK = 3

export const placementQuestions: PlacementQuestion[] = [
  {
    skill: "Vocabulary",
    level: "A1",
    prompt: "What does this greeting mean?",
    german: "Guten Abend!",
    options: ["Good evening!", "Good morning!", "Goodbye!"],
    correct: 0,
  },
  {
    skill: "Grammar",
    level: "A1",
    prompt: "Which word completes the sentence?",
    german: "Wir ___ aus Berlin.",
    germanOptions: true,
    options: ["kommen", "kommt", "komme"],
    correct: 0,
  },
  {
    skill: "Reading",
    level: "A1",
    prompt: "A sign on the bakery door. When does it open again?",
    sign: "Heute geschlossen.\nMorgen ab 9 Uhr geöffnet.",
    options: [
      "Tomorrow from 9 o’clock",
      "Today at 9 o’clock",
      "It is closed until 9 tonight",
    ],
    correct: 0,
  },
  {
    skill: "Listening",
    level: "A1",
    prompt: "Where does Jonas work?",
    listening: "Ich heiße Jonas und ich arbeite als Entwickler in Hamburg.",
    options: ["In Hamburg", "In Berlin", "In München"],
    correct: 0,
  },
  {
    skill: "Grammar",
    level: "A2",
    prompt: "Which word completes the sentence?",
    german: "Gestern ___ ich lange gearbeitet.",
    germanOptions: true,
    options: ["habe", "bin", "war"],
    correct: 0,
  },
  {
    skill: "Vocabulary",
    level: "A2",
    prompt: "Which verb fits?",
    german: "Ich muss den Termin leider ___.",
    germanOptions: true,
    options: ["verschieben", "verschenken", "verstehen"],
    correct: 0,
  },
  {
    skill: "Reading",
    level: "B1",
    prompt: "Why does Aylin want to move the meeting?",
    mail: {
      from: "Aylin Öztürk · email",
      text: "Könnten wir das Meeting auf Donnerstag verlegen? Am Mittwoch bin ich den ganzen Tag beim Kunden.",
    },
    options: [
      "She’s with a client all day on Wednesday",
      "The meeting has been cancelled",
      "She’s on holiday on Thursday",
    ],
    correct: 0,
  },
  {
    skill: "Listening",
    level: "B1",
    prompt: "What does Lena suggest?",
    listening:
      "Ich finde die Idee gut, aber wir sollten vorher die Kosten prüfen.",
    options: [
      "Checking the costs before deciding",
      "Rejecting the idea",
      "Starting straight away",
    ],
    correct: 0,
  },
]
