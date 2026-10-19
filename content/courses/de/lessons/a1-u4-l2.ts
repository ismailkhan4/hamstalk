import type { Lesson } from "@/features/lessons/schema"

/** Unit 4 · Lesson 2: Wie spät ist es?. Written for this app. */
export const lesson2: Lesson = {
  id: "a1-u4-l2",
  kind: "lesson",
  title: "Wie spät ist es?",
  titleInTarget: true,
  titleEn: "What time is it?",
  goal: "Ask the time, tell it, and say when something starts",
  minutes: 8,
  xp: 30,
  focus: "Wie spät ist es? · halb zehn · um zehn",
  intro: {
    speaker: { person: "lf", initials: "LF" },
    target: "Das Stand-up ist um halb zehn.",
    native:
      "Half past nine, or half to ten? German counts halves towards the next hour, and every new colleague gets caught by it once.",
  },
  phrases: ["Wie spät ist es?", "Es ist neun Uhr.", "halb zehn", "um zehn"],
  vocabulary: [
    {
      word: "Wie spät ist es?",
      native: "what time is it?",
      example: {
        target: "Entschuldigung, wie spät ist es?",
        native: "Excuse me, what time is it?",
      },
    },
    {
      article: "die",
      word: "Uhr",
      native: "o’clock; clock",
      example: { target: "Es ist neun Uhr.", native: "It’s nine o’clock." },
    },
    {
      word: "halb",
      native: "half (to the next hour)",
      example: { target: "halb zehn", native: "9:30 (half to ten)" },
    },
    {
      article: "das",
      word: "Viertel",
      native: "quarter",
      example: { target: "Viertel nach neun", native: "quarter past nine" },
    },
    {
      word: "um",
      native: "at (a time)",
      example: {
        target: "Das Meeting ist um zehn.",
        native: "The meeting is at ten.",
      },
    },
  ],
  practised: ["Wie spät ist es?", "Es ist neun Uhr.", "halb zehn", "um zehn"],
  canDo: [
    "Ask what time it is",
    "Say the time on the hour, at quarter past, half past and quarter to",
    "Say when a meeting starts with um",
  ],
  exercises: [
    {
      type: "discover",
      kind: "New phrases",
      title: "Clock-watching on the team",
      sub: "Play each line. Listen for halb: it points to the next hour.",
      lines: [
        {
          speaker: { person: "jk", initials: "JK", label: "Jonas" },
          target: "Wie spät ist es?",
          native: "What time is it?",
          note: "Literally “how late is it?”. The usual way to ask the time.",
          saveKey: "T4a",
          topic: "Time",
          example: {
            target: "Entschuldigung, wie spät ist es?",
            native: "Excuse me, what time is it?",
          },
        },
        {
          speaker: { person: "ao", initials: "AÖ", label: "Aylin" },
          target: "Es ist neun Uhr.",
          native: "It’s nine o’clock.",
          note: "Es ist … Uhr for the full hour.",
          saveKey: "T4b",
          topic: "Time",
          example: { target: "Es ist zehn Uhr.", native: "It’s ten o’clock." },
        },
        {
          speaker: { person: "lf", initials: "LF", label: "Lena" },
          target: "Das Stand-up ist um halb zehn.",
          native: "The stand-up is at half past nine.",
          note: "halb zehn is half-way to ten: 9:30, not 10:30. And um says when something happens.",
          saveKey: "T4c",
          topic: "Time",
          example: {
            target: "um halb zehn",
            native: "at 9:30",
          },
        },
        {
          speaker: { person: "mb", initials: "MB", label: "Mia" },
          target: "Es ist Viertel nach neun.",
          native: "It’s quarter past nine.",
          note: "Viertel nach is quarter past, Viertel vor is quarter to. These two work like English.",
        },
      ],
    },
    {
      type: "tip",
      kind: "Good to know",
      title: "Telling the time",
      sub: "Quarters work like English. Halves look ahead to the next hour.",
      columns: ["Time", "German"],
      rows: [
        ["9:00", "neun Uhr"],
        ["9:15", "Viertel nach neun"],
        ["9:30", "halb zehn"],
        ["9:45", "Viertel vor zehn"],
        ["at 9:30", "um halb zehn"],
      ],
      examples: [
        { target: "Es ist halb zehn.", native: "It’s half past nine." },
        {
          target: "Das Meeting ist um zehn.",
          native: "The meeting is at ten.",
        },
      ],
      note: "Calendars and train stations use the 24-hour clock: neun Uhr dreißig, vierzehn Uhr. In conversation, people say halb zehn.",
    },
    {
      type: "choice",
      variant: "listening",
      kind: "Listen",
      prompt: "Lena tells you when the stand-up is. What time is it?",
      optionsLanguage: "native",
      options: ["9:30", "10:30", "10:00"],
      correct: 0,
      alternatives: [],
      feedback: {
        right: "halb zehn is half-way to ten: 9:30.",
        alternative: {},
        wrong: {
          "1": "That’s the classic trap! 10:30 would be halb elf. halb zehn is half-way to ten: 9:30.",
          "2": "10:00 would be zehn Uhr. She said halb zehn: 9:30.",
        },
      },
      topic: "Time",
      listening: {
        clip: "Das Stand-up ist um halb zehn.",
        translation: "The stand-up is at half past nine.",
        meta: "0:02 · Lena",
      },
    },
    {
      type: "choice",
      variant: "multiple-choice",
      kind: "Choose the answer",
      prompt: "Jonas asks the time. It’s 10:15. What do you say?",
      optionsLanguage: "target",
      options: [
        "Es ist Viertel nach zehn.",
        "Es ist Viertel vor zehn.",
        "Es ist halb zehn.",
      ],
      correct: 0,
      alternatives: [],
      feedback: {
        right: "Viertel nach zehn: quarter past ten.",
        alternative: {},
        wrong: {
          "1": "Viertel vor zehn is quarter to ten, 9:45. For 10:15, say Viertel nach zehn.",
          "2": "halb zehn is 9:30. For 10:15, say Viertel nach zehn.",
        },
      },
      topic: "Time",
    },
    {
      type: "choice",
      variant: "fill",
      kind: "Fill in the blank",
      prompt: "Ask Aylin what time it is",
      optionsLanguage: "target",
      options: ["spät", "Uhr", "halb"],
      correct: 0,
      alternatives: [],
      feedback: {
        right: "Wie spät ist es? asks the time.",
        alternative: {},
        wrong: {
          "1": "Uhr goes in Wie viel Uhr ist es?, which also works. With Wie alone, ask Wie spät ist es?",
          "2": "halb is part of a time, like halb zehn. To ask the time: Wie spät ist es?",
        },
      },
      topic: "Time",
      fill: { before: "Wie", after: "ist es?" },
    },
    {
      type: "build",
      kind: "Build the sentence",
      prompt: "Tell the team when the meeting starts",
      sub: "The meeting is at ten.",
      tiles: ["Das", "Meeting", "ist", "um", "zehn.", "halb"],
      answer: [0, 1, 2, 3, 4],
      feedback: {
        right: "Das Meeting ist um zehn. um says when.",
        wrong: "Ten o’clock sharp, so no halb: Das Meeting ist um zehn.",
      },
      topic: "Time",
    },
    {
      type: "match",
      kind: "Match the meaning",
      prompt: "Match each time with the clock",
      sub: "Choose a time, then the clock.",
      pairs: [
        { phrase: "neun Uhr", meaning: "9:00" },
        { phrase: "halb zehn", meaning: "9:30" },
        { phrase: "Viertel nach neun", meaning: "9:15" },
        { phrase: "Viertel vor zehn", meaning: "9:45" },
      ],
      meaningOrder: ["9:30", "9:45", "9:00", "9:15"],
      labels: {
        phrases: "Times",
        meanings: "Clock",
        empty: "Choose the clock",
        joiner: " is ",
      },
      meaningsLanguage: "native",
      explanation:
        "halb looks ahead (halb zehn is 9:30), while Viertel nach and Viertel vor work like quarter past and quarter to.",
      topic: "Time",
    },
    {
      type: "translate",
      kind: "Translate",
      prompt: "A message from Lena. What does it say?",
      source: "Die Mittagspause ist um halb eins.",
      accept: [
        "The lunch break is at half past twelve.",
        "The lunch break is at 12:30.",
        "The lunch break is at twelve thirty.",
        "Lunch is at half past twelve.",
        "Lunch is at 12:30.",
        "Lunch is at twelve thirty.",
        "The lunch break is at half past 12.",
      ],
      feedback: {
        right:
          "halb eins is half-way to one: 12:30. Die Mittagspause is the lunch break.",
        wrong:
          "halb eins is half-way to one, so 12:30: The lunch break is at half past twelve.",
      },
      topic: "Time",
    },
    {
      type: "conversation",
      kind: "A morning of times",
      prompt: "Coffee, meetings and the clock",
      sub: "Three colleagues, three times.",
      turns: [
        {
          speaker: {
            person: "jk",
            initials: "JK",
            label: "Jonas · team table",
          },
          line: "Wie spät ist es?",
          translation: "What time is it?",
          task: "It’s exactly 9:30. Tell him.",
          options: [
            { target: "Es ist halb zehn.", native: "It’s half past nine." },
            { target: "Es ist halb neun.", native: "It’s half past eight." },
            { target: "Es ist neun Uhr.", native: "It’s nine o’clock." },
          ],
          correct: 0,
          alternatives: [],
          feedback: {
            right: "halb zehn: half-way to ten. Time for the stand-up!",
            alternative: {},
            wrong: {
              "1": "halb neun is 8:30, half-way to nine. For 9:30, say halb zehn.",
              "2": "neun Uhr is 9:00. For 9:30, say halb zehn.",
            },
          },
        },
        {
          speaker: { person: "lf", initials: "LF", label: "Lena · calendar" },
          line: "Das Meeting ist um zehn, oder?",
          translation: "The meeting is at ten, right?",
          task: "It’s actually at 10:30. Correct her.",
          options: [
            { target: "Nein, um halb elf.", native: "No, at half past ten." },
            { target: "Nein, um halb zehn.", native: "No, at half past nine." },
            { target: "Ja, um zehn.", native: "Yes, at ten." },
          ],
          correct: 0,
          alternatives: [],
          feedback: {
            right: "halb elf is half-way to eleven: 10:30.",
            alternative: {},
            wrong: {
              "1": "halb zehn is 9:30. For 10:30, look ahead to eleven: halb elf.",
              "2": "The meeting is at 10:30, not ten. Say Nein, um halb elf.",
            },
          },
        },
        {
          speaker: { person: "ao", initials: "AÖ", label: "Aylin · kitchen" },
          line: "Kaffee um Viertel vor elf?",
          translation: "Coffee at quarter to eleven?",
          task: "Say yes and repeat the time",
          options: [
            {
              target: "Ja, gern! Um Viertel vor elf.",
              native: "Yes, gladly! At quarter to eleven.",
            },
            {
              target: "Ja, gern! Um Viertel nach elf.",
              native: "Yes, gladly! At quarter past eleven.",
            },
            {
              target: "Es ist Viertel vor elf.",
              native: "It’s quarter to eleven.",
            },
          ],
          correct: 0,
          alternatives: [],
          feedback: {
            right: "Ja, gern! and the time back: a friendly yes.",
            alternative: {},
            wrong: {
              "1": "Viertel nach is quarter past. Aylin said Viertel vor elf, 10:45.",
              "2": "That tells the time. Aylin asked about coffee: Ja, gern! Um Viertel vor elf.",
            },
          },
        },
      ],
      closing: {
        speaker: { person: "ao", initials: "AÖ", label: "Aylin" },
        target: "Super, bis dann!",
        native: "Great, see you then!",
      },
      topic: "Time",
    },
    {
      type: "speak",
      kind: "Say it",
      prompt: "Remind the team when the stand-up is",
      target: "Das Stand-up ist um halb zehn.",
      native: "The stand-up is at half past nine.",
      speaker: "lf",
      accept: ["Das Standup ist um halb zehn."],
      feedback: {
        right: "um halb zehn: at 9:30.",
        wrong:
          "Say each part: Das Stand-up ist, um, halb zehn. Play it slowly first.",
      },
      topic: "Time",
    },
  ],
}
