import type { Lesson } from "@/features/lessons/schema"

/** Unit 3 · Lesson 2: Jobs on the team. Written for this app; the Unit 3 designs cover Lessons 3 and 4 only. */
export const lesson2: Lesson = {
  id: "a1-u3-l2",
  kind: "lesson",
  title: "Jobs on the team",
  titleInTarget: false,
  titleEn: "",
  goal: "Say what you do, and say what a teammate does",
  minutes: 7,
  xp: 30,
  focus: "sein: ich bin, du bist, er / sie ist · jobs",
  intro: {
    speaker: { person: "lf", initials: "LF" },
    target: "Ich bin Teamleiterin.",
    native:
      "Everyone on the team has a role. This lesson helps you say yours and talk about a teammate’s.",
  },
  phrases: ["Ich bin Entwickler.", "Du bist …", "Er ist … / Sie ist …"],
  vocabulary: [
    {
      article: "der",
      word: "Entwickler",
      native: "developer (man)",
      example: { target: "Ich bin Entwickler.", native: "I’m a developer." },
    },
    {
      article: "die",
      word: "Entwicklerin",
      native: "developer (woman)",
      example: {
        target: "Anna ist Entwicklerin.",
        native: "Anna is a developer.",
      },
    },
    {
      article: "die",
      word: "Designerin",
      native: "designer (woman)",
      example: {
        target: "Aylin ist Designerin.",
        native: "Aylin is a designer.",
      },
    },
  ],
  practised: ["der Entwickler", "die Entwicklerin", "die Designerin"],
  canDo: [
    "Say what you do with Ich bin …",
    "Say what a teammate does with Er ist … or Sie ist …",
    "Leave out the article before a job",
  ],
  exercises: [
    {
      type: "discover",
      kind: "New phrases",
      title: "Who does what",
      sub: "Play each line. Listen for bin and ist before the job.",
      lines: [
        {
          speaker: { person: "lf", initials: "LF", label: "Lena" },
          target: "Ich bin Teamleiterin.",
          native: "I’m the team lead.",
          note: "Jobs come without an article: Ich bin Teamleiterin.",
          saveKey: "U3c",
          topic: "Jobs",
          example: {
            target: "Ich bin Teamleiterin.",
            native: "I’m the team lead.",
          },
        },
        {
          speaker: { person: "jk", initials: "JK", label: "Jonas" },
          target: "Ich bin Entwickler.",
          native: "I’m a developer.",
          note: "Entwickler is a man, Entwicklerin a woman.",
          saveKey: "U3d",
          topic: "Jobs",
          example: {
            target: "Ich bin Entwickler.",
            native: "I’m a developer.",
          },
        },
        {
          speaker: { person: "lf", initials: "LF", label: "Lena" },
          target: "Aylin ist Designerin.",
          native: "Aylin is a designer.",
          note: "About someone else, use ist: Aylin ist Designerin.",
          saveKey: "U3e",
          topic: "Jobs",
          example: {
            target: "Aylin ist Designerin.",
            native: "Aylin is a designer.",
          },
        },
        {
          speaker: { person: "me", initials: "%I", label: "You" },
          target: "Ich bin Entwickler.",
          native: "I’m a developer.",
          note: "Your turn. If you are a woman, say Entwicklerin.",
        },
      ],
    },
    {
      type: "tip",
      kind: "Good to know",
      title: "sein: bin, bist, ist",
      sub: "The most common verb. Learn the three forms you need today.",
      columns: ["", "sein · to be", "Example"],
      rows: [
        ["I", "ich bin", "Ich bin Entwickler."],
        ["you (du)", "du bist", "Du bist Designerin."],
        ["he, she", "er / sie ist", "Aylin ist Designerin."],
      ],
      examples: [
        { target: "Ich bin Teamleiterin.", native: "I’m the team lead." },
        {
          target: "Anna ist Entwicklerin. Jonas ist Entwickler.",
          native: "Anna is a developer. Jonas is a developer.",
        },
      ],
      note: "Say your job with no article: Ich bin Entwickler, not “Ich bin ein Entwickler”. Add -in for a woman: Entwickler → Entwicklerin.",
    },
    {
      type: "choice",
      variant: "listening",
      kind: "Listen",
      prompt: "What does Aylin do?",
      optionsLanguage: "native",
      options: [
        "She is a designer",
        "She is a developer",
        "She is the team lead",
      ],
      correct: 0,
      alternatives: [],
      feedback: {
        right: "Designerin: Aylin is a designer.",
        alternative: {},
        wrong: {
          "1": "Entwicklerin would be developer. Listen for the job after ist: Designerin.",
          "2": "Teamleiterin is Lena’s job. Aylin ist Designerin.",
        },
      },
      topic: "Jobs",
      listening: {
        clip: "Aylin ist Designerin.",
        translation: "Aylin is a designer.",
        meta: "0:02 · Lena",
      },
    },
    {
      type: "choice",
      variant: "multiple-choice",
      kind: "Choose the answer",
      prompt: "You are a developer and tell Anna. What do you say?",
      optionsLanguage: "target",
      options: [
        "Ich bin Entwickler.",
        "Ich bin ein Entwickler.",
        "Ich heiße Entwickler.",
      ],
      correct: 0,
      alternatives: [],
      feedback: {
        right: "Ich bin plus your job, with no article.",
        alternative: {},
        wrong: {
          "1": "In this phrase, German leaves out the article: Ich bin Entwickler.",
          "2": "Ich heiße is for your name. For your job: Ich bin Entwickler.",
        },
      },
      topic: "Jobs",
    },
    {
      type: "choice",
      variant: "fill",
      kind: "Fill in the blank",
      prompt: "Say what Aylin does",
      optionsLanguage: "target",
      options: ["ist", "bin", "bist"],
      correct: 0,
      alternatives: [],
      feedback: {
        right: "Aylin is she, so: Aylin ist Designerin.",
        alternative: {},
        wrong: {
          "1": "bin goes with ich. For Aylin, use ist.",
          "2": "bist goes with du. For Aylin, use ist.",
        },
      },
      topic: "Jobs",
      fill: { before: "Aylin", after: "Designerin." },
    },
    {
      type: "build",
      kind: "Build the sentence",
      prompt: "Tell Anna what you do",
      sub: "I’m a developer. (Use the man’s form, Entwickler, for this exercise.)",
      tiles: ["Entwickler.", "Ich", "bin"],
      answer: [1, 2, 0],
      feedback: {
        right: "Ich bin Entwickler. A woman would say Entwicklerin.",
        wrong: "Start with Ich, then bin, then the job: Ich bin Entwickler.",
      },
      topic: "Jobs",
    },
    {
      type: "match",
      kind: "Match the meaning",
      prompt: "Match each job with its meaning",
      sub: "Choose a word, then what it means.",
      pairs: [
        { phrase: "der Entwickler", meaning: "Developer (man)" },
        { phrase: "die Entwicklerin", meaning: "Developer (woman)" },
        { phrase: "die Designerin", meaning: "Designer (woman)" },
        { phrase: "die Teamleiterin", meaning: "Team lead (woman)" },
      ],
      meaningOrder: [
        "Team lead (woman)",
        "Developer (man)",
        "Designer (woman)",
        "Developer (woman)",
      ],
      labels: {
        phrases: "Words",
        meanings: "Meanings",
        empty: "Choose a meaning",
        joiner: " means ",
      },
      meaningsLanguage: "native",
      explanation:
        "Add -in for a woman: Entwickler → Entwicklerin. Designerin and Teamleiterin are women’s forms.",
      topic: "Jobs",
    },
    {
      type: "conversation",
      kind: "Roles on the team",
      prompt: "Say what you do, and what Jonas does",
      sub: "Use bin for yourself and ist for someone else.",
      turns: [
        {
          speaker: { person: "lf", initials: "LF", label: "Lena · kick-off" },
          line: "Ich bin Teamleiterin. Und du?",
          translation: "I’m the team lead. And you?",
          task: "Say you’re a developer",
          options: [
            { target: "Ich bin Entwickler.", native: "I’m a developer. (man)" },
            {
              target: "Ich bin Entwicklerin.",
              native: "I’m a developer. (woman)",
            },
            {
              target: "Ich heiße Entwickler.",
              native: "My name is Developer.",
            },
          ],
          correct: 0,
          alternatives: [1],
          feedback: {
            right: "Ich bin plus your job.",
            alternative: {
              "1": "Entwicklerin is the form for a woman, and it is right too.",
            },
            wrong: {
              "2": "Ich heiße is for your name. For your job: Ich bin Entwickler.",
            },
          },
        },
        {
          speaker: { person: "lf", initials: "LF", label: "Lena · kick-off" },
          line: "Das ist Jonas. Er ist Entwickler.",
          translation: "This is Jonas. He is a developer.",
          task: "Greet Jonas and say you’re a developer too",
          options: [
            {
              target: "Hallo, Jonas! Ich bin auch Entwickler.",
              native: "Hi, Jonas! I’m a developer too.",
            },
            {
              target: "Hallo, Jonas! Du bist Teamleiterin.",
              native: "Hi, Jonas! You are the team lead.",
            },
            {
              target: "Hallo, Lena! Ich bin Jonas.",
              native: "Hi, Lena! I’m Jonas.",
            },
          ],
          correct: 0,
          alternatives: [],
          feedback: {
            right: "You greeted Jonas and used auch for too.",
            alternative: {},
            wrong: {
              "1": "Lena said Jonas is a developer. Teamleiterin is Lena’s job.",
              "2": "You are not Jonas, and Lena introduced him. Greet him: Hallo, Jonas!",
            },
          },
        },
      ],
      closing: {
        speaker: { person: "jk", initials: "JK", label: "Jonas" },
        target: "Freut mich, %N!",
        native: "Nice to meet you, %N!",
      },
    },
  ],
}
