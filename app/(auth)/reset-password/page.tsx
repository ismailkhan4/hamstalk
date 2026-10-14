import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { updatePasswordAction } from "@/features/auth/actions"
import { AuthShell } from "@/features/auth/components/auth-shell"
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = { title: "Choose a new password" }

/** Reached from the reset email, which signs the learner in with a short-lived recovery session. */
export default async function ResetPasswordPage() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  if (!data.user?.email) redirect("/forgot-password?expired=1")

  return (
    <AuthShell variant="recover">
      <ResetPasswordForm
        action={updatePasswordAction}
        email={data.user.email}
      />
    </AuthShell>
  )
}
