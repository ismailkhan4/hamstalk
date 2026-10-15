import type { Metadata } from "next"

import { signInAction } from "@/features/auth/actions"
import { AuthShell } from "@/features/auth/components/auth-shell"
import { SignInForm } from "@/features/auth/components/sign-in-form"

export const metadata: Metadata = { title: "Sign in" }

const NOTICES = [
  "password-updated",
  "session-expired",
  "signed-out",
  "link-invalid",
  "account-deleted",
] as const
type Notice = (typeof NOTICES)[number]

type Props = {
  searchParams: Promise<{
    next?: string | string[]
    notice?: string | string[]
  }>
}

export default async function SignInPage({ searchParams }: Props) {
  const params = await searchParams
  const next = typeof params.next === "string" ? params.next : null
  const notice = NOTICES.find((value) => value === params.notice) as
    Notice | undefined

  return (
    <AuthShell
      variant="signin"
      panelText="Welcome back. Your team saved you a seat at the standup."
    >
      <SignInForm
        action={signInAction.bind(null, next)}
        {...(notice ? { notice } : {})}
      />
    </AuthShell>
  )
}
