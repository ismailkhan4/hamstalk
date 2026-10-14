import type { Lesson } from "@/features/lessons/schema"

/** Unit 3 · Lesson 1: Wie heißt du?. Written for this app; the Unit 3 designs cover Lessons 3 and 4 only. */
export const lesson1: Lesson = {
  id: "a1-u3-l1",
  kind: "lesson",
  title: "Wie heißt du?",
  titleIsGerman: true,
  titleEn: "What’s your name?",
  goal: "Ask someone’s name and give yours, with du and with Sie",
  minutes: 7,
  xp: 30,
  focus: "heißen · Wie heißt du? · Wie heißen Sie?",
  intro: {
    speaker: { person: "cm", initials: "CM" },
    de: "Hallo! Wie heißt du?",
    en: "A new face at the coffee machine. You already know how to say your name. This lesson helps you ask for someone else’s.",
  },
  phrases: ["Wie heißt du?", "Ich heiße …", "Wie heißen Sie?"],
  vocabulary: [
    {
      word: "Wie heißt du?",
      en: "what’s your name? (to a teammate)",
      example: { de: "Hallo! Wie heißt du?", en: "Hi! What’s your name?" },
    },
    {
      word: "Ich heiße …",
      en: "my name is …",
      example: { de: "Ich heiße Clara.", en: "My name is Clara." },
    },
    {
      word: "Wie heißen Sie?",
      en: "what’s your name? (to a visitor)",
      example: {
        de: "Guten Tag! Wie heißen Sie?",
        en: "Hello! What’s your name?",
      },
    },
  ],
  practised: ["Wie heißt du?", "Ich heiße …", "Wie heißen Sie?"],
  canDo: [
    "Ask a teammate’s name with Wie heißt du?",
    "Ask a visitor’s name with Wie heißen Sie?",
    "Give your name with Ich heiße …",
  ],
  exercises: [
    {
      type: "discover",
      kind: "New phrases",
      title: "Names at the coffee machine",
      sub: "Play each line. Listen for heißt with a teammate and heißen with a visitor.",
      lines: [
        {
          speaker: { person: "cm", initials: "CM", label: "Clara" },
          de: "Hallo! Ich bin Clara. Wie heißt du?",
          en: "Hi! I’m Clara. What’s your name?",
          note: "Wie heißt du? asks for a name. You answer with Ich heiße …",
          saveKey: "U3a",
          topic: "Names",
          example: { de: "Hallo! Wie heißt du?", en: "Hi! What’s your name?" },
        },
        {
          speaker: { person: "me", initials: "%I", label: "You" },
          de: "Ich heiße %N. Und du?",
          en: "My name is %N. And you?",
          note: "Und du? now fits again: you asked for her name, so you ask for yours back.",
        },
        {
          speaker: { person: "lf", initials: "LF", label: "Lena" },
          de: "Guten Tag, Herr Schulz. Wie heißen Sie?",
          en: "Hello, Mr Schulz. What’s your name?",
          note: "With Sie, the verb ends in -en: Wie heißen Sie?",
          saveKey: "U3b",
          topic: "Names",
          example: {
            de: "Guten Tag! Wie heißen Sie?",
            en: "Hello! What’s your name?",
          },
        },
        {
          speaker: { person: "mb", initials: "HS", label: "Herr Schulz" },
          de: "Ich heiße Schulz.",
          en: "My name is Schulz.",
          note: "The answer is the same for du and Sie: Ich heiße …",
        },
      ],
    },
    {
      type: "tip",
      kind: "Good to know",
      title: "heißen: three forms",
      sub: "The verb changes its ending with the person. Learn these three as phrases.",
      columns: ["", "heißen · to be called", "Example"],
      rows: [
        ["I", "ich heiße", "Ich heiße %N."],
        ["you (du)", "du heißt", "Wie heißt du?"],
        ["you (Sie)", "Sie heißen", "Wie heißen Sie?"],
      ],
      examples: [
        {
          de: "Wie heißt du? – Ich heiße Clara.",
          en: "What’s your name? – My name is Clara.",
        },
        {
          de: "Wie heißen Sie? – Ich heiße Schulz.",
          en: "What’s your name? – My name is Schulz.",
        },
      ],
      note: "du goes with -t (heißt), Sie goes with -en (heißen), and ich with -e (heiße). The words stay the same; only the ending changes.",
    },
    {
      type: "choice",
      variant: "listening",
      kind: "Listen",
      prompt:
        "A colleague stops you in the hallway. What does she want to know?",
      optionsLanguage: "en",
      options: ["Your name", "How you are", "Where you are from"],
      correct: 0,
      alternatives: [],
      feedback: {
        right: "Wie heißt du? asks for your name.",
        alternative: {},
        wrong: {
          "1": "How you are would be Wie geht’s? Here she says Wie heißt du?, your name.",
          "2": "Where you’re from comes later. Wie heißt du? asks for your name.",
        },
      },
      topic: "Names",
      listening: {
        clip: "Hallo! Wie heißt du?",
        translation: "Hi! What’s your name?",
        meta: "0:02 · Clara",
      },
    },
    {
      type: "choice",
      variant: "multiple-choice",
      kind: "Choose the answer",
      prompt: "Clara asks „Wie heißt du?“ What do you answer?",
      optionsLanguage: "de",
      options: [
        "Ich heiße %N.",
        "Ich bin %N.",
        "Gut, danke.",
        "Freut mich auch!",
      ],
      correct: 0,
      alternatives: [1],
      feedback: {
        right: "Ich heiße %N answers Wie heißt du?",
        alternative: {
          "1": "Ich bin %N works too. Both give your name; heißen matches the question.",
        },
        wrong: {
          "2": "Gut, danke answers Wie geht’s? She asked your name: Ich heiße %N.",
          "3": "Freut mich auch answers Freut mich! She asked for your name: Ich heiße %N.",
        },
      },
      topic: "Names",
    },
    {
      type: "choice",
      variant: "fill",
      kind: "Fill in the blank",
      prompt: "Ask Clara for her name",
      optionsLanguage: "de",
      options: ["heißt", "heiße", "heißen"],
      correct: 0,
      alternatives: [],
      feedback: {
        right: "With du, heißen becomes heißt: Wie heißt du?",
        alternative: {},
        wrong: {
          "1": "heiße goes with ich: Ich heiße … With du, use heißt.",
          "2": "heißen goes with Sie: Wie heißen Sie? With du, use heißt.",
        },
      },
      topic: "Names",
      fill: { before: "Wie", after: "du?" },
    },
    {
      type: "build",
      kind: "Build the sentence",
      prompt: "Ask Herr Schulz for his name",
      sub: "What’s your name? (formal)",
      tiles: ["Sie?", "Wie", "heißen"],
      answer: [1, 2, 0],
      feedback: {
        right:
          "Wie heißen Sie? The question word first, then the verb, then Sie.",
        wrong: "Start with Wie, then heißen, then Sie: Wie heißen Sie?",
      },
      topic: "Names",
    },
    {
      type: "match",
      kind: "Match the meaning",
      prompt: "Match each phrase with its meaning",
      sub: "Choose a phrase, then what it means.",
      pairs: [
        {
          phrase: "Wie heißt du?",
          meaning: "To a teammate: what’s your name?",
        },
        {
          phrase: "Wie heißen Sie?",
          meaning: "To a visitor: what’s your name?",
        },
        { phrase: "Ich heiße …", meaning: "My name is …" },
        { phrase: "Und du?", meaning: "And you?" },
      ],
      meaningOrder: [
        "And you?",
        "To a visitor: what’s your name?",
        "My name is …",
        "To a teammate: what’s your name?",
      ],
      labels: {
        phrases: "Phrases",
        meanings: "Meanings",
        empty: "Choose a meaning",
        joiner: " means ",
      },
      meaningsLanguage: "en",
      explanation:
        "heißt goes with du, heißen with Sie, and Ich heiße … gives your own name.",
      topic: "Names",
    },
    {
      type: "conversation",
      kind: "Names on day one",
      prompt: "Three people ask your name",
      sub: "Match the form to the person.",
      turns: [
        {
          speaker: {
            person: "cm",
            initials: "CM",
            label: "Clara · coffee machine",
          },
          line: "Hallo! Wie heißt du?",
          translation: "Hi! What’s your name?",
          task: "Give your name and ask back",
          options: [
            { de: "Ich heiße %N. Und du?", en: "My name is %N. And you?" },
            { de: "Wie heißen Sie?", en: "What’s your name? (formal)" },
            { de: "Gut, danke.", en: "Fine, thanks." },
          ],
          correct: 0,
          alternatives: [],
          feedback: {
            right: "Your name, then Und du? asks for hers.",
            alternative: {},
            wrong: {
              "1": "That asks her name, but she asked yours first. Answer: Ich heiße %N.",
              "2": "Gut, danke answers Wie geht’s? She asked your name.",
            },
          },
        },
        {
          speaker: { person: "mb", initials: "FW", label: "Frau Wagner · HR" },
          line: "Guten Tag. Wie heißen Sie?",
          translation: "Hello. What’s your name?",
          task: "Greet her and give your name",
          options: [
            { de: "Guten Tag. Ich heiße %N.", en: "Hello. My name is %N." },
            {
              de: "Guten Tag. Wie heißt du?",
              en: "Hello. What’s your name? (informal)",
            },
            {
              de: "Gute Nacht. Ich heiße %N.",
              en: "Good night. My name is %N.",
            },
          ],
          correct: 0,
          alternatives: [],
          feedback: {
            right:
              "She asked with Sie, you answer politely: Guten Tag. Ich heiße %N.",
            alternative: {},
            wrong: {
              "1": "She asked your name. Answer it first: Ich heiße %N.",
              "2": "Gute Nacht is for the end of the day. Greet her: Guten Tag.",
            },
          },
        },
        {
          speaker: { person: "aw", initials: "AW", label: "Anna · team table" },
          line: "Ich bin Anna. Und wie heißt du?",
          translation: "I’m Anna. And what’s your name?",
          task: "Give your name and say you’re glad",
          options: [
            {
              de: "Ich heiße %N. Freut mich!",
              en: "My name is %N. Nice to meet you!",
            },
            { de: "Ich bin Anna.", en: "I’m Anna." },
            { de: "Wie heißen Sie?", en: "What’s your name? (formal)" },
          ],
          correct: 0,
          alternatives: [],
          feedback: {
            right: "Your name, and Freut mich! to be friendly.",
            alternative: {},
            wrong: {
              "1": "That’s her name. She asked for yours: Ich heiße %N.",
              "2": "She’s a teammate, and she asked you. Answer: Ich heiße %N.",
            },
          },
        },
      ],
      closing: {
        speaker: { person: "aw", initials: "AW", label: "Anna" },
        de: "Freut mich auch, %N!",
        en: "Nice to meet you too, %N!",
      },
    },
  ],
}
