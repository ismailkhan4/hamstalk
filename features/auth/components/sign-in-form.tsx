"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { Alert } from "@/components/feedback/alert"
import { Field } from "@/components/forms/field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { signInSchema, type SignInValues } from "../schemas"
import type { AuthAction, AuthError } from "../types"
import { PasswordInput } from "./password-input"

type SignInFormProps = {
  action: AuthAction<SignInValues>
  defaultEmail?: string
  notice?:
    | "password-updated"
    | "session-expired"
    | "signed-out"
    | "link-invalid"
    | "account-deleted"
}

const notices = {
  "password-updated": {
    tone: "success",
    title: "Password updated",
    message: "Sign in with your new password.",
  },
  "session-expired": {
    tone: "info",
    title: "Please sign in again",
    message: "You’ve been signed out for security after a long break.",
  },
  "signed-out": {
    tone: "success",
    title: "You’re signed out",
    message: "See you at the next standup.",
  },
  "account-deleted": {
    tone: "success",
    title: "Your account is deleted",
    message:
      "Your progress, words and notes were removed. Thanks for learning with us.",
  },
  "link-invalid": {
    tone: "error",
    title: "That link didn’t work",
    message:
      "It may have expired or been used already. Sign in, or ask for a new link.",
  },
} as const

export function SignInForm({
  action,
  defaultEmail = "",
  notice,
}: SignInFormProps) {
  const [serverError, setServerError] = useState<AuthError | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: { email: defaultEmail, password: "" },
  })

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null)
    const result = await action(values)
    if (!result.ok) setServerError(result.error)
  })

  const shownNotice = notice && !serverError ? notices[notice] : null

  return (
    <form onSubmit={onSubmit} noValidate>
      <h1 className="font-display text-h1 font-bold">Welcome back</h1>
      <p className="mt-3 text-body text-secondary-text">
        Sign in to pick up where you left off with your team.
      </p>

      {shownNotice && (
        <Alert
          tone={shownNotice.tone}
          title={shownNotice.title}
          className="mt-6"
        >
          {shownNotice.message}
        </Alert>
      )}
      {serverError && (
        <Alert tone="error" title={serverError.title} className="mt-6">
          {serverError.message}
        </Alert>
      )}

      <div className="mt-8 flex flex-col gap-5">
        <Field
          label="Email"
          error={errors.email?.message}
          invalid={Boolean(serverError)}
        >
          <Input
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            inputMode="email"
            {...register("email")}
          />
        </Field>
        <Field
          label="Password"
          error={errors.password?.message}
          invalid={Boolean(serverError)}
          labelAside={
            <Link
              href="/forgot-password"
              className="text-sm font-semibold text-primary-text underline underline-offset-[3px]"
            >
              Forgot password?
            </Link>
          }
        >
          <PasswordInput
            autoComplete="current-password"
            {...register("password")}
          />
        </Field>
      </div>

      <Button
        type="submit"
        size="lg"
        fullWidth
        loading={isSubmitting}
        loadingText="Signing in…"
        className="mt-8"
      >
        Sign in
      </Button>
      <p className="mt-5 text-center text-[0.9375rem] text-secondary-text">
        New to Klarlingo?{" "}
        <Link
          href="/signup"
          className="font-semibold text-primary-text underline underline-offset-[3px]"
        >
          Create an account
        </Link>
      </p>
    </form>
  )
}
