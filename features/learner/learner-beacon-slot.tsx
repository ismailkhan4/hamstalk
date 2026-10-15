import { createClient } from "@/lib/supabase/server"

import { LearnerBeacon } from "./learner-beacon"

async function signedInUser() {
  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getClaims()
    const claims = data?.claims
    if (!claims?.sub) return null

    const metadata = (claims.user_metadata ?? {}) as Record<string, unknown>
    return {
      id: claims.sub,
      email: typeof claims.email === "string" ? claims.email : "",
      fullName:
        typeof metadata.full_name === "string" ? metadata.full_name.trim() : "",
    }
  } catch {
    return null
  }
}

/** The beacon for whoever is signed in, or nothing. Never redirects: the pages do that. */
export async function LearnerBeaconSlot() {
  const user = await signedInUser()
  return user ? (
    <LearnerBeacon
      userId={user.id}
      email={user.email}
      fullName={user.fullName}
    />
  ) : null
}
