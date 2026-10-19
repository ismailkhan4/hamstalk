import type { Lesson } from "@/features/lessons/schema"

/** Unit 4 · Lesson 3: Termine. Written for this app. */
export const lesson3: Lesson = {
  id: "a1-u4-l3",
  kind: "lesson",
  title: "Termine",
  titleInTarget: true,
  titleEn: "Appointments",
  goal: "Name the weekdays and say when you have an appointment",
  minutes: 8,
  xp: 30,
  focus: "am Montag · heute · morgen · Ich habe einen Termin.",
  intro: {
    speaker: { person: "mb", initials: "MB" },
    target: "Morgen um zehn haben Sie einen Termin.",
    native:
      "Your calendar is filling up. Today: the days of the week, and the word order for “tomorrow at ten I have …”.",
  },
  phrases: [
    "am Montag",
    "heute",
    "morgen",
    "Ich habe einen Termin.",
    "Ich habe keine Zeit.",
  ],
  vocabulary: [
    {
      article: "der",
      word: "Termin",
      native: "appointment, meeting slot",
      example: {
        target: "Ich habe einen Termin.",
        native: "I have an appointment.",
      },
    },
    {
      article: "der",
      word: "Montag",
      native: "Monday",
      example: {
        target: "Am Montag haben wir die Planung.",
        native: "On Monday we have planning.",
      },
    },
    {
      word: "heute",
      native: "today",
      example: {
        target: "Heute habe ich keine Zeit.",
        native: "I don’t have time today.",
      },
    },
    {
      word: "morgen",
      native: "tomorrow",
      example: {
        target: "Morgen um zehn?",
        native: "Tomorrow at ten?",
      },
    },
    {
      article: "die",
      word: "Zeit",
      native: "time",
      example: {
        target: "Hast du morgen Zeit?",
        native: "Do you have time tomorrow?",
      },
    },
  ],
  practised: [
    "am Montag",
    "heute",
    "morgen",
    "Ich habe einen Termin.",
    "Ich habe keine Zeit.",
  ],
  canDo: [
    "Name the days from Monday to Friday",
    "Say you have an appointment, today, tomorrow or on a day",
    "Keep the verb second after a time word",
  ],
  exercises: [
    {
      type: "discover",
      kind: "New phrases",
      title: "Your first week’s calendar",
      sub: "Play each line. Notice where the verb goes when a time comes first.",
      lines: [
        {
          speaker: { person: "mb", initials: "MB", label: "Mia · reception" },
          target: "Morgen um zehn haben Sie einen Termin.",
          native: "Tomorrow at ten you have an appointment.",
          note: "Morgen um zehn comes first, so the verb haben comes second, then Sie.",
          saveKey: "C4a",
          topic: "Appointments",
          example: {
            target: "Ich habe einen Termin.",
            native: "I have an appointment.",
          },
        },
        {
          speaker: { person: "lf", initials: "LF", label: "Lena" },
          target: "Am Montag haben wir die Planung.",
          native: "On Monday we have planning.",
          note: "am + day: am Montag, am Dienstag. Like “on Monday”.",
          saveKey: "C4b",
          topic: "Appointments",
          example: { target: "am Montag", native: "on Monday" },
        },
        {
          speaker: { person: "jk", initials: "JK", label: "Jonas" },
          target: "Heute habe ich keine Zeit. Morgen?",
          native: "I don’t have time today. Tomorrow?",
          note: "heute is today, morgen is tomorrow. keine Zeit: no time.",
          saveKey: "C4c",
          topic: "Appointments",
          example: {
            target: "Heute habe ich keine Zeit.",
            native: "I don’t have time today.",
          },
        },
        {
          speaker: { person: "ao", initials: "AÖ", label: "Aylin" },
          target: "Das Review ist am Donnerstag um zwei.",
          native: "The review is on Thursday at two.",
          note: "Day first, then time: am Donnerstag um zwei.",
        },
      ],
    },
    {
      type: "tip",
      kind: "Good to know",
      title: "Days, and the verb in second place",
      sub: "Every day ends in -tag, except Wednesday, the middle of the week.",
      columns: ["Day", "German", "On …"],
      rows: [
        ["Monday", "Montag", "am Montag"],
        ["Tuesday", "Dienstag", "am Dienstag"],
        ["Wednesday", "Mittwoch", "am Mittwoch"],
        ["Thursday", "Donnerstag", "am Donnerstag"],
        ["Friday", "Freitag", "am Freitag"],
        ["Weekend", "Wochenende", "am Wochenende"],
      ],
      examples: [
        {
          target: "Ich habe morgen einen Termin.",
          native: "I have an appointment tomorrow.",
        },
        {
          target: "Morgen habe ich einen Termin.",
          native: "Tomorrow I have an appointment.",
        },
      ],
      note: "Both examples are right. The verb is always in second place: put Morgen first and ich moves behind the verb. Never Morgen ich habe …",
    },
    {
      type: "choice",
      variant: "listening",
      kind: "Listen",
      prompt: "Mia tells you about an appointment. When is it?",
      optionsLanguage: "native",
      options: ["Wednesday at 3", "Monday at 3", "Wednesday at 2"],
      correct: 0,
      alternatives: [],
      feedback: {
        right: "am Mittwoch um drei: Wednesday at three.",
        alternative: {},
        wrong: {
          "1": "Montag is Monday. Mia said Mittwoch, the middle of the week: Wednesday.",
          "2": "zwei is two. Mia said um drei: at three.",
        },
      },
      topic: "Appointments",
      listening: {
        clip: "Der Termin ist am Mittwoch um drei.",
        translation: "The appointment is on Wednesday at three.",
        meta: "0:03 · Mia",
      },
    },
    {
      type: "choice",
      variant: "multiple-choice",
      kind: "Choose the answer",
      prompt: "Which sentence is right?",
      optionsLanguage: "target",
      options: [
        "Morgen habe ich einen Termin.",
        "Morgen ich habe einen Termin.",
        "Morgen einen Termin ich habe.",
      ],
      correct: 0,
      alternatives: [],
      feedback: {
        right: "Morgen first, the verb habe second, then ich.",
        alternative: {},
        wrong: {
          "1": "Close, and it’s how English does it. In German the verb stays second: Morgen habe ich …",
          "2": "The verb goes second, right after Morgen: Morgen habe ich einen Termin.",
        },
      },
      topic: "Appointments",
    },
    {
      type: "choice",
      variant: "fill",
      kind: "Fill in the blank",
      prompt: "Jonas has no time today",
      optionsLanguage: "target",
      options: ["Heute", "Morgen", "Montag"],
      correct: 0,
      alternatives: [],
      feedback: {
        right: "Heute habe ich keine Zeit: I don’t have time today.",
        alternative: {},
        wrong: {
          "1": "Morgen is tomorrow. Today is heute.",
          "2": "A day needs am: am Montag. And Jonas means today: Heute.",
        },
      },
      topic: "Appointments",
      fill: { before: "", after: "habe ich keine Zeit." },
    },
    {
      type: "build",
      kind: "Build the sentence",
      prompt: "Tell Lena about Friday",
      sub: "On Friday I have an appointment.",
      tiles: ["Am", "Freitag", "habe", "ich", "einen", "Termin.", "bin"],
      answer: [0, 1, 2, 3, 4, 5],
      feedback: {
        right: "Am Freitag, then the verb habe, then ich. Verb second.",
        wrong:
          "Start with Am Freitag, then the verb, then ich: Am Freitag habe ich einen Termin.",
      },
      topic: "Appointments",
    },
    {
      type: "match",
      kind: "Match the meaning",
      prompt: "Match each day with its English name",
      sub: "Dienstag and Donnerstag are the ones people mix up.",
      pairs: [
        { phrase: "Montag", meaning: "Monday" },
        { phrase: "Dienstag", meaning: "Tuesday" },
        { phrase: "Mittwoch", meaning: "Wednesday" },
        { phrase: "Donnerstag", meaning: "Thursday" },
      ],
      meaningOrder: ["Thursday", "Monday", "Wednesday", "Tuesday"],
      labels: {
        phrases: "Days",
        meanings: "In English",
        empty: "Choose a day",
        joiner: " is ",
      },
      meaningsLanguage: "native",
      explanation:
        "Donnerstag is Thursday: Donner means thunder, like Thor’s day. Dienstag is Tuesday.",
      topic: "Appointments",
    },
    {
      type: "translate",
      kind: "Translate",
      prompt: "Jonas sends a message. What does it say?",
      source: "Am Donnerstag habe ich keine Zeit.",
      accept: [
        "I don’t have time on Thursday.",
        "I have no time on Thursday.",
        "On Thursday I don’t have time.",
        "On Thursday I have no time.",
        "I don’t have any time on Thursday.",
        "I’m busy on Thursday.",
        "I’m not free on Thursday.",
      ],
      feedback: {
        right: "keine Zeit is no time, and am Donnerstag is on Thursday.",
        wrong:
          "Am Donnerstag is on Thursday and keine Zeit is no time: I don’t have time on Thursday.",
      },
      topic: "Appointments",
    },
    {
      type: "conversation",
      kind: "Finding a slot",
      prompt: "Your calendar fills up",
      sub: "Answer with a day or a time, and keep the verb second.",
      turns: [
        {
          speaker: { person: "mb", initials: "MB", label: "Mia · reception" },
          line: "Frau Wagner fragt: Haben Sie am Montag Zeit?",
          translation: "Ms Wagner asks: do you have time on Monday?",
          task: "Say yes, you have time on Monday",
          options: [
            {
              target: "Ja, am Montag habe ich Zeit.",
              native: "Yes, on Monday I have time.",
            },
            {
              target: "Ja, am Montag ich habe Zeit.",
              native: "Yes, on Monday I have time.",
            },
            {
              target: "Ja, am Mittwoch habe ich Zeit.",
              native: "Yes, on Wednesday I have time.",
            },
          ],
          correct: 0,
          alternatives: [],
          feedback: {
            right: "am Montag first, then habe: the verb stays second.",
            alternative: {},
            wrong: {
              "1": "After am Montag the verb comes next: am Montag habe ich Zeit.",
              "2": "Mittwoch is Wednesday. She asked about Montag.",
            },
          },
        },
        {
          speaker: { person: "mb", initials: "MB", label: "Mia · reception" },
          line: "Um zehn oder um elf?",
          translation: "At ten or at eleven?",
          task: "Choose eleven",
          options: [
            { target: "Um elf, bitte.", native: "At eleven, please." },
            { target: "Es ist elf Uhr.", native: "It’s eleven o’clock." },
            { target: "Um zwölf, bitte.", native: "At twelve, please." },
          ],
          correct: 0,
          alternatives: [],
          feedback: {
            right: "Um elf, bitte: short and polite.",
            alternative: {},
            wrong: {
              "1": "Es ist elf Uhr tells the time now. Mia asked when: Um elf, bitte.",
              "2": "zwölf is twelve. Choose eleven: Um elf, bitte.",
            },
          },
        },
        {
          speaker: {
            person: "jk",
            initials: "JK",
            label: "Jonas · team table",
          },
          line: "Hast du morgen Zeit für Pair-Programming?",
          translation: "Do you have time for pair programming tomorrow?",
          task: "You have an appointment tomorrow. Say so.",
          options: [
            {
              target: "Morgen habe ich einen Termin.",
              native: "Tomorrow I have an appointment.",
            },
            {
              target: "Morgen ich habe einen Termin.",
              native: "Tomorrow I have an appointment.",
            },
            {
              target: "Heute habe ich einen Termin.",
              native: "Today I have an appointment.",
            },
          ],
          correct: 0,
          alternatives: [],
          feedback: {
            right: "Morgen habe ich einen Termin. Verb second, every time.",
            alternative: {},
            wrong: {
              "1": "After Morgen comes the verb: Morgen habe ich einen Termin.",
              "2": "heute is today. Jonas asked about tomorrow: Morgen habe ich …",
            },
          },
        },
      ],
      closing: {
        speaker: { person: "jk", initials: "JK", label: "Jonas" },
        target: "Kein Problem. Dann am Mittwoch!",
        native: "No problem. Wednesday, then!",
      },
      topic: "Appointments",
    },
    {
      type: "speak",
      kind: "Say it",
      prompt: "Tell Jonas you have an appointment on Monday",
      target: "Am Montag habe ich einen Termin.",
      native: "On Monday I have an appointment.",
      accept: ["Ich habe am Montag einen Termin."],
      feedback: {
        right: "Am Montag habe ich einen Termin: verb second.",
        wrong:
          "Am Montag, then habe ich, then einen Termin. Play it slowly and say it along.",
      },
      topic: "Appointments",
    },
  ],
}
