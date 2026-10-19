import { notFound } from "next/navigation"

import { AppShell } from "@/components/layout/app-shell"
import { FriendsWeek } from "@/features/friends/components/friends-week"
import type { FriendWeek } from "@/features/friends/model"
import { LeagueView } from "@/features/leagues/components/league-view"
import { devPreviewsEnabled } from "@/lib/dev-preview"

import { sampleLeague } from "../sample-league"

type Props = { searchParams: Promise<{ state?: string; friends?: string }> }

async function seen() {
  "use server"
}

async function nudge() {
  "use server"
  return { result: "sent" as const, message: "Nudge sent.", delivered: true }
}

const friend = (
  handle: string,
  displayName: string,
  xp: number,
  streak: number,
  more: Partial<FriendWeek> = {}
): FriendWeek => ({
  handle,
  displayName,
  xp,
  streak,
  me: false,
  practisedToday: true,
  canNudge: false,
  ...more,
})

const SAMPLE_FRIENDS: FriendWeek[] = [
  friend("priya-3f9a21", "Priya S.", 340, 21),
  friend("sam-8c1d02", "Sam H.", 215, 6, { me: true }),
  friend("tomasz-77b0e4", "Tomasz K.", 120, 3, {
    practisedToday: false,
    canNudge: true,
  }),
  friend("lea-02ac55", "Lea M.", 40, 0, { practisedToday: false }),
]

/**
 * Development only: the league page with a sample table.
 * `?state=mid|top|bottom|full|new|promoted|relegated|stayed`, and `&friends=none` for the friends
 * table before following anyone.
 */
export default async function DevLeaguePage({ searchParams }: Props) {
  if (!devPreviewsEnabled) notFound()
  const params = await searchParams
  const league = sampleLeague(params.state)
  const friends =
    params.friends === "none"
      ? SAMPLE_FRIENDS.filter((row) => row.me)
      : SAMPLE_FRIENDS
  return (
    <AppShell name="Sam Haddad" email="sam@example.com">
      <LeagueView
        league={league}
        onResultSeen={seen}
        profileBase="/dev/profile?handle="
        friends={
          <FriendsWeek rows={friends} myHandle="sam-8c1d02" onNudge={nudge} />
        }
      />
    </AppShell>
  )
}
