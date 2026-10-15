import type { Metadata } from "next"

import { loadLearner } from "@/features/learner/load-learner"
import { DatabaseNotReady } from "@/features/onboarding/database-not-ready"
import { PathView } from "@/features/path/components/path-view"

export const metadata: Metadata = { title: "Learning path" }

type Props = {
  searchParams: Promise<{ level?: string | string[]; unit?: string | string[] }>
}

export default async function PathPage({ searchParams }: Props) {
  const learner = await loadLearner("/path")
  if (learner === "database-not-ready") return <DatabaseNotReady />
  return (
    <PathView
      {...learner}
      email={learner.user.email}
      params={await searchParams}
    />
  )
}
