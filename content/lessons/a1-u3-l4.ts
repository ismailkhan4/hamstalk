import type { Lesson } from "@/features/lessons/schema"

/**
 * Unit 3 · Lesson 4: Woher kommst du?. Adapted from the design’s prototype lesson. Differences: the
 * learner’s own country and languages aren’t assumed, so the exercises name Spain, Spanish and
 * English, and the free-order “build your introduction” has one fixed order.
 */
export const lesson4: Lesson = {
  id: "a1-u3-l4",
  kind: "lesson",
  title: "Woher kommst du?",
  titleIsGerman: true,
  titleEn: "Where are you from?",
  goal: "Ask where someone is from, say where you’re from and talk about the languages you speak",
  minutes: 10,
  xp: 30,
  focus: "kommen aus · sprechen · lernen",
  intro: {
    speaker: { person: "cm", initials: "CM" },
    de: "Hallo! Ich bin Clara, ich bin neu im Team.",
    en: "Clara Martin starts in the design team today. You’ll talk to her at the end of this lesson.",
  },
  phrases: ["Woher kommst du?", "Ich komme aus …", "sprechen", "lernen"],
  vocabulary: [
    {
      word: "Woher kommst du?",
      en: "where are you from?",
      example: {
        de: "Woher kommst du? – Ich komme aus Spanien.",
        en: "Where are you from? – I’m from Spain.",
      },
    },
    {
      word: "Ich komme aus …",
      en: "I’m from …",
      example: { de: "Ich komme aus Deutschland.", en: "I’m from Germany." },
    },
    {
      word: "sprechen",
      en: "to speak",
      example: {
        de: "Ich spreche Spanisch und Englisch.",
        en: "I speak Spanish and English.",
      },
    },
    {
      word: "lernen",
      en: "to learn",
      example: { de: "Ich lerne Deutsch.", en: "I’m learning German." },
    },
    {
      article: "die",
      word: "Sprache",
      en: "language",
      example: { de: "Deutsch ist eine Sprache.", en: "German is a language." },
    },
  ],
  practised: [
    "Woher kommst du?",
    "Ich komme aus …",
    "sprechen",
    "lernen",
    "die Sprache",
  ],
  canDo: [
    "Ask where someone is from, with du and with Sie",
    "Say where you’re from: Ich komme aus …",
    "Say which languages you speak and which one you’re learning",
  ],
  exercises: [
    {
      type: "discover",
      kind: "New phrases",
      title: "Lena meets a new colleague in the team kitchen",
      sub: "Play each line as often as you like. Save the ones you want to keep.",
      lines: [
        {
          speaker: { person: "lf", initials: "LF", label: "Lena" },
          de: "Hallo! Ich heiße Lena. Woher kommst du?",
          en: "Hi! My name is Lena. Where are you from?",
          note: "Woher kommst du? asks where someone is from.",
          saveKey: "L4a",
          topic: "Where from",
          example: { de: "Woher kommst du?", en: "Where are you from?" },
        },
        {
          speaker: { person: "me", initials: "%I", label: "You" },
          de: "Ich komme aus Spanien.",
          en: "I’m from Spain.",
          note: "Ich komme aus + country. Use your own country.",
          saveKey: "L4b",
          topic: "Where from",
        },
        {
          speaker: { person: "me", initials: "%I", label: "You" },
          de: "Ich spreche Spanisch und Englisch.",
          en: "I speak Spanish and English.",
          note: "sprechen + the languages you speak.",
          saveKey: "L4c",
          topic: "Languages",
        },
        {
          speaker: { person: "me", initials: "%I", label: "You" },
          de: "Ich lerne Deutsch.",
          en: "I’m learning German.",
          note: "lernen + the language you’re learning.",
          saveKey: "L4d",
          topic: "Languages",
        },
        {
          speaker: { person: "lf", initials: "LF", label: "Lena" },
          de: "Super! Ich komme aus Deutschland, aus Köln.",
          en: "Great! I’m from Germany, from Cologne.",
          note: "With Sie, for HR, customers and people you don’t know: Woher kommen Sie?",
          saveKey: "L4e",
          topic: "Where from",
          example: {
            de: "Woher kommen Sie?",
            en: "Where are you from? (formal)",
          },
        },
      ],
    },
    {
      type: "choice",
      variant: "listening",
      kind: "Listen",
      prompt: "Which language is Jonas learning?",
      optionsLanguage: "en",
      options: ["Spanish", "English", "German"],
      correct: 0,
      alternatives: [],
      feedback: {
        right:
          "Und ich lerne Spanisch: Jonas is learning Spanish. He already speaks German and English.",
        alternative: {},
        wrong: {
          "1": "Jonas already speaks English: Ich spreche Deutsch und Englisch. Listen for lerne, the language he’s learning.",
          "2": "German is a language Jonas speaks. Listen for lerne near the end.",
        },
      },
      topic: "Languages",
      listening: {
        clip: "Hallo, ich bin Jonas. Ich komme aus Hamburg. Ich spreche Deutsch und Englisch. Und ich lerne Spanisch.",
        translation:
          "Hi, I’m Jonas. I’m from Hamburg. I speak German and English. And I’m learning Spanish.",
        meta: "0:08 · Jonas",
      },
    },
    {
      type: "match",
      kind: "Countries and languages",
      prompt: "Match each country with its language",
      sub: "Choose a country, then its language. Countries take capitals, and so do languages.",
      pairs: [
        { phrase: "Deutschland", meaning: "Deutsch" },
        { phrase: "Frankreich", meaning: "Französisch" },
        { phrase: "Spanien", meaning: "Spanisch" },
        { phrase: "Pakistan", meaning: "Urdu" },
      ],
      meaningOrder: ["Spanisch", "Urdu", "Deutsch", "Französisch"],
      labels: {
        phrases: "Countries",
        meanings: "Languages",
        empty: "Choose a language",
        joiner: " → ",
      },
      meaningsLanguage: "de",
      explanation:
        "Many languages end in -isch: Spanien → Spanisch, Frankreich → Französisch. Deutschland → Deutsch.",
      topic: "Languages",
    },
    {
      type: "tip",
      kind: "Grammar",
      title: "Where from, and which languages",
      sub: "kommen and sprechen in the forms you need today.",
      columns: ["", "kommen · to come", "sprechen · to speak"],
      rows: [
        ["I", "ich komme", "ich spreche"],
        ["you (teammate)", "du kommst", "du sprichst"],
        ["he, she", "er / sie kommt", "er / sie spricht"],
        ["you (Sie)", "Sie kommen", "Sie sprechen"],
      ],
      examples: [
        {
          de: "Woher kommst du? – Ich komme aus Spanien.",
          en: "Where are you from? – I’m from Spain.",
        },
        {
          de: "Woher kommen Sie? – Ich komme aus Deutschland.",
          en: "Where are you from? (Sie) – I’m from Germany.",
        },
        {
          de: "Lena spricht Deutsch. Ich lerne Deutsch.",
          en: "Lena speaks German. I’m learning German.",
        },
      ],
      note: "Woher? asks where someone is from; answer with aus and the country. sprechen changes its vowel with du and er or sie: du sprichst, sie spricht. lernen works like kommen: ich lerne, du lernst.",
    },
    {
      type: "choice",
      variant: "fill",
      kind: "Fill in the blank",
      prompt: "Ask Clara where she’s from",
      optionsLanguage: "de",
      options: ["kommst", "komme", "kommt"],
      correct: 0,
      alternatives: [],
      feedback: {
        right: "With du, kommen becomes kommst: Woher kommst du?",
        alternative: {},
        wrong: {
          "1": "komme goes with ich: Ich komme aus … With du, use kommst.",
          "2": "kommt goes with er or sie: Lena kommt aus Deutschland. With du, use kommst.",
        },
      },
      topic: "Where from",
      fill: { before: "Woher", after: "du?" },
    },
    {
      type: "choice",
      variant: "multiple-choice",
      kind: "Choose the answer",
      prompt:
        "Frau Wagner from HR meets you for the first time. What does she ask?",
      optionsLanguage: "de",
      options: ["Woher kommen Sie?", "Woher kommst du?", "Wo kommen Sie?"],
      correct: 0,
      alternatives: [],
      feedback: {
        right:
          "Frau Wagner uses Sie with someone she doesn’t know yet: Woher kommen Sie?",
        alternative: {},
        wrong: {
          "1": "Woher kommst du? is for teammates and friends. With someone new at HR, people use Sie: Woher kommen Sie?",
          "2": "Wo asks where something is. Woher asks where someone is from.",
        },
      },
      topic: "du or Sie",
    },
    {
      type: "choice",
      variant: "fill",
      kind: "Fill in the blank",
      prompt:
        "Say which languages Lena speaks. Lena speaks German and English.",
      optionsLanguage: "de",
      options: ["spricht", "sprichst", "spreche"],
      correct: 0,
      alternatives: [],
      feedback: {
        right:
          "With er or sie, sprechen becomes spricht: Lena spricht Deutsch und Englisch.",
        alternative: {},
        wrong: {
          "1": "sprichst goes with du: Du sprichst … For Lena, use spricht.",
          "2": "spreche goes with ich. For Lena, use spricht.",
        },
      },
      topic: "Languages",
      fill: { before: "Lena", after: "Deutsch und Englisch." },
    },
    {
      type: "choice",
      variant: "multiple-choice",
      kind: "Choose the answer",
      prompt:
        "You speak Spanish and English, and you’re learning German. What do you say?",
      optionsLanguage: "de",
      options: [
        "Ich spreche Spanisch und Englisch. Ich lerne Deutsch.",
        "Ich lerne Spanisch und Englisch. Ich spreche Deutsch.",
        "Ich spreche Spanisch und Englisch. Ich lerne Spanien.",
      ],
      correct: 0,
      alternatives: [],
      feedback: {
        right:
          "spreche for the languages you already speak, lerne for the one you’re learning.",
        alternative: {},
        wrong: {
          "1": "That says you’re learning Spanish and English and already speak German. Swap them: Ich spreche Spanisch und Englisch. Ich lerne Deutsch.",
          "2": "Spanien is a country, not a language. You learn a language: Ich lerne Deutsch.",
        },
      },
      topic: "Languages",
    },
    {
      type: "build",
      kind: "Build your introduction",
      prompt: "Introduce yourself to Clara",
      sub: "Greet her, give your name, say you’re from Spain, say you speak Spanish and English, and that you’re learning German.",
      tiles: [
        "Ich spreche Spanisch und Englisch.",
        "Hallo!",
        "Ich lerne Deutsch.",
        "Ich heiße %N.",
        "Ich komme aus Spanien.",
        "Ich komme Spanien.",
        "Ich spreche Deutsch.",
      ],
      answer: [1, 3, 4, 0, 2],
      feedback: {
        right:
          "A complete introduction: greeting, name, where you’re from, languages and what you’re learning.",
        wrong:
          "Start with the greeting and your name. To say where you’re from, add aus: Ich komme aus Spanien. You speak Spanish and English, and you learn German.",
      },
      topic: "Introductions",
    },
    {
      type: "conversation",
      kind: "Workplace conversation",
      prompt: "Meet Clara from the design team",
      sub: "Answer her questions, then ask her one back.",
      turns: [
        {
          speaker: {
            person: "cm",
            initials: "CM",
            label: "Clara · design team",
          },
          line: "Hallo! Ich bin Clara, ich bin neu im Designteam. Woher kommst du?",
          translation:
            "Hi! I’m Clara, I’m new in the design team. Where are you from?",
          task: "Say you’re from Spain",
          options: [
            { de: "Ich komme aus Spanien.", en: "I’m from Spain." },
            { de: "Ich heiße Spanien.", en: "My name is Spain." },
            { de: "Ich spreche Spanien.", en: "I speak Spain." },
          ],
          correct: 0,
          alternatives: [],
          feedback: {
            right: "Ich komme aus + country answers Woher?",
            alternative: {},
            wrong: {
              "1": "Ich heiße … is for your name. For where you’re from: Ich komme aus …",
              "2": "Spanien is a country, and sprechen goes with a language. Say: Ich komme aus Spanien.",
            },
          },
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
              de: "Ich komme aus Spanisch und Englisch.",
              en: "I’m from Spanish and English.",
            },
            {
              de: "Ich lerne Spanisch und Englisch.",
              en: "I’m learning Spanish and English.",
            },
          ],
          correct: 0,
          alternatives: [],
          feedback: {
            right: "spreche for the languages you speak, lerne for German.",
            alternative: {},
            wrong: {
              "1": "Spanish and English are languages, so use sprechen: Ich spreche Spanisch und Englisch.",
              "2": "Ich lerne means you’re still learning them. You already speak Spanish and English: Ich spreche …",
            },
          },
        },
        {
          speaker: {
            person: "cm",
            initials: "CM",
            label: "Clara · design team",
          },
          line: "Toll! Dein Deutsch ist schon gut.",
          translation: "Great! Your German is already good.",
          task: "Thank her and ask where she’s from",
          options: [
            {
              de: "Danke! Und du? Woher kommst du?",
              en: "Thanks! And you? Where are you from?",
            },
            {
              de: "Danke! Und Sie? Woher kommen Sie?",
              en: "Thanks! And you? Where are you from? (Sie)",
            },
            { de: "Danke! Wo bist du?", en: "Thanks! Where are you?" },
          ],
          correct: 0,
          alternatives: [],
          feedback: {
            right:
              "Clara uses du with you, so you use du too: Woher kommst du?",
            alternative: {},
            wrong: {
              "1": "Clara is a teammate and says du to you, so answer with du: Woher kommst du?",
              "2": "Wo bist du? asks where she is right now. To ask where she’s from: Woher kommst du?",
            },
          },
        },
      ],
      closing: {
        speaker: { person: "cm", initials: "CM", label: "Clara" },
        de: "Ich komme aus Frankreich, aus Lyon. Ich spreche Französisch, Englisch und ein bisschen Deutsch.",
        en: "I’m from France, from Lyon. I speak French, English and a little German.",
      },
    },
  ],
}
