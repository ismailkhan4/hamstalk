import type { Metadata } from "next"

import { loadLearner } from "@/features/learner/load-learner"
import { DatabaseNotReady } from "@/features/onboarding/database-not-ready"
import { PathView } from "@/features/path/components/path-view"
import { loadCompletedStandups } from "@/features/team/data"
import { loadExpressPassed } from "@/features/session-generator/express"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = { title: "Learning path" }

type Props = {
  searchParams: Promise<{ level?: string | string[]; unit?: string | string[] }>
}

export default async function PathPage({ searchParams }: Props) {
  const learner = await loadLearner("/path")
  if (learner === "database-not-ready") return <DatabaseNotReady />
  const supabase = await createClient()
  const [completedStandups, expressPassed] = await Promise.all([
    loadCompletedStandups(supabase),
    loadExpressPassed(supabase),
  ])
  return (
    <PathView
      {...learner}
      email={learner.user.email}
      completedStandups={completedStandups}
      expressPassed={expressPassed}
      params={await searchParams}
    />
  )
}
