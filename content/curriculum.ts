import type { Article } from "@/components/learning/article-word"
import type { Person } from "@/components/learning/avatar"

export type CefrLevel = "A1" | "A2" | "B1" | "B2"
export type Skill =
  "Listening" | "Speaking" | "Reading" | "Writing" | "Vocabulary"

export type LessonMeta = {
  id: string
  title: string
  titleIsGerman: boolean
  /** One line in English: what the learner will be able to do. */
  goal: string
  minutes: number
  exercises: number
  kind: "lesson" | "review"
  /** Home's mission card, for lessons that have one designed. */
  mission?: {
    description: string
    quote: { person: Person; initials: string; de: string; en: string }
  }
}

export type Word = { article?: Article; word: string }

export type Unit = {
  id: string
  level: CefrLevel
  number: number
  title: string
  summary: string
  description?: string
  canDo?: string[]
  words?: Word[]
  /** `%N` is replaced with the learner's first name. */
  grammar?: string
  skills?: Skill[]
  lessons: LessonMeta[]
}

export type Level = {
  code: CefrLevel
  name: string
  description: string
  units: Unit[]
  checkpoint: { title: string; summary: string }
}

const lessonsPlanned = (
  unitId: string,
  titles: [string, boolean][]
): LessonMeta[] => [
  ...titles.map(([title, titleIsGerman], i) => ({
    id: `${unitId}-l${i + 1}`,
    title,
    titleIsGerman,
    goal: "",
    minutes: 7,
    exercises: 8,
    kind: "lesson" as const,
  })),
  {
    id: `${unitId}-review`,
    title: "Unit review",
    titleIsGerman: false,
    goal: "",
    minutes: 8,
    exercises: 8,
    kind: "review",
  },
]

const a1Units: Unit[] = [
  {
    id: "a1-u1",
    level: "A1",
    number: 1,
    title: "First day at work",
    summary: "Hallo, Tschüss, danke and your name.",
    description:
      "Your first words in the office: hello, goodbye and your name.",
    canDo: [
      "Say hello and goodbye at the right time of day",
      "Say your name",
      "Understand simple greetings",
    ],
    words: [
      { word: "Hallo" },
      { word: "Tschüss" },
      { word: "Guten Morgen" },
      { article: "das", word: "Büro" },
      { word: "danke" },
    ],
    grammar:
      "Fixed phrases with ich: Ich bin %N. Ich heiße %N. Learned as phrases; conjugation comes in Unit 3.",
    skills: ["Listening", "Speaking", "Vocabulary"],
    lessons: [
      {
        id: "a1-u1-l1",
        title: "Hallo!",
        titleIsGerman: true,
        goal: "Say hello and goodbye",
        minutes: 6,
        exercises: 7,
        kind: "lesson",
        mission: {
          description:
            "Hallo, Tschüss and Auf Wiedersehen in seven short exercises, from the bakery on the way in to the end of your first day.",
          quote: {
            person: "mb",
            initials: "MB",
            de: "Hallo!",
            en: "Mia at reception is the first person you’ll greet.",
          },
        },
      },
      {
        id: "a1-u1-l2",
        title: "Guten Morgen, guten Tag",
        titleIsGerman: true,
        goal: "Choose the greeting that fits the time of day",
        minutes: 7,
        exercises: 8,
        kind: "lesson",
        mission: {
          description:
            "Guten Morgen, Guten Tag, Guten Abend and Gute Nacht in eight short exercises, from breakfast at the bakery to the end of the team dinner.",
          quote: {
            person: "bk",
            initials: "FK",
            de: "Guten Morgen!",
            en: "Frau Krüger at the bakery, 7:45 on your second day.",
          },
        },
      },
      {
        id: "a1-u1-l3",
        title: "Ich bin …",
        titleIsGerman: true,
        goal: "Say your name and catch someone else’s",
        minutes: 7,
        exercises: 7,
        kind: "lesson",
        mission: {
          description:
            "Ich bin … and Ich heiße … in seven short exercises: catch your teammates’ names at lunch and give yours.",
          quote: {
            person: "ao",
            initials: "AÖ",
            de: "Ich bin Aylin. Und du?",
            en: "Aylin at the team table, at lunch.",
          },
        },
      },
      {
        id: "a1-u1-l4",
        title: "Danke und bitte",
        titleIsGerman: true,
        goal: "Thank someone, reply to thanks and say sorry",
        minutes: 7,
        exercises: 8,
        kind: "lesson",
        mission: {
          description:
            "Danke, Bitte and Entschuldigung in eight short exercises: a badge, a fixed laptop, a knocked-over coffee.",
          quote: {
            person: "jk",
            initials: "JK",
            de: "Danke, %N!",
            en: "Jonas, after you helped him find a bug.",
          },
        },
      },
      {
        id: "a1-u1-review",
        title: "Unit review",
        titleIsGerman: false,
        goal: "Reception, first morning: listen to four greetings and reply to each",
        minutes: 8,
        exercises: 8,
        kind: "review",
        mission: {
          description:
            "Eight exercises that bring back Lessons 1 to 4 at reception. Nothing new; it shows what to practise next.",
          quote: {
            person: "mb",
            initials: "MB",
            de: "Guten Morgen!",
            en: "Mia at reception, ready for a review of your first week.",
          },
        },
      },
    ],
  },
  {
    id: "a1-u2",
    level: "A1",
    number: 2,
    title: "Greetings and introductions",
    summary: "Wie geht’s? Introduce a colleague, choose du or Sie.",
    description: "Meet people politely and ask how they are.",
    canDo: [
      "Ask and answer “Wie geht’s?”",
      "Introduce a colleague",
      "Choose between du and Sie",
    ],
    words: [
      { word: "Wie geht’s?" },
      { word: "gut" },
      { article: "der", word: "Kollege" },
      { article: "die", word: "Kollegin" },
      { word: "freut mich" },
    ],
    grammar:
      "du and Sie: Wie geht’s dir? with teammates, Wie geht es Ihnen? with HR and strangers.",
    skills: ["Speaking", "Listening", "Vocabulary"],
    lessons: lessonsPlanned("a1-u2", [
      ["Wie geht’s?", true],
      ["du oder Sie?", true],
      ["Das ist Lena", true],
      ["Freut mich!", true],
    ]),
  },
  {
    id: "a1-u3",
    level: "A1",
    number: 3,
    title: "Names, jobs and countries",
    summary: "Say who you are, what you do and where you’re from.",
    description:
      "Introduce yourself at work: your name, your job and where you come from.",
    canDo: [
      "Introduce yourself with your name and job",
      "Ask someone where they’re from",
      "Understand a teammate who introduces themselves",
    ],
    words: [
      { article: "die", word: "Softwareentwicklerin" },
      { article: "der", word: "Beruf" },
      { word: "heißen" },
      { word: "woher" },
      { word: "kommen" },
    ],
    grammar:
      "sein and heißen: ich bin, du bist · ich heiße, du heißt. No article before jobs. First look at verb second: Heute arbeite ich …",
    skills: ["Speaking", "Listening", "Reading", "Vocabulary"],
    lessons: lessonsPlanned("a1-u3", [
      ["Wie heißt du?", true],
      ["Jobs on the team", false],
      ["Meet your team", false],
      ["Woher kommst du?", true],
    ]),
  },
  {
    id: "a1-u4",
    level: "A1",
    number: 4,
    title: "Numbers, dates and time",
    summary: "Meeting times, dates and phone numbers.",
    description: "Meeting times, dates, phone numbers and prices.",
    canDo: [
      "Say and understand times like “um halb zehn”",
      "Give a date and a phone number",
      "Ask when a meeting starts",
    ],
    words: [
      { article: "die", word: "Uhr" },
      { word: "halb" },
      { article: "der", word: "Termin" },
      { word: "heute" },
      { word: "morgen" },
    ],
    grammar:
      "Times with um and am. After a time word the verb stays second: Um zehn beginnt das Meeting.",
    skills: ["Listening", "Speaking", "Vocabulary"],
    lessons: lessonsPlanned("a1-u4", [
      ["Zahlen 0 bis 100", true],
      ["Wie spät ist es?", true],
      ["Termine", true],
      ["Datum und Telefon", true],
    ]),
  },
  {
    id: "a1-u5",
    level: "A1",
    number: 5,
    title: "Basic questions",
    summary: "Wer, was, wann, wo, and yes-or-no questions.",
    description:
      "Find out what you need to know in your first weeks, at work and in town.",
    canDo: [
      "Ask who, what, when and where",
      "Ask yes-or-no questions with the verb first",
      "Understand short directions in the office",
    ],
    words: [
      { word: "wer" },
      { word: "wann" },
      { word: "wo" },
      { article: "die", word: "Küche" },
      { article: "der", word: "Besprechungsraum" },
    ],
    grammar:
      "Questions: question word + verb (Wo ist …?) and yes-or-no questions with the verb first (Hast du kurz Zeit?).",
    skills: ["Speaking", "Listening", "Reading"],
    lessons: lessonsPlanned("a1-u5", [
      ["Wer ist das?", true],
      ["Wo ist der Besprechungsraum?", true],
      ["Wann? Wie lange?", true],
      ["Hast du kurz Zeit?", true],
    ]),
  },
  {
    id: "a1-u6",
    level: "A1",
    number: 6,
    title: "Everyday vocabulary",
    summary: "The office, the canteen, the supermarket: what you need.",
    description:
      "Name what’s around you at work, in the canteen and at the supermarket, and say what you need.",
    canDo: [
      "Name everyday things with der, die or das",
      "Say what you need: Ich brauche einen Laptop",
      "Order food and ask what something costs",
    ],
    words: [
      { article: "der", word: "Laptop" },
      { article: "die", word: "Tastatur" },
      { article: "der", word: "Kaffee" },
      { article: "das", word: "Brötchen" },
      { word: "brauchen" },
    ],
    grammar:
      "der, die, das and ein, eine. After brauchen and haben, der-words change: einen Laptop.",
    skills: ["Vocabulary", "Speaking", "Reading"],
    lessons: lessonsPlanned("a1-u6", [
      ["Im Büro", true],
      ["Ich brauche einen Laptop", true],
      ["In der Kantine", true],
      ["Im Supermarkt", true],
    ]),
  },
  {
    id: "a1-u7",
    level: "A1",
    number: 7,
    title: "Simple sentence structure",
    summary: "Verb second, separable verbs, nicht and kein.",
    description:
      "Build clear statements, questions and negative sentences for a short status update.",
    canDo: [
      "Put the verb second after any first element",
      "Use separable verbs: Die E-Mail kommt nicht an",
      "Say no with nicht and kein",
    ],
    words: [
      { word: "fertig" },
      { word: "schon" },
      { word: "noch nicht" },
      { word: "ankommen" },
      { word: "kein" },
    ],
    grammar:
      "Verb position, consolidated: second in statements, first in yes-or-no questions, separable verbs, and nicht or kein.",
    skills: ["Writing", "Reading", "Speaking"],
    lessons: lessonsPlanned("a1-u7", [
      ["Position zwei", true],
      ["Kommt … an", true],
      ["nicht oder kein?", true],
      ["Noch nicht fertig", true],
    ]),
  },
  {
    id: "a1-u8",
    level: "A1",
    number: 8,
    title: "First standup conversation",
    summary: "Done, today, blocker: your first full update.",
    description:
      "Give a full standup update in simple German: what’s done, what’s next and what blocks you.",
    canDo: [
      "Say what’s done: Die Login-Seite ist fertig",
      "Say what you have to do today with müssen",
      "Ask for help with können",
    ],
    words: [
      { word: "müssen" },
      { word: "können" },
      { article: "das", word: "Problem" },
      { article: "die", word: "Hilfe" },
      { word: "helfen" },
    ],
    grammar:
      "können and müssen: the second verb goes to the end. Heute muss ich die Tests schreiben.",
    skills: ["Speaking", "Listening"],
    lessons: lessonsPlanned("a1-u8", [
      ["Was ist fertig?", true],
      ["Heute muss ich …", true],
      ["Kannst du mir helfen?", true],
      ["Mein erstes Daily", true],
    ]),
  },
]

const previewUnits = (level: CefrLevel, units: [string, string][]): Unit[] =>
  units.map(([title, summary], i) => ({
    id: `${level.toLowerCase()}-u${i + 1}`,
    level,
    number: i + 1,
    title,
    summary,
    lessons: [],
  }))

export const levels: Level[] = [
  {
    code: "A1",
    name: "Beginner foundations",
    description:
      "Sounds, greetings and your first sentences at work and in everyday life.",
    units: a1Units,
    checkpoint: {
      title: "A1 checkpoint",
      summary: "Short tasks in reading, listening, writing and speaking.",
    },
  },
  {
    code: "A2",
    name: "Everyday communication",
    description: "Talk about yesterday, make plans and handle simple messages.",
    units: previewUnits("A2", [
      ["Talking about yesterday", "The Perfekt: Gestern habe ich …"],
      ["Plans and appointments", "Arrange meetings and doctor’s visits."],
      ["Team chat and short messages", "Clear, friendly written German."],
      ["Asking for help", "Explain where you’re stuck."],
      ["Errands and the Bürgeramt", "Forms, appointments and opening hours."],
      ["Small talk", "Weekends, food and the weather."],
      ["Describing a bug", "What happened, what you expected."],
      ["A full standup update", "Yesterday, today and blockers."],
    ]),
    checkpoint: { title: "A2 checkpoint", summary: "Mixed tasks at A2 level." },
  },
  {
    code: "B1",
    name: "Independent communication",
    description:
      "Explain problems, give reasons and follow longer conversations.",
    units: previewUnits("B1", [
      ["Explaining problems", "Wenn …, dann …: cause and effect."],
      ["Asking for clarification", "Check you understood before you start."],
      ["Opinions and reasons", "weil, deshalb, trotzdem."],
      ["Team meetings", "Follow along and add your point."],
      ["Code reviews", "Suggest changes politely."],
      ["Phone calls", "Understand without seeing faces."],
      ["Writing emails", "Structure, tone and standard phrases."],
      ["Telling a story", "Past tenses in a longer narrative."],
    ]),
    checkpoint: { title: "B1 checkpoint", summary: "Mixed tasks at B1 level." },
  },
  {
    code: "B2",
    name: "Confident professional communication",
    description: "Present decisions, handle disagreement and work with nuance.",
    units: previewUnits("B2", [
      ["Following fast discussions", "Keep up when three people talk at once."],
      ["Presenting a decision", "Context, decision, consequences."],
      ["Disagreeing politely", "Push back without sounding blunt."],
      ["Explaining trade-offs", "Weigh options in front of the team."],
      ["Feedback conversations", "Give and receive feedback."],
      ["Interviews", "Talk about your experience in depth."],
      ["Negotiating", "Deadlines, scope and priorities."],
      ["Leading a meeting", "Moderate, summarise, decide."],
    ]),
    checkpoint: { title: "B2 checkpoint", summary: "Mixed tasks at B2 level." },
  },
]

export function getLevel(code: CefrLevel) {
  const level = levels.find((candidate) => candidate.code === code)
  if (!level) throw new Error(`Unknown level ${code}`)
  return level
}

export function getUnit(unitId: string) {
  for (const level of levels) {
    const unit = level.units.find((candidate) => candidate.id === unitId)
    if (unit) return unit
  }
  return null
}

export function findLesson(lessonId: string) {
  for (const level of levels) {
    for (const unit of level.units) {
      const index = unit.lessons.findIndex((lesson) => lesson.id === lessonId)
      const lesson = unit.lessons[index]
      if (lesson) return { level, unit, lesson, index }
    }
  }
  return null
}
