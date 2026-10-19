import type { Lesson } from "@/features/lessons/schema"

/** Unit 4 · Review: Plan your week with the team. Written for this app. */
export const review: Lesson = {
  id: "a1-u4-review",
  kind: "review",
  title: "Plan your week with the team",
  titleInTarget: false,
  titleEn: "",
  goal: "Book a meeting with Lena: catch numbers, give times and days, and swap phone numbers, using everything from Lessons 1 to 4.",
  minutes: 8,
  xp: 40,
  focus: "Lessons 1 to 4",
  intro: {
    speaker: { person: "lf", initials: "LF" },
    target: "Lass uns die Woche planen!",
    native:
      "Covers numbers, times, days and dates. Nothing new: only what you’ve learned in Unit 4. It isn’t a test; it shows what to practise next.",
  },
  phrases: [
    "Zahlen 0 bis 100",
    "Wie spät ist es?",
    "Termine",
    "Datum und Telefon",
  ],
  vocabulary: [],
  practised: [],
  canDo: [],
  exercises: [
    {
      type: "choice",
      variant: "listening",
      kind: "Listen",
      prompt: "Lena counts who’s coming to the planning. How many?",
      optionsLanguage: "native",
      options: ["14", "40", "4"],
      correct: 0,
      alternatives: [],
      feedback: {
        right: "vierzehn: vier + zehn, 14.",
        alternative: {},
        wrong: {
          "1": "40 would be vierzig. Lena said vierzehn: vier + zehn, 14.",
          "2": "4 would be vier. Listen for -zehn at the end: vierzehn, 14.",
        },
      },
      topic: "Numbers",
      revisits: 0,
      listening: {
        clip: "Wir sind vierzehn bei der Planung.",
        translation: "There are fourteen of us at the planning.",
        meta: "0:03 · Lena",
      },
    },
    {
      type: "match",
      kind: "Match the meaning",
      prompt: "Match each time with the clock",
      sub: "Times from across the week.",
      pairs: [
        { phrase: "halb elf", meaning: "10:30" },
        { phrase: "Viertel nach zwei", meaning: "2:15" },
        { phrase: "Viertel vor neun", meaning: "8:45" },
        { phrase: "zwölf Uhr", meaning: "12:00" },
      ],
      meaningOrder: ["8:45", "12:00", "10:30", "2:15"],
      labels: {
        phrases: "Times",
        meanings: "Clock",
        empty: "Choose the clock",
        joiner: " is ",
      },
      meaningsLanguage: "native",
      explanation:
        "halb looks ahead to the next hour (halb elf is 10:30). Viertel nach and Viertel vor work like English.",
      topic: "Time",
      revisits: 1,
    },
    {
      type: "choice",
      variant: "multiple-choice",
      kind: "Choose the answer",
      prompt: "Which sentence is right?",
      optionsLanguage: "target",
      options: [
        "Am Freitag habe ich keine Zeit.",
        "Am Freitag ich habe keine Zeit.",
        "Freitag am habe ich keine Zeit.",
      ],
      correct: 0,
      alternatives: [],
      feedback: {
        right: "Am Freitag first, then the verb habe. Verb second.",
        alternative: {},
        wrong: {
          "1": "After Am Freitag comes the verb: Am Freitag habe ich keine Zeit.",
          "2": "am goes before the day: Am Freitag habe ich keine Zeit.",
        },
      },
      topic: "Appointments",
      revisits: 2,
    },
    {
      type: "choice",
      variant: "fill",
      kind: "Fill in the blank",
      prompt: "Give Lena your number: 0173 25. Make the 2 clear.",
      optionsLanguage: "target",
      options: ["zwo", "zwölf", "zwanzig", "zwei"],
      correct: 0,
      alternatives: [3],
      feedback: {
        right: "zwo: the phone word for two, so it can’t be heard as drei.",
        alternative: {
          "3": "zwei is right too. On the phone, zwo is clearer.",
        },
        wrong: {
          "1": "zwölf is 12. Phone numbers go digit by digit: zwo, then fünf.",
          "2": "zwanzig is 20. Phone numbers go digit by digit: zwo, then fünf.",
        },
      },
      topic: "Phone",
      revisits: 3,
      fill: { before: "Null eins sieben drei,", after: "fünf." },
    },
    {
      type: "translate",
      kind: "Translate",
      prompt: "A calendar invite from Lena. What does it say?",
      source: "Das Meeting ist um halb drei.",
      accept: [
        "The meeting is at half past two.",
        "The meeting is at 2:30.",
        "The meeting is at two thirty.",
        "The meeting is at half past 2.",
        "The meeting is at 14:30.",
      ],
      feedback: {
        right: "halb drei is half-way to three: 2:30.",
        wrong:
          "halb drei looks ahead to three, so 2:30: The meeting is at half past two.",
      },
      topic: "Time",
      revisits: 1,
    },
    {
      type: "build",
      kind: "Build the sentence",
      prompt: "Tell Jonas about tomorrow",
      sub: "Tomorrow at ten I have an appointment.",
      tiles: ["Morgen", "um", "zehn", "habe", "ich", "einen", "Termin.", "bin"],
      answer: [0, 1, 2, 3, 4, 5, 6],
      feedback: {
        right: "Morgen um zehn takes first place, so habe comes second.",
        wrong:
          "The whole time goes first, then the verb: Morgen um zehn habe ich einen Termin.",
      },
      topic: "Appointments",
      revisits: 2,
    },
    {
      type: "choice",
      variant: "listening",
      kind: "Listen",
      prompt: "Aylin mentions the launch. When is it?",
      optionsLanguage: "native",
      options: ["20 June", "2 June", "12 June"],
      correct: 0,
      alternatives: [],
      feedback: {
        right: "am zwanzigsten Juni: the 20th of June.",
        alternative: {},
        wrong: {
          "1": "The 2nd would be am zweiten. Aylin said am zwanzigsten: the 20th.",
          "2": "The 12th would be am zwölften. Aylin said am zwanzigsten: the 20th.",
        },
      },
      topic: "Dates",
      revisits: 3,
      listening: {
        clip: "Der Launch ist am zwanzigsten Juni.",
        translation: "The launch is on the twentieth of June.",
        meta: "0:03 · Aylin",
      },
    },
    {
      type: "conversation",
      kind: "Planning with Lena",
      prompt: "Book your first planning meeting",
      sub: "Four questions, one from each lesson.",
      turns: [
        {
          speaker: { person: "lf", initials: "LF", label: "Lena · team table" },
          line: "Wie spät ist es?",
          translation: "What time is it?",
          task: "It’s 9:30",
          options: [
            { target: "Es ist halb zehn.", native: "It’s half past nine." },
            { target: "Es ist halb neun.", native: "It’s half past eight." },
            { target: "Es ist neun Uhr.", native: "It’s nine o’clock." },
          ],
          correct: 0,
          alternatives: [],
          feedback: {
            right: "halb zehn: half-way to ten.",
            alternative: {},
            wrong: {
              "1": "halb neun is 8:30. For 9:30, look ahead to ten: halb zehn.",
              "2": "neun Uhr is 9:00. For 9:30: halb zehn.",
            },
          },
          revisits: 1,
        },
        {
          speaker: { person: "lf", initials: "LF", label: "Lena · team table" },
          line: "Hast du am Donnerstag Zeit?",
          translation: "Do you have time on Thursday?",
          task: "Say yes, on Thursday you have time",
          options: [
            {
              target: "Ja, am Donnerstag habe ich Zeit.",
              native: "Yes, on Thursday I have time.",
            },
            {
              target: "Ja, am Dienstag habe ich Zeit.",
              native: "Yes, on Tuesday I have time.",
            },
            {
              target: "Ja, am Donnerstag ich habe Zeit.",
              native: "Yes, on Thursday I have time.",
            },
          ],
          correct: 0,
          alternatives: [],
          feedback: {
            right: "am Donnerstag, then habe: verb second.",
            alternative: {},
            wrong: {
              "1": "Dienstag is Tuesday. Lena asked about Donnerstag, Thursday.",
              "2": "After am Donnerstag comes the verb: am Donnerstag habe ich Zeit.",
            },
          },
          revisits: 2,
        },
        {
          speaker: { person: "lf", initials: "LF", label: "Lena · team table" },
          line: "Um elf oder um halb zwölf?",
          translation: "At eleven or at half past eleven?",
          task: "Choose 11:30",
          options: [
            {
              target: "Um halb zwölf, bitte.",
              native: "At half past eleven, please.",
            },
            {
              target: "Um halb elf, bitte.",
              native: "At half past ten, please.",
            },
            { target: "Um elf, bitte.", native: "At eleven, please." },
          ],
          correct: 0,
          alternatives: [],
          feedback: {
            right: "halb zwölf is half-way to twelve: 11:30.",
            alternative: {},
            wrong: {
              "1": "halb elf is 10:30. For 11:30, look ahead to twelve: halb zwölf.",
              "2": "elf is 11:00. For 11:30: um halb zwölf.",
            },
          },
          revisits: 1,
        },
        {
          speaker: { person: "lf", initials: "LF", label: "Lena · team table" },
          line: "Und wie ist deine Telefonnummer?",
          translation: "And what’s your phone number?",
          task: "Yours ends in 22",
          options: [
            {
              target: "Null eins sechs null, zwo zwo.",
              native: "0160, 2 2.",
            },
            {
              target: "Null eins sechs null, zweiundzwanzig.",
              native: "0160, 22.",
            },
            {
              target: "Null eins sechs null, zwölf.",
              native: "0160, 12.",
            },
          ],
          correct: 0,
          alternatives: [1],
          feedback: {
            right: "zwo zwo: digit by digit, the clearest on the phone.",
            alternative: {
              "1": "That works too. Many Germans read numbers in pairs: zweiundzwanzig.",
            },
            wrong: {
              "2": "zwölf is 12. Yours ends in 22: zwo zwo.",
            },
          },
          revisits: 3,
        },
      ],
      closing: {
        speaker: { person: "lf", initials: "LF", label: "Lena" },
        target: "Super. Dann Donnerstag um halb zwölf!",
        native: "Great. Thursday at half past eleven, then!",
      },
      topic: "Appointments",
    },
  ],
  revisitedLessons: [
    { lessonId: "a1-u4-l1", label: "Lesson 1", title: "Zahlen 0 bis 100" },
    { lessonId: "a1-u4-l2", label: "Lesson 2", title: "Wie spät ist es?" },
    { lessonId: "a1-u4-l3", label: "Lesson 3", title: "Termine" },
    { lessonId: "a1-u4-l4", label: "Lesson 4", title: "Datum und Telefon" },
  ],
}
