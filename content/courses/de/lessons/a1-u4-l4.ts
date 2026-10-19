import type { Lesson } from "@/features/lessons/schema"

/** Unit 4 · Lesson 4: Datum und Telefon. Written for this app. */
export const lesson4: Lesson = {
  id: "a1-u4-l4",
  kind: "lesson",
  title: "Datum und Telefon",
  titleInTarget: true,
  titleEn: "Dates and phone numbers",
  goal: "Say a date and give your phone number",
  minutes: 9,
  xp: 30,
  focus: "der erste · am dritten Mai · zwo · Telefonnummer",
  intro: {
    speaker: { person: "mb", initials: "FW" },
    target: "Wie ist Ihre Telefonnummer?",
    native:
      "Frau Wagner from HR has a form for you: a phone number, your first working day and your birthday. Time for dates.",
  },
  phrases: [
    "Heute ist der zwölfte Mai.",
    "am dritten Juni",
    "Wie ist deine Telefonnummer?",
    "zwo",
  ],
  vocabulary: [
    {
      article: "das",
      word: "Datum",
      native: "date",
      example: {
        target: "Welches Datum ist heute?",
        native: "What’s the date today?",
      },
    },
    {
      word: "der erste",
      native: "the first",
      example: {
        target: "Heute ist der erste Juni.",
        native: "Today is the first of June.",
      },
    },
    {
      word: "am dritten",
      native: "on the third",
      example: { target: "am dritten Mai", native: "on the third of May" },
    },
    {
      article: "die",
      word: "Telefonnummer",
      native: "phone number",
      example: {
        target: "Wie ist deine Telefonnummer?",
        native: "What’s your phone number?",
      },
    },
    {
      word: "zwo",
      native: "two (on the phone)",
      example: {
        target: "null eins fünf eins, zwo zwo",
        native: "0151 22",
      },
    },
  ],
  practised: [
    "Heute ist der zwölfte Mai.",
    "am dritten Juni",
    "Wie ist deine Telefonnummer?",
    "zwo",
  ],
  canDo: [
    "Say today’s date",
    "Say on which date something happens",
    "Give your phone number, digit by digit",
  ],
  exercises: [
    {
      type: "discover",
      kind: "New phrases",
      title: "Dates and numbers for HR",
      sub: "Play each line. Listen for the -te and -ste endings on dates.",
      lines: [
        {
          speaker: { person: "lf", initials: "LF", label: "Lena" },
          target: "Heute ist der zwölfte Mai.",
          native: "Today is the twelfth of May.",
          note: "Dates use the “-th” form: zwölf becomes der zwölfte.",
          saveKey: "D4a",
          topic: "Dates",
          example: {
            target: "Heute ist der erste Juni.",
            native: "Today is the first of June.",
          },
        },
        {
          speaker: { person: "ao", initials: "AÖ", label: "Aylin" },
          target: "Der Launch ist am zwanzigsten Juni.",
          native: "The launch is on the twentieth of June.",
          note: "From 20 the ending is -ste: zwanzigste. After am it gets an -n: am zwanzigsten.",
          saveKey: "D4b",
          topic: "Dates",
          example: { target: "am dritten Mai", native: "on the third of May" },
        },
        {
          speaker: { person: "mb", initials: "FW", label: "Frau Wagner · HR" },
          target: "Wie ist Ihre Telefonnummer?",
          native: "What’s your phone number?",
          note: "Ihre with Sie, for HR. To a teammate: Wie ist deine Telefonnummer?",
          saveKey: "D4c",
          topic: "Phone",
          example: {
            target: "Wie ist deine Telefonnummer?",
            native: "What’s your phone number? (to a teammate)",
          },
        },
        {
          speaker: { person: "jk", initials: "JK", label: "Jonas" },
          target: "Null eins fünf eins, zwo drei vier.",
          native: "0151, 2 3 4.",
          note: "On the phone, Germans say zwo for zwei, so it never sounds like drei.",
        },
      ],
    },
    {
      type: "tip",
      kind: "Good to know",
      title: "Dates: the first, the third, the twentieth",
      sub: "Add -te up to 19 and -ste from 20. After am, add an -n.",
      columns: ["Date", "Today is …", "On …"],
      rows: [
        ["1st", "der erste", "am ersten"],
        ["2nd", "der zweite", "am zweiten"],
        ["3rd", "der dritte", "am dritten"],
        ["12th", "der zwölfte", "am zwölften"],
        ["20th", "der zwanzigste", "am zwanzigsten"],
      ],
      examples: [
        {
          target: "Heute ist der dritte Mai.",
          native: "Today is the 3rd of May.",
        },
        {
          target: "Mein Geburtstag ist am siebten Juli.",
          native: "My birthday is on the 7th of July.",
        },
      ],
      note: "Three are special: erste, dritte and siebte. In writing it’s just a full stop after the number: am 3. Mai.",
    },
    {
      type: "choice",
      variant: "listening",
      kind: "Listen",
      prompt: "Jonas gives you his number. Which one is it?",
      optionsLanguage: "native",
      options: ["0173 254", "0173 354", "0137 254"],
      correct: 0,
      alternatives: [],
      feedback: {
        right: "zwo is two: 0173 254.",
        alternative: {},
        wrong: {
          "1": "zwo is 2, not 3. That’s exactly why people say it: 0173 254.",
          "2": "He said sieben drei, 7 then 3: 0173 254.",
        },
      },
      topic: "Phone",
      listening: {
        clip: "Meine Nummer ist null eins sieben drei, zwo fünf vier.",
        translation: "My number is 0173, 2 5 4.",
        meta: "0:04 · Jonas",
      },
    },
    {
      type: "choice",
      variant: "multiple-choice",
      kind: "Choose the answer",
      prompt: "It’s the 3rd. How do you say today’s date?",
      optionsLanguage: "target",
      options: [
        "Heute ist der dritte.",
        "Heute ist der dreite.",
        "Heute ist der drei.",
      ],
      correct: 0,
      alternatives: [],
      feedback: {
        right: "der dritte: one of the three special ones.",
        alternative: {},
        wrong: {
          "1": "Good guess from the rule, but 3rd is special: der dritte.",
          "2": "drei is the number. For a date, use the “-th” form: der dritte.",
        },
      },
      topic: "Dates",
    },
    {
      type: "choice",
      variant: "fill",
      kind: "Fill in the blank",
      prompt: "The launch is on 20 June",
      optionsLanguage: "target",
      options: ["zwanzigsten", "zwanzig", "zwanzigste"],
      correct: 0,
      alternatives: [],
      feedback: {
        right: "am zwanzigsten Juni: -ste for 20, plus -n after am.",
        alternative: {},
        wrong: {
          "1": "zwanzig is the number. For a date, use the “-th” form, with -n after am: am zwanzigsten.",
          "2": "Almost! After am the date takes an -n: am zwanzigsten.",
        },
      },
      topic: "Dates",
      fill: { before: "Der Launch ist am", after: "Juni." },
    },
    {
      type: "build",
      kind: "Build the sentence",
      prompt: "Ask Jonas for his number",
      sub: "What’s your phone number? (to a teammate)",
      tiles: ["Wie", "ist", "deine", "Telefonnummer?", "Ihre"],
      answer: [0, 1, 2, 3],
      feedback: {
        right: "deine for a teammate: Wie ist deine Telefonnummer?",
        wrong:
          "Jonas is a teammate, so deine, not Ihre: Wie ist deine Telefonnummer?",
      },
      topic: "Phone",
    },
    {
      type: "match",
      kind: "Match the meaning",
      prompt: "Match each phrase with its meaning",
      sub: "Choose a phrase, then what it means.",
      pairs: [
        { phrase: "der erste", meaning: "the first" },
        { phrase: "am dritten", meaning: "on the third" },
        { phrase: "zwo", meaning: "two, on the phone" },
        { phrase: "die Telefonnummer", meaning: "the phone number" },
      ],
      meaningOrder: [
        "two, on the phone",
        "the phone number",
        "on the third",
        "the first",
      ],
      labels: {
        phrases: "Phrases",
        meanings: "Meanings",
        empty: "Choose a meaning",
        joiner: " means ",
      },
      meaningsLanguage: "native",
      explanation:
        "der erste is a date, am dritten says when, and zwo is how two sounds on the phone.",
      topic: "Dates",
    },
    {
      type: "translate",
      kind: "Translate",
      prompt: "Lena adds a team birthday to the calendar. What does it say?",
      source: "Mein Geburtstag ist am siebten Juli.",
      accept: [
        "My birthday is on the seventh of July.",
        "My birthday is on 7 July.",
        "My birthday is on July 7.",
        "My birthday is on July 7th.",
        "My birthday is on the 7th of July.",
        "My birthday is on July seventh.",
        "My birthday is on 7th July.",
      ],
      feedback: {
        right:
          "am siebten Juli: on the seventh of July. siebte is one of the special ones.",
        wrong:
          "am siebten Juli is on the 7th of July: My birthday is on the seventh of July.",
      },
      topic: "Dates",
    },
    {
      type: "conversation",
      kind: "The HR form",
      prompt: "Frau Wagner fills in your details",
      sub: "She uses Sie. Answer with numbers and dates.",
      turns: [
        {
          speaker: { person: "mb", initials: "FW", label: "Frau Wagner · HR" },
          line: "Wie ist Ihre Telefonnummer?",
          translation: "What’s your phone number?",
          task: "Your number starts 0151 234",
          options: [
            {
              target: "Null eins fünf eins, zwo drei vier.",
              native: "0151, 2 3 4.",
            },
            {
              target: "Null eins fünf eins, drei zwo vier.",
              native: "0151, 3 2 4.",
            },
            { target: "Ich heiße %N.", native: "My name is %N." },
          ],
          correct: 0,
          alternatives: [],
          feedback: {
            right: "Digit by digit, with zwo for the 2.",
            alternative: {},
            wrong: {
              "1": "Two digits swapped: yours is zwo drei vier, 2 3 4.",
              "2": "She asked for your number, not your name.",
            },
          },
        },
        {
          speaker: { person: "mb", initials: "FW", label: "Frau Wagner · HR" },
          line: "Und Ihr erster Arbeitstag?",
          translation: "And your first working day?",
          task: "It was the 1st of June",
          options: [
            { target: "Der erste Juni.", native: "The first of June." },
            { target: "Der dritte Juni.", native: "The third of June." },
            { target: "Der erste Juli.", native: "The first of July." },
          ],
          correct: 0,
          alternatives: [],
          feedback: {
            right: "der erste Juni: the 1st of June.",
            alternative: {},
            wrong: {
              "1": "der dritte is the 3rd. Your first day was der erste.",
              "2": "Juli is July. Your first day was in Juni, June.",
            },
          },
        },
        {
          speaker: { person: "mb", initials: "FW", label: "Frau Wagner · HR" },
          line: "Danke. Und wann ist Ihr Geburtstag?",
          translation: "Thanks. And when is your birthday?",
          task: "It’s on the 12th of March",
          options: [
            { target: "Am zwölften März.", native: "On the twelfth of March." },
            { target: "Am zwölf März.", native: "On twelve March." },
            {
              target: "Am zwanzigsten März.",
              native: "On the twentieth of March.",
            },
          ],
          correct: 0,
          alternatives: [],
          feedback: {
            right: "am zwölften März: the “-th” form, plus -n after am.",
            alternative: {},
            wrong: {
              "1": "zwölf is the number. For a date after am: am zwölften.",
              "2": "zwanzigsten is the 20th. Yours is the 12th: am zwölften.",
            },
          },
        },
      ],
      closing: {
        speaker: { person: "mb", initials: "FW", label: "Frau Wagner" },
        target: "Danke schön. Alles klar!",
        native: "Thank you. All done!",
      },
      topic: "Dates",
    },
    {
      type: "speak",
      kind: "Say it",
      prompt: "Give Jonas the start of your number: 0151",
      target: "Meine Nummer ist null eins fünf eins.",
      native: "My number is 0151.",
      accept: [],
      feedback: {
        right: "Digit by digit: null eins fünf eins.",
        wrong:
          "Each digit on its own: null, eins, fünf, eins. Play it slowly and say it along.",
      },
      topic: "Phone",
    },
  ],
}
