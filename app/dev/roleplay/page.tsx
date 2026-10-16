import { notFound } from "next/navigation"

import { roleplays } from "@/content/courses/de/roleplays"
import type { RoleplayLine } from "@/features/roleplay/actions"
import { RoleplayChat } from "@/features/roleplay/components/roleplay-chat"
import { devPreviewsEnabled } from "@/lib/dev-preview"

/** Development only: the roleplay chat with scripted replies, no AI and nothing saved. */
async function turn(history: RoleplayLine[]) {
  "use server"
  const said = history.filter((line) => line.role === "learner").length
  const script = [
    {
      reply: {
        target: "Schön! Wie heißt du?",
        native: "Nice! What’s your name?",
      },
      correction: null,
      goalsMet: ["greet"],
      done: false,
    },
    {
      reply: {
        target: "Freut mich! Ich bin Clara. Bis gleich beim Standup!",
        native: "Nice to meet you! I’m Clara. See you at the standup!",
      },
      correction: {
        better: "Ich heiße Sam.",
        note: "heißen: ich heiße, not ich heißt",
      },
      goalsMet: ["greet", "name"],
      done: false,
    },
    {
      reply: { target: "Tschüss!", native: "Bye!" },
      correction: null,
      goalsMet: ["greet", "name", "bye"],
      done: true,
    },
  ]
  return { ok: true as const, turn: script[Math.min(said, script.length) - 1]! }
}

async function finish() {
  "use server"
  return {
    ok: true as const,
    rewards: null,
    feedback: {
      stars: 2,
      summary: "You greeted Clara, said who you are and left politely.",
      highlights: ["“Hallo, Clara!” was a friendly start."],
      fixes: [
        {
          said: "Ich heißt Sam.",
          better: "Ich heiße Sam.",
          why: "With ich, heißen ends in -e.",
        },
      ],
    },
  }
}

export default function DevRoleplayPage() {
  if (!devPreviewsEnabled) notFound()
  const roleplay = roleplays[0]!
  return (
    <RoleplayChat
      roleplay={roleplay}
      character={{ id: "cm", name: "Clara", initials: "CM", role: "Design" }}
      actions={{ turn, finish }}
    />
  )
}
