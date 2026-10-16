import { redirect } from "next/navigation"

import { requireUser } from "@/lib/auth/session"
import { loadMyProfile } from "@/features/leagues/data"

/** The learner's own profile, at its public address. */
export default async function MyProfilePage() {
  await requireUser("/profile")
  const profile = await loadMyProfile()
  redirect(profile ? `/u/${profile.handle}` : "/settings")
}
