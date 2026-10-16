import { Trophy } from "lucide-react"
import type { Metadata } from "next"

import { EmptyState } from "@/components/feedback/empty-state"
import { AppShell } from "@/components/layout/app-shell"
import { FriendsWeek } from "@/features/friends/components/friends-week"
import { loadFriendsWeek } from "@/features/friends/data"
import { loadLearner } from "@/features/learner/load-learner"
import { markResultSeenAction } from "@/features/leagues/actions"
import { LeagueView } from "@/features/leagues/components/league-view"
import { loadLeague, loadMyProfile } from "@/features/leagues/data"
import { DatabaseNotReady } from "@/features/onboarding/database-not-ready"

export const metadata: Metadata = { title: "League" }

export default async function LeaguePage() {
  const learner = await loadLearner("/league")
  if (learner === "database-not-ready") return <DatabaseNotReady />
  const [league, friends, me] = await Promise.all([
    loadLeague(),
    loadFriendsWeek(),
    loadMyProfile(),
  ])

  return (
    <AppShell
      name={learner.name}
      email={learner.user.email}
      counts={learner.counts}
    >
      {league ? (
        <LeagueView
          league={league}
          onResultSeen={markResultSeenAction}
          friends={
            friends && (
              <FriendsWeek
                rows={friends}
                myHandle={me?.isPublic ? me.handle : null}
              />
            )
          }
        />
      ) : (
        <main id="main" className="grid min-h-[60svh] place-items-center px-4">
          <EmptyState
            icon={Trophy}
            tone="offline"
            title="The league isn’t open yet"
          >
            Weekly leagues need the leagues migration. If you run this copy of
            Klarlingo, apply supabase/migrations/leagues.sql.
          </EmptyState>
        </main>
      )}
    </AppShell>
  )
}
