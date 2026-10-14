"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { MailCheck } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { Alert } from "@/components/feedback/alert"
import { Field } from "@/components/forms/field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { forgotPasswordSchema, type ForgotPasswordValues } from "../schemas"
import type { AuthAction, AuthError } from "../types"
import { BackToSignIn } from "./back-to-sign-in"
import { ResultStamp } from "./result-stamp"

type ForgotPasswordFormProps = {
  action: AuthAction<ForgotPasswordValues>
  linkExpired?: boolean
}

export function ForgotPasswordForm({
  action,
  linkExpired = false,
}: ForgotPasswordFormProps) {
  const [sentTo, setSentTo] = useState<string | null>(null)
  const [serverError, setServerError] = useState<AuthError | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: { email: "" },
  })

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null)
    const result = await action(values)
    if (result.ok) setSentTo(values.email)
    else setServerError(result.error)
  })

  if (sentTo) {
    return (
      <div role="status">
        <BackToSignIn />
        <ResultStamp icon={MailCheck} tone="primary" />
        <h1 className="font-display text-h1 font-bold">Check your inbox</h1>
        <p className="mt-3 text-body text-secondary-text">
          If an account exists for <b className="text-foreground">{sentTo}</b>,
          a reset link is on its way. It works for one hour.
        </p>
        <p className="mt-6 text-[15px] text-secondary-text">
          Didn’t get it? Check spam, or{" "}
          <button
            type="button"
            onClick={() => {
              setSentTo(null)
              reset({ email: "" })
            }}
            className="font-semibold text-primary-text underline underline-offset-[3px]"
          >
            try a different email
          </button>
          .
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <BackToSignIn />
      <h1 className="font-display text-h1 font-bold">Reset your password</h1>
      <p className="mt-3 text-body text-secondary-text">
        Enter the email you signed up with. We’ll send you a link to choose a
        new password.
      </p>
      {linkExpired && !serverError && (
        <Alert
          tone="warning"
          title="That reset link has expired"
          className="mt-6"
        >
          Reset links work for one hour, and only the newest one counts. Send
          yourself a new one.
        </Alert>
      )}
      {serverError && (
        <Alert tone="error" title={serverError.title} className="mt-6">
          {serverError.message}
        </Alert>
      )}
      <div className="mt-8">
        <Field label="Email" error={errors.email?.message}>
          <Input
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            inputMode="email"
            {...register("email")}
          />
        </Field>
      </div>
      <Button
        type="submit"
        size="lg"
        fullWidth
        loading={isSubmitting}
        loadingText="Sending link…"
        className="mt-8"
      >
        Send reset link
      </Button>
    </form>
  )
}
