type Line = { de: string; en: string }

export type StandupPrompt = {
  task: string
  ask?: Line
  options: Line[]
  correct: number
  right: string
  wrong: Record<number, string>
  react: Line
  phrases: Line[]
}

export type Standup = {
  unitId: string
  line: Line
  prompts: StandupPrompt[]
}

export const standups: Standup[] = [
  {
    unitId: "a1-u1",
    line: { de: "Guten Morgen, zusammen!", en: "Good morning, everyone!" },
    prompts: [
      {
        task: "Greet the team",
        ask: { de: "Guten Morgen, %N!", en: "Good morning, %N!" },
        options: [
          { de: "Guten Morgen, zusammen!", en: "Good morning, everyone!" },
          { de: "Gute Nacht, zusammen!", en: "Good night, everyone!" },
          { de: "Tschüss, Lena!", en: "Bye, Lena!" },
        ],
        correct: 0,
        right:
          "Guten Morgen, zusammen greets everyone at once. Perfect for a meeting.",
        wrong: {
          1: "Gute Nacht is for the evening, before bed. It’s 09:30.",
          2: "Tschüss is goodbye. The meeting is just starting.",
        },
        react: { de: "Hallo, %N! Danke!", en: "Hi, %N! Thanks!" },
        phrases: [
          { de: "Guten Morgen, zusammen!", en: "Good morning, everyone!" },
          { de: "Hallo zusammen!", en: "Hello, everyone!" },
        ],
      },
      {
        task: "Say thank you",
        options: [
          { de: "Gern!", en: "You’re welcome!" },
          { de: "Entschuldigung!", en: "Sorry!" },
          { de: "Auf Wiedersehen!", en: "Goodbye!" },
        ],
        correct: 0,
        right: "Gern is a friendly way to say you’re welcome.",
        wrong: {
          1: "Entschuldigung says sorry. Nothing went wrong, Lena only said thanks.",
          2: "Auf Wiedersehen is goodbye, and the standup has only just started.",
        },
        react: { de: "Tschüss, %N!", en: "Bye, %N!" },
        phrases: [
          { de: "Gern!", en: "You’re welcome!" },
          { de: "Bitte!", en: "You’re welcome! (also: please)" },
        ],
      },
    ],
  },
]

export function getStandup(unitId: string) {
  return standups.find((standup) => standup.unitId === unitId) ?? null
}

export function personaliseLine(line: Line, firstName: string): Line {
  return {
    de: line.de.replaceAll("%N", firstName),
    en: line.en.replaceAll("%N", firstName),
  }
}
