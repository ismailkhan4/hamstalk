import { notFound } from "next/navigation"

import { AppShell } from "@/components/layout/app-shell"
import { ProfileView } from "@/features/leagues/components/profile-view"
import { devPreviewsEnabled } from "@/lib/dev-preview"

import { sampleProfile } from "../sample-league"

type Props = { searchParams: Promise<{ me?: string }> }

async function fakeSave() {
  "use server"
  return { ok: true as const }
}

/** Development only: a learner's profile page. `?me=1` shows your own, with the edit form. */
export default async function DevProfilePage({ searchParams }: Props) {
  if (!devPreviewsEnabled) notFound()
  const profile = sampleProfile((await searchParams).me === "1")
  return (
    <AppShell name="Sam Haddad" email="sam@example.com">
      <ProfileView profile={profile} save={fakeSave} />
    </AppShell>
  )
}
