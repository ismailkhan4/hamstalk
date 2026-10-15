import type { Lesson } from "@/features/lessons/schema"

/**
 * Unit 3 · Lesson 3: Meet your team. Adapted from the design’s prototype lesson. Differences: the
 * learner’s own country isn’t assumed (exercises say which country to use), and the free-text
 * translation is graded against a list of accepted wordings.
 */
export const lesson3: Lesson = {
  id: "a1-u3-l3",
  kind: "lesson",
  title: "Meet your team",
  titleInTarget: false,
  titleEn: "",
  goal: "Introduce yourself, say what you do and say where you are from",
  minutes: 7,
  xp: 30,
  focus: "sein and heißen · a first look at verb second",
  intro: {
    speaker: { person: "aw", initials: "AW" },
    target: "Hallo! Ich heiße Anna. Ich bin Softwareentwicklerin.",
    native:
      "Anna has just joined the team. Introduce yourself the way she does: your name, your job and a little about your day.",
  },
  phrases: ["Ich bin neu im Team.", "Heute arbeite ich …", "Woher kommst du?"],
  vocabulary: [
    {
      article: "die",
      word: "Softwareentwicklerin",
      native: "software developer (woman)",
      example: {
        target: "Anna ist Softwareentwicklerin.",
        native: "Anna is a software developer.",
      },
    },
    {
      word: "Ich bin neu im Team.",
      native: "I’m new on the team.",
      example: {
        target: "Ja, ich bin neu im Team.",
        native: "Yes, I’m new on the team.",
      },
    },
    {
      word: "Heute arbeite ich …",
      native: "today I’m working on …",
      example: {
        target: "Heute arbeite ich an einer neuen Funktion.",
        native: "Today I’m working on a new feature.",
      },
    },
  ],
  practised: [
    "die Softwareentwicklerin",
    "Ich bin neu im Team.",
    "Heute arbeite ich …",
  ],
  canDo: [
    "Say your name and your job in one introduction",
    "Say you are new on the team",
    "Say what you are working on today",
  ],
  exercises: [
    {
      type: "discover",
      kind: "New phrases",
      title: "Anna’s first day",
      sub: "Play each line as often as you like. Save the ones you want to keep.",
      lines: [
        {
          speaker: { person: "aw", initials: "AW", label: "Anna" },
          target: "Hallo! Ich heiße Anna. Ich bin Softwareentwicklerin.",
          native: "Hi! My name is Anna. I’m a software developer.",
          note: "Jobs come without an article: Ich bin Softwareentwicklerin. For a man: Softwareentwickler.",
          saveKey: "U3f",
          topic: "Introductions",
          article: "die",
          example: {
            target: "Anna ist Softwareentwicklerin.",
            native: "Anna is a software developer.",
          },
        },
        {
          speaker: { person: "jk", initials: "JK", label: "Jonas" },
          target: "Du bist neu im Team, oder?",
          native: "You’re new on the team, right?",
          note: "neu is new, im Team is on the team, and oder? asks for a yes.",
        },
        {
          speaker: { person: "me", initials: "%I", label: "You" },
          target: "Ja, ich bin neu im Team.",
          native: "Yes, I’m new on the team.",
          note: "Ja means yes. Ich bin neu im Team says the same as Jonas, with ich.",
          saveKey: "U3g",
          topic: "Introductions",
        },
        {
          speaker: { person: "aw", initials: "AW", label: "Anna" },
          target: "Heute arbeite ich an einer neuen Funktion.",
          native: "Today I’m working on a new feature.",
          note: "The verb arbeite is the second idea in the sentence, even after Heute.",
          saveKey: "U3h",
          topic: "Word order",
          example: {
            target: "Heute arbeite ich an einer neuen Funktion.",
            native: "Today I’m working on a new feature.",
          },
        },
        {
          speaker: { person: "jk", initials: "JK", label: "Jonas" },
          target: "Und du? Woher kommst du?",
          native: "And you? Where are you from?",
          note: "Woher asks where someone is from. You will answer it next lesson.",
        },
      ],
    },
    {
      type: "tip",
      kind: "Grammar",
      title: "Saying who you are: sein and heißen",
      sub: "Two verbs you’ll use in every introduction.",
      columns: ["", "sein · to be", "heißen · to be called"],
      rows: [
        ["I", "ich bin", "ich heiße"],
        ["you (informal)", "du bist", "du heißt"],
        ["he, she", "er / sie ist", "er / sie heißt"],
      ],
      examples: [
        {
          target: "Ich heiße Anna. Ich bin Softwareentwicklerin.",
          native: "My name is Anna. I’m a software developer.",
        },
        {
          target: "Du bist neu im Team, oder?",
          native: "You’re new on the team, right?",
        },
      ],
      note: "Jobs come without an article in German: Ich bin Softwareentwicklerin.",
    },
    {
      type: "choice",
      variant: "fill",
      kind: "Fill in the blank",
      prompt: "Complete Anna’s sentence",
      optionsLanguage: "target",
      options: ["bin", "bist", "ist"],
      correct: 0,
      alternatives: [],
      feedback: {
        right: "Ich goes with bin: ich bin, du bist, er or sie ist.",
        alternative: {},
        wrong: {
          "1": "Bist goes with du (you). With ich, use bin.",
          "2": "Ist is for er, sie or es. With ich, use bin.",
        },
      },
      topic: "Jobs",
      fill: { before: "Ich", after: "Softwareentwicklerin." },
    },
    {
      type: "choice",
      variant: "multiple-choice",
      kind: "Choose the answer",
      prompt:
        "It’s 9:00 and you arrive at the office. What do you say to Anna?",
      optionsLanguage: "target",
      options: ["Guten Morgen, Anna!", "Gute Nacht, Anna!", "Tschüss, Anna!"],
      correct: 0,
      alternatives: [],
      feedback: {
        right:
          "Guten Morgen works until about 11. Later in the day, say Hallo or Guten Tag.",
        alternative: {},
        wrong: {
          "1": "Gute Nacht means good night. You say it before going to bed.",
          "2": "Tschüss means bye. You say it when you leave.",
        },
      },
      topic: "Greetings",
    },
    {
      type: "build",
      kind: "Build the sentence",
      prompt: "Tell Anna what you’re working on today",
      sub: "I’m working on a new feature today.",
      tiles: ["heute", "Ich", "an einer neuen Funktion.", "arbeite"],
      answer: [1, 3, 0, 2],
      feedback: {
        right:
          "The verb arbeite takes position two: Ich arbeite heute an einer neuen Funktion. Starting with Heute works too: Heute arbeite ich …",
        wrong: "In a German statement the verb comes second: Ich arbeite …",
      },
      topic: "Word order",
    },
    {
      type: "choice",
      variant: "listening",
      kind: "Listen",
      prompt: "What does Jonas want to know?",
      optionsLanguage: "native",
      options: [
        "Where you’re from",
        "What you’re working on",
        "What your name is",
      ],
      correct: 0,
      alternatives: [],
      feedback: {
        right: "Woher means where from. Answer with: Ich komme aus …",
        alternative: {},
        wrong: {
          "1": "That would be a different question. Listen for woher at the start.",
          "2": "That would be: Wie heißt du? Listen again for woher.",
        },
      },
      topic: "Listening",
      listening: {
        clip: "Und du? Woher kommst du?",
        translation: "And you? Where are you from?",
        meta: "0:03 · Jonas",
      },
    },
    {
      type: "translate",
      kind: "Translate",
      prompt: "What does this sentence mean?",
      source: "Ich bin neu im Team.",
      accept: [
        "I am new on the team",
        "I am new in the team",
        "I am new to the team",
        "I am new on this team",
        "I am new in this team",
        "I am the new one on the team",
      ],
      feedback: {
        right: "Exactly. neu means new, and im Team means on (or in) the team.",
        wrong:
          "neu means new and im Team means on the team. A good answer: I’m new on the team.",
      },
      topic: "Introductions",
    },
    {
      type: "conversation",
      kind: "Workplace dialogue",
      prompt: "Lena welcomes you",
      sub: "Answer her two questions.",
      turns: [
        {
          speaker: {
            person: "lf",
            initials: "LF",
            label: "Lena · team kitchen",
          },
          line: "Hallo, %N! Du bist neu im Team, oder?",
          translation: "Hi, %N! You’re new on the team, right?",
          task: "Say yes, you’re new",
          options: [
            {
              target: "Ja, ich bin neu im Team.",
              native: "Yes, I’m new on the team.",
            },
            {
              target: "Ja, du bist neu im Team.",
              native: "Yes, you are new on the team.",
            },
            { target: "Ja, ich heiße neu.", native: "Yes, my name is new." },
          ],
          correct: 0,
          alternatives: [],
          feedback: {
            right: "ich bin: you are talking about yourself.",
            alternative: {},
            wrong: {
              "1": "du bist is for the other person. You say ich bin.",
              "2": "heißen is for names. To say you’re new: Ich bin neu.",
            },
          },
        },
        {
          speaker: {
            person: "lf",
            initials: "LF",
            label: "Lena · team kitchen",
          },
          line: "Hallo %N! Woher kommst du?",
          translation: "Hi %N! Where are you from?",
          task: "Say you’re from Spain (Spanien)",
          options: [
            { target: "Ich komme aus Spanien.", native: "I’m from Spain." },
            { target: "Ich bin aus Spanien.", native: "I’m from Spain." },
            { target: "Ich heiße Spanien.", native: "My name is Spain." },
            { target: "Ich komme Spanien.", native: "I come Spain." },
          ],
          correct: 0,
          alternatives: [1],
          feedback: {
            right: "Ich komme aus plus a country answers Woher?",
            alternative: {
              "1": "Ich bin aus Spanien works as well. Ich komme aus … is the one to learn first.",
            },
            wrong: {
              "2": "Ich heiße … is for your name, not where you come from.",
              "3": "To say where you’re from, add aus: Ich komme aus Spanien.",
            },
          },
        },
      ],
      closing: {
        speaker: { person: "lf", initials: "LF", label: "Lena" },
        target: "Willkommen im Team, %N!",
        native: "Welcome to the team, %N!",
      },
    },
  ],
}
