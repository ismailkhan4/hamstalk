import type { Lesson } from "@/features/lessons/schema"

/** Unit 1 · Lesson 4: Danke und bitte. Content from the Unit 1 designs (pages 13 to 15). */
export const lesson4: Lesson = {
  id: "a1-u1-l4",
  kind: "lesson",
  title: "Danke und bitte",
  titleIsGerman: true,
  titleEn: "Thanks and you’re welcome",
  goal: "Thank someone, reply to thanks and say sorry.",
  minutes: 7,
  xp: 30,
  focus: "Danke · Bitte · Entschuldigung",
  intro: {
    speaker: {
      person: "jk",
      initials: "JK",
    },
    de: "Danke, %N!",
    en: "Small favours happen all day: a badge at reception, help with a laptop, a coffee. This lesson gives you the words for thanks, you’re welcome and sorry.",
  },
  phrases: ["Danke", "Vielen Dank", "Bitte", "Gern", "Entschuldigung"],
  practised: [
    "Danke",
    "Danke schön",
    "Vielen Dank",
    "Bitte",
    "Gern",
    "Entschuldigung",
  ],
  canDo: [
    "Thank someone: Danke, Danke schön, Vielen Dank",
    "Reply when someone thanks you: Bitte or Gern",
    "Say sorry, or excuse me: Entschuldigung",
  ],
  exercises: [
    {
      type: "discover",
      kind: "New phrases",
      title: "A morning of small favours",
      sub: "Play each line as often as you like. Save the ones you want to keep.",
      lines: [
        {
          speaker: {
            person: "mb",
            initials: "MB",
            label: "Mia · reception, hands you your badge",
          },
          de: "Bitte schön!",
          en: "Here you go!",
          note: "Bitte also goes with handing something over.",
        },
        {
          speaker: {
            person: "me",
            initials: "%I",
            label: "You",
          },
          de: "Danke!",
          en: "Thanks!",
          note: "The everyday thank you.",
          saveKey: "U4a",
        },
        {
          speaker: {
            person: "mb",
            initials: "MB",
            label: "Mia",
          },
          de: "Bitte!",
          en: "You’re welcome!",
          note: "Bitte answers danke.",
          saveKey: "U4b",
        },
        {
          speaker: {
            person: "me",
            initials: "%I",
            label: "You · Jonas fixed your laptop",
          },
          de: "Vielen Dank!",
          en: "Thanks a lot!",
          note: "A bigger thank you, when someone really helped.",
          saveKey: "U4c",
        },
        {
          speaker: {
            person: "jk",
            initials: "JK",
            label: "Jonas",
          },
          de: "Gern!",
          en: "You’re welcome! (happy to)",
          note: "A friendly reply to thanks, common among colleagues.",
          saveKey: "U4d",
        },
        {
          speaker: {
            person: "me",
            initials: "%I",
            label: "You · you bump into Aylin",
          },
          de: "Entschuldigung!",
          en: "Sorry!",
          note: "Sorry. It also means excuse me, to get someone’s attention.",
          saveKey: "U4e",
        },
        {
          speaker: {
            person: "ao",
            initials: "AÖ",
            label: "Aylin",
          },
          de: "Kein Problem!",
          en: "No problem!",
          note: "What you’ll often hear back.",
        },
      ],
    },
    {
      type: "tip",
      kind: "Good to know",
      title: "Thanks, you’re welcome, sorry",
      sub: "Three small situations and what goes back and forth.",
      columns: ["Situation", "You say", "You’ll hear back"],
      rows: [
        ["Someone helps you", "Danke!", "Bitte!"],
        ["Someone really helped", "Vielen Dank!", "Gern!"],
        ["You bump into someone", "Entschuldigung!", "Kein Problem!"],
      ],
      examples: [
        {
          de: "Danke schön! – Bitte schön!",
          en: "Thank you! – You’re welcome! (a little warmer)",
        },
        {
          de: "Entschuldigung, Lena …",
          en: "Excuse me, Lena … (to get her attention)",
        },
      ],
      note: "Bitte does two jobs: it answers danke, and it also means please. Schön makes both a little warmer: Danke schön, Bitte schön.",
    },
    {
      type: "choice",
      variant: "listening",
      kind: "Listen",
      prompt: "You hold the door for your neighbour. What does she say?",
      optionsLanguage: "en",
      options: ["Thank you", "Sorry", "You’re welcome"],
      correct: 0,
      alternatives: [],
      feedback: {
        right: "Danke schön: a warm thank you for holding the door.",
        alternative: {},
        wrong: {
          "1": "Sorry would be Entschuldigung. She says Danke schön: thank you.",
          "2": "You’re welcome would be Bitte. She says Danke schön: thank you.",
        },
      },
      topic: "Listening",
      listening: {
        clip: "Danke schön!",
        translation: "Thank you!",
        meta: "0:02 · Frau Yılmaz",
      },
    },
    {
      type: "match",
      kind: "Match the moment",
      prompt: "Match each phrase with the moment it fits",
      sub: "Choose a phrase, then the moment.",
      pairs: [
        {
          phrase: "Danke!",
          meaning: "Mia hands you your badge",
        },
        {
          phrase: "Bitte!",
          meaning: "Jonas thanks you",
        },
        {
          phrase: "Vielen Dank!",
          meaning: "Jonas spent an hour on your laptop",
        },
        {
          phrase: "Entschuldigung!",
          meaning: "You step on someone’s foot",
        },
      ],
      meaningOrder: [
        "Jonas thanks you",
        "You step on someone’s foot",
        "Mia hands you your badge",
        "Jonas spent an hour on your laptop",
      ],
      labels: {
        phrases: "Phrases",
        meanings: "Moments",
        empty: "Choose a moment",
        joiner: " fits: ",
      },
      meaningsLanguage: "en",
      explanation:
        "Danke and Vielen Dank thank someone, Bitte answers thanks, Entschuldigung says sorry.",
      topic: "Thanks and sorry",
    },
    {
      type: "choice",
      variant: "multiple-choice",
      kind: "Choose the answer",
      prompt: "You send Jonas a file. He says „Danke!“ What do you answer?",
      optionsLanguage: "de",
      options: ["Bitte!", "Danke!", "Entschuldigung!", "Gern!"],
      correct: 0,
      alternatives: [3],
      feedback: {
        right: "Bitte: the usual answer to danke.",
        alternative: {
          "3": "Gern works too: friendly and very common between colleagues.",
        },
        wrong: {
          "1": "Danke thanks someone. Jonas thanked you, so answer with Bitte or Gern.",
          "2": "Entschuldigung is sorry. Nothing went wrong: answer his thanks with Bitte.",
        },
      },
      topic: "Thanks and sorry",
    },
    {
      type: "choice",
      variant: "multiple-choice",
      kind: "Choose the answer",
      prompt:
        "You arrive five minutes late to the 9:30 standup. What do you say to the team?",
      optionsLanguage: "de",
      options: ["Entschuldigung!", "Bitte!", "Gute Nacht!"],
      correct: 0,
      alternatives: [],
      feedback: {
        right: "Entschuldigung: a short sorry for being late.",
        alternative: {},
        wrong: {
          "1": "Bitte answers thanks or means please. To say sorry: Entschuldigung!",
          "2": "Gute Nacht is for leaving late. To say sorry: Entschuldigung!",
        },
      },
      topic: "Thanks and sorry",
    },
    {
      type: "build",
      kind: "Build the sentence",
      prompt: "Lena brings you a coffee. Thank her warmly",
      sub: "Thank you, Lena!",
      tiles: ["schön,", "Danke", "Lena!", "Bitte"],
      answer: [1, 0, 2],
      feedback: {
        right:
          "Danke schön, Lena! Thank-you first, schön right after it, then her name.",
        wrong:
          "Danke comes first, then schön, then her name: Danke schön, Lena! Bitte is the reply, not the thank-you.",
      },
      topic: "Thanks and sorry",
    },
    {
      type: "conversation",
      kind: "Your morning",
      prompt: "Thanks, welcome, sorry",
      sub: "Choose what you’d say each time.",
      turns: [
        {
          speaker: {
            person: "mb",
            initials: "MB",
            label: "Mia · reception",
          },
          line: "Bitte schön!",
          translation: "Here you go! (your new badge)",
          task: "Thank her",
          options: [
            {
              de: "Danke!",
              en: "Thanks!",
            },
            {
              de: "Bitte!",
              en: "You’re welcome!",
            },
            {
              de: "Entschuldigung!",
              en: "Sorry!",
            },
            {
              de: "Danke schön!",
              en: "Thank you!",
            },
          ],
          correct: 0,
          alternatives: [3],
          feedback: {
            right: "Danke: she handed you something.",
            alternative: {
              "3": "Danke schön, a little warmer. Perfect.",
            },
            wrong: {
              "1": "She’s handing you your badge, so thank her: Danke!",
              "2": "Nothing went wrong. Thank her: Danke!",
            },
          },
        },
        {
          speaker: {
            person: "jk",
            initials: "JK",
            label: "Jonas · after you found his bug",
          },
          line: "Danke, %N!",
          translation: "Thanks, %N!",
          task: "Reply to his thanks",
          options: [
            {
              de: "Gern!",
              en: "You’re welcome!",
            },
            {
              de: "Danke!",
              en: "Thanks!",
            },
            {
              de: "Entschuldigung!",
              en: "Sorry!",
            },
            {
              de: "Bitte!",
              en: "You’re welcome!",
            },
          ],
          correct: 0,
          alternatives: [3],
          feedback: {
            right: "Gern: friendly, between colleagues.",
            alternative: {
              "3": "Bitte works just as well.",
            },
            wrong: {
              "1": "He thanked you, so answer it: Gern! or Bitte!",
              "2": "Entschuldigung is sorry. He’s thanking you: Gern!",
            },
          },
        },
        {
          speaker: {
            person: "ao",
            initials: "AÖ",
            label: "Aylin · coffee machine",
          },
          line: "Oh!",
          translation: "Oh! (you just knocked her cup)",
          task: "Say sorry",
          options: [
            {
              de: "Entschuldigung!",
              en: "Sorry!",
            },
            {
              de: "Bitte!",
              en: "You’re welcome!",
            },
            {
              de: "Danke!",
              en: "Thanks!",
            },
          ],
          correct: 0,
          alternatives: [],
          feedback: {
            right: "Entschuldigung: that’s the sorry.",
            alternative: {},
            wrong: {
              "1": "Bitte answers thanks. You knocked her cup: Entschuldigung!",
              "2": "Danke thanks someone. To apologise: Entschuldigung!",
            },
          },
        },
      ],
      closing: {
        speaker: {
          person: "ao",
          initials: "AÖ",
          label: "Aylin",
        },
        de: "Kein Problem!",
        en: "No problem!",
      },
    },
  ],
}
