import type { Lesson } from "@/features/lessons/schema"

/** Unit 4 · Lesson 1: Zahlen 0 bis 100. Written for this app. */
export const lesson1: Lesson = {
  id: "a1-u4-l1",
  kind: "lesson",
  title: "Zahlen 0 bis 100",
  titleInTarget: true,
  titleEn: "Numbers 0 to 100",
  goal: "Count to 100 and catch ticket and room numbers",
  minutes: 8,
  xp: 30,
  focus: "zwölf · zwanzig · zweiundvierzig",
  intro: {
    speaker: { person: "jk", initials: "JK" },
    target: "Ticket zweiundvierzig, Raum vierzehn …",
    native:
      "Day two. Tickets, rooms and teams all come with numbers, and German builds them its own way: the ones come first.",
  },
  phrases: ["zwölf", "zwanzig", "zweiundvierzig", "Nummer vierzehn"],
  vocabulary: [
    {
      word: "zwölf",
      native: "twelve",
      example: {
        target: "Wir sind zwölf im Team.",
        native: "There are twelve of us on the team.",
      },
    },
    {
      word: "zwanzig",
      native: "twenty",
      example: {
        target: "Ich brauche zwanzig Minuten.",
        native: "I need twenty minutes.",
      },
    },
    {
      word: "dreißig",
      native: "thirty",
      example: {
        target: "Das Meeting dauert dreißig Minuten.",
        native: "The meeting takes thirty minutes.",
      },
    },
    {
      word: "zweiundvierzig",
      native: "forty-two (two-and-forty)",
      example: {
        target: "Ticket zweiundvierzig ist fertig.",
        native: "Ticket 42 is done.",
      },
    },
    {
      word: "hundert",
      native: "a hundred",
      example: { target: "Raum hundert", native: "Room 100" },
    },
    {
      article: "die",
      word: "Nummer",
      native: "number",
      example: {
        target: "Ihr Raum ist Nummer vierzehn.",
        native: "Your room is number fourteen.",
      },
    },
  ],
  practised: ["zwölf", "zwanzig", "zweiundvierzig", "Nummer vierzehn"],
  canDo: [
    "Count from 0 to 100",
    "Catch a ticket or room number when someone says it",
    "Say how many people are on your team",
  ],
  exercises: [
    {
      type: "discover",
      kind: "New words",
      title: "Numbers on day two",
      sub: "Play each line. Listen for where the number sits, and how 42 is built.",
      lines: [
        {
          speaker: { person: "mb", initials: "MB", label: "Mia · reception" },
          target: "Ihr Raum ist Nummer vierzehn.",
          native: "Your room is number fourteen.",
          note: "vierzehn is vier + zehn: four and ten. 13 to 19 all work like this.",
          saveKey: "N4a",
          topic: "Numbers",
          example: { target: "Raum vierzehn", native: "Room 14" },
        },
        {
          speaker: { person: "jk", initials: "JK", label: "Jonas" },
          target: "Schau mal: Ticket zweiundvierzig.",
          native: "Have a look: ticket forty-two.",
          note: "zwei-und-vierzig: two-and-forty. In German the ones come before the tens.",
          saveKey: "N4b",
          topic: "Numbers",
          example: { target: "Ticket zweiundvierzig", native: "Ticket 42" },
        },
        {
          speaker: { person: "lf", initials: "LF", label: "Lena" },
          target: "Wir sind zwölf im Team.",
          native: "There are twelve of us on the team.",
          note: "zwölf, like elf (11), is one to learn by heart.",
          saveKey: "N4c",
          topic: "Numbers",
          example: {
            target: "Wir sind zwölf.",
            native: "There are twelve of us.",
          },
        },
        {
          speaker: { person: "ao", initials: "AÖ", label: "Aylin" },
          target: "Ich brauche zwanzig Minuten.",
          native: "I need twenty minutes.",
          note: "The tens end in -zig: zwanzig, vierzig, fünfzig. Only 30 is different: dreißig.",
        },
      ],
    },
    {
      type: "tip",
      kind: "Good to know",
      title: "How German builds numbers",
      sub: "Learn 0 to 12, and the rest follows a pattern.",
      columns: ["Pattern", "Examples"],
      rows: [
        ["0 to 12: learn by heart", "null, eins, zwei … zehn, elf, zwölf"],
        ["13 to 19: number + zehn", "dreizehn, vierzehn, sechzehn"],
        ["Tens: number + zig", "zwanzig, vierzig, fünfzig"],
        ["21 to 99: ones + und + tens", "einundzwanzig, zweiundvierzig"],
        ["100", "hundert"],
      ],
      examples: [
        {
          target: "Ticket zweiundvierzig",
          native: "Ticket 42: two-and-forty",
        },
        {
          target: "Wir sind zwölf im Team.",
          native: "There are twelve of us on the team.",
        },
      ],
      note: "Three traps: 30 is dreißig, with ß, not -zig. 16 and 17 drop letters: sechzehn, siebzehn. And 21 starts with ein, not eins: einundzwanzig.",
    },
    {
      type: "choice",
      variant: "listening",
      kind: "Listen",
      prompt: "Jonas mentions a ticket. Which number is it?",
      optionsLanguage: "native",
      options: ["42", "24", "32"],
      correct: 0,
      alternatives: [],
      feedback: {
        right: "zwei-und-vierzig: two-and-forty, so 42. The ones come first.",
        alternative: {},
        wrong: {
          "1": "24 would be vierundzwanzig. Jonas said zwei-und-vierzig: the ones come first, so it’s 42.",
          "2": "32 would be zweiunddreißig. Listen to the end: vierzig is forty, so 42.",
        },
      },
      topic: "Numbers",
      listening: {
        clip: "Ticket zweiundvierzig ist fertig.",
        translation: "Ticket 42 is done.",
        meta: "0:02 · Jonas",
      },
    },
    {
      type: "choice",
      variant: "multiple-choice",
      kind: "Choose the answer",
      prompt: "Aylin needs 16 minutes. How do you say 16?",
      optionsLanguage: "target",
      options: ["sechzehn", "sechszehn", "sechzig"],
      correct: 0,
      alternatives: [],
      feedback: {
        right: "sechzehn: sechs drops its s before zehn.",
        alternative: {},
        wrong: {
          "1": "Close! 16 drops the s: sechzehn, not sechszehn.",
          "2": "sechzig is 60. For 16, add zehn: sechzehn.",
        },
      },
      topic: "Numbers",
    },
    {
      type: "choice",
      variant: "fill",
      kind: "Fill in the blank",
      prompt: "Lena counts the team. There are 12 of you.",
      optionsLanguage: "target",
      options: ["zwölf", "zwanzig", "zehn"],
      correct: 0,
      alternatives: [],
      feedback: {
        right: "Wir sind zwölf im Team: there are twelve of us.",
        alternative: {},
        wrong: {
          "1": "zwanzig is 20. Twelve is zwölf.",
          "2": "zehn is 10. Twelve is zwölf, one of the numbers to learn by heart.",
        },
      },
      topic: "Numbers",
      fill: { before: "Wir sind", after: "im Team." },
    },
    {
      type: "build",
      kind: "Build the sentence",
      prompt: "Tell Jonas which ticket you’re on",
      sub: "This is ticket 35.",
      tiles: ["Ticket", "fünfunddreißig.", "Das", "ist", "dreiundfünfzig."],
      answer: [2, 3, 0, 1],
      feedback: {
        right: "Das ist Ticket fünfunddreißig: five-and-thirty, ones first.",
        wrong:
          "35 is fünfunddreißig, ones first. dreiundfünfzig would be 53. Das ist Ticket fünfunddreißig.",
      },
      topic: "Numbers",
    },
    {
      type: "match",
      kind: "Match the meaning",
      prompt: "Match each number with its digits",
      sub: "Choose a number, then its digits.",
      pairs: [
        { phrase: "dreizehn", meaning: "13" },
        { phrase: "dreißig", meaning: "30" },
        { phrase: "dreiunddreißig", meaning: "33" },
        { phrase: "hundert", meaning: "100" },
      ],
      meaningOrder: ["30", "100", "13", "33"],
      labels: {
        phrases: "Numbers",
        meanings: "Digits",
        empty: "Choose the digits",
        joiner: " is ",
      },
      meaningsLanguage: "native",
      explanation:
        "-zehn adds ten (dreizehn, 13), dreißig is the one ten without -zig (30), and und joins ones to tens (dreiunddreißig, 33).",
      topic: "Numbers",
    },
    {
      type: "translate",
      kind: "Translate",
      prompt: "Mia left you a note. What does it say?",
      source: "Mein Büro ist Raum siebzehn.",
      accept: [
        "My office is room seventeen.",
        "My office is room 17.",
        "My office is room number seventeen.",
        "My office is room number 17.",
      ],
      feedback: {
        right: "siebzehn is 17: sieben drops its -en before zehn.",
        wrong:
          "Mein Büro ist Raum siebzehn: my office is room 17. siebzehn is sieben + zehn, with the -en dropped.",
      },
      topic: "Numbers",
    },
    {
      type: "conversation",
      kind: "Numbers on day two",
      prompt: "Rooms, tickets and the team",
      sub: "Listen for the number, then answer.",
      turns: [
        {
          speaker: { person: "mb", initials: "MB", label: "Mia · reception" },
          line: "Ihr Raum ist Nummer vierzehn.",
          translation: "Your room is number fourteen.",
          task: "Repeat the number to check it",
          options: [
            { target: "Vierzehn? Danke!", native: "Fourteen? Thanks!" },
            { target: "Vierzig? Danke!", native: "Forty? Thanks!" },
            { target: "Vier? Danke!", native: "Four? Thanks!" },
          ],
          correct: 0,
          alternatives: [],
          feedback: {
            right: "vierzehn, 14: repeating a number back is a good habit.",
            alternative: {},
            wrong: {
              "1": "vierzig is 40. Mia said vierzehn: vier + zehn, 14.",
              "2": "vier is 4. Mia said vierzehn: vier + zehn, 14.",
            },
          },
        },
        {
          speaker: {
            person: "jk",
            initials: "JK",
            label: "Jonas · team table",
          },
          line: "Du machst Ticket zweiundvierzig, oder?",
          translation: "You’re doing ticket 42, right?",
          task: "Your ticket is 24. Correct him.",
          options: [
            {
              target: "Nein, Ticket vierundzwanzig.",
              native: "No, ticket 24.",
            },
            { target: "Ja, Ticket zweiundvierzig.", native: "Yes, ticket 42." },
            { target: "Nein, Ticket zwanzig.", native: "No, ticket 20." },
          ],
          correct: 0,
          alternatives: [],
          feedback: {
            right:
              "vierundzwanzig: four-and-twenty. Easy to swap with 42, so worth checking.",
            alternative: {},
            wrong: {
              "1": "Yours is 24, not 42. Four-and-twenty: vierundzwanzig.",
              "2": "zwanzig is 20. Yours is 24: vierundzwanzig.",
            },
          },
        },
        {
          speaker: { person: "lf", initials: "LF", label: "Lena · stand-up" },
          line: "Wie viele sind wir im Team?",
          translation: "How many of us are on the team?",
          task: "Say there are twelve of you",
          options: [
            { target: "Wir sind zwölf.", native: "There are twelve of us." },
            { target: "Ich bin zwölf.", native: "I’m twelve (years old)." },
            { target: "Wir sind zwanzig.", native: "There are twenty of us." },
          ],
          correct: 0,
          alternatives: [],
          feedback: {
            right: "Wir sind zwölf: there are twelve of us.",
            alternative: {},
            wrong: {
              "1": "Ich bin zwölf says you’re twelve years old! For the team, say Wir sind zwölf.",
              "2": "zwanzig is 20. The team is twelve: Wir sind zwölf.",
            },
          },
        },
      ],
      closing: {
        speaker: { person: "lf", initials: "LF", label: "Lena" },
        target: "Genau, zwölf. Und ab heute dreizehn!",
        native: "Exactly, twelve. And from today, thirteen!",
      },
      topic: "Numbers",
    },
    {
      type: "speak",
      kind: "Say it",
      prompt: "Tell Jonas you’re working on ticket 42",
      target: "Das ist Ticket zweiundvierzig.",
      native: "This is ticket 42.",
      speaker: "jk",
      accept: [],
      feedback: {
        right: "Zweiundvierzig: two-and-forty, ones first.",
        wrong: "Ones first: zwei-und-vierzig. Play it slowly and say it along.",
      },
      topic: "Numbers",
    },
  ],
}
