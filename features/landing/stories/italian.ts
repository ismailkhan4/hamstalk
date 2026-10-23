import type { Learner, Speaker, Story } from "./types"

const giulia = {
  person: "lf",
  initials: "GR",
  name: "Giulia",
  fullName: "Giulia Romano",
} as const satisfies Speaker & { fullName: string }
const marco: Speaker = { person: "jk", initials: "MC", name: "Marco" }
const sara: Speaker = { person: "ao", initials: "SB", name: "Sara" }
const you: Learner = { person: "me", initials: "Tu" }

/** A Milan product team. Italian weekdays are written in lower case. */
export const italian: Story = {
  course: "it",
  available: false,
  company: "Moka S.r.l.",
  city: { de: "Mailand", en: "Milan", it: "Milano" },
  room: "Cornetto",
  greeting: "Ciao",
  weekend: "Buon fine settimana!",
  lead: giulia,
  helper: marco,
  friend: sara,
  you,
  days: {
    mon: {
      short: "Lu",
      name: "lunedì",
      lines: [
        { from: giulia, target: "Cosa fai oggi?" },
        { from: you, target: "Oggi lavoro alla pagina di login." },
      ],
      glosses: {
        en: [
          "What are you doing today?",
          "Today I’m working on the login page.",
        ],
        de: ["Was machst du heute?", "Heute arbeite ich an der Login-Seite."],
      },
      tips: {
        en: "No *io* needed: *lavoro* already means “I work”.",
        de: "Kein *io* nötig: *lavoro* heißt schon „ich arbeite“.",
        it: "Niente *io*: *lavoro* dice già chi sta lavorando.",
      },
    },
    tue: {
      short: "Ma",
      name: "martedì",
      lines: [
        { from: you, target: "Marco, mi dai una mano?" },
        { from: marco, target: "Certo! Che succede?" },
      ],
      glosses: {
        en: ["Marco, can you give me a hand?", "Sure! What’s up?"],
        de: ["Marco, hilfst du mir mal?", "Klar! Was ist los?"],
      },
      tips: {
        en: "*Mi dai una mano?* (literally “give me a hand?”) is how colleagues ask for help.",
        de: "*Mi dai una mano?* – wörtlich „Gibst du mir eine Hand?“ – so bittet man im Team um Hilfe.",
        it: "*Mi dai una mano?* è il modo più naturale per chiedere aiuto a chi lavora con te.",
      },
    },
    wed: {
      short: "Me",
      name: "mercoledì",
      lines: [
        { from: you, target: "Quando clicco su «Salva», compare un errore." },
        { from: marco, target: "Ok, controllo i log." },
      ],
      glosses: {
        en: [
          "When I click “Save”, an error appears.",
          "OK, I’ll check the logs.",
        ],
        de: [
          "Wenn ich auf „Speichern“ klicke, kommt ein Fehler.",
          "Okay, ich schaue mir die Logs an.",
        ],
      },
      tips: {
        en: "Italian often puts the verb before the subject: *compare un errore*.",
        de: "Im Italienischen steht das Verb oft vor dem Subjekt: *compare un errore*.",
        it: "Il verbo può venire prima del soggetto: *compare un errore*.",
      },
    },
    thu: {
      short: "Gi",
      name: "giovedì",
      lines: [
        { from: sara, target: "Allora, come ti trovi a Milano?" },
        { from: you, target: "Benissimo! Ma cercare casa è faticoso." },
      ],
      glosses: {
        en: [
          "So, how are you finding Milan?",
          "I love it! But flat hunting is tiring.",
        ],
        de: [
          "Und, wie gefällt dir Mailand?",
          "Sehr gut! Aber die Wohnungssuche ist anstrengend.",
        ],
      },
      tips: {
        en: "*Come ti trovi?* asks how you’re settling in.",
        de: "Mit *Come ti trovi?* fragt man, wie du dich eingelebt hast.",
        it: "*Come ti trovi?* chiede come ti stai ambientando.",
      },
    },
    fri: {
      short: "Ve",
      name: "venerdì",
      lines: [
        {
          from: giulia,
          target: "Mi sembra a posto! Puoi aggiungere un altro test?",
        },
        { from: you, target: "Giusto, lo faccio." },
      ],
      glosses: {
        en: [
          "Looks good to me! Could you add another test?",
          "Good point, will do.",
        ],
        de: [
          "Sieht gut aus! Kannst du noch einen Test hinzufügen?",
          "Guter Punkt, mache ich.",
        ],
      },
      tips: {
        en: "*Puoi …?* is a friendly way to ask for something.",
        de: "Mit *Puoi …?* bittest du freundlich um etwas.",
        it: "*Puoi …?* è un modo cordiale per chiedere qualcosa.",
      },
    },
  },
  levels: {
    A1: "Ciao, sono Sam. Sono qui da poco.",
    A2: "Ieri ho scritto i test.",
    B1: "Secondo me il problema è nella cache.",
    B2: "Propongo di stabilizzare prima l’API.",
  },
}
