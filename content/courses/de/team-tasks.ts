/**
 * The two workplace tasks that open when Unit 3 is finished: a ticket to read and answer, and a
 * message from a teammate to reply to. Both are practice: nothing is sent and nothing is saved, and
 * the teammates are fictional. Every word the learner has not met is glossed beside the text.
 */

export const TICKET_UNIT_ID = "a1-u3"

export type Gloss = {
  article?: "der" | "die" | "das"
  word: string
  native: string
  forms?: string
}

export const ticket = {
  id: "HAMS-142",
  title: { target: "Neue Anmeldung testen", native: "Test the new sign-in" },
  status: { target: "Offen", native: "open" },
  fields: [
    {
      target: "Priorität",
      native: "priority",
      value: { target: "Hoch", native: "high" },
    },
    {
      target: "Erstellt von",
      native: "created by",
      value: { target: "Aylin Öztürk", native: "" },
    },
    {
      target: "Zuständig",
      native: "assigned to",
      value: { target: "%N (du)", native: "" },
    },
  ],
  body: {
    target:
      "Hallo %N, die neue Anmeldung ist online. Bitte heute testen: E-Mail und Passwort. Danke!",
    native:
      "Hi %N, the new sign-in is live. Please test it today: email and password. Thanks!",
  },
  words: [
    { article: "die", word: "Anmeldung", native: "sign-in" },
    { word: "testen", native: "to test", forms: "ich teste, du testest" },
    { word: "neu", native: "new" },
    { word: "heute", native: "today" },
    { article: "das", word: "Passwort", native: "password" },
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
  target: string
  native: string
  correct: boolean
  title?: string
  note: string
}

export const chat = {
  from: { name: "Jonas Krüger", initials: "JK", time: "14:02" },
  message: {
    target:
      "Hey %N, kannst du kurz auf meinen Pull Request schauen? Ich brauche ein Review bis 15 Uhr.",
    native:
      "Hey %N, can you take a quick look at my pull request? I need a review by 3 pm.",
  },
  chips: [
    { word: "kurz", native: "quickly, briefly" },
    { word: "schauen auf", native: "to look at" },
    { word: "bis 15 Uhr", native: "by 3 pm" },
  ],
  replies: [
    {
      target: "Klar, ich schaue gleich.",
      native: "Sure, I’ll take a look right away.",
      correct: true,
      note: "Friendly, informal like Jonas, and “gleich” tells him it will happen well before 15 Uhr.",
    },
    {
      target: "Ja, ich schaue morgen.",
      native: "Yes, I’ll look tomorrow.",
      correct: false,
      title: "Too late for Jonas",
      note: "Your German is correct, but Jonas needs the review by 15 Uhr today. Morgen means tomorrow.",
    },
    {
      target: "Können Sie das bitte wiederholen?",
      native: "Could you repeat that, please? (formal)",
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
