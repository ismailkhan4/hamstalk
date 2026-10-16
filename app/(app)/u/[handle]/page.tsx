import { UserRound } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"

import { EmptyState } from "@/components/feedback/empty-state"
import { AppShell } from "@/components/layout/app-shell"
import { buttonVariants } from "@/components/ui/button-variants"
import { loadLearner } from "@/features/learner/load-learner"
import { saveProfileAction } from "@/features/leagues/actions"
import { ProfileView } from "@/features/leagues/components/profile-view"
import { loadProfile } from "@/features/leagues/data"
import { DatabaseNotReady } from "@/features/onboarding/database-not-ready"

type Props = { params: Promise<{ handle: string }> }

export const metadata: Metadata = { title: "Profile" }

export default async function ProfilePage({ params }: Props) {
  const { handle } = await params
  const learner = await loadLearner(`/u/${handle}`)
  if (learner === "database-not-ready") return <DatabaseNotReady />
  const profile = await loadProfile(handle)

  return (
    <AppShell
      name={learner.name}
      email={learner.user.email}
      counts={learner.counts}
    >
      {profile ? (
        <ProfileView profile={profile} save={saveProfileAction} />
      ) : (
        <main id="main" className="grid min-h-[60svh] place-items-center px-4">
          <EmptyState
            icon={UserRound}
            title="This profile isn’t available"
            actions={
              <Link
                href="/league"
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                Back to the league
              </Link>
            }
          >
            The learner may have made it private, or the link is wrong.
          </EmptyState>
        </main>
      )}
    </AppShell>
  )
}
