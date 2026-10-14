import type { Lesson } from "@/features/lessons/schema"

/** Unit 1 · Lesson 2: Guten Morgen, guten Tag. Content from the Unit 1 designs (pages 13 to 15). */
export const lesson2: Lesson = {
  id: "a1-u1-l2",
  kind: "lesson",
  title: "Guten Morgen, guten Tag",
  titleIsGerman: true,
  titleEn: "Good morning, good day",
  goal: "Choose the greeting that fits the time of day.",
  minutes: 7,
  xp: 30,
  focus: "Morgen · Tag · Abend · Nacht",
  intro: {
    speaker: {
      person: "bk",
      initials: "FK",
    },
    de: "Guten Morgen!",
    en: "Your second day. At 7:45 Frau Krüger at the bakery says good morning. By the evening, people greet you differently. This lesson shows which greeting fits when.",
  },
  phrases: ["Guten Morgen", "Guten Tag", "Guten Abend", "Gute Nacht"],
  vocabulary: [
    {
      word: "Guten Morgen",
      en: "good morning",
      example: {
        de: "Guten Morgen, zusammen!",
        en: "Good morning, everyone!",
      },
    },
    {
      word: "Guten Tag",
      en: "hello, good day (polite, daytime)",
      example: {
        de: "Guten Tag, Herr Schulz!",
        en: "Hello, Mr Schulz!",
      },
    },
    {
      word: "Guten Abend",
      en: "good evening",
      example: {
        de: "Guten Abend, Frau Yılmaz!",
        en: "Good evening, Ms Yılmaz!",
      },
    },
    {
      word: "Gute Nacht",
      en: "good night (when leaving late or going to bed)",
      example: {
        de: "Gute Nacht, zusammen!",
        en: "Good night, everyone!",
      },
    },
  ],
  practised: ["Guten Morgen", "Guten Tag", "Guten Abend", "Gute Nacht"],
  canDo: [
    "Greet people in the morning, during the day and in the evening",
    "Say good night when you leave late or go to bed",
    "Pick the greeting that fits the time and the person",
  ],
  exercises: [
    {
      type: "discover",
      kind: "New phrases",
      title: "One day, four greetings",
      sub: "Play each line as often as you like. The time shows when you’d hear it.",
      lines: [
        {
          speaker: {
            person: "bk",
            initials: "FK",
            label: "Frau Krüger · bakery, 07:45",
          },
          de: "Guten Morgen!",
          en: "Good morning!",
          note: "In the morning, until about 11.",
          saveKey: "U2a",
          topic: "Greetings",
          example: {
            de: "Guten Morgen, zusammen!",
            en: "Good morning, everyone!",
          },
        },
        {
          speaker: {
            person: "lf",
            initials: "LF",
            label: "Lena · standup, 09:30",
          },
          de: "Guten Morgen, zusammen!",
          en: "Good morning, everyone!",
          note: "zusammen, from Lesson 1: the whole group at once.",
        },
        {
          speaker: {
            person: "mb",
            initials: "HS",
            label: "Herr Schulz · visitor at reception, 14:30",
          },
          de: "Guten Tag!",
          en: "Hello! (literally: good day)",
          note: "During the day. A little more formal than Hallo: shops, reception, people you don’t know.",
          saveKey: "U2b",
          topic: "Greetings",
          example: {
            de: "Guten Tag, Herr Schulz!",
            en: "Hello, Mr Schulz!",
          },
        },
        {
          speaker: {
            person: "ao",
            initials: "FY",
            label: "Frau Yılmaz · neighbour, 19:15",
          },
          de: "Guten Abend!",
          en: "Good evening!",
          note: "From about 6 in the evening.",
          saveKey: "U2c",
          topic: "Greetings",
        },
        {
          speaker: {
            person: "lf",
            initials: "LF",
            label: "Lena · leaving the team dinner, 22:45",
          },
          de: "Gute Nacht!",
          en: "Good night!",
          note: "Not a greeting: you say it when you leave late or go to bed.",
          saveKey: "U2d",
          topic: "Greetings",
        },
      ],
    },
    {
      type: "tip",
      kind: "Good to know",
      title: "Which greeting when?",
      sub: "The clock decides most of it. Hallo from Lesson 1 still works all day.",
      columns: ["When", "Greeting", "Also fine"],
      rows: [
        ["Morning, until about 11", "Guten Morgen!", "Hallo!"],
        ["Daytime, about 11 to 6 pm", "Guten Tag!", "Hallo!"],
        ["Evening, from about 6 pm", "Guten Abend!", "Hallo!"],
        ["Leaving late, going to bed", "Gute Nacht!", "Tschüss!"],
      ],
      examples: [
        {
          de: "Guten Morgen, zusammen!",
          en: "Good morning, everyone! (the 9:30 standup)",
        },
        {
          de: "Guten Tag!",
          en: "Hello! (a visitor at reception, a shop, an office)",
        },
      ],
      note: "The times are a guide, not a rule: around late morning people switch from Guten Morgen to Guten Tag. Guten Tag sounds a little more formal than Hallo. Gute Nacht is only for leaving or going to bed, never for arriving.",
    },
    {
      type: "choice",
      variant: "listening",
      kind: "Listen",
      prompt:
        "Your neighbour greets you on the stairs. When is this most likely?",
      optionsLanguage: "en",
      options: ["In the evening", "In the morning", "When she’s going to bed"],
      correct: 0,
      alternatives: [],
      feedback: {
        right:
          "She says Guten Abend: good evening. You hear it from about 6 pm.",
        alternative: {},
        wrong: {
          "1": "In the morning she’d say Guten Morgen. Listen again: she says Guten Abend, good evening.",
          "2": "Going to bed would be Gute Nacht. She says Guten Abend: good evening, a greeting.",
        },
      },
      topic: "Listening",
      listening: {
        clip: "Guten Abend!",
        translation: "Good evening!",
        meta: "0:02 · Frau Yılmaz",
      },
    },
    {
      type: "match",
      kind: "Match the moment",
      prompt: "Match each greeting with the moment it fits",
      sub: "Choose a greeting, then the moment.",
      pairs: [
        {
          phrase: "Guten Morgen!",
          meaning: "08:00 · arriving at the office",
        },
        {
          phrase: "Guten Tag!",
          meaning: "14:30 · a visitor at reception",
        },
        {
          phrase: "Guten Abend!",
          meaning: "19:30 · arriving at a restaurant",
        },
        {
          phrase: "Gute Nacht!",
          meaning: "23:00 · leaving to go to bed",
        },
      ],
      meaningOrder: [
        "19:30 · arriving at a restaurant",
        "08:00 · arriving at the office",
        "23:00 · leaving to go to bed",
        "14:30 · a visitor at reception",
      ],
      labels: {
        phrases: "Greetings",
        meanings: "Moments",
        empty: "Choose a moment",
        joiner: " fits ",
      },
      meaningsLanguage: "en",
      explanation:
        "Morgen, Tag, Abend: morning, day, evening. Gute Nacht is the one you say when you leave.",
      topic: "Greetings",
    },
    {
      type: "choice",
      variant: "multiple-choice",
      kind: "Choose the greeting",
      prompt: "It’s 08:15. You walk into the bakery. What do you say?",
      optionsLanguage: "de",
      options: ["Guten Morgen!", "Guten Abend!", "Gute Nacht!"],
      correct: 0,
      alternatives: [],
      feedback: {
        right: "Guten Morgen: it’s just after 8, so it’s morning.",
        alternative: {},
        wrong: {
          "1": "Guten Abend is for the evening, from about 6 pm. At 08:15 say Guten Morgen.",
          "2": "Gute Nacht is for leaving late or going to bed, not for arriving. At 08:15 say Guten Morgen.",
        },
      },
      topic: "Greetings",
    },
    {
      type: "choice",
      variant: "multiple-choice",
      kind: "Choose the greeting",
      prompt:
        "It’s 14:30. A customer you’ve never met comes to reception. What do you say?",
      optionsLanguage: "de",
      options: ["Guten Tag!", "Guten Morgen!", "Gute Nacht!", "Hallo!"],
      correct: 0,
      alternatives: [3],
      feedback: {
        right:
          "Guten Tag: it’s the afternoon, and Guten Tag is polite with someone you don’t know. Hallo! would be fine too.",
        alternative: {
          "3": "Hallo works too: it fits any time. With a customer you don’t know, Guten Tag sounds a little more polite.",
        },
        wrong: {
          "1": "It’s 14:30, so the morning is over. Guten Tag fits the afternoon.",
          "2": "Gute Nacht is for leaving late or going to bed. To greet a customer in the afternoon: Guten Tag.",
        },
      },
      topic: "Greetings",
    },
    {
      type: "choice",
      variant: "fill",
      kind: "Fill in the blank",
      prompt: "It’s 19:00. Your neighbour comes home as you do.",
      optionsLanguage: "de",
      options: ["Abend!", "Morgen!", "Nacht!"],
      correct: 0,
      alternatives: [],
      feedback: {
        right: "Guten Abend! It’s 7 pm, so it’s evening.",
        alternative: {},
        wrong: {
          "1": "Guten Morgen is for the morning. At 19:00 it’s evening: Guten Abend!",
          "2": "Nacht goes with Gute, not Guten: Gute Nacht. And that’s for leaving or bedtime. Coming home at 19:00: Guten Abend!",
        },
      },
      topic: "Greetings",
      fill: {
        before: "Guten",
        after: "",
      },
    },
    {
      type: "conversation",
      kind: "Your second day",
      prompt: "Four moments, from breakfast to bedtime",
      sub: "Choose the greeting that fits each moment.",
      turns: [
        {
          speaker: {
            person: "bk",
            initials: "FK",
            label: "Frau Krüger · bakery, 07:45",
          },
          line: "Guten Morgen!",
          translation: "Good morning!",
          task: "Greet her back",
          options: [
            {
              de: "Guten Morgen!",
              en: "Good morning!",
            },
            {
              de: "Guten Abend!",
              en: "Good evening!",
            },
            {
              de: "Gute Nacht!",
              en: "Good night!",
            },
          ],
          correct: 0,
          alternatives: [],
          feedback: {
            right: "Guten Morgen, the same greeting back. It’s 7:45.",
            alternative: {},
            wrong: {
              "1": "Guten Abend is for the evening. It’s 7:45: Guten Morgen!",
              "2": "Gute Nacht is for leaving late or going to bed. In the morning: Guten Morgen!",
            },
          },
        },
        {
          speaker: {
            person: "lf",
            initials: "LF",
            label: "Lena · standup, 09:30",
          },
          line: "Guten Morgen, %N!",
          translation: "Good morning, %N!",
          task: "Greet the whole team at once",
          options: [
            {
              de: "Guten Morgen, zusammen!",
              en: "Good morning, everyone!",
            },
            {
              de: "Guten Abend, zusammen!",
              en: "Good evening, everyone!",
            },
            {
              de: "Gute Nacht, zusammen!",
              en: "Good night, everyone!",
            },
          ],
          correct: 0,
          alternatives: [],
          feedback: {
            right: "Guten Morgen, zusammen! Morning greeting, whole team.",
            alternative: {},
            wrong: {
              "1": "It’s 9:30 in the morning, so not Abend: Guten Morgen, zusammen!",
              "2": "Gute Nacht is a late goodbye. To open the standup: Guten Morgen, zusammen!",
            },
          },
        },
        {
          speaker: {
            person: "mb",
            initials: "HS",
            label: "Herr Schulz · visitor, 15:00",
          },
          line: "Guten Tag!",
          translation: "Hello! (good day)",
          task: "Greet the visitor",
          options: [
            {
              de: "Guten Tag!",
              en: "Hello! (good day)",
            },
            {
              de: "Guten Morgen!",
              en: "Good morning!",
            },
            {
              de: "Gute Nacht!",
              en: "Good night!",
            },
            {
              de: "Hallo!",
              en: "Hello!",
            },
          ],
          correct: 0,
          alternatives: [3],
          feedback: {
            right: "Guten Tag: afternoon, and polite with a visitor.",
            alternative: {
              "3": "Hallo works at any time. With a visitor you don’t know, Guten Tag sounds a little more polite.",
            },
            wrong: {
              "1": "It’s 15:00, so the morning is over: Guten Tag!",
              "2": "Gute Nacht is for leaving late or going to bed. To greet a visitor: Guten Tag!",
            },
          },
        },
        {
          speaker: {
            person: "lf",
            initials: "LF",
            label: "Lena · team dinner, 22:45",
          },
          line: "Gute Nacht, %N!",
          translation: "Good night, %N!",
          task: "Everyone is going home. Say goodbye",
          options: [
            {
              de: "Gute Nacht!",
              en: "Good night!",
            },
            {
              de: "Guten Abend!",
              en: "Good evening!",
            },
            {
              de: "Guten Morgen!",
              en: "Good morning!",
            },
          ],
          correct: 0,
          alternatives: [],
          feedback: {
            right: "Gute Nacht: it’s late and you’re all heading home.",
            alternative: {},
            wrong: {
              "1": "Guten Abend greets someone in the evening. You’re leaving late: Gute Nacht!",
              "2": "Guten Morgen is for the morning. It’s late and you’re leaving: Gute Nacht!",
            },
          },
        },
      ],
      closing: {
        speaker: {
          person: "jk",
          initials: "JK",
          label: "Jonas",
        },
        de: "Gute Nacht, zusammen!",
        en: "Good night, everyone!",
      },
    },
  ],
}
