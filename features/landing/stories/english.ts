import type { Learner, Speaker, Story } from "./types"

const priya = {
  person: "lf",
  initials: "PS",
  name: "Priya",
  fullName: "Priya Shah",
} as const satisfies Speaker & { fullName: string }
const tom: Speaker = { person: "jk", initials: "TB", name: "Tom" }
const chloe: Speaker = { person: "ao", initials: "CO", name: "Chloe" }
const you: Learner = { person: "me", initials: "Me" }

/** A London software studio. British English, like the rest of Hamstalk. */
export const english: Story = {
  course: "en",
  available: false,
  company: "Tealeaf Ltd",
  city: { de: "London", en: "London", it: "Londra" },
  room: "Crumpet",
  greeting: "Hello",
  weekend: "Have a lovely weekend!",
  lead: priya,
  helper: tom,
  friend: chloe,
  you,
  days: {
    mon: {
      short: "Mo",
      name: "Monday",
      lines: [
        { from: priya, target: "What are you working on today?" },
        { from: you, target: "Today I’m working on the sign-in page." },
      ],
      glosses: {
        de: [
          "Woran arbeitest du heute?",
          "Heute arbeite ich an der Anmeldeseite.",
        ],
        it: ["A cosa lavori oggi?", "Oggi lavoro alla pagina di login."],
      },
      tips: {
        en: "*I’m working* is for what’s happening right now, not every day.",
        de: "*I’m working* sagt, was du gerade tust – nicht, was du immer tust.",
        it: "*I’m working* indica quello che fai adesso, non tutti i giorni.",
      },
    },
    tue: {
      short: "Tu",
      name: "Tuesday",
      lines: [
        { from: you, target: "Tom, have you got a minute?" },
        { from: tom, target: "Sure! What’s up?" },
      ],
      glosses: {
        de: ["Tom, hast du kurz Zeit?", "Klar! Was ist los?"],
        it: ["Tom, hai un minuto?", "Certo! Che succede?"],
      },
      tips: {
        en: "*Have you got a minute?* is the polite way to interrupt someone.",
        de: "Mit *Have you got a minute?* unterbrichst du jemanden höflich.",
        it: "Con *Have you got a minute?* interrompi qualcuno con gentilezza.",
      },
    },
    wed: {
      short: "We",
      name: "Wednesday",
      lines: [
        { from: you, target: "When I click “Save”, I get an error message." },
        { from: tom, target: "OK, I’ll have a look at the logs." },
      ],
      glosses: {
        de: [
          "Wenn ich auf „Speichern“ klicke, kommt eine Fehlermeldung.",
          "Okay, ich schaue mir die Logs an.",
        ],
        it: [
          "Quando clicco su «Salva», compare un messaggio di errore.",
          "Ok, do un’occhiata ai log.",
        ],
      },
      tips: {
        en: "*I’ll* is for things you decide on the spot.",
        de: "*I’ll* nimmst du für Entscheidungen, die du spontan triffst.",
        it: "*I’ll* si usa per le decisioni prese sul momento.",
      },
    },
    thu: {
      short: "Th",
      name: "Thursday",
      lines: [
        { from: chloe, target: "So, how are you finding London?" },
        { from: you, target: "I love it! But flat hunting is exhausting." },
      ],
      glosses: {
        de: [
          "Und, wie gefällt dir London?",
          "Sehr gut! Aber die Wohnungssuche ist anstrengend.",
        ],
        it: [
          "Allora, come ti trovi a Londra?",
          "Benissimo! Però cercare casa è sfiancante.",
        ],
      },
      tips: {
        en: "*How are you finding …?* asks what you think of something new.",
        de: "Mit *How are you finding …?* fragt man, wie dir etwas Neues gefällt.",
        it: "*How are you finding …?* chiede come ti trovi con qualcosa di nuovo.",
      },
    },
    fri: {
      short: "Fr",
      name: "Friday",
      lines: [
        { from: priya, target: "Looks good! Could you add one more test?" },
        { from: you, target: "Good point, will do." },
      ],
      glosses: {
        de: [
          "Sieht gut aus! Kannst du noch einen Test hinzufügen?",
          "Guter Punkt, mache ich.",
        ],
        it: [
          "Mi sembra a posto! Puoi aggiungere ancora un test?",
          "Giusto, lo faccio.",
        ],
      },
      tips: {
        en: "*Could you …?* sounds softer than *Can you …?*",
        de: "*Could you …?* klingt weicher als *Can you …?*",
        it: "*Could you …?* suona più gentile di *Can you …?*",
      },
    },
  },
  levels: {
    A1: "Hi, I’m Sam. I’m new here.",
    A2: "Yesterday I wrote the tests.",
    B1: "I think the problem is in the cache.",
    B2: "I’d suggest we stabilise the API first.",
  },
}
