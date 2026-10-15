import type { Lesson } from "@/features/lessons/schema"

/** Unit 2 · Lesson 4: Freut mich!. Written for this app; the Unit 2 designs don’t exist yet. */
export const lesson4: Lesson = {
  id: "a1-u2-l4",
  kind: "lesson",
  title: "Freut mich!",
  titleInTarget: true,
  titleEn: "Nice to meet you!",
  goal: "Say you are glad to meet someone and answer when they say it to you",
  minutes: 7,
  xp: 30,
  focus: "Freut mich! · Freut mich auch!",
  intro: {
    speaker: { person: "aw", initials: "AW" },
    target: "Hallo, ich bin Anna. Freut mich!",
    native:
      "Anna’s first week. Everyone she meets says they’re glad to. This lesson helps you say it and answer it.",
  },
  phrases: ["Freut mich!", "Freut mich auch!"],
  vocabulary: [
    {
      word: "Freut mich!",
      native: "nice to meet you!",
      example: {
        target: "Hallo, ich bin Anna. Freut mich!",
        native: "Hi, I’m Anna. Nice to meet you!",
      },
    },
    {
      word: "Freut mich auch!",
      native: "nice to meet you too!",
      example: {
        target: "Ich bin Jonas. – Freut mich auch!",
        native: "I’m Jonas. – Nice to meet you too!",
      },
    },
  ],
  practised: ["Freut mich!", "Freut mich auch!"],
  canDo: [
    "Say Freut mich! when you meet someone",
    "Answer with Freut mich auch!",
    "Combine a greeting, a name and Freut mich!",
  ],
  exercises: [
    {
      type: "discover",
      kind: "New phrases",
      title: "First meetings",
      sub: "Play each line. Listen for Freut mich after the name.",
      lines: [
        {
          speaker: { person: "aw", initials: "AW", label: "Anna" },
          target: "Hallo, ich bin Anna. Freut mich!",
          native: "Hi, I’m Anna. Nice to meet you!",
          note: "Freut mich! is what you say when you meet someone.",
          saveKey: "U2j",
          topic: "Introductions",
          example: {
            target: "Hallo, ich bin Anna. Freut mich!",
            native: "Hi, I’m Anna. Nice to meet you!",
          },
        },
        {
          speaker: { person: "jk", initials: "JK", label: "Jonas" },
          target: "Ich bin Jonas. Freut mich auch!",
          native: "I’m Jonas. Nice to meet you too!",
          note: "auch means too. Use Freut mich auch! to answer.",
          saveKey: "U2k",
          topic: "Introductions",
          example: {
            target: "Ich bin Jonas. Freut mich auch!",
            native: "I’m Jonas. Nice to meet you too!",
          },
        },
        {
          speaker: { person: "mb", initials: "HS", label: "Herr Schulz" },
          target: "Guten Tag! Freut mich!",
          native: "Hello! Nice to meet you!",
          note: "It works with du and with Sie, with teammates and with visitors.",
        },
        {
          speaker: { person: "me", initials: "%I", label: "You" },
          target: "Hallo, ich bin %N. Freut mich!",
          native: "Hi, I’m %N. Nice to meet you!",
          note: "Greeting, name, then Freut mich!",
        },
      ],
    },
    {
      type: "tip",
      kind: "Good to know",
      title: "Say it, then answer it",
      sub: "Both people say it. The answer just adds auch.",
      columns: ["", "Say", "Answer"],
      rows: [
        ["Meeting someone", "Freut mich!", "Freut mich auch!"],
        [
          "With your name",
          "Ich bin %N. Freut mich!",
          "Hallo, %N! Freut mich auch!",
        ],
      ],
      examples: [
        {
          target: "Ich bin Anna. Freut mich! – Freut mich auch!",
          native: "I’m Anna. Nice to meet you! – Nice to meet you too!",
        },
        {
          target: "Guten Tag! Freut mich!",
          native: "Hello! Nice to meet you!",
        },
      ],
      note: "Freut mich! is a fixed phrase and the same for everyone. Keep it whole; you don’t need to change anything in it.",
    },
    {
      type: "choice",
      variant: "listening",
      kind: "Listen",
      prompt: "What does Anna say at the end?",
      optionsLanguage: "native",
      options: ["Nice to meet you", "Thank you", "Goodbye"],
      correct: 0,
      alternatives: [],
      feedback: {
        right: "Freut mich: nice to meet you.",
        alternative: {},
        wrong: {
          "1": "Thank you would be Danke. Anna says Freut mich.",
          "2": "Goodbye would be Tschüss or Auf Wiedersehen. Anna says Freut mich.",
        },
      },
      topic: "Introductions",
      listening: {
        clip: "Hallo! Ich bin Anna. Freut mich!",
        translation: "Hi! I’m Anna. Nice to meet you!",
        meta: "0:03 · Anna",
      },
    },
    {
      type: "choice",
      variant: "multiple-choice",
      kind: "Choose the answer",
      prompt:
        "Anna says „Freut mich!“ after you give your name. What do you answer?",
      optionsLanguage: "target",
      options: ["Freut mich auch!", "Danke, gern!", "Gute Nacht!"],
      correct: 0,
      alternatives: [],
      feedback: {
        right: "Freut mich auch: nice to meet you too.",
        alternative: {},
        wrong: {
          "1": "Danke and gern are for thanks. She said she’s glad to meet you: Freut mich auch!",
          "2": "Gute Nacht is a goodbye for late. You have just met: Freut mich auch!",
        },
      },
      topic: "Introductions",
    },
    {
      type: "build",
      kind: "Build the sentence",
      prompt: "Answer Anna",
      sub: "Nice to meet you too, Anna!",
      tiles: ["Anna!", "auch,", "Freut", "mich"],
      answer: [2, 3, 1, 0],
      feedback: {
        right: "Freut mich auch, Anna! The phrase first, then her name.",
        wrong: "Say the whole phrase, then her name: Freut mich auch, Anna!",
      },
      topic: "Introductions",
    },
    {
      type: "match",
      kind: "Match the meaning",
      prompt: "Match each phrase with its meaning",
      sub: "Choose a phrase, then what it means.",
      pairs: [
        { phrase: "Freut mich!", meaning: "Nice to meet you!" },
        { phrase: "Freut mich auch!", meaning: "Nice to meet you too!" },
        { phrase: "Das ist …", meaning: "This is …" },
        { phrase: "Wie geht’s?", meaning: "How are you?" },
      ],
      meaningOrder: [
        "How are you?",
        "Nice to meet you too!",
        "This is …",
        "Nice to meet you!",
      ],
      labels: {
        phrases: "Phrases",
        meanings: "Meanings",
        empty: "Choose a meaning",
        joiner: " means ",
      },
      meaningsLanguage: "native",
      explanation:
        "Freut mich! and Freut mich auch! are for meeting, Das ist … introduces, Wie geht’s? asks how someone is.",
      topic: "Introductions",
    },
    {
      type: "choice",
      variant: "fill",
      kind: "Fill in the blank",
      prompt: "Anna introduces herself and says she’s glad to meet you",
      optionsLanguage: "target",
      options: ["mich", "du", "danke"],
      correct: 0,
      alternatives: [],
      feedback: {
        right: "Freut mich: the whole phrase.",
        alternative: {},
        wrong: {
          "1": "du means you. The phrase is Freut mich!",
          "2": "danke means thanks. The phrase is Freut mich!",
        },
      },
      topic: "Introductions",
      fill: { before: "Hallo, ich bin Anna. Freut", after: "!" },
    },
    {
      type: "conversation",
      kind: "Kick-off meeting",
      prompt: "Meet three people in a row",
      sub: "Greet, answer and be polite.",
      turns: [
        {
          speaker: { person: "lf", initials: "LF", label: "Lena · kick-off" },
          line: "Hallo, %N! Das ist meine Kollegin Anna.",
          translation: "Hi, %N! This is my colleague Anna.",
          task: "Greet Anna and say you’re glad",
          options: [
            {
              target: "Hallo, Anna! Freut mich!",
              native: "Hi, Anna! Nice to meet you!",
            },
            {
              target: "Hallo, Lena! Freut mich!",
              native: "Hi, Lena! Nice to meet you!",
            },
            { target: "Tschüss, Anna!", native: "Bye, Anna!" },
          ],
          correct: 0,
          alternatives: [],
          feedback: {
            right: "Her name and Freut mich!",
            alternative: {},
            wrong: {
              "1": "Lena introduced her, so greet Anna: Hallo, Anna! Freut mich!",
              "2": "Tschüss is for leaving. You have just met: Hallo, Anna! Freut mich!",
            },
          },
        },
        {
          speaker: { person: "aw", initials: "AW", label: "Anna · kick-off" },
          line: "Freut mich auch! Wie geht’s?",
          translation: "Nice to meet you too! How are you?",
          task: "Answer and ask back",
          options: [
            {
              target: "Gut, danke. Und dir?",
              native: "Fine, thanks. And you?",
            },
            { target: "Freut mich auch!", native: "Nice to meet you too!" },
            { target: "Ich heiße Anna.", native: "My name is Anna." },
          ],
          correct: 0,
          alternatives: [],
          feedback: {
            right: "Anna asked how you are: Gut, danke. Und dir?",
            alternative: {},
            wrong: {
              "1": "She already said that. Now she asks how you are: Gut, danke. Und dir?",
              "2": "That is her name. She asked how you are: Gut, danke. Und dir?",
            },
          },
        },
        {
          speaker: {
            person: "mb",
            initials: "HS",
            label: "Herr Schulz · visitor",
          },
          line: "Guten Tag, ich bin Schulz. Freut mich!",
          translation: "Hello, I’m Schulz. Nice to meet you!",
          task: "Answer politely",
          options: [
            {
              target: "Guten Tag, Herr Schulz. Freut mich auch!",
              native: "Hello, Mr Schulz. Nice to meet you too!",
            },
            {
              target: "Hallo, Anna! Freut mich!",
              native: "Hi, Anna! Nice to meet you!",
            },
            {
              target: "Gute Nacht, Herr Schulz!",
              native: "Good night, Mr Schulz!",
            },
          ],
          correct: 0,
          alternatives: [],
          feedback: {
            right: "A visitor: Guten Tag, his name, and Freut mich auch!",
            alternative: {},
            wrong: {
              "1": "Anna isn’t speaking now. Answer Herr Schulz: Freut mich auch!",
              "2": "Gute Nacht is a goodbye for late. Greet him: Guten Tag, Herr Schulz.",
            },
          },
        },
      ],
      closing: {
        speaker: { person: "lf", initials: "LF", label: "Lena" },
        target: "Danke, %N!",
        native: "Thanks, %N!",
      },
    },
  ],
}
