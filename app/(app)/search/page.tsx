import type { Metadata } from "next"

import { loadLearner } from "@/features/learner/load-learner"
import { DatabaseNotReady } from "@/features/onboarding/database-not-ready"
import { loadPhrasebook } from "@/features/phrasebook/data"
import { cleanQuery, searchAll } from "@/features/search/search"
import { SearchView } from "@/features/search/search-view"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = { title: "Search" }

type Props = { searchParams: Promise<{ q?: string | string[] }> }

export default async function SearchPage({ searchParams }: Props) {
  const query = cleanQuery((await searchParams).q)
  const learner = await loadLearner(
    query ? `/search?q=${encodeURIComponent(query)}` : "/search"
  )
  if (learner === "database-not-ready") return <DatabaseNotReady />
  const phrases = query ? await loadPhrasebook(await createClient()) : []

  return (
    <SearchView
      name={learner.name}
      email={learner.user.email}
      counts={learner.counts}
      query={query}
      results={searchAll(query, phrases)}
    />
  )
}
