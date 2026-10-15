import type { Lesson } from "@/features/lessons/schema"

/** Unit 2 · Lesson 2: du oder Sie?. Written for this app; the Unit 2 designs don’t exist yet. */
export const lesson2: Lesson = {
  id: "a1-u2-l2",
  kind: "lesson",
  title: "du oder Sie?",
  titleInTarget: true,
  titleEn: "du or Sie?",
  goal: "Choose between du and Sie when you ask how someone is",
  minutes: 7,
  xp: 30,
  focus: "Wie geht’s dir? · Wie geht es Ihnen?",
  intro: {
    speaker: { person: "lf", initials: "LF" },
    target: "Guten Tag, Herr Schulz. Wie geht es Ihnen?",
    native:
      "A visitor arrives while the team is in the kitchen. Teammates say du; visitors get Sie. This lesson shows the difference.",
  },
  phrases: ["Wie geht’s dir?", "Wie geht es Ihnen?", "Und Ihnen?"],
  vocabulary: [
    {
      word: "Wie geht’s dir?",
      native: "how are you? (to a teammate)",
      example: {
        target: "Hallo, Anna! Wie geht’s dir?",
        native: "Hi, Anna! How are you?",
      },
    },
    {
      word: "Wie geht es Ihnen?",
      native: "how are you? (to a visitor)",
      example: {
        target: "Guten Tag, Herr Schulz. Wie geht es Ihnen?",
        native: "Hello, Mr Schulz. How are you?",
      },
    },
    {
      word: "Und Ihnen?",
      native: "and you? (to a visitor)",
      example: {
        target: "Gut, danke. Und Ihnen?",
        native: "Fine, thanks. And you?",
      },
    },
  ],
  practised: ["Wie geht’s dir?", "Wie geht es Ihnen?", "Und Ihnen?"],
  canDo: [
    "Ask a teammate how they are with du",
    "Ask a visitor politely with Sie",
    "Answer and ask back in the right form",
  ],
  exercises: [
    {
      type: "discover",
      kind: "New phrases",
      title: "Teammate or visitor?",
      sub: "Play each line. Listen for dir with teammates and Ihnen with visitors.",
      lines: [
        {
          speaker: { person: "lf", initials: "LF", label: "Lena" },
          target: "Hallo, Jonas! Wie geht’s dir?",
          native: "Hi, Jonas! How are you?",
          note: "To a teammate, you use du: Wie geht’s dir?",
          saveKey: "U2d",
          topic: "Small talk",
          example: {
            target: "Hallo, Anna! Wie geht’s dir?",
            native: "Hi, Anna! How are you?",
          },
        },
        {
          speaker: { person: "lf", initials: "LF", label: "Lena" },
          target: "Guten Tag, Herr Schulz. Wie geht es Ihnen?",
          native: "Hello, Mr Schulz. How are you?",
          note: "To a visitor or someone you don’t know, you use Sie: Wie geht es Ihnen?",
          saveKey: "U2e",
          topic: "Small talk",
          example: {
            target: "Guten Tag, Herr Schulz. Wie geht es Ihnen?",
            native: "Hello, Mr Schulz. How are you?",
          },
        },
        {
          speaker: { person: "mb", initials: "HS", label: "Herr Schulz" },
          target: "Gut, danke. Und Ihnen?",
          native: "Fine, thanks. And you?",
          note: "Und Ihnen? is the polite way to ask back.",
          saveKey: "U2f",
          topic: "Small talk",
          example: {
            target: "Gut, danke. Und Ihnen?",
            native: "Fine, thanks. And you?",
          },
        },
        {
          speaker: { person: "me", initials: "%I", label: "You" },
          target: "Gut, danke. Und Ihnen?",
          native: "Fine, thanks. And you?",
          note: "Your turn: a visitor asked, so you ask back with Ihnen.",
        },
      ],
    },
    {
      type: "tip",
      kind: "Good to know",
      title: "du or Sie",
      sub: "Pick the form by who you are talking to, not by how you feel.",
      columns: ["", "du (informal)", "Sie (formal)"],
      rows: [
        ["Who", "Teammates, friends", "Visitors, people you don’t know"],
        ["Ask how they are", "Wie geht’s dir?", "Wie geht es Ihnen?"],
        ["Ask back", "Und dir?", "Und Ihnen?"],
      ],
      examples: [
        {
          target: "Hallo, Jonas! Wie geht’s dir?",
          native: "Hi, Jonas! How are you?",
        },
        {
          target: "Guten Tag, Herr Schulz. Wie geht es Ihnen?",
          native: "Hello, Mr Schulz. How are you?",
        },
      ],
      note: "Sie and Ihnen always start with a capital letter. When you aren’t sure, Sie is the polite choice, and people will tell you if du is fine.",
    },
    {
      type: "choice",
      variant: "listening",
      kind: "Listen",
      prompt: "Is Lena speaking formally or informally?",
      optionsLanguage: "native",
      options: ["Formally (Sie)", "Informally (du)"],
      correct: 0,
      alternatives: [],
      feedback: {
        right: "Ihnen is the Sie form, so Lena is being formal.",
        alternative: {},
        wrong: {
          "1": "With du you would hear dir. Lena says Ihnen, which is Sie.",
        },
      },
      topic: "du or Sie",
      listening: {
        clip: "Guten Tag, Herr Schulz. Wie geht es Ihnen?",
        translation: "Hello, Mr Schulz. How are you?",
        meta: "0:04 · Lena and a visitor",
      },
    },
    {
      type: "choice",
      variant: "multiple-choice",
      kind: "Choose the answer",
      prompt:
        "Herr Schulz, a visitor, asks „Wie geht es Ihnen?“ What do you answer?",
      optionsLanguage: "target",
      options: [
        "Gut, danke. Und Ihnen?",
        "Gut, danke. Und dir?",
        "Es geht. Und dir?",
        "Auf Wiedersehen!",
      ],
      correct: 0,
      alternatives: [],
      feedback: {
        right: "A visitor gets Sie, so you ask back with Und Ihnen?",
        alternative: {},
        wrong: {
          "1": "Und dir? is for teammates. To a visitor: Und Ihnen?",
          "2": "Es geht is fine, but Und dir? is for teammates. To a visitor: Und Ihnen?",
          "3": "Auf Wiedersehen is goodbye. He asked how you are: Gut, danke. Und Ihnen?",
        },
      },
      topic: "du or Sie",
    },
    {
      type: "build",
      kind: "Build the sentence",
      prompt: "Ask Herr Schulz how he is",
      sub: "How are you, Mr Schulz?",
      tiles: ["Ihnen,", "Wie", "Schulz?", "geht", "Herr", "es"],
      answer: [1, 3, 5, 0, 4, 2],
      feedback: {
        right:
          "Wie geht es Ihnen, Herr Schulz? The polite question, then his name.",
        wrong:
          "The question comes first, then his name: Wie geht es Ihnen, Herr Schulz?",
      },
      topic: "du or Sie",
    },
    {
      type: "match",
      kind: "Match the meaning",
      prompt: "Match each phrase with who you say it to",
      sub: "Choose a phrase, then who it is for.",
      pairs: [
        { phrase: "Wie geht’s dir?", meaning: "To a teammate: how are you?" },
        { phrase: "Wie geht es Ihnen?", meaning: "To a visitor: how are you?" },
        { phrase: "Und dir?", meaning: "To a teammate: and you?" },
        { phrase: "Und Ihnen?", meaning: "To a visitor: and you?" },
      ],
      meaningOrder: [
        "To a visitor: and you?",
        "To a teammate: how are you?",
        "To a visitor: how are you?",
        "To a teammate: and you?",
      ],
      labels: {
        phrases: "Phrases",
        meanings: "Who it is for",
        empty: "Choose who it is for",
        joiner: " is for ",
      },
      meaningsLanguage: "native",
      explanation:
        "dir goes with du and teammates. Ihnen goes with Sie and visitors.",
      topic: "du or Sie",
    },
    {
      type: "choice",
      variant: "fill",
      kind: "Fill in the blank",
      prompt: "Lena asks her teammate Jonas how he is",
      optionsLanguage: "target",
      options: ["dir", "Ihnen", "danke"],
      correct: 0,
      alternatives: [],
      feedback: {
        right:
          "Wie geht’s dir, Jonas? dir goes with du, and Jonas is a teammate.",
        alternative: {},
        wrong: {
          "1": "Ihnen is for visitors. Jonas is a teammate: Wie geht’s dir?",
          "2": "danke means thanks. The question needs dir: Wie geht’s dir?",
        },
      },
      topic: "du or Sie",
      fill: { before: "Wie geht’s", after: ", Jonas?" },
    },
    {
      type: "conversation",
      kind: "A visitor in the kitchen",
      prompt: "Match the form to the person",
      sub: "Visitors get Sie, teammates get du.",
      turns: [
        {
          speaker: {
            person: "mb",
            initials: "HS",
            label: "Herr Schulz · visitor",
          },
          line: "Guten Tag! Wie geht es Ihnen?",
          translation: "Hello! How are you?",
          task: "Answer politely and ask back",
          options: [
            {
              target: "Gut, danke. Und Ihnen?",
              native: "Fine, thanks. And you? (formal)",
            },
            {
              target: "Gut, danke. Und dir?",
              native: "Fine, thanks. And you? (informal)",
            },
            { target: "Hallo! Ich bin %N.", native: "Hi! I’m %N." },
          ],
          correct: 0,
          alternatives: [],
          feedback: {
            right: "A visitor, so Sie: Und Ihnen?",
            alternative: {},
            wrong: {
              "1": "dir is for teammates. To a visitor: Und Ihnen?",
              "2": "He asked how you are. Answer first: Gut, danke. Und Ihnen?",
            },
          },
        },
        {
          speaker: { person: "jk", initials: "JK", label: "Jonas · teammate" },
          line: "Hallo, %N! Wie geht’s?",
          translation: "Hi, %N! How are you?",
          task: "Answer your teammate and ask back",
          options: [
            {
              target: "Gut, danke. Und dir?",
              native: "Fine, thanks. And you? (informal)",
            },
            {
              target: "Gut, danke. Und Ihnen?",
              native: "Fine, thanks. And you? (formal)",
            },
            { target: "Auf Wiedersehen!", native: "Goodbye!" },
          ],
          correct: 0,
          alternatives: [],
          feedback: {
            right: "A teammate, so du: Und dir?",
            alternative: {},
            wrong: {
              "1": "Ihnen is for visitors. Jonas is a teammate: Und dir?",
              "2": "He has just said hello. Answer him: Gut, danke. Und dir?",
            },
          },
        },
        {
          speaker: { person: "aw", initials: "AW", label: "Anna · teammate" },
          line: "Hallo!",
          translation: "Hi!",
          task: "Ask Anna how she is",
          options: [
            {
              target: "Wie geht’s dir, Anna?",
              native: "How are you, Anna? (informal)",
            },
            {
              target: "Wie geht es Ihnen, Anna?",
              native: "How are you, Anna? (formal)",
            },
            { target: "Danke, Anna!", native: "Thanks, Anna!" },
          ],
          correct: 0,
          alternatives: [],
          feedback: {
            right: "Anna is a teammate: Wie geht’s dir?",
            alternative: {},
            wrong: {
              "1": "Ihnen would sound very formal for a teammate. Say Wie geht’s dir?",
              "2": "She hasn’t done anything to thank her for. Ask how she is: Wie geht’s dir?",
            },
          },
        },
      ],
      closing: {
        speaker: { person: "aw", initials: "AW", label: "Anna" },
        target: "Gut, danke. Und dir?",
        native: "Fine, thanks. And you?",
      },
    },
  ],
}
