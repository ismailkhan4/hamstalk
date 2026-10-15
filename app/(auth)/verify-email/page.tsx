import type { Metadata } from "next"

import { resendVerificationAction } from "@/features/auth/actions"
import { AuthShell } from "@/features/auth/components/auth-shell"
import { VerifyEmail } from "@/features/auth/components/verify-email"

export const metadata: Metadata = { title: "Check your email" }

type Props = {
  searchParams: Promise<{
    email?: string | string[]
    expired?: string | string[]
  }>
}

export default async function VerifyEmailPage({ searchParams }: Props) {
  const params = await searchParams
  const email =
    typeof params.email === "string" && params.email.includes("@")
      ? params.email.slice(0, 254)
      : null

  return (
    <AuthShell variant="verify">
      <VerifyEmail
        email={email}
        expired={params.expired === "1"}
        resend={resendVerificationAction}
      />
    </AuthShell>
  )
}
