"use client"

import { Clock, MailOpen, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { Alert } from "@/components/feedback/alert"
import { Button } from "@/components/ui/button"

import type { AuthAction, AuthError } from "../types"
import { ResultStamp } from "./result-stamp"

type VerifyEmailProps = {
  email: string
  expired?: boolean
  resend: AuthAction<{ email: string }>
}

export function VerifyEmail({
  email,
  expired = false,
  resend,
}: VerifyEmailProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle")
  const [error, setError] = useState<AuthError | null>(null)

  async function onResend() {
    setStatus("sending")
    setError(null)
    const result = await resend({ email })
    if (result.ok) setStatus("sent")
    else {
      setStatus("idle")
      setError(result.error)
    }
  }

  const changeHref = `/signup?email=${encodeURIComponent(email)}`
  const showExpired = expired && status !== "sent"

  return (
    <div>
      <ResultStamp
        icon={showExpired ? Clock : MailOpen}
        tone={showExpired ? "warning" : "primary"}
      />
      <h1 className="font-display text-h1 font-bold">
        {showExpired ? "This link has expired" : "Check your email"}
      </h1>
      {showExpired ? (
        <p className="mt-3 text-body text-secondary-text">
          Verification links work for 24 hours, and only the newest one counts.
          We’ll send a fresh link to <b className="text-foreground">{email}</b>.
        </p>
      ) : (
        <p className="mt-3 text-body text-secondary-text">
          We sent a verification link to{" "}
          <b className="text-foreground">{email}</b>. Open it to confirm your
          address and meet your team.
        </p>
      )}

      {status === "sent" && (
        <Alert tone="success" title="New link sent" className="mt-6">
          Use the newest email. Earlier links no longer work.
        </Alert>
      )}
      {error && (
        <Alert tone="error" title={error.title} className="mt-6">
          {error.message}
        </Alert>
      )}

      <div className="mt-8 border-t border-border-subtle pt-6">
        {!showExpired && (
          <p className="mb-4 text-sm text-muted-foreground">
            No email after a few minutes? Check your spam folder, then send it
            again.
          </p>
        )}
        <Button
          type="button"
          variant={showExpired ? "primary" : "outline"}
          size="lg"
          fullWidth
          iconLeft={showExpired ? undefined : <RefreshCw />}
          loading={status === "sending"}
          loadingText="Sending…"
          onClick={onResend}
        >
          {showExpired ? "Send a new link" : "Resend email"}
        </Button>
        <p className="mt-5 text-center text-[15px] text-secondary-text">
          Wrong address?{" "}
          <Link
            href={changeHref}
            className="font-semibold text-primary-text underline underline-offset-[3px]"
          >
            Change email
          </Link>
        </p>
      </div>
    </div>
  )
}
