import { LogOut } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

import { Logo } from "@/components/brand/logo"
import { Button } from "@/components/ui/button"
import { signOutAction } from "@/features/auth/actions"
import {
  DatabaseNotReadyError,
  loadPreferences,
} from "@/features/onboarding/data"
import { DatabaseNotReady } from "@/features/onboarding/database-not-ready"
import { requireUser } from "@/lib/auth/session"
import { firstName } from "@/lib/auth/user-name"
import { createClient } from "@/lib/supabase/server"


export const metadata: Metadata = { title: "Home" }

export default async function HomePage() {
  const user = await requireUser("/home")
  const supabase = await createClient()
  let preferences
  try {
    preferences = await loadPreferences(supabase, user.id)
  } catch (error) {
    if (error instanceof DatabaseNotReadyError) return <DatabaseNotReady />
    throw error
  }
  if (!preferences.onboardedAt) redirect(`/onboarding/${preferences.step}`)

  return (
    <div className="flex min-h-svh flex-col bg-deep px-[clamp(20px,5vw,112px)] py-6 text-deep-foreground">
      <header className="flex items-center justify-between">
        <Link
          href="/"
          aria-label="Klarlingo home"
          className="[&_span]:text-deep-foreground"
        >
          <Logo symbolClassName="size-[30px]" />
        </Link>
      </header>
      <main id="main" className="flex flex-1 flex-col justify-center py-16">
        <p className="flex items-center gap-2 text-sm font-semibold text-mint">
          <i aria-hidden="true" className="size-2.5 rounded-full bg-spark" />
          Signed in
        </p>
        <h1
          lang="de"
          className="mt-4 max-w-[14ch] font-voice text-[clamp(44px,5.6vw,72px)] leading-[1.04]"
        >
          Willkommen zurück, {firstName(user)}.
        </h1>
        <p className="mt-5 max-w-[46ch] text-body-lg text-deep-muted">
          You’re signed in as {user.email}. Your learning dashboard is being
          built; this is where today’s mission and your reviews will appear.
        </p>
        <form action={signOutAction} className="mt-9">
          <Button
            type="submit"
            variant="inverse"
            size="lg"
            iconLeft={<LogOut />}
          >
            Sign out
          </Button>
        </form>
      </main>
    </div>
  )
}
