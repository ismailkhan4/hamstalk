import type { Learner, Speaker, Story } from "./types"

const lena = {
  person: "lf",
  initials: "LF",
  name: "Lena",
  fullName: "Lena Fischer",
} as const satisfies Speaker & { fullName: string }
const jonas: Speaker = { person: "jk", initials: "JK", name: "Jonas" }
const aylin: Speaker = { person: "ao", initials: "AÖ", name: "Aylin" }
const you: Learner = { person: "me", initials: "Du" }

/** A Berlin start-up. Hamstalk's first course, and the one the app teaches today. */
export const german: Story = {
  course: "de",
  available: true,
  company: "Kaffeesatz GmbH",
  city: { de: "Berlin", en: "Berlin", it: "Berlino" },
  room: "Brezel",
  greeting: "Hallo",
  weekend: "Schönes Wochenende!",
  lead: lena,
  helper: jonas,
  friend: aylin,
  you,
  days: {
    mon: {
      short: "Mo",
      name: "Montag",
      lines: [
        { from: lena, target: "Was machst du heute?" },
        { from: you, target: "Heute arbeite ich an der Anmeldung." },
      ],
      glosses: {
        en: ["What are you doing today?", "Today I’m working on the sign-in."],
        it: ["Cosa fai oggi?", "Oggi lavoro al login."],
      },
      tips: {
        en: "Even when you start with *heute*, the verb still comes second.",
        de: "Auch wenn der Satz mit *heute* beginnt, steht das Verb an zweiter Stelle.",
        it: "Anche se inizi con *heute*, il verbo resta al secondo posto.",
      },
    },
    tue: {
      short: "Di",
      name: "Dienstag",
      lines: [
        { from: you, target: "Jonas, kannst du mir kurz helfen?" },
        { from: jonas, target: "Klar! Was ist los?" },
      ],
      glosses: {
        en: ["Jonas, can you help me for a sec?", "Sure! What’s up?"],
        it: ["Jonas, mi aiuti un attimo?", "Certo! Che succede?"],
      },
      tips: {
        en: "*Kurz* makes any request smaller and friendlier.",
        de: "Mit *kurz* klingt jede Bitte kleiner und freundlicher.",
        it: "Con *kurz* ogni richiesta suona più leggera e gentile.",
      },
    },
    wed: {
      short: "Mi",
      name: "Mittwoch",
      lines: [
        {
          from: you,
          target: "Wenn ich auf „Speichern“ klicke, kommt eine Fehlermeldung.",
        },
        { from: jonas, target: "Okay, ich schaue mir die Logs an." },
      ],
      glosses: {
        en: [
          "When I click “Save”, an error message appears.",
          "OK, I’ll check the logs.",
        ],
        it: [
          "Quando clicco su «Salva», compare un messaggio di errore.",
          "Ok, do un’occhiata ai log.",
        ],
      },
      tips: {
        en: "*Wenn* sends the verb to the end of its clause.",
        de: "*Wenn* schickt das Verb ans Ende des Nebensatzes.",
        it: "*Wenn* manda il verbo alla fine della frase secondaria.",
      },
    },
    thu: {
      short: "Do",
      name: "Donnerstag",
      lines: [
        { from: aylin, target: "Und, wie gefällt dir Berlin?" },
        {
          from: you,
          target: "Sehr gut! Aber die Wohnungssuche ist anstrengend.",
        },
      ],
      glosses: {
        en: [
          "So, how do you like Berlin?",
          "Very much! But flat hunting is exhausting.",
        ],
        it: [
          "Allora, come ti trovi a Berlino?",
          "Benissimo! Però cercare casa è sfiancante.",
        ],
      },
      tips: {
        en: "*Aber* joins two ideas without moving the verb.",
        de: "*Aber* verbindet zwei Gedanken, ohne das Verb zu verschieben.",
        it: "*Aber* unisce due idee senza spostare il verbo.",
      },
    },
    fri: {
      short: "Fr",
      name: "Freitag",
      lines: [
        {
          from: lena,
          target: "Sieht gut aus! Kannst du noch einen Test hinzufügen?",
        },
        { from: you, target: "Guter Punkt, mache ich." },
      ],
      glosses: {
        en: [
          "Looks good! Could you add one more test?",
          "Good point, will do.",
        ],
        it: [
          "Mi sembra a posto! Puoi aggiungere ancora un test?",
          "Giusto, lo faccio.",
        ],
      },
      tips: {
        en: "*Kannst du noch …* politely asks for one more thing.",
        de: "Mit *Kannst du noch …* bittest du höflich um noch etwas.",
        it: "Con *Kannst du noch …* chiedi gentilmente ancora una cosa.",
      },
    },
  },
  levels: {
    A1: "Ich heiße Sam. Ich bin neu hier.",
    A2: "Gestern habe ich die Tests geschrieben.",
    B1: "Ich glaube, das Problem liegt im Cache.",
    B2: "Ich schlage vor, dass wir zuerst die API stabilisieren.",
  },
}
