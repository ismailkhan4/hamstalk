import type { Lesson } from "@/features/lessons/schema"

/** Unit 1 · Lesson 3: Ich bin …. Content from the Unit 1 designs (pages 13 to 15). */
export const lesson3: Lesson = {
  id: "a1-u1-l3",
  kind: "lesson",
  title: "Ich bin …",
  titleIsGerman: true,
  titleEn: "I’m …",
  goal: "Say your name and catch someone else’s.",
  minutes: 7,
  xp: 30,
  focus: "Ich bin … · Ich heiße … · Und du?",
  intro: {
    speaker: {
      person: "ao",
      initials: "AÖ",
    },
    de: "Hallo, ich bin Aylin. Und du?",
    en: "Lunch at the team table. Everyone says their name once, quickly. This lesson helps you catch theirs and say yours.",
  },
  phrases: ["Ich bin …", "Ich heiße …", "Und du?"],
  practised: ["Ich bin …", "Ich heiße …", "Und du?"],
  canDo: [
    "Say your name with Ich bin … or Ich heiße …",
    "Catch someone’s name when they introduce themselves",
    "Hear Und du? and answer with your name",
  ],
  exercises: [
    {
      type: "discover",
      kind: "New phrases",
      title: "Names at the team table",
      sub: "Play each line as often as you like. Listen for the name after bin or heiße.",
      lines: [
        {
          speaker: {
            person: "lf",
            initials: "LF",
            label: "Lena",
          },
          de: "Hallo, ich bin Lena.",
          en: "Hi, I’m Lena.",
          note: "Ich bin + your name.",
          saveKey: "U3a",
        },
        {
          speaker: {
            person: "jk",
            initials: "JK",
            label: "Jonas",
          },
          de: "Guten Tag! Ich heiße Jonas.",
          en: "Hello! My name is Jonas.",
          note: "Ich heiße + your name. Same meaning as Ich bin.",
          saveKey: "U3b",
        },
        {
          speaker: {
            person: "ao",
            initials: "AÖ",
            label: "Aylin",
          },
          de: "Ich bin Aylin. Und du?",
          en: "I’m Aylin. And you?",
          note: "Und du? means and you? Now it’s your turn to say your name.",
          saveKey: "U3c",
        },
        {
          speaker: {
            person: "me",
            initials: "%I",
            label: "You",
          },
          de: "Ich bin %N.",
          en: "I’m %N.",
          note: "Your name goes at the end.",
        },
      ],
    },
    {
      type: "tip",
      kind: "Good to know",
      title: "Two ways to say your name",
      sub: "Learn them as whole phrases. Both are correct and both are common.",
      columns: ["", "Ich bin …", "Ich heiße …"],
      rows: [
        ["Your name", "Ich bin %N.", "Ich heiße %N."],
        ["With a greeting", "Hallo, ich bin %N.", "Guten Tag, ich heiße %N."],
      ],
      examples: [
        {
          de: "Ich bin Aylin. Und du? – Ich bin %N.",
          en: "I’m Aylin. And you? – I’m %N.",
        },
        {
          de: "Guten Morgen, ich heiße Jonas.",
          en: "Good morning, my name is Jonas.",
        },
      ],
      note: "Ich bin … and Ich heiße … say the same thing here. Keep them as fixed phrases for now; the other forms of these verbs come in Unit 3. After a greeting, ich takes a small i: Hallo, ich bin …",
    },
    {
      type: "choice",
      variant: "listening",
      kind: "Listen",
      prompt: "A new colleague stops at your desk. What’s her name?",
      optionsLanguage: "en",
      options: ["Anna", "Lena", "Aylin"],
      correct: 0,
      alternatives: [],
      feedback: {
        right: "Ich bin Anna: her name comes right after bin.",
        alternative: {},
        wrong: {
          "1": "Lena is your team lead. Listen for the name after ich bin: Anna.",
          "2": "Aylin introduced herself at lunch. This colleague says ich bin Anna.",
        },
      },
      topic: "Listening",
      listening: {
        clip: "Hallo, ich bin Anna. Und du?",
        translation: "Hi, I’m Anna. And you?",
        meta: "0:03 · new colleague",
      },
    },
    {
      type: "build",
      kind: "Build the sentence",
      prompt: "Greet Herr Schulz and say your name",
      sub: "Good morning, my name is %N.",
      tiles: ["heiße", "Guten Morgen,", "%N.", "ich"],
      answer: [1, 3, 0, 2],
      feedback: {
        right: "Guten Morgen, ich heiße %N. Greeting first, then your name.",
        wrong:
          "Start with the greeting, then ich heiße, then your name: Guten Morgen, ich heiße %N.",
      },
      topic: "Names",
    },
    {
      type: "choice",
      variant: "multiple-choice",
      kind: "Choose the answer",
      prompt: "Aylin says „Ich bin Aylin. Und du?“ What do you answer?",
      optionsLanguage: "de",
      options: ["Ich bin %N.", "Ich bin Aylin.", "Und du?", "Ich heiße %N."],
      correct: 0,
      alternatives: [3],
      feedback: {
        right: "Ich bin %N: she asked Und du?, so you say your name.",
        alternative: {
          "3": "Ich heiße %N works just as well. Both phrases give your name.",
        },
        wrong: {
          "1": "That says you’re Aylin. Use your own name: Ich bin %N.",
          "2": "Und du? asks her back, but she already told you her name. Say yours: Ich bin %N.",
        },
      },
      topic: "Names",
    },
    {
      type: "choice",
      variant: "fill",
      kind: "Fill in the blank",
      prompt: "Mia at reception tells you her name",
      optionsLanguage: "de",
      options: ["ich", "du", "und"],
      correct: 0,
      alternatives: [],
      feedback: {
        right: "Hallo, ich bin Mia: ich means I.",
        alternative: {},
        wrong: {
          "1": "du means you, as in Und du? Mia talks about herself: ich bin Mia.",
          "2": "und means and. To say I’m Mia: ich bin Mia.",
        },
      },
      topic: "Names",
      fill: {
        before: "Hallo,",
        after: "bin Mia.",
      },
    },
    {
      type: "conversation",
      kind: "Lunch with the team",
      prompt: "Three people, three names",
      sub: "Catch each name and give yours.",
      turns: [
        {
          speaker: {
            person: "ao",
            initials: "AÖ",
            label: "Aylin · team table",
          },
          line: "Hallo! Ich bin Aylin. Und du?",
          translation: "Hi! I’m Aylin. And you?",
          task: "Say your name",
          options: [
            {
              de: "Ich bin %N.",
              en: "I’m %N.",
            },
            {
              de: "Ich bin Aylin.",
              en: "I’m Aylin.",
            },
            {
              de: "Und du?",
              en: "And you?",
            },
            {
              de: "Ich heiße %N.",
              en: "My name is %N.",
            },
          ],
          correct: 0,
          alternatives: [3],
          feedback: {
            right: "Your name, after Ich bin.",
            alternative: {
              "3": "Ich heiße %N works too: same meaning.",
            },
            wrong: {
              "1": "That says you’re Aylin. Use your own name: Ich bin %N.",
              "2": "She asked you. Answer with your name: Ich bin %N.",
            },
          },
        },
        {
          speaker: {
            person: "mb",
            initials: "HS",
            label: "Herr Schulz · visitor, 14:00",
          },
          line: "Guten Tag! Ich heiße Schulz.",
          translation: "Hello! My name is Schulz.",
          task: "Greet him and say your name",
          options: [
            {
              de: "Guten Tag! Ich heiße %N.",
              en: "Hello! My name is %N.",
            },
            {
              de: "Gute Nacht! Ich heiße %N.",
              en: "Good night! My name is %N.",
            },
            {
              de: "Guten Tag! Ich heiße Schulz.",
              en: "Hello! My name is Schulz.",
            },
          ],
          correct: 0,
          alternatives: [],
          feedback: {
            right: "Guten Tag for the afternoon, then your name.",
            alternative: {},
            wrong: {
              "1": "Gute Nacht is for leaving late. At 14:00: Guten Tag! Ich heiße %N.",
              "2": "Schulz is his name. Give yours: Guten Tag! Ich heiße %N.",
            },
          },
        },
        {
          speaker: {
            person: "aw",
            initials: "AW",
            label: "Anna · new colleague",
          },
          line: "Hallo! Ich heiße Anna.",
          translation: "Hi! My name is Anna.",
          task: "Greet her by name",
          options: [
            {
              de: "Hallo, Anna!",
              en: "Hi, Anna!",
            },
            {
              de: "Hallo, Lena!",
              en: "Hi, Lena!",
            },
            {
              de: "Tschüss, Anna!",
              en: "Bye, Anna!",
            },
          ],
          correct: 0,
          alternatives: [],
          feedback: {
            right: "You caught her name: Hallo, Anna!",
            alternative: {},
            wrong: {
              "1": "Listen again: she said Ich heiße Anna, so Hallo, Anna!",
              "2": "Tschüss is for leaving. You’ve just met: Hallo, Anna!",
            },
          },
        },
      ],
      closing: {
        speaker: {
          person: "aw",
          initials: "AW",
          label: "Anna",
        },
        de: "Hallo, %N!",
        en: "Hi, %N!",
      },
    },
  ],
}
