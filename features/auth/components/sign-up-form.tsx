"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useState } from "react"
import { useForm, useWatch } from "react-hook-form"

import { Alert } from "@/components/feedback/alert"
import { Field } from "@/components/forms/field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { signUpSchema, type SignUpValues } from "../schemas"
import type { AuthAction, AuthError } from "../types"
import { PasswordInput } from "./password-input"
import { PasswordRules } from "./password-rules"

type SignUpFormProps = {
  action: AuthAction<SignUpValues>
  defaultEmail?: string
  onNameChange?: (name: string) => void
}

export function SignUpForm({
  action,
  defaultEmail = "",
  onNameChange,
}: SignUpFormProps) {
  const [serverError, setServerError] = useState<AuthError | null>(null)
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isSubmitted },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: { fullName: "", email: defaultEmail, password: "" },
  })

  const password = useWatch({ control, name: "password" })
  const errorCount = Object.keys(errors).length
  const nameField = register("fullName", {
    onChange: (event) => onNameChange?.(event.target.value),
  })

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null)
    const result = await action(values)
    if (!result.ok) setServerError(result.error)
  })

  return (
    <form onSubmit={onSubmit} noValidate>
      <h1 className="font-display text-h1 font-bold">Join the team</h1>
      <p className="mt-3 text-body text-secondary-text">
        Create your account and start as the newest developer at a small German
        tech company. You’ll learn the German you need, one short mission at a
        time.
      </p>

      {isSubmitted && <SignUpErrorSummary count={errorCount} />}
      {serverError && (
        <Alert tone="error" title={serverError.title} className="mt-6">
          {serverError.message}
        </Alert>
      )}

      <div className="mt-8 flex flex-col gap-5">
        <Field
          label="Full name"
          error={errors.fullName?.message}
          helper={
            errors.fullName
              ? undefined
              : "Your teammates will use this name in conversations."
          }
        >
          <Input placeholder="Sam Haddad" autoComplete="name" {...nameField} />
        </Field>
        <Field label="Email" error={errors.email?.message}>
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
          invalid={Boolean(errors.password)}
          helper={<PasswordRules password={password} submitted={isSubmitted} />}
        >
          <PasswordInput
            autoComplete="new-password"
            {...register("password")}
          />
        </Field>
      </div>

      <Button
        type="submit"
        size="lg"
        fullWidth
        loading={isSubmitting}
        loadingText="Creating your account…"
        className="mt-8"
      >
        Create account
      </Button>
      <p className="mt-5 text-center text-[15px] text-secondary-text">
        Already have an account?{" "}
        <Link
          href="/signin"
          className="font-semibold text-primary-text underline underline-offset-[3px]"
        >
          Sign in
        </Link>
      </p>
    </form>
  )
}

function SignUpErrorSummary({ count }: { count: number }) {
  if (count === 0) return null
  return (
    <Alert tone="error" title="Check the highlighted fields" className="mt-6">
      {count === 1
        ? "One field needs a fix before we can create your account."
        : `${count} fields need a fix before we can create your account.`}
    </Alert>
  )
}
