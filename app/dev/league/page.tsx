import { notFound } from "next/navigation"

import { AppShell } from "@/components/layout/app-shell"
import { LeagueView } from "@/features/leagues/components/league-view"
import { devPreviewsEnabled } from "@/lib/dev-preview"

import { sampleLeague } from "../sample-league"

type Props = { searchParams: Promise<{ state?: string }> }

async function seen() {
  "use server"
}

/**
 * Development only: the league page with a sample table.
 * `?state=mid|top|bottom|full|new|promoted|relegated|stayed`.
 */
export default async function DevLeaguePage({ searchParams }: Props) {
  if (!devPreviewsEnabled) notFound()
  const league = sampleLeague((await searchParams).state)
  return (
    <AppShell name="Sam Haddad" email="sam@example.com">
      <LeagueView
        league={league}
        onResultSeen={seen}
        profileBase="/dev/profile?handle="
      />
    </AppShell>
  )
}
