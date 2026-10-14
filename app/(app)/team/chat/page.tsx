import type { Metadata } from "next"

import { ChatScreen } from "@/features/team/chat-screen"
import { DatabaseNotReady } from "@/features/onboarding/database-not-ready"
import { loadTaskLearner } from "@/features/team/task-access"

export const metadata: Metadata = { title: "Message from Jonas" }

export default async function ChatPage() {
  const learner = await loadTaskLearner("/team/chat")
  if (learner === "database-not-ready") return <DatabaseNotReady />

  return (
    <ChatScreen
      shell={{
        name: learner.name,
        email: learner.user.email,
        counts: learner.counts,
      }}
      firstName={learner.firstName}
    />
  )
}
