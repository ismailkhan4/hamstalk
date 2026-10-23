import type { Course } from "@/lib/i18n"

import type { CopyFor } from "./types"

/** The language as a noun ("Englisch lernen") and as the stem of an adjective ("englischsprachig"). */
const names: Record<Course, { noun: string; stem: string }> = {
  de: { noun: "Deutsch", stem: "deutsch" },
  en: { noun: "Englisch", stem: "englisch" },
  it: { noun: "Italienisch", stem: "italienisch" },
}

/** Informal "du" throughout, as tech teams talk to each other. */
export const de: CopyFor = (story) => {
  const { noun, stem } = names[story.course]
  const { lead, helper, friend, company } = story
  return {
    meta: {
      title: `Hamstalk · ${noun} lernen. Im Team ankommen.`,
      description: `${noun} für Entwicklerinnen und Entwickler, die neu in einem ${stem}sprachigen Team sind.`,
      ogLocale: "de_DE",
    },
    nav: {
      home: "Hamstalk-Startseite",
      skipToContent: "Zum Inhalt springen",
      footer: "Fußzeile",
      language: "Sprache",
      themeToLight: "Zum hellen Design wechseln",
      themeToDark: "Zum dunklen Design wechseln",
    },
    cta: { start: "Montag starten", signIn: "Anmelden" },
    courses: {
      label: "Ich möchte lernen",
      names: { de: "Deutsch", en: "Englisch", it: "Italienisch" },
      comingSoon: "Demnächst",
      notReady: `Der Kurs für ${noun} entsteht gerade. Bis er startet, unterrichtet Hamstalk Deutsch.`,
      tryAvailable: "Zum Deutschkurs",
    },
    hero: {
      kicker: `Montag, 09:00 · ${company}, ${story.city.de}`,
      title: `Dein neues Team spricht ${noun}.`,
      lede: `Hamstalk bringt dir ${noun} Arbeitstag für Arbeitstag bei: Stand-up, Bug, Kaffeepause. Fünf Minuten pro Lektion – und ein Hamster, der dich anfeuert.`,
      signInPrompt: "Schon im Team?",
      planner: "Deine erste Woche",
      now: "Jetzt",
    },
    you: "Du",
    week: {
      title: "Eine Woche, fünf echte Momente.",
      lede: "Jede Lektion ist ein Moment aus dieser Woche. So sieht sie von Montag bis Freitag aus.",
      tipLabel: "Hamstis Tipp:",
      approved: `Pull-Request freigegeben. *${story.weekend}*`,
      days: {
        mon: {
          title: "Das Stand-up",
          moment:
            "Alle erzählen, woran sie gerade arbeiten. Du weißt genau, was du machst. Nur sagen kannst du es nicht. Noch nicht.",
        },
        tue: {
          title: "Du hängst fest",
          moment: `Das Ticket ergibt keinen Sinn, und ${helper.name} sieht beschäftigt aus. Kein Satz hilft dir öfter als die Bitte um Hilfe.`,
        },
        wed: {
          title: "Irgendwas ist kaputt",
          moment:
            "Im Registrierungsformular steckt ein Bug, und alle schauen dich an. Beschreib ihn genau – den Rest erledigen die Logs.",
        },
        thu: {
          title: "Die Kaffeepause",
          moment:
            "Nicht alles dreht sich um die Arbeit. Beim Smalltalk wirst du vom Neuzugang zur Kollegin oder zum Kollegen.",
        },
        fri: {
          title: "Dein erster Pull-Request",
          moment: `${lead.name} sieht sich deinen Code an, und ihr Kommentar ist auf ${noun}. Du antwortest, ohne ein Übersetzungstool zu öffnen.`,
        },
      },
    },
    growth: {
      title: `Nächste Woche: ein bisschen mehr ${noun}.`,
      lede: `Jede Lerneinheit ist eine Woche wie diese. Mit deinem ${noun} wächst auch deine Rolle im Team.`,
      roles: {
        A1: "Neu im Team",
        A2: "Teil des Teams",
        B1: "Zuständig für ein Feature",
        B2: "Leitet die Diskussion",
      },
    },
    buddy: {
      title: "Das ist Hamsti, dein Lernbuddy.",
      lede: `*Hamstern* heißt Vorräte anlegen. Hamsti hamstert jedes Wort, das du lernst – und seine Backen werden immer voller, je besser dein ${noun} wird.`,
      captions: {
        happy: "Bläst bei jeder richtigen Antwort die Backen auf",
        sad: "Schmollt ein bisschen, wenn du danebenliegst",
        sleepy: "Döst ein, wenn du einen Tag auslässt",
        dance: "Tanzt, wenn du eine Lektion abschließt",
      },
    },
    faq: {
      title: "FAQ für Neuzugänge",
      items: [
        {
          q: "Brauche ich Vorkenntnisse?",
          a: `Überhaupt keine. Dein erster Montag beginnt mit *${story.greeting}*.`,
        },
        {
          q: `Geht es nur um ${noun} für die Arbeit?`,
          a: "Nein. Du bestellst auch Kaffee, vereinbarst Termine und suchst eine Wohnung. Das Büro sorgt nur dafür, dass jede Lektion eine Geschichte erzählt.",
        },
        {
          q: "Muss ich programmieren können?",
          a: `Nein. Das Team in der Geschichte entwickelt Software, aber das ${noun}, das du lernst, hilft dir auch außerhalb der Tech-Branche.`,
        },
        {
          q: "Funktioniert Hamstalk auf dem Handy?",
          a: "Ja. Hamstalk läuft im Browser und lässt sich wie eine App auf dem Startbildschirm installieren.",
        },
        {
          q: "Wie lange dauert es, bis ich fließend spreche?",
          a: "Ehrlich gesagt: länger als eine Woche. Der Lernpfad reicht bis B2, und wie schnell du vorankommst, hängt davon ab, wie oft du übst. Offizielle Zertifikate gibt es weiterhin nur über offizielle Prüfungen.",
        },
      ],
    },
    invite: {
      heading: "Bis Montag!",
      label: "Einladung",
      when: "Montag · 09:30–09:45",
      where: `${company} · Raum „${story.room}“`,
      organiser: "Organisatorin",
      note: `Bring dein ${noun} mit – auch wenn es erst *${story.greeting}* ist.`,
      accept: "Einladung annehmen",
    },
    footer: {
      links: {
        week: "Deine erste Woche",
        levels: "Niveaustufen",
        buddy: "Hamsti",
        faq: "FAQ",
      },
      note: `${lead.name}, ${helper.name}, ${friend.name} und die ${company} sind erfunden. Dein ${noun} nicht.`,
    },
  }
}
