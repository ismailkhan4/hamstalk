import type { Lesson } from "@/features/lessons/schema"

/** Unit 2 · Lesson 3: Das ist Lena. Written for this app; the Unit 2 designs don’t exist yet. */
export const lesson3: Lesson = {
  id: "a1-u2-l3",
  kind: "lesson",
  title: "Das ist Lena",
  titleInTarget: true,
  titleEn: "This is Lena",
  goal: "Introduce a colleague and say who is who",
  minutes: 7,
  xp: 30,
  focus: "Das ist … · Kollege · Kollegin",
  intro: {
    speaker: { person: "lf", initials: "LF" },
    target: "Das ist meine Kollegin Anna.",
    native:
      "Lena introduces the team to a new face. This lesson helps you introduce someone and say whether they are a colleague.",
  },
  phrases: ["Das ist …", "der Kollege", "die Kollegin"],
  vocabulary: [
    {
      word: "Das ist …",
      native: "this is …",
      example: { target: "Das ist Jonas.", native: "This is Jonas." },
    },
    {
      article: "der",
      word: "Kollege",
      native: "colleague (man)",
      example: {
        target: "Das ist mein Kollege Jonas.",
        native: "This is my colleague Jonas.",
      },
    },
    {
      article: "die",
      word: "Kollegin",
      native: "colleague (woman)",
      example: {
        target: "Das ist meine Kollegin Anna.",
        native: "This is my colleague Anna.",
      },
    },
  ],
  practised: ["Das ist …", "der Kollege", "die Kollegin"],
  canDo: [
    "Introduce someone with Das ist …",
    "Say Kollege for a man and Kollegin for a woman",
    "Catch who is being introduced",
  ],
  exercises: [
    {
      type: "discover",
      kind: "New phrases",
      title: "Meet the team",
      sub: "Play each line. Listen for Das ist … and for the word before the name.",
      lines: [
        {
          speaker: { person: "lf", initials: "LF", label: "Lena" },
          target: "Das ist mein Kollege Jonas.",
          native: "This is my colleague Jonas.",
          note: "Das ist … introduces someone. Kollege is a man.",
          saveKey: "U2g",
          topic: "Introductions",
          example: {
            target: "Das ist mein Kollege Jonas.",
            native: "This is my colleague Jonas.",
          },
        },
        {
          speaker: { person: "lf", initials: "LF", label: "Lena" },
          target: "Das ist meine Kollegin Anna.",
          native: "This is my colleague Anna.",
          note: "Kollegin is a woman, so mein becomes meine.",
          saveKey: "U2h",
          topic: "Introductions",
          example: {
            target: "Das ist meine Kollegin Anna.",
            native: "This is my colleague Anna.",
          },
        },
        {
          speaker: { person: "lf", initials: "LF", label: "Lena" },
          target: "Herr Schulz, das ist %N.",
          native: "Mr Schulz, this is %N.",
          note: "Herr is Mr, Frau is Ms or Mrs. Use them with a surname.",
          saveKey: "U2i",
          topic: "Introductions",
        },
        {
          speaker: { person: "me", initials: "%I", label: "You" },
          target: "Das ist Lena.",
          native: "This is Lena.",
          note: "Your turn: introduce Lena to a new colleague.",
        },
      ],
    },
    {
      type: "tip",
      kind: "Good to know",
      title: "Kollege or Kollegin",
      sub: "Add -in for a woman. Learn mein Kollege and meine Kollegin as whole phrases.",
      columns: ["", "A man", "A woman"],
      rows: [
        ["The word", "der Kollege", "die Kollegin"],
        [
          "Introduce",
          "Das ist mein Kollege Jonas.",
          "Das ist meine Kollegin Anna.",
        ],
      ],
      examples: [
        {
          target: "Das ist mein Kollege Jonas.",
          native: "This is my colleague Jonas.",
        },
        {
          target: "Das ist meine Kollegin Anna.",
          native: "This is my colleague Anna.",
        },
      ],
      note: "Das ist … stays the same for everyone. Only Kollege/Kollegin and mein/meine change. Keep them as whole phrases for now; there is more on mein and meine later.",
    },
    {
      type: "choice",
      variant: "listening",
      kind: "Listen",
      prompt: "Lena introduces someone. Who is Anna?",
      optionsLanguage: "native",
      options: ["A colleague (woman)", "A colleague (man)", "A visitor"],
      correct: 0,
      alternatives: [],
      feedback: {
        right: "Kollegin is a woman: meine Kollegin Anna.",
        alternative: {},
        wrong: {
          "1": "A man would be Kollege. Lena says Kollegin, so Anna is a woman.",
          "2": "A visitor wouldn’t be called a colleague. Lena says meine Kollegin.",
        },
      },
      topic: "Introductions",
      listening: {
        clip: "Das ist meine Kollegin Anna.",
        translation: "This is my colleague Anna.",
        meta: "0:03 · Lena",
      },
    },
    {
      type: "choice",
      variant: "multiple-choice",
      kind: "Choose the answer",
      prompt:
        "You introduce your teammate Jonas to Herr Schulz. What do you say?",
      optionsLanguage: "target",
      options: [
        "Das ist mein Kollege Jonas.",
        "Das ist meine Kollegin Jonas.",
        "Gern, Jonas!",
      ],
      correct: 0,
      alternatives: [],
      feedback: {
        right: "Jonas is a man, so mein Kollege.",
        alternative: {},
        wrong: {
          "1": "Kollegin is for a woman. Jonas is a man: mein Kollege.",
          "2": "Gern answers thanks. To introduce someone: Das ist mein Kollege Jonas.",
        },
      },
      topic: "Introductions",
    },
    {
      type: "build",
      kind: "Build the sentence",
      prompt: "Introduce Anna",
      sub: "This is my colleague Anna.",
      tiles: ["Anna.", "Das", "meine", "ist", "Kollegin"],
      answer: [1, 3, 2, 4, 0],
      feedback: {
        right:
          "Das ist meine Kollegin Anna. Das ist first, then who she is, then her name.",
        wrong:
          "Start with Das ist, then meine Kollegin, then the name: Das ist meine Kollegin Anna.",
      },
      topic: "Introductions",
    },
    {
      type: "match",
      kind: "Match the meaning",
      prompt: "Match each word with its meaning",
      sub: "Choose a word, then what it means.",
      pairs: [
        { phrase: "der Kollege", meaning: "Colleague (man)" },
        { phrase: "die Kollegin", meaning: "Colleague (woman)" },
        { phrase: "Das ist …", meaning: "This is …" },
        { phrase: "Frau", meaning: "Ms, Mrs" },
      ],
      meaningOrder: [
        "Ms, Mrs",
        "This is …",
        "Colleague (woman)",
        "Colleague (man)",
      ],
      labels: {
        phrases: "Words",
        meanings: "Meanings",
        empty: "Choose a meaning",
        joiner: " means ",
      },
      meaningsLanguage: "native",
      explanation:
        "Kollege is a man, Kollegin a woman, Das ist … introduces, and Frau goes before a woman’s surname.",
      topic: "Introductions",
    },
    {
      type: "choice",
      variant: "fill",
      kind: "Fill in the blank",
      prompt: "Lena introduces Anna",
      optionsLanguage: "target",
      options: ["meine", "mein", "und"],
      correct: 0,
      alternatives: [],
      feedback: {
        right: "meine Kollegin: Kollegin is a woman, so mein becomes meine.",
        alternative: {},
        wrong: {
          "1": "mein goes with Kollege, a man. Anna is a woman: meine Kollegin.",
          "2": "und means and. To say my: meine Kollegin.",
        },
      },
      topic: "Introductions",
      fill: { before: "Das ist", after: "Kollegin Anna." },
    },
    {
      type: "conversation",
      kind: "Meet the team",
      prompt: "Greet each person you meet",
      sub: "Lena introduces, you answer.",
      turns: [
        {
          speaker: { person: "lf", initials: "LF", label: "Lena · kick-off" },
          line: "Hallo, %N! Das ist meine Kollegin Anna.",
          translation: "Hi, %N! This is my colleague Anna.",
          task: "Greet Anna",
          options: [
            { target: "Hallo, Anna!", native: "Hi, Anna!" },
            { target: "Hallo, Lena!", native: "Hi, Lena!" },
            { target: "Tschüss, Anna!", native: "Bye, Anna!" },
          ],
          correct: 0,
          alternatives: [],
          feedback: {
            right: "You caught her name: Hallo, Anna!",
            alternative: {},
            wrong: {
              "1": "Lena is the one introducing. Greet the person she introduced: Hallo, Anna!",
              "2": "Tschüss is for leaving. You have just met: Hallo, Anna!",
            },
          },
        },
        {
          speaker: { person: "lf", initials: "LF", label: "Lena · kick-off" },
          line: "Und das ist mein Kollege Jonas.",
          translation: "And this is my colleague Jonas.",
          task: "Greet Jonas",
          options: [
            { target: "Hallo, Jonas!", native: "Hi, Jonas!" },
            { target: "Gute Nacht, Jonas!", native: "Good night, Jonas!" },
            { target: "Hallo, Anna!", native: "Hi, Anna!" },
          ],
          correct: 0,
          alternatives: [],
          feedback: {
            right: "Hallo, Jonas! You used his name.",
            alternative: {},
            wrong: {
              "1": "Gute Nacht is for the end of the day. It’s the kick-off: Hallo, Jonas!",
              "2": "You already greeted Anna. This time it’s Jonas: Hallo, Jonas!",
            },
          },
        },
        {
          speaker: { person: "lf", initials: "LF", label: "Lena · reception" },
          line: "Herr Schulz, das ist %N.",
          translation: "Mr Schulz, this is %N.",
          task: "Greet him and say your name",
          options: [
            {
              target: "Guten Tag! Ich heiße %N.",
              native: "Hello! My name is %N.",
            },
            {
              target: "Guten Tag! Ich heiße Schulz.",
              native: "Hello! My name is Schulz.",
            },
            { target: "Gute Nacht!", native: "Good night!" },
          ],
          correct: 0,
          alternatives: [],
          feedback: {
            right: "A visitor in the afternoon: Guten Tag, then your name.",
            alternative: {},
            wrong: {
              "1": "Schulz is his name. Give yours: Guten Tag! Ich heiße %N.",
              "2": "Gute Nacht is a goodbye for late. Greet him: Guten Tag! Ich heiße %N.",
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
