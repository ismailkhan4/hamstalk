import { MessagesSquare } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { EmptyState } from "@/components/feedback/empty-state"
import { buttonVariants } from "@/components/ui/button-variants"
import { ACTIVE_COURSE } from "@/content/courses"
import { getUnit } from "@/content/courses/de/curriculum"
import { getRoleplay } from "@/content/courses/de/roleplays"
import { loadLearner } from "@/features/learner/load-learner"
import { DatabaseNotReady } from "@/features/onboarding/database-not-ready"
import { isUnitCompleted } from "@/features/path/model"
import {
  finishRoleplayAction,
  roleplayTurnAction,
} from "@/features/roleplay/actions"
import { RoleplayChat } from "@/features/roleplay/components/roleplay-chat"
import { aiEnabled } from "@/lib/ai/claude"
import { createClient } from "@/lib/supabase/server"

type Props = { params: Promise<{ id: string }> }

export const metadata: Metadata = { title: "Roleplay" }

function Unavailable({ title, body }: { title: string; body: string }) {
  return (
    <main
      id="main"
      className="grid min-h-svh place-items-center bg-background px-4"
    >
      <EmptyState
        icon={MessagesSquare}
        title={title}
        actions={
          <Link
            href="/team"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            Back to the team
          </Link>
        }
      >
        {body}
      </EmptyState>
    </main>
  )
}

/** A roleplay with a team character. Each visit starts a fresh conversation. */
export default async function RoleplayPage({ params }: Props) {
  const { id } = await params
  const roleplay = getRoleplay(id)
  if (!roleplay) notFound()
  const learner = await loadLearner(`/team/roleplay/${id}`)
  if (learner === "database-not-ready") return <DatabaseNotReady />

  const unit = getUnit(roleplay.unlockUnit)
  if (!unit || !isUnitCompleted(unit, learner.progress))
    return (
      <Unavailable
        title="Not yet"
        body={`Finish Unit ${unit?.number} first: this conversation uses what it teaches.`}
      />
    )
  if (!aiEnabled())
    return (
      <Unavailable
        title="Roleplays aren’t switched on here"
        body="They need an Anthropic API key. If you run this copy of Klarlingo, set ANTHROPIC_API_KEY."
      />
    )

  const supabase = await createClient()
  const { data: session, error } = await supabase
    .from("practice_sessions")
    .insert({
      user_id: learner.user.id,
      kind: "roleplay",
      exercise_keys: [`roleplay:${roleplay.id}`],
    })
    .select("id")
    .single()
  if (error || !session)
    return (
      <Unavailable
        title="Roleplays aren’t set up yet"
        body="They need the AI migration. If you run this copy of Klarlingo, apply supabase/migrations/ai.sql."
      />
    )

  const pacer = ACTIVE_COURSE.pacers.find((p) => p.id === roleplay.character)
  return (
    <RoleplayChat
      roleplay={roleplay}
      character={{
        id: roleplay.character,
        name: pacer?.name.split(" ")[0] ?? "Your colleague",
        initials: pacer?.initials ?? "?",
        role: pacer?.role ?? "",
      }}
      actions={{
        turn: roleplayTurnAction.bind(null, session.id, roleplay.id),
        finish: finishRoleplayAction.bind(null, session.id, roleplay.id),
      }}
    />
  )
}
