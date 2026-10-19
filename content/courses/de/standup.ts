type Line = { target: string; native: string }

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
    line: {
      target: "Guten Morgen, zusammen!",
      native: "Good morning, everyone!",
    },
    prompts: [
      {
        task: "Greet the team",
        ask: { target: "Guten Morgen, %N!", native: "Good morning, %N!" },
        options: [
          {
            target: "Guten Morgen, zusammen!",
            native: "Good morning, everyone!",
          },
          { target: "Gute Nacht, zusammen!", native: "Good night, everyone!" },
          { target: "Tschüss, Lena!", native: "Bye, Lena!" },
        ],
        correct: 0,
        right:
          "Guten Morgen, zusammen greets everyone at once. Perfect for a meeting.",
        wrong: {
          1: "Gute Nacht is for the evening, before bed. It’s 09:30.",
          2: "Tschüss is goodbye. The meeting is just starting.",
        },
        react: { target: "Hallo, %N! Danke!", native: "Hi, %N! Thanks!" },
        phrases: [
          {
            target: "Guten Morgen, zusammen!",
            native: "Good morning, everyone!",
          },
          { target: "Hallo zusammen!", native: "Hello, everyone!" },
        ],
      },
      {
        task: "Say thank you",
        options: [
          { target: "Gern!", native: "You’re welcome!" },
          { target: "Entschuldigung!", native: "Sorry!" },
          { target: "Auf Wiedersehen!", native: "Goodbye!" },
        ],
        correct: 0,
        right: "Gern is a friendly way to say you’re welcome.",
        wrong: {
          1: "Entschuldigung says sorry. Nothing went wrong, Lena only said thanks.",
          2: "Auf Wiedersehen is goodbye, and the standup has only just started.",
        },
        react: { target: "Tschüss, %N!", native: "Bye, %N!" },
        phrases: [
          { target: "Gern!", native: "You’re welcome!" },
          { target: "Bitte!", native: "You’re welcome! (also: please)" },
        ],
      },
    ],
  },
  {
    unitId: "a1-u2",
    line: { target: "Gut, danke. Und dir?", native: "Fine, thanks. And you?" },
    prompts: [
      {
        task: "Answer the check-in",
        ask: {
          target: "Guten Morgen, %N! Wie geht’s dir?",
          native: "Good morning, %N! How are you?",
        },
        options: [
          { target: "Gut, danke. Und dir?", native: "Fine, thanks. And you?" },
          {
            target: "Gut, danke. Und Ihnen?",
            native: "Fine, thanks. And you? (formal)",
          },
          { target: "Tschüss, Lena!", native: "Bye, Lena!" },
        ],
        correct: 0,
        right:
          "Lena is your teammate, so you ask back with du: Und dir? Short and friendly.",
        wrong: {
          1: "Und Ihnen? is the Sie form, for visitors and people you don’t know. Lena is your teammate: Und dir?",
          2: "Tschüss is goodbye. The meeting is just starting.",
        },
        react: {
          target: "Gut, danke! Herr Schulz, das ist %N.",
          native: "Fine, thanks! Mr Schulz, this is %N.",
        },
        phrases: [
          { target: "Gut, danke. Und dir?", native: "Fine, thanks. And you?" },
          { target: "Es geht. Und dir?", native: "So-so. And you?" },
        ],
      },
      {
        task: "Greet the visitor",
        options: [
          {
            target: "Guten Tag, Herr Schulz. Freut mich!",
            native: "Hello, Mr Schulz. Nice to meet you!",
          },
          {
            target: "Hallo, Herr Schulz! Wie geht’s dir?",
            native: "Hi, Mr Schulz! How are you? (informal)",
          },
          {
            target: "Guten Tag, Lena. Freut mich!",
            native: "Hello, Lena. Nice to meet you!",
          },
        ],
        correct: 0,
        right:
          "Guten Tag and his name are polite for a visitor, and Freut mich! says you’re glad to meet him.",
        wrong: {
          1: "Wie geht’s dir? uses du, which is for teammates. A visitor gets Sie, and you’ve only just met.",
          2: "Lena introduced you, but Herr Schulz is the one you’re meeting: Guten Tag, Herr Schulz.",
        },
        react: { target: "Danke, %N!", native: "Thanks, %N!" },
        phrases: [
          { target: "Freut mich!", native: "Nice to meet you!" },
          { target: "Freut mich auch!", native: "Nice to meet you too!" },
        ],
      },
    ],
  },
  {
    unitId: "a1-u3",
    line: {
      target: "Heute arbeite ich an einer neuen Funktion.",
      native: "Today I’m working on a new feature.",
    },
    prompts: [
      {
        task: "Answer the check-in",
        ask: {
          target: "Guten Morgen, %N! Wie geht’s dir?",
          native: "Good morning, %N! How are you?",
        },
        options: [
          { target: "Gut, danke. Und dir?", native: "Fine, thanks. And you?" },
          {
            target: "Gut, danke. Und Ihnen?",
            native: "Fine, thanks. And you? (formal)",
          },
          { target: "Ich heiße %N.", native: "My name is %N." },
        ],
        correct: 0,
        right: "A teammate, so du: Und dir? Short and friendly.",
        wrong: {
          1: "Und Ihnen? is the Sie form, for visitors. Lena is your teammate: Und dir?",
          2: "Ich heiße … gives your name. Lena asked how you are: Gut, danke.",
        },
        react: { target: "Gut, danke!", native: "Fine, thanks!" },
        phrases: [
          { target: "Gut, danke. Und dir?", native: "Fine, thanks. And you?" },
          { target: "Es geht. Und dir?", native: "So-so. And you?" },
        ],
      },
      {
        task: "Say what you’re working on today",
        options: [
          {
            target: "Heute arbeite ich an einer neuen Funktion.",
            native: "Today I’m working on a new feature.",
          },
          {
            target: "Heute ich arbeite an einer neuen Funktion.",
            native: "Today I’m working on a new feature.",
          },
          {
            target: "Heute bin ich an einer neuen Funktion.",
            native: "Today I am at a new feature.",
          },
        ],
        correct: 0,
        right:
          "Heute takes position one, so the verb arbeite comes second and ich follows it. Verb second.",
        wrong: {
          1: "After Heute the verb comes next, then ich: Heute arbeite ich …",
          2: "bin says who you are. To say what you do, use arbeiten: Heute arbeite ich …",
        },
        react: { target: "Danke, %N!", native: "Thanks, %N!" },
        phrases: [
          {
            target: "Heute arbeite ich an einer neuen Funktion.",
            native: "Today I’m working on a new feature.",
          },
          { target: "Ich bin neu im Team.", native: "I’m new on the team." },
        ],
      },
    ],
  },
  {
    unitId: "a1-u4",
    line: {
      target: "Um zehn habe ich einen Termin.",
      native: "At ten I have an appointment.",
    },
    prompts: [
      {
        task: "Say what’s in your calendar today",
        ask: {
          target: "Guten Morgen, %N! Was steht heute an?",
          native: "Good morning, %N! What’s on today?",
        },
        options: [
          {
            target: "Um zehn habe ich einen Termin.",
            native: "At ten I have an appointment.",
          },
          {
            target: "Um zehn ich habe einen Termin.",
            native: "At ten I have an appointment.",
          },
          {
            target: "Es ist zehn Uhr.",
            native: "It’s ten o’clock.",
          },
        ],
        correct: 0,
        right:
          "Um zehn takes first place, so habe comes second, then ich. Verb second.",
        wrong: {
          1: "After Um zehn the verb comes next: Um zehn habe ich einen Termin.",
          2: "That tells the time now. Lena asked what’s on: Um zehn habe ich einen Termin.",
        },
        react: { target: "Alles klar, um zehn.", native: "Got it, at ten." },
        phrases: [
          {
            target: "Um zehn habe ich einen Termin.",
            native: "At ten I have an appointment.",
          },
          {
            target: "Heute habe ich keine Termine.",
            native: "I have no appointments today.",
          },
        ],
      },
      {
        task: "Say when you’re free tomorrow",
        ask: {
          target: "Hast du morgen Zeit für ein Review?",
          native: "Do you have time for a review tomorrow?",
        },
        options: [
          {
            target: "Ja, morgen um halb elf.",
            native: "Yes, tomorrow at half past ten.",
          },
          {
            target: "Ja, morgen ist halb elf.",
            native: "Yes, tomorrow is half past ten.",
          },
          {
            target: "Ja, am morgen um halb elf.",
            native: "Yes, on tomorrow at half past ten.",
          },
        ],
        correct: 0,
        right: "morgen um halb elf: tomorrow at 10:30. Short and clear.",
        wrong: {
          1: "ist says what something is. To say when: morgen um halb elf.",
          2: "am goes with days, like am Montag. morgen stands on its own: morgen um halb elf.",
        },
        react: {
          target: "Super, morgen um halb elf!",
          native: "Great, tomorrow at half past ten!",
        },
        phrases: [
          {
            target: "Ja, morgen um halb elf.",
            native: "Yes, tomorrow at half past ten.",
          },
          {
            target: "Morgen habe ich keine Zeit.",
            native: "I don’t have time tomorrow.",
          },
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
    target: line.target.replaceAll("%N", firstName),
    native: line.native.replaceAll("%N", firstName),
  }
}
