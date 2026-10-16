/**
 * Roleplays: short typed conversations with someone from the course's story world, played by AI
 * in character. Each unlocks when its unit is finished and only expects language that unit (and
 * the ones before it) taught.
 */

export type Roleplay = {
  id: string
  title: string
  /** The character: a pacer id from the course config, which matches the avatars. */
  character: string
  where: string
  /** Finishing this unit opens the roleplay. */
  unlockUnit: string
  /** What the learner is asked to do, in their own language. */
  brief: string
  /** What counts as done. The AI ticks these off as the learner manages them. */
  goals: readonly { id: string; text: string }[]
  /** The character's first line. */
  opening: { target: string; native: string }
  /** Phrases the learner can tap to get started. */
  phrases: readonly string[]
  /** For the AI: who the character is and how they talk. */
  persona: string
}

export const roleplays: readonly Roleplay[] = [
  {
    id: "kaffeemaschine",
    title: "At the coffee machine",
    character: "cm",
    where: "The office kitchen, 9:05",
    unlockUnit: "a1-u1",
    brief:
      "Clara from design is getting coffee. Say hello, tell her your name, and say goodbye when you head to the standup.",
    goals: [
      { id: "greet", text: "Say hello" },
      { id: "name", text: "Say your name" },
      { id: "bye", text: "Say goodbye" },
    ],
    opening: {
      target: "Oh, hallo! Bist du neu hier?",
      native: "Oh, hi! Are you new here?",
    },
    phrases: ["Hallo!", "Ja, ich bin …", "Tschüss!"],
    persona:
      "Clara Meyer, a friendly product designer in her thirties at Kaffeesatz GmbH in Berlin. Warm, a little chatty, uses du with colleagues. She is pouring coffee before the 9:30 standup.",
  },
  {
    id: "jonas-kennenlernen",
    title: "Meeting Jonas",
    character: "jk",
    where: "Jonas’s desk, first morning",
    unlockUnit: "a1-u2",
    brief:
      "Lena sent you to meet Jonas from backend. Greet him, ask how he is, answer when he asks you, and introduce yourself.",
    goals: [
      { id: "greet", text: "Greet Jonas" },
      { id: "how", text: "Ask how he is" },
      { id: "answer", text: "Say how you are" },
      { id: "intro", text: "Introduce yourself" },
    ],
    opening: {
      target: "Hallo! Du bist bestimmt die neue Person im Team, oder?",
      native: "Hi! You must be the new person on the team, right?",
    },
    phrases: ["Hallo, Jonas!", "Wie geht’s?", "Gut, danke!", "Ich bin …"],
    persona:
      "Jonas Krüger, a backend developer, late twenties, fast-talking but kind. Uses du. Loves a bug hunt and makes small jokes. He talks a bit fast, but slows down for the learner.",
  },
  {
    id: "mittagessen",
    title: "Lunch with Aylin",
    character: "ao",
    where: "The canteen, 12:30",
    unlockUnit: "a1-u3",
    brief:
      "You sit down next to Aylin from design at lunch. Find out where she’s from and what she does, and tell her the same about you.",
    goals: [
      { id: "from-ask", text: "Ask where she’s from" },
      { id: "job-ask", text: "Ask what she does" },
      { id: "from-say", text: "Say where you’re from" },
      { id: "job-say", text: "Say what you do" },
    ],
    opening: {
      target: "Hallo! Ist hier noch frei?",
      native: "Hi! Is this seat free?",
    },
    phrases: [
      "Ja, klar!",
      "Woher kommst du?",
      "Was machst du?",
      "Ich komme aus …",
    ],
    persona:
      "Aylin Öztürk, a UX designer from Hamburg with Turkish roots, curious and direct, always asks why. Uses du. Happy to talk about her work and where she grew up.",
  },
]

export function getRoleplay(id: string) {
  return roleplays.find((roleplay) => roleplay.id === id)
}
