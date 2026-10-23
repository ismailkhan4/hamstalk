import type { Course } from "@/lib/i18n"

import type { CopyFor } from "./types"

/**
 * The language bare ("parla inglese"), with its article ("impara l’inglese", not "il inglese")
 * and as a feminine adjective ("di lingua inglese", "di lingua tedesca").
 */
const names: Record<Course, { bare: string; the: string; feminine: string }> = {
  de: { bare: "tedesco", the: "il tedesco", feminine: "tedesca" },
  en: { bare: "inglese", the: "l’inglese", feminine: "inglese" },
  it: { bare: "italiano", the: "l’italiano", feminine: "italiana" },
}

/** Informal "tu", and phrasing that doesn't assume the reader's gender. */
export const it: CopyFor = (story) => {
  const { bare, the, feminine } = names[story.course]
  const { lead, helper, friend, company } = story
  return {
    meta: {
      title: `Hamstalk · Impara ${the}. Entra nel team.`,
      description: `Il corso di ${bare} per chi sviluppa software e sta entrando in un team di lingua ${feminine}.`,
      ogLocale: "it_IT",
    },
    nav: {
      home: "Home di Hamstalk",
      skipToContent: "Vai al contenuto",
      footer: "Piè di pagina",
      language: "Lingua",
      themeToLight: "Passa al tema chiaro",
      themeToDark: "Passa al tema scuro",
    },
    cta: { start: "Inizia lunedì", signIn: "Accedi" },
    courses: {
      label: "Voglio imparare",
      names: { de: "Tedesco", en: "Inglese", it: "Italiano" },
      comingSoon: "In arrivo",
      notReady: `Il corso di ${bare} è in preparazione. Finché non apre, Hamstalk insegna il tedesco.`,
      tryAvailable: "Prova il corso di tedesco",
    },
    hero: {
      kicker: `Lunedì, 09:00 · ${company}, ${story.city.it}`,
      title: `Il tuo nuovo team parla ${bare}.`,
      lede: `Con Hamstalk impari ${the} una giornata di lavoro alla volta: lo stand-up, il bug, la pausa caffè. Cinque minuti a lezione, con un criceto che fa il tifo per te.`,
      signInPrompt: "Fai già parte del team?",
      planner: "La tua prima settimana",
      now: "Adesso",
    },
    you: "Tu",
    week: {
      title: "Una settimana, cinque momenti veri.",
      lede: "Ogni lezione è un momento della settimana. Ecco com’è, dal lunedì al venerdì.",
      tipLabel: "Il consiglio di Hamsti:",
      approved: `Pull request approvata. *${story.weekend}*`,
      days: {
        mon: {
          title: "Lo stand-up",
          moment:
            "Ognuno racconta a cosa sta lavorando. Tu sai benissimo cosa stai facendo, solo che non riesci a dirlo. Non ancora.",
        },
        tue: {
          title: "Serve una mano",
          moment: `Il ticket non ha senso e ${helper.name} sembra occupato. Nessuna frase ti aiuterà più di quella per chiedere aiuto.`,
        },
        wed: {
          title: "Qualcosa non va",
          moment:
            "C’è un bug nel modulo di registrazione e tutti guardano te. Descrivilo con chiarezza: al resto pensano i log.",
        },
        thu: {
          title: "La pausa caffè",
          moment:
            "Non è tutto lavoro. È con due chiacchiere che smetti di essere la new entry e diventi parte del team.",
        },
        fri: {
          title: "La tua prima pull request",
          moment: `${lead.name} rivede il tuo codice e il suo commento è in ${bare}. Rispondi senza aprire un traduttore.`,
        },
      },
    },
    growth: {
      title: `La settimana dopo, un po’ più di ${bare}.`,
      lede: `Ogni unità è una settimana come questa. Il tuo ruolo nel team cresce insieme al tuo ${bare}.`,
      roles: {
        A1: "Primi giorni nel team",
        A2: "Parte del team",
        B1: "Responsabile di una feature",
        B2: "Guida la discussione",
      },
    },
    buddy: {
      title: "Ecco Hamsti, il tuo compagno di studio.",
      lede: `In tedesco, *hamstern* significa «fare scorta». Hamsti fa scorta di ogni parola che impari, e le sue guance si riempiono man mano che il tuo ${bare} cresce.`,
      captions: {
        happy: "Gonfia le guance a ogni risposta giusta",
        sad: "Mette un po’ il broncio quando sbagli",
        sleepy: "Si appisola se salti un giorno",
        dance: "Balla quando finisci una lezione",
      },
    },
    faq: {
      title: "Le domande di chi è appena arrivato",
      items: [
        {
          q: `Devo già sapere un po’ di ${bare}?`,
          a: `Per niente. Il tuo primo lunedì inizia con *${story.greeting}*.`,
        },
        {
          q: `È solo ${bare} per il lavoro?`,
          a: "No. Ordinerai anche un caffè, prenderai appuntamenti e cercherai casa. L’ufficio dà solo una storia a ogni lezione.",
        },
        {
          q: "Devo saper programmare?",
          a: `No. Il team della storia sviluppa software, ma ${the} che impari ti serve anche fuori dal mondo tech.`,
        },
        {
          q: "Funziona sul telefono?",
          a: "Sì. Hamstalk funziona nel browser e si installa sulla schermata Home come un’app.",
        },
        {
          q: `Quanto ci vuole per parlare ${bare} fluentemente?`,
          a: "Più di una settimana, a essere sinceri. Il percorso arriva fino al B2 e la velocità con cui sali dipende da quanto spesso ti eserciti. Per le certificazioni ufficiali servono comunque gli esami ufficiali.",
        },
      ],
    },
    invite: {
      heading: "Ci vediamo lunedì.",
      label: "Invito",
      when: "Lunedì · 09:30–09:45",
      where: `${company} · Sala «${story.room}»`,
      organiser: "Organizzatrice",
      note: `Porta il tuo ${bare}, anche se per ora è solo *${story.greeting}*.`,
      accept: "Accetta l’invito",
    },
    footer: {
      links: {
        week: "La tua prima settimana",
        levels: "Livelli",
        buddy: "Hamsti",
        faq: "FAQ",
      },
      note: `${lead.name}, ${helper.name}, ${friend.name} e la ${company} sono inventati. Il tuo ${bare} no.`,
    },
  }
}
