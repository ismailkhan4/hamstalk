import type { Lesson } from "@/features/lessons/schema"

/** Unit 3 · Review: Introduce yourself to the whole team. Written for this app. */
export const review: Lesson = {
  id: "a1-u3-review",
  kind: "review",
  title: "Introduce yourself to the whole team",
  titleIsGerman: false,
  titleEn: "",
  goal: "Your first team meeting: give your name, say what you do, say where you’re from and what you speak, using everything from Lessons 1 to 4.",
  minutes: 8,
  xp: 40,
  focus: "Lessons 1 to 4",
  intro: {
    speaker: { person: "lf", initials: "LF" },
    de: "Willkommen im Team! Stell dich bitte vor.",
    en: "Covers names, jobs, introductions and where you’re from. Nothing new: only what you’ve learned in Unit 3. It isn’t a test; it shows what to practise next.",
  },
  phrases: [
    "Wie heißt du?",
    "Jobs on the team",
    "Meet your team",
    "Woher kommst du?",
  ],
  vocabulary: [],
  practised: [],
  canDo: [],
  exercises: [
    {
      type: "choice",
      variant: "listening",
      kind: "Listen",
      prompt: "Frau Wagner from HR speaks to you. Is she formal or informal?",
      optionsLanguage: "en",
      options: ["Formal (Sie)", "Informal (du)"],
      correct: 0,
      alternatives: [],
      feedback: {
        right: "Wie heißen Sie? uses Sie, so she is being formal.",
        alternative: {},
        wrong: {
          "1": "With du you would hear heißt. She says heißen, which goes with Sie.",
        },
      },
      topic: "Names",
      revisits: 0,
      listening: {
        clip: "Guten Tag. Wie heißen Sie?",
        translation: "Hello. What’s your name?",
        meta: "0:03 · Frau Wagner",
      },
    },
    {
      type: "match",
      kind: "Match the meaning",
      prompt: "Match each sentence with its meaning",
      sub: "One sentence from several lessons.",
      pairs: [
        { phrase: "Ich bin Teamleiterin.", meaning: "I’m the team lead" },
        { phrase: "Aylin ist Designerin.", meaning: "Aylin is a designer" },
        { phrase: "Ich komme aus Spanien.", meaning: "I’m from Spain" },
        { phrase: "Ich lerne Deutsch.", meaning: "I’m learning German" },
      ],
      meaningOrder: [
        "I’m learning German",
        "I’m the team lead",
        "I’m from Spain",
        "Aylin is a designer",
      ],
      labels: {
        phrases: "Sentences",
        meanings: "Meanings",
        empty: "Choose a meaning",
        joiner: " means ",
      },
      meaningsLanguage: "en",
      explanation:
        "bin is for ich, ist for someone else, komme aus gives a country and lerne a language you’re learning.",
      topic: "Unit 3",
      revisits: 1,
    },
    {
      type: "choice",
      variant: "multiple-choice",
      kind: "Choose the answer",
      prompt: "Anna asks „Wie heißt du?“ What do you answer?",
      optionsLanguage: "de",
      options: [
        "Ich heiße %N. Und du?",
        "Wie heißen Sie?",
        "Ich komme aus Spanien.",
      ],
      correct: 0,
      alternatives: [],
      feedback: {
        right: "Your name, then Und du? asks for hers.",
        alternative: {},
        wrong: {
          "1": "That asks her name with Sie, and she asked yours. Answer: Ich heiße %N.",
          "2": "That says where you’re from. She asked your name: Ich heiße %N.",
        },
      },
      topic: "Names",
      revisits: 0,
    },
    {
      type: "choice",
      variant: "fill",
      kind: "Fill in the blank",
      prompt: "Say what Jonas does",
      optionsLanguage: "de",
      options: ["ist", "bin", "bist"],
      correct: 0,
      alternatives: [],
      feedback: {
        right: "Jonas is he, so: Jonas ist Entwickler.",
        alternative: {},
        wrong: {
          "1": "bin goes with ich. For Jonas, use ist.",
          "2": "bist goes with du. For Jonas, use ist.",
        },
      },
      topic: "Jobs",
      revisits: 1,
      fill: { before: "Jonas", after: "Entwickler." },
    },
    {
      type: "translate",
      kind: "Translate",
      prompt: "What does this sentence mean?",
      source: "Heute arbeite ich an einer neuen Funktion.",
      accept: [
        "Today I am working on a new feature",
        "Today I work on a new feature",
        "I am working on a new feature today",
        "Today I am working on a new function",
      ],
      feedback: {
        right:
          "Heute is today, arbeite ich is I work, and an einer neuen Funktion is on a new feature.",
        wrong:
          "Heute means today, arbeite ich means I’m working, and an einer neuen Funktion means on a new feature.",
      },
      topic: "Word order",
      revisits: 2,
    },
    {
      type: "choice",
      variant: "listening",
      kind: "Listen",
      prompt: "Which language does Clara speak besides English?",
      optionsLanguage: "en",
      options: ["French", "Spanish", "German"],
      correct: 0,
      alternatives: [],
      feedback: {
        right: "Französisch: French.",
        alternative: {},
        wrong: {
          "1": "Spanisch is Spanish. Clara says Französisch, French.",
          "2": "Deutsch is German, which she is still learning. She says Französisch.",
        },
      },
      topic: "Languages",
      revisits: 3,
      listening: {
        clip: "Ich komme aus Frankreich. Ich spreche Französisch und Englisch.",
        translation: "I’m from France. I speak French and English.",
        meta: "0:05 · Clara",
      },
    },
    {
      type: "build",
      kind: "Build the sentence",
      prompt: "Say where you’re from",
      sub: "I’m from Spain.",
      tiles: ["Ich", "aus", "komme", "Spanien."],
      answer: [0, 2, 1, 3],
      feedback: {
        right:
          "Ich komme aus Spanien. The verb is second, and aus comes before the country.",
        wrong:
          "Ich first, then the verb komme, then aus and the country: Ich komme aus Spanien.",
      },
      topic: "Where from",
      revisits: 3,
    },
    {
      type: "conversation",
      kind: "The whole team",
      prompt: "Introduce yourself to everyone",
      sub: "Four people, four questions.",
      turns: [
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
            { de: "Ich bin Teamleiterin.", en: "I’m the team lead." },
          ],
          correct: 0,
          alternatives: [],
          feedback: {
            right: "A polite greeting and your name.",
            alternative: {},
            wrong: {
              "1": "She asked your name. Answer it first: Ich heiße %N.",
              "2": "That says what you do, and she asked your name: Ich heiße %N.",
            },
          },
          revisits: 0,
        },
        {
          speaker: { person: "lf", initials: "LF", label: "Lena · team lead" },
          line: "Ich bin Teamleiterin. Und du?",
          translation: "I’m the team lead. And you?",
          task: "Say you’re a developer",
          options: [
            { de: "Ich bin Entwickler.", en: "I’m a developer. (man)" },
            { de: "Ich bin Entwicklerin.", en: "I’m a developer. (woman)" },
            { de: "Ich heiße Entwickler.", en: "My name is Developer." },
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
          revisits: 1,
        },
        {
          speaker: { person: "jk", initials: "JK", label: "Jonas · developer" },
          line: "Du bist neu im Team, oder? Woher kommst du?",
          translation: "You’re new on the team, right? Where are you from?",
          task: "Say yes and that you’re from Spain",
          options: [
            {
              de: "Ja, ich bin neu. Ich komme aus Spanien.",
              en: "Yes, I’m new. I’m from Spain.",
            },
            {
              de: "Ja, du bist neu. Ich heiße Spanien.",
              en: "Yes, you are new. My name is Spain.",
            },
            {
              de: "Ja, ich bin neu. Ich komme Spanien.",
              en: "Yes, I’m new. I come Spain.",
            },
          ],
          correct: 0,
          alternatives: [],
          feedback: {
            right: "ich bin neu, and Ich komme aus + country.",
            alternative: {},
            wrong: {
              "1": "du bist is for the other person, and Ich heiße is for a name. Say: Ich bin neu. Ich komme aus Spanien.",
              "2": "To say where you’re from, add aus: Ich komme aus Spanien.",
            },
          },
          revisits: 2,
        },
        {
          speaker: {
            person: "cm",
            initials: "CM",
            label: "Clara · design team",
          },
          line: "Cool! Welche Sprachen sprichst du?",
          translation: "Cool! Which languages do you speak?",
          task: "Say you speak Spanish and English, and are learning German",
          options: [
            {
              de: "Ich spreche Spanisch und Englisch. Und ich lerne Deutsch.",
              en: "I speak Spanish and English. And I’m learning German.",
            },
            {
              de: "Ich lerne Spanisch und Englisch.",
              en: "I’m learning Spanish and English.",
            },
            { de: "Ich komme aus Spanisch.", en: "I’m from Spanish." },
          ],
          correct: 0,
          alternatives: [],
          feedback: {
            right: "spreche for the languages you speak, lerne for German.",
            alternative: {},
            wrong: {
              "1": "You already speak Spanish and English: Ich spreche … Ich lerne is for German.",
              "2": "Spanisch is a language, not a country. Use spreche: Ich spreche Spanisch.",
            },
          },
          revisits: 3,
        },
      ],
      closing: {
        speaker: { person: "lf", initials: "LF", label: "Lena" },
        de: "Willkommen im Team, %N!",
        en: "Welcome to the team, %N!",
      },
    },
  ],
  revisitedLessons: [
    { lessonId: "a1-u3-l1", label: "Lesson 1", title: "Wie heißt du?" },
    { lessonId: "a1-u3-l2", label: "Lesson 2", title: "Jobs on the team" },
    { lessonId: "a1-u3-l3", label: "Lesson 3", title: "Meet your team" },
    { lessonId: "a1-u3-l4", label: "Lesson 4", title: "Woher kommst du?" },
  ],
}
