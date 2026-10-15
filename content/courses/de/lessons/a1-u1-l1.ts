import type { Lesson } from "@/features/lessons/schema"

/** Unit 1 · Lesson 1: Hallo!. Content from the Unit 1 designs (pages 13 to 15). */
export const lesson1: Lesson = {
  id: "a1-u1-l1",
  kind: "lesson",
  title: "Hallo!",
  titleInTarget: true,
  titleEn: "Hello!",
  goal: "Say hello and goodbye: Hallo, Tschüss, Auf Wiedersehen.",
  minutes: 6,
  xp: 30,
  focus: "Hallo · Tschüss · Auf Wiedersehen",
  intro: {
    speaker: {
      person: "mb",
      initials: "MB",
    },
    target: "Hallo!",
    native:
      "Mia Braun works at reception. She’s the first person you’ll greet on your first morning, at the end of this lesson.",
  },
  phrases: ["Hallo", "Hallo zusammen", "Tschüss", "Auf Wiedersehen"],
  vocabulary: [
    {
      word: "Hallo",
      native: "hello",
      example: {
        target: "Hallo, Lena!",
        native: "Hello, Lena!",
      },
    },
    {
      word: "Hallo zusammen",
      native: "hello, everyone",
      example: {
        target: "Hallo zusammen!",
        native: "Hello, everyone!",
      },
    },
    {
      word: "Tschüss",
      native: "bye (friendly)",
      example: {
        target: "Tschüss, Jonas!",
        native: "Bye, Jonas!",
      },
    },
    {
      word: "Auf Wiedersehen",
      native: "goodbye (polite)",
      example: {
        target: "Auf Wiedersehen, Frau Krüger!",
        native: "Goodbye, Ms Krüger!",
      },
    },
  ],
  practised: ["Hallo", "Hallo zusammen", "Tschüss", "Auf Wiedersehen"],
  canDo: [
    "Say hello to one person or to a whole group",
    "Say goodbye in a friendly way or a polite way",
    "Choose the right phrase when you arrive and when you leave",
  ],
  exercises: [
    {
      type: "discover",
      kind: "New phrases",
      title: "Your first morning, from the bakery to the office",
      sub: "Play each line as often as you like. Save the ones you want to keep.",
      lines: [
        {
          speaker: {
            person: "bk",
            initials: "FK",
            label: "Frau Krüger · bakery",
          },
          target: "Hallo!",
          native: "Hello!",
          note: "Hallo works at any time of day, with anyone.",
          saveKey: "U1a",
          topic: "Greetings",
          example: {
            target: "Hallo, Lena!",
            native: "Hello, Lena!",
          },
        },
        {
          speaker: {
            person: "me",
            initials: "%I",
            label: "You",
          },
          target: "Hallo!",
          native: "Hello!",
        },
        {
          speaker: {
            person: "bk",
            initials: "FK",
            label: "Frau Krüger · bakery",
          },
          target: "Auf Wiedersehen!",
          native: "Goodbye!",
          note: "The polite goodbye: in shops, at reception, with people you don’t know well.",
          saveKey: "U1b",
          topic: "Greetings",
          example: {
            target: "Auf Wiedersehen, Frau Krüger!",
            native: "Goodbye, Ms Krüger!",
          },
        },
        {
          speaker: {
            person: "lf",
            initials: "LF",
            label: "Lena · at the office",
          },
          target: "Hallo zusammen! Hallo, %N!",
          native: "Hello, everyone! Hello, %N!",
          note: "Hallo zusammen greets a whole group at once.",
          saveKey: "U1c",
          topic: "Greetings",
        },
        {
          speaker: {
            person: "jk",
            initials: "JK",
            label: "Jonas · end of the day",
          },
          target: "Tschüss, %N!",
          native: "Bye, %N!",
          note: "Tschüss is the friendly goodbye, for teammates and friends.",
          saveKey: "U1d",
          topic: "Greetings",
          example: {
            target: "Tschüss, Jonas!",
            native: "Bye, Jonas!",
          },
        },
      ],
    },
    {
      type: "tip",
      kind: "Good to know",
      title: "Friendly or polite?",
      sub: "Hallo fits everyone. For goodbye, choose by who you’re talking to.",
      columns: ["Who you’re with", "Arriving", "Leaving"],
      rows: [
        ["Teammates and friends", "Hallo!", "Tschüss!"],
        [
          "Shops, reception, people you don’t know",
          "Hallo!",
          "Auf Wiedersehen!",
        ],
        ["A whole group", "Hallo zusammen!", "Tschüss zusammen!"],
      ],
      examples: [
        {
          target: "Hallo, Lena! – Hallo, %N!",
          native: "Hello, Lena! – Hello, %N!",
        },
        {
          target: "Tschüss, Jonas!",
          native: "Bye, Jonas!",
        },
        {
          target: "Auf Wiedersehen!",
          native: "Goodbye! (at the bakery, at reception)",
        },
      ],
      note: "Not sure which goodbye to use? Auf Wiedersehen is always polite. Tschüss is friendly, and many people say it in shops too, so neither one is a mistake.",
    },
    {
      type: "match",
      kind: "Match the meaning",
      prompt: "Match each phrase with its meaning",
      sub: "Choose a phrase, then what it means.",
      pairs: [
        {
          phrase: "Hallo!",
          meaning: "Hello",
        },
        {
          phrase: "Tschüss!",
          meaning: "Bye (friendly)",
        },
        {
          phrase: "Auf Wiedersehen!",
          meaning: "Goodbye (polite)",
        },
        {
          phrase: "Hallo zusammen!",
          meaning: "Hello, everyone",
        },
      ],
      meaningOrder: [
        "Goodbye (polite)",
        "Hello, everyone",
        "Hello",
        "Bye (friendly)",
      ],
      labels: {
        phrases: "Phrases",
        meanings: "Meanings",
        empty: "Choose a meaning",
        joiner: " means ",
      },
      meaningsLanguage: "native",
      explanation:
        "Hallo and Hallo zusammen say hello. Tschüss and Auf Wiedersehen say goodbye.",
      topic: "Greetings",
    },
    {
      type: "choice",
      variant: "listening",
      kind: "Listen",
      prompt: "It’s 6 pm and Jonas is leaving. What does he say to you?",
      optionsLanguage: "native",
      options: ["Bye", "Hello", "Hello, everyone"],
      correct: 0,
      alternatives: [],
      feedback: {
        right:
          "Tschüss means bye. Jonas is a teammate, so he uses the friendly goodbye.",
        alternative: {},
        wrong: {
          "1": "Hallo is hello. Jonas is leaving, so listen for the goodbye: Tschüss.",
          "2": "Hallo zusammen greets a group as you arrive. Jonas is leaving and says Tschüss.",
        },
      },
      listening: {
        clip: "Tschüss, %N!",
        translation: "Bye, %N!",
        meta: "0:02 · Jonas",
      },
    },
    {
      type: "choice",
      variant: "multiple-choice",
      kind: "Choose the answer",
      prompt:
        "You’re leaving the bakery. Frau Krüger says „Auf Wiedersehen!“ What can you say?",
      optionsLanguage: "target",
      options: ["Auf Wiedersehen!", "Tschüss!", "Hallo zusammen!", "Hallo!"],
      correct: 0,
      alternatives: [1],
      feedback: {
        right:
          "Auf Wiedersehen: polite, and the same goodbye she used. Tschüss! would be fine too.",
        alternative: {
          "1": "Tschüss works too. It’s friendly, and lots of people say it in shops. Auf Wiedersehen is the more polite choice.",
        },
        wrong: {
          "2": "Hallo zusammen says hello to a group as you arrive. You’re leaving, so say goodbye: Auf Wiedersehen! or Tschüss!",
          "3": "Hallo is for when you arrive. You’re leaving, so say goodbye: Auf Wiedersehen! or Tschüss!",
        },
      },
      topic: "Greetings",
    },
    {
      type: "choice",
      variant: "fill",
      kind: "Fill in the blank",
      prompt: "Lena arrives at the team table and greets everyone at once",
      optionsLanguage: "target",
      options: ["zusammen!", "Tschüss!", "Wiedersehen!"],
      correct: 0,
      alternatives: [],
      feedback: {
        right: "Hallo zusammen! means hello, everyone.",
        alternative: {},
        wrong: {
          "1": "Tschüss is goodbye. Lena is arriving and greeting the whole group: Hallo zusammen!",
          "2": "Wiedersehen only comes in Auf Wiedersehen, which is a goodbye. To greet everyone: Hallo zusammen!",
        },
      },
      topic: "Greetings",
      fill: {
        before: "Hallo",
        after: "",
      },
    },
    {
      type: "conversation",
      kind: "Your first day",
      prompt: "From reception to the end of the day",
      sub: "Three people, three moments. Choose what you’d say.",
      turns: [
        {
          speaker: {
            person: "mb",
            initials: "MB",
            label: "Mia · reception, 08:55",
          },
          line: "Hallo!",
          translation: "Hello!",
          task: "Say hello back",
          options: [
            {
              target: "Hallo!",
              native: "Hello!",
            },
            {
              target: "Tschüss!",
              native: "Bye!",
            },
            {
              target: "Auf Wiedersehen!",
              native: "Goodbye!",
            },
          ],
          correct: 0,
          alternatives: [],
          feedback: {
            right: "You’re arriving, so Hallo! is right.",
            alternative: {},
            wrong: {
              "1": "Tschüss is for leaving. You’ve just arrived: Hallo!",
              "2": "Auf Wiedersehen is a goodbye. You’ve just arrived: Hallo!",
            },
          },
        },
        {
          speaker: {
            person: "lf",
            initials: "LF",
            label: "Lena · team table, 09:00",
          },
          line: "Hallo, %N!",
          translation: "Hello, %N!",
          task: "Greet Lena and the whole team at once",
          options: [
            {
              target: "Hallo zusammen!",
              native: "Hello, everyone!",
            },
            {
              target: "Tschüss zusammen!",
              native: "Bye, everyone!",
            },
            {
              target: "Auf Wiedersehen!",
              native: "Goodbye!",
            },
          ],
          correct: 0,
          alternatives: [],
          feedback: {
            right: "Hallo zusammen! greets Lena, Jonas and Aylin in one go.",
            alternative: {},
            wrong: {
              "1": "Tschüss zusammen is bye, everyone, for when you leave. You’re arriving: Hallo zusammen!",
              "2": "Auf Wiedersehen is a polite goodbye. To greet the team: Hallo zusammen!",
            },
          },
        },
        {
          speaker: {
            person: "jk",
            initials: "JK",
            label: "Jonas · 18:00",
          },
          line: "Tschüss, %N!",
          translation: "Bye, %N!",
          task: "Say bye to Jonas",
          options: [
            {
              target: "Tschüss, Jonas!",
              native: "Bye, Jonas!",
            },
            {
              target: "Hallo, Jonas!",
              native: "Hello, Jonas!",
            },
            {
              target: "Auf Wiedersehen, Jonas!",
              native: "Goodbye, Jonas!",
            },
          ],
          correct: 0,
          alternatives: [2],
          feedback: {
            right: "Tschüss, Jonas! Friendly, just like his goodbye.",
            alternative: {
              "2": "That works. Auf Wiedersehen is a bit formal for a teammate, though; Tschüss is what Jonas would expect.",
            },
            wrong: {
              "1": "Hallo is for arriving. Jonas is leaving: Tschüss, Jonas!",
            },
          },
        },
      ],
      closing: {
        speaker: {
          person: "ao",
          initials: "AÖ",
          label: "Aylin",
        },
        target: "Tschüss zusammen!",
        native: "Bye, everyone!",
      },
    },
  ],
}
