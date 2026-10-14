import type { Lesson } from "@/features/lessons/schema"

/** Unit 1 · Review: Reception, first morning. Content from the Unit 1 designs (pages 13 to 15). */
export const review: Lesson = {
  id: "a1-u1-review",
  kind: "review",
  title: "Reception, first morning",
  titleIsGerman: false,
  titleEn: "",
  goal: "Your first morning at reception, from arriving to leaving: hear people greet you and reply to each, using everything from Lessons 1 to 4.",
  minutes: 8,
  xp: 40,
  focus: "Lessons 1 to 4",
  intro: {
    speaker: {
      person: "mb",
      initials: "MB",
    },
    de: "Guten Morgen!",
    en: "Covers Hallo!, Guten Morgen guten Tag, Ich bin … and Danke und bitte. Nothing new: only what you’ve learned in Unit 1. It isn’t a test; it shows what to practise next.",
  },
  phrases: [
    "Hallo!",
    "Guten Morgen, guten Tag",
    "Ich bin …",
    "Danke und bitte",
  ],
  practised: [],
  canDo: [],
  exercises: [
    {
      type: "choice",
      variant: "listening",
      kind: "Listen",
      prompt: "Reception, 08:50. Mia greets you. What time of day is it?",
      optionsLanguage: "en",
      options: ["Morning", "Evening", "Late at night"],
      correct: 0,
      alternatives: [],
      feedback: {
        right: "Guten Morgen: it’s morning.",
        alternative: {},
        wrong: {
          "1": "Evening would be Guten Abend. Mia says Guten Morgen: morning.",
          "2": "Late at night you’d hear Gute Nacht, as a goodbye. Mia says Guten Morgen.",
        },
      },
      topic: "Greetings",
      revisits: 1,
      listening: {
        clip: "Guten Morgen!",
        translation: "Good morning!",
        meta: "0:02 · Mia",
      },
    },
    {
      type: "match",
      kind: "Match the meaning",
      prompt: "Match each phrase with its meaning",
      sub: "One phrase from each lesson.",
      pairs: [
        {
          phrase: "Tschüss!",
          meaning: "Bye",
        },
        {
          phrase: "Guten Abend!",
          meaning: "Good evening",
        },
        {
          phrase: "Ich heiße …",
          meaning: "My name is …",
        },
        {
          phrase: "Entschuldigung!",
          meaning: "Sorry",
        },
      ],
      meaningOrder: ["Sorry", "Bye", "My name is …", "Good evening"],
      labels: {
        phrases: "Phrases",
        meanings: "Meanings",
        empty: "Choose a meaning",
        joiner: " means ",
      },
      meaningsLanguage: "en",
      explanation: "One from each lesson: goodbye, evening, your name, sorry.",
      topic: "Vocabulary",
      revisits: 0,
    },
    {
      type: "choice",
      variant: "multiple-choice",
      kind: "Choose the answer",
      prompt: "Mia says „Ich bin Mia. Und du?“ What do you answer?",
      optionsLanguage: "de",
      options: ["Ich bin %N.", "Ich bin Mia.", "Bitte!", "Ich heiße %N."],
      correct: 0,
      alternatives: [3],
      feedback: {
        right: "Ich bin %N: your name, after Und du?",
        alternative: {
          "3": "Ich heiße %N works just as well.",
        },
        wrong: {
          "1": "That says you’re Mia. Give your own name: Ich bin %N.",
          "2": "Bitte answers thanks. She asked your name: Ich bin %N.",
        },
      },
      topic: "Names",
      revisits: 2,
    },
    {
      type: "choice",
      variant: "multiple-choice",
      kind: "Choose the answer",
      prompt: "Mia hands you your badge: „Bitte schön!“ What do you say?",
      optionsLanguage: "de",
      options: ["Danke!", "Bitte!", "Entschuldigung!", "Vielen Dank!"],
      correct: 0,
      alternatives: [3],
      feedback: {
        right: "Danke: she handed you something.",
        alternative: {
          "3": "Vielen Dank works too, a bigger thank you.",
        },
        wrong: {
          "1": "Bitte is what she said. You thank her: Danke!",
          "2": "Nothing went wrong. Thank her: Danke!",
        },
      },
      topic: "Thanks and sorry",
      revisits: 3,
    },
    {
      type: "choice",
      variant: "listening",
      kind: "Listen",
      prompt: "A visitor arrives at 15:00. What’s his name?",
      optionsLanguage: "en",
      options: ["Schulz", "Tag", "Mia"],
      correct: 0,
      alternatives: [],
      feedback: {
        right: "Ich heiße Schulz: the name comes after heiße.",
        alternative: {},
        wrong: {
          "1": "Tag is part of Guten Tag, the greeting. His name comes after ich heiße: Schulz.",
          "2": "Mia works at reception. The visitor says ich heiße Schulz.",
        },
      },
      topic: "Listening",
      revisits: 2,
      listening: {
        clip: "Guten Tag! Ich heiße Schulz.",
        translation: "Hello! My name is Schulz.",
        meta: "0:03 · visitor",
      },
    },
    {
      type: "choice",
      variant: "fill",
      kind: "Fill in the blank",
      prompt: "It’s 18:00. You leave and wave to the whole team.",
      optionsLanguage: "de",
      options: ["zusammen!", "Morgen!", "bitte!"],
      correct: 0,
      alternatives: [],
      feedback: {
        right: "Tschüss zusammen! Bye, everyone.",
        alternative: {},
        wrong: {
          "1": "Morgen goes with Guten, for the morning. To say bye to everyone: Tschüss zusammen!",
          "2": "Bitte answers thanks. To say bye to everyone: Tschüss zusammen!",
        },
      },
      topic: "Greetings",
      revisits: 0,
      fill: {
        before: "Tschüss",
        after: "",
      },
    },
    {
      type: "build",
      kind: "Build the sentence",
      prompt: "Greet Herr Schulz politely and say your name",
      sub: "Hello, my name is %N.",
      tiles: ["ich", "Guten Tag,", "%N.", "heiße", "Gute Nacht,"],
      answer: [1, 0, 3, 2],
      feedback: {
        right:
          "Guten Tag, ich heiße %N. Polite daytime greeting, then your name.",
        wrong:
          "Start with Guten Tag for the afternoon, then ich heiße and your name. Gute Nacht is for leaving late.",
      },
      topic: "Names",
      revisits: 1,
    },
    {
      type: "conversation",
      kind: "Your first morning",
      prompt: "Arriving, meeting, thanking, leaving",
      sub: "Reply to each person.",
      turns: [
        {
          speaker: {
            person: "mb",
            initials: "MB",
            label: "Mia · reception, 08:50",
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
              de: "Tschüss!",
              en: "Bye!",
            },
          ],
          correct: 0,
          alternatives: [],
          feedback: {
            right: "Guten Morgen, the same greeting back.",
            alternative: {},
            wrong: {
              "1": "It’s 08:50, so it’s morning: Guten Morgen!",
              "2": "Tschüss is for leaving. You’ve just arrived: Guten Morgen!",
            },
          },
          revisits: 1,
        },
        {
          speaker: {
            person: "mb",
            initials: "MB",
            label: "Mia",
          },
          line: "Ich bin Mia. Und du?",
          translation: "I’m Mia. And you?",
          task: "Say your name",
          options: [
            {
              de: "Ich bin %N.",
              en: "I’m %N.",
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
          alternatives: [2],
          feedback: {
            right: "Your name, after Ich bin.",
            alternative: {
              "2": "Ich heiße %N works too.",
            },
            wrong: {
              "1": "She asked you. Answer with your name: Ich bin %N.",
            },
          },
          revisits: 2,
        },
        {
          speaker: {
            person: "mb",
            initials: "MB",
            label: "Mia",
          },
          line: "Bitte schön!",
          translation: "Here you go! (your badge)",
          task: "Thank her",
          options: [
            {
              de: "Danke!",
              en: "Thanks!",
            },
            {
              de: "Bitte!",
              en: "You’re welcome!",
            },
            {
              de: "Vielen Dank!",
              en: "Thanks a lot!",
            },
          ],
          correct: 0,
          alternatives: [2],
          feedback: {
            right: "Danke: she handed you your badge.",
            alternative: {
              "2": "Vielen Dank, a bigger thank you. Also right.",
            },
            wrong: {
              "1": "Bitte is what she said. Thank her: Danke!",
            },
          },
          revisits: 3,
        },
        {
          speaker: {
            person: "lf",
            initials: "LF",
            label: "Lena · 18:00",
          },
          line: "Tschüss, %N!",
          translation: "Bye, %N!",
          task: "Say bye to Lena",
          options: [
            {
              de: "Tschüss, Lena!",
              en: "Bye, Lena!",
            },
            {
              de: "Hallo, Lena!",
              en: "Hi, Lena!",
            },
            {
              de: "Auf Wiedersehen, Lena!",
              en: "Goodbye, Lena!",
            },
          ],
          correct: 0,
          alternatives: [2],
          feedback: {
            right: "Tschüss, Lena! Friendly, like hers.",
            alternative: {
              "2": "Auf Wiedersehen works; Tschüss is the usual one with a teammate.",
            },
            wrong: {
              "1": "Hallo is for arriving. Lena is leaving: Tschüss, Lena!",
            },
          },
          revisits: 0,
        },
      ],
      closing: {
        speaker: {
          person: "lf",
          initials: "LF",
          label: "Lena",
        },
        de: "Tschüss!",
        en: "Bye!",
      },
    },
  ],
  revisitedLessons: [
    {
      lessonId: "a1-u1-l1",
      label: "Lesson 1",
      title: "Hallo!",
    },
    {
      lessonId: "a1-u1-l2",
      label: "Lesson 2",
      title: "Guten Morgen, guten Tag",
    },
    {
      lessonId: "a1-u1-l3",
      label: "Lesson 3",
      title: "Ich bin …",
    },
    {
      lessonId: "a1-u1-l4",
      label: "Lesson 4",
      title: "Danke und bitte",
    },
  ],
}
