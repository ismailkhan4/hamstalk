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
  {
    unitId: "a1-u2",
    line: { de: "Gut, danke. Und dir?", en: "Fine, thanks. And you?" },
    prompts: [
      {
        task: "Answer the check-in",
        ask: {
          de: "Guten Morgen, %N! Wie geht’s dir?",
          en: "Good morning, %N! How are you?",
        },
        options: [
          { de: "Gut, danke. Und dir?", en: "Fine, thanks. And you?" },
          {
            de: "Gut, danke. Und Ihnen?",
            en: "Fine, thanks. And you? (formal)",
          },
          { de: "Tschüss, Lena!", en: "Bye, Lena!" },
        ],
        correct: 0,
        right:
          "Lena is your teammate, so you ask back with du: Und dir? Short and friendly.",
        wrong: {
          1: "Und Ihnen? is the Sie form, for visitors and people you don’t know. Lena is your teammate: Und dir?",
          2: "Tschüss is goodbye. The meeting is just starting.",
        },
        react: {
          de: "Gut, danke! Herr Schulz, das ist %N.",
          en: "Fine, thanks! Mr Schulz, this is %N.",
        },
        phrases: [
          { de: "Gut, danke. Und dir?", en: "Fine, thanks. And you?" },
          { de: "Es geht. Und dir?", en: "So-so. And you?" },
        ],
      },
      {
        task: "Greet the visitor",
        options: [
          {
            de: "Guten Tag, Herr Schulz. Freut mich!",
            en: "Hello, Mr Schulz. Nice to meet you!",
          },
          {
            de: "Hallo, Herr Schulz! Wie geht’s dir?",
            en: "Hi, Mr Schulz! How are you? (informal)",
          },
          {
            de: "Guten Tag, Lena. Freut mich!",
            en: "Hello, Lena. Nice to meet you!",
          },
        ],
        correct: 0,
        right:
          "Guten Tag and his name are polite for a visitor, and Freut mich! says you’re glad to meet him.",
        wrong: {
          1: "Wie geht’s dir? uses du, which is for teammates. A visitor gets Sie, and you’ve only just met.",
          2: "Lena introduced you, but Herr Schulz is the one you’re meeting: Guten Tag, Herr Schulz.",
        },
        react: { de: "Danke, %N!", en: "Thanks, %N!" },
        phrases: [
          { de: "Freut mich!", en: "Nice to meet you!" },
          { de: "Freut mich auch!", en: "Nice to meet you too!" },
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
