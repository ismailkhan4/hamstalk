import { ShieldCheck } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"

import { buttonVariants } from "@/components/ui/button-variants"
import { AuthShell } from "@/features/auth/components/auth-shell"
import { ResultStamp } from "@/features/auth/components/result-stamp"

export const metadata: Metadata = { title: "Password updated" }

export default function PasswordUpdatedPage() {
  return (
    <AuthShell variant="recover">
      <div role="status">
        <ResultStamp icon={ShieldCheck} tone="success" />
        <h1 className="font-display text-h1 font-bold">Password updated</h1>
        <p className="mt-3 text-body text-secondary-text">
          Your new password is saved. For your security, you’ve been signed out
          on other devices.
        </p>
        <Link
          href="/signin?notice=password-updated"
          className={buttonVariants({
            size: "lg",
            fullWidth: true,
            className: "mt-8",
          })}
        >
          Back to sign in
        </Link>
      </div>
    </AuthShell>
  )
}
