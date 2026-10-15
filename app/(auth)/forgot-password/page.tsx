import type { Metadata } from "next"

import { requestPasswordResetAction } from "@/features/auth/actions"
import { AuthShell } from "@/features/auth/components/auth-shell"
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form"

export const metadata: Metadata = { title: "Reset your password" }

type Props = { searchParams: Promise<{ expired?: string | string[] }> }

export default async function ForgotPasswordPage({ searchParams }: Props) {
  const { expired } = await searchParams
  return (
    <AuthShell variant="recover">
      <ForgotPasswordForm
        action={requestPasswordResetAction}
        linkExpired={expired === "1"}
      />
    </AuthShell>
  )
}
