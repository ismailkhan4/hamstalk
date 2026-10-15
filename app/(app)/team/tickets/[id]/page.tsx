import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ticket } from "@/content/team-tasks"
import { DatabaseNotReady } from "@/features/onboarding/database-not-ready"
import { loadTaskLearner } from "@/features/team/task-access"
import { TicketScreen } from "@/features/team/ticket-screen"

export const metadata: Metadata = { title: "Ticket KLAR-142" }

type Props = { params: Promise<{ id: string }> }

export default async function TicketPage({ params }: Props) {
  const { id } = await params
  if (id !== ticket.id) notFound()
  const learner = await loadTaskLearner(`/team/tickets/${id}`)
  if (learner === "database-not-ready") return <DatabaseNotReady />

  return (
    <TicketScreen
      shell={{
        name: learner.name,
        email: learner.user.email,
        counts: learner.counts,
      }}
      firstName={learner.firstName}
    />
  )
}
