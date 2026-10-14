"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm, useWatch } from "react-hook-form"

import { Alert } from "@/components/feedback/alert"
import { Field } from "@/components/forms/field"
import { Button } from "@/components/ui/button"

import { resetPasswordSchema, type ResetPasswordValues } from "../schemas"
import type { AuthAction, AuthError } from "../types"
import { PasswordInput } from "./password-input"
import { PasswordRules } from "./password-rules"

type ResetPasswordFormProps = {
  action: AuthAction<ResetPasswordValues>
  email: string
}

export function ResetPasswordForm({ action, email }: ResetPasswordFormProps) {
  const [serverError, setServerError] = useState<AuthError | null>(null)
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isSubmitted },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: { password: "", confirmPassword: "" },
  })

  const [password, confirmPassword] = useWatch({
    control,
    name: ["password", "confirmPassword"],
  })
  const matches =
    confirmPassword !== "" && confirmPassword === password && !errors.password

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null)
    const result = await action(values)
    if (!result.ok) setServerError(result.error)
  })

  return (
    <form onSubmit={onSubmit} noValidate>
      <h1 className="font-display text-h1 font-bold">Choose a new password</h1>
      <p className="mt-3 text-body text-secondary-text">
        For <b className="text-foreground">{email}</b>. Pick something you
        haven’t used on Klarlingo before.
      </p>
      {serverError && (
        <Alert tone="error" title={serverError.title} className="mt-6">
          {serverError.message}
        </Alert>
      )}
      <div className="mt-8 flex flex-col gap-5">
        <Field
          label="New password"
          invalid={Boolean(errors.password)}
          helper={<PasswordRules password={password} submitted={isSubmitted} />}
        >
          <PasswordInput
            autoComplete="new-password"
            {...register("password")}
          />
        </Field>
        <Field
          label="Confirm new password"
          error={errors.confirmPassword?.message}
          success={matches ? "Passwords match" : undefined}
        >
          <PasswordInput
            autoComplete="new-password"
            {...register("confirmPassword")}
          />
        </Field>
      </div>
      <Button
        type="submit"
        size="lg"
        fullWidth
        loading={isSubmitting}
        loadingText="Updating…"
        className="mt-8"
      >
        Update password
      </Button>
    </form>
  )
}
