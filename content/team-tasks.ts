/**
 * The two workplace tasks that open when Unit 3 is finished: a ticket to read and answer, and a
 * message from a teammate to reply to. Both are practice: nothing is sent and nothing is saved, and
 * the teammates are fictional. Every word the learner has not met is glossed beside the text.
 */

export const TICKET_UNIT_ID = "a1-u3"

export type Gloss = {
  article?: "der" | "die" | "das"
  word: string
  en: string
  forms?: string
}

export const ticket = {
  id: "KLAR-142",
  title: { de: "Neue Anmeldung testen", en: "Test the new sign-in" },
  status: { de: "Offen", en: "open" },
  fields: [
    { de: "Priorität", en: "priority", value: { de: "Hoch", en: "high" } },
    {
      de: "Erstellt von",
      en: "created by",
      value: { de: "Aylin Öztürk", en: "" },
    },
    {
      de: "Zuständig",
      en: "assigned to",
      value: { de: "%N (du)", en: "" },
    },
  ],
  body: {
    de: "Hallo %N, die neue Anmeldung ist online. Bitte heute testen: E-Mail und Passwort. Danke!",
    en: "Hi %N, the new sign-in is live. Please test it today: email and password. Thanks!",
  },
  words: [
    { article: "die", word: "Anmeldung", en: "sign-in" },
    { word: "testen", en: "to test", forms: "ich teste, du testest" },
    { word: "neu", en: "new" },
    { word: "heute", en: "today" },
    { article: "das", word: "Passwort", en: "password" },
  ] satisfies Gloss[],
  task: {
    title: "Tell Lena what you’re doing today",
    prompt:
      "Build the sentence: Today I’m testing the sign-in. Start with Heute.",
    tiles: ["Heute", "teste", "die Anmeldung.", "ich"],
    answer: [0, 1, 3, 2],
    right:
      "Heute teste ich die Anmeldung. Heute takes position one, so the verb teste comes second and ich follows it.",
    wrong:
      "After Heute the verb comes next, then ich: Heute teste ich die Anmeldung.",
  },
}

export type ChatReply = {
  de: string
  en: string
  correct: boolean
  title?: string
  note: string
}

export const chat = {
  from: { name: "Jonas Krüger", initials: "JK", time: "14:02" },
  message: {
    de: "Hey %N, kannst du kurz auf meinen Pull Request schauen? Ich brauche ein Review bis 15 Uhr.",
    en: "Hey %N, can you take a quick look at my pull request? I need a review by 3 pm.",
  },
  chips: [
    { word: "kurz", en: "quickly, briefly" },
    { word: "schauen auf", en: "to look at" },
    { word: "bis 15 Uhr", en: "by 3 pm" },
  ],
  replies: [
    {
      de: "Klar, ich schaue gleich.",
      en: "Sure, I’ll take a look right away.",
      correct: true,
      note: "Friendly, informal like Jonas, and “gleich” tells him it will happen well before 15 Uhr.",
    },
    {
      de: "Ja, ich schaue morgen.",
      en: "Yes, I’ll look tomorrow.",
      correct: false,
      title: "Too late for Jonas",
      note: "Your German is correct, but Jonas needs the review by 15 Uhr today. Morgen means tomorrow.",
    },
    {
      de: "Können Sie das bitte wiederholen?",
      en: "Could you repeat that, please? (formal)",
      correct: false,
      title: "Correct German, wrong tone",
      note: "Sie is the formal you. Teammates use du, and Jonas’s message was clear, so there is nothing to repeat.",
    },
  ] satisfies ChatReply[],
  modelReplies: [
    "Klar, ich schaue gleich.",
    "Ja, mach ich. Ich schaue es mir bis 15 Uhr an.",
  ],
  checklist: [
    { text: "Did you use du? Teammates use the informal du.", example: "" },
    { text: "Did you say when? Jonas needs it by 15 Uhr.", example: "" },
    { text: "Is the verb in position two?", example: "Ich schaue …" },
  ],
}
