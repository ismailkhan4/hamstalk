"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { Alert } from "@/components/feedback/alert"
import { ChoiceRow } from "@/components/forms/choice-row"
import { Field } from "@/components/forms/field"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogActions,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/features/auth/components/password-input"
import {
  profileSchema,
  resetPasswordSchema,
  type ProfileValues,
  type ResetPasswordValues,
} from "@/features/auth/schemas"
import {
  GOALS,
  LEVELS,
  goalOptions,
  levelOptions,
  type Goal,
  type StartLevel,
} from "@/features/onboarding/options"

import type { SettingsResult } from "./actions"

type Failure = Extract<SettingsResult, { ok: false }>

type DialogProps = { open: boolean; onOpenChange: (open: boolean) => void }

function Failed({ failure }: { failure: Failure | null }) {
  return failure ? (
    <Alert tone="error" title={failure.title} className="mt-4">
      {failure.message}
    </Alert>
  ) : null
}

type ChoiceDialogProps<T extends string> = DialogProps & {
  title: string
  description: string
  name: string
  values: readonly T[]
  labels: (value: T) => { title: string; text: string }
  current: T | null
  confirmLabel: string
  onSave: (value: T) => Promise<SettingsResult>
}

/** A radio list in a dialog, used for the main goal and the starting level. */
function ChoiceDialog<T extends string>({
  open,
  onOpenChange,
  title,
  description,
  name,
  values,
  labels,
  current,
  confirmLabel,
  onSave,
}: ChoiceDialogProps<T>) {
  const [picked, setPicked] = useState<T | null>(current)
  const [saving, setSaving] = useState(false)
  const [failure, setFailure] = useState<Failure | null>(null)

  async function save() {
    if (!picked) return
    setSaving(true)
    setFailure(null)
    const result = await onSave(picked)
    setSaving(false)
    if (result.ok) onOpenChange(false)
    else setFailure(result)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next) {
          setPicked(current)
          setFailure(null)
        }
        onOpenChange(next)
      }}
    >
      <DialogContent>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
        <fieldset className="mt-5">
          <legend className="sr-only">{title}</legend>
          <div className="flex flex-col gap-2.5">
            {values.map((value) => (
              <ChoiceRow
                key={value}
                type="radio"
                name={name}
                value={value}
                checked={picked === value}
                onChange={() => setPicked(value)}
                title={labels(value).title}
                description={labels(value).text}
                className="min-h-14"
              />
            ))}
          </div>
        </fieldset>
        <Failed failure={failure} />
        <DialogActions>
          <DialogClose render={<Button variant="outline" size="lg" />}>
            Cancel
          </DialogClose>
          <Button
            size="lg"
            onClick={save}
            loading={saving}
            loadingText="Saving…"
            disabled={!picked || picked === current}
          >
            {confirmLabel}
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  )
}

export function GoalDialog(
  props: DialogProps & {
    current: Goal | null
    onSave: (goal: Goal) => Promise<SettingsResult>
  }
) {
  return (
    <ChoiceDialog
      {...props}
      title="Change your main goal?"
      description="Your next missions follow your goal. Lessons you’ve finished and your words stay as they are."
      name="goal"
      values={GOALS}
      labels={(goal) => goalOptions[goal]}
      confirmLabel="Change goal"
    />
  )
}

export function LevelDialog(
  props: DialogProps & {
    current: StartLevel | null
    onSave: (level: StartLevel) => Promise<SettingsResult>
  }
) {
  return (
    <ChoiceDialog
      {...props}
      title="Change your starting level?"
      description="This changes where your path begins. Lessons you’ve finished and your words stay as they are. Only A1 Units 1 and 2 have lessons so far."
      name="level"
      values={LEVELS}
      labels={(level) => levelOptions[level]}
      confirmLabel="Change level"
    />
  )
}

export function ProfileDialog({
  open,
  onOpenChange,
  name,
  email,
  onSave,
}: DialogProps & {
  name: string
  email: string
  onSave: (values: ProfileValues) => Promise<SettingsResult>
}) {
  const [failure, setFailure] = useState<Failure | null>(null)
  const [note, setNote] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { fullName: name, email },
  })

  const submit = handleSubmit(async (values) => {
    setFailure(null)
    const result = await onSave(values)
    if (!result.ok) return setFailure(result)
    if (result.message && values.email !== email) setNote(result.message)
    else onOpenChange(false)
  })

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next) {
          reset({ fullName: name, email })
          setFailure(null)
          setNote(null)
        }
        onOpenChange(next)
      }}
    >
      <DialogContent>
        <form onSubmit={submit} noValidate>
          <DialogTitle>Name and email</DialogTitle>
          <DialogDescription>
            Your teammates see your name. We use your email to sign you in.
          </DialogDescription>
          <div className="mt-5 flex flex-col gap-4">
            <Field label="Full name" error={errors.fullName?.message}>
              <Input autoComplete="name" {...register("fullName")} />
            </Field>
            <Field label="Email" error={errors.email?.message}>
              <Input
                type="email"
                autoComplete="email"
                inputMode="email"
                {...register("email")}
              />
            </Field>
          </div>
          <Failed failure={failure} />
          {note && (
            <Alert tone="success" title="Name saved" className="mt-4">
              {note}
            </Alert>
          )}
          <DialogActions>
            <DialogClose render={<Button variant="outline" size="lg" />}>
              {note ? "Close" : "Cancel"}
            </DialogClose>
            {!note && (
              <Button
                type="submit"
                size="lg"
                loading={isSubmitting}
                loadingText="Saving…"
              >
                Save changes
              </Button>
            )}
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function PasswordDialog({
  open,
  onOpenChange,
  onSave,
}: DialogProps & {
  onSave: (values: ResetPasswordValues) => Promise<SettingsResult>
}) {
  const [failure, setFailure] = useState<Failure | null>(null)
  const [done, setDone] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  })

  const submit = handleSubmit(async (values) => {
    setFailure(null)
    const result = await onSave(values)
    if (result.ok) setDone(result.message ?? "Password updated.")
    else setFailure(result)
  })

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next) {
          reset()
          setFailure(null)
          setDone(null)
        }
        onOpenChange(next)
      }}
    >
      <DialogContent>
        <form onSubmit={submit} noValidate>
          <DialogTitle>Change password</DialogTitle>
          <DialogDescription>
            Use at least 8 characters, with a letter and a number.
          </DialogDescription>
          <div className="mt-5 flex flex-col gap-4">
            <Field label="New password" error={errors.password?.message}>
              <PasswordInput
                autoComplete="new-password"
                {...register("password")}
              />
            </Field>
            <Field
              label="New password again"
              error={errors.confirmPassword?.message}
            >
              <PasswordInput
                autoComplete="new-password"
                {...register("confirmPassword")}
              />
            </Field>
          </div>
          <Failed failure={failure} />
          {done && (
            <Alert tone="success" title="Password updated" className="mt-4">
              {done}
            </Alert>
          )}
          <DialogActions>
            <DialogClose render={<Button variant="outline" size="lg" />}>
              {done ? "Close" : "Cancel"}
            </DialogClose>
            {!done && (
              <Button
                type="submit"
                size="lg"
                loading={isSubmitting}
                loadingText="Saving…"
              >
                Change password
              </Button>
            )}
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  )
}

type DangerDialogProps = DialogProps & {
  title: string
  description: string
  keepLabel: string
  confirmLabel: string
  /** When set, the learner must type this word before the action is allowed. */
  confirmWord?: string
  onConfirm: (typed: string) => Promise<SettingsResult>
  onDone?: (result: Extract<SettingsResult, { ok: true }>) => void
}

export function DangerDialog({
  open,
  onOpenChange,
  title,
  description,
  keepLabel,
  confirmLabel,
  confirmWord,
  onConfirm,
  onDone,
}: DangerDialogProps) {
  const [typed, setTyped] = useState("")
  const [working, setWorking] = useState(false)
  const [failure, setFailure] = useState<Failure | null>(null)

  async function confirm() {
    setWorking(true)
    setFailure(null)
    const result = await onConfirm(typed)
    setWorking(false)
    if (result.ok) {
      onOpenChange(false)
      onDone?.(result)
    } else setFailure(result)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next) {
          setTyped("")
          setFailure(null)
        }
        onOpenChange(next)
      }}
    >
      <DialogContent size="sm">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
        {confirmWord && (
          <div className="mt-4">
            <Field label={`Type “${confirmWord}” to confirm`}>
              <Input
                value={typed}
                onChange={(event) => setTyped(event.target.value)}
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
              />
            </Field>
          </div>
        )}
        <Failed failure={failure} />
        <DialogActions>
          <DialogClose render={<Button variant="outline" size="lg" />}>
            {keepLabel}
          </DialogClose>
          <Button
            variant="danger"
            size="lg"
            onClick={confirm}
            loading={working}
            loadingText="Working…"
            disabled={
              confirmWord !== undefined &&
              typed.trim().toLowerCase() !== confirmWord
            }
          >
            {confirmLabel}
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  )
}
