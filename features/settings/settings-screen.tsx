"use client"

import {
  Download,
  KeyRound,
  LogOut,
  Monitor,
  Moon,
  RefreshCcw,
  Sun,
  Trash2,
} from "lucide-react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { useState, useSyncExternalStore, useTransition } from "react"

import { Alert } from "@/components/feedback/alert"
import { AppShell } from "@/components/layout/app-shell"
import { Avatar } from "@/components/learning/avatar"
import { initialsFor } from "@/components/learning/team-badge"
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button-variants"
import type {
  ProfileValues,
  ResetPasswordValues,
} from "@/features/auth/schemas"
import {
  CONTEXTS,
  DAILY_MINUTES,
  REMINDER_TIMES,
  contextOptions,
  goalOptions,
  levelOptions,
  type Preferences,
} from "@/features/onboarding/options"
import type { NotebookCounts } from "@/features/review/data"
import {
  MOTION_OPTIONS,
  TEXT_SIZE_OPTIONS,
  useAppearance,
} from "@/lib/appearance"
import { resetAnalytics } from "@/lib/analytics/client"
import { cn } from "@/lib/utils"

import type { SettingsResult } from "./actions"
import {
  DangerDialog,
  GoalDialog,
  LevelDialog,
  PasswordDialog,
  ProfileDialog,
} from "./settings-dialogs"

type PreferencePatch = Partial<
  Pick<
    Preferences,
    | "goal"
    | "startLevel"
    | "contexts"
    | "dailyMinutes"
    | "reminderEnabled"
    | "reminderTime"
  >
>

export type SettingsActions = {
  savePreferences: (patch: PreferencePatch) => Promise<SettingsResult>
  updateProfile: (values: ProfileValues) => Promise<SettingsResult>
  changePassword: (values: ResetPasswordValues) => Promise<SettingsResult>
  resetProgress: () => Promise<SettingsResult>
  deleteAccount: (input: { confirmation: string }) => Promise<SettingsResult>
  signOut: () => Promise<void>
}

type SettingsScreenProps = {
  shell: { name: string; email: string; counts?: NotebookCounts }
  preferences: Preferences
  actions: SettingsActions
  /** Where the data download comes from; the preview has no real file. */
  exportHref?: string
}

function Section({
  title,
  lede,
  children,
}: {
  title: string
  lede?: string
  children: React.ReactNode
}) {
  const id = `section-${title.toLowerCase().replace(/[^a-z]+/g, "-")}`
  return (
    <section
      aria-labelledby={id}
      className="grid gap-6 border-t border-border-subtle py-8 lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)] lg:gap-10"
    >
      <div>
        <h2 id={id} className="font-display text-h3 font-bold">
          {title}
        </h2>
        {lede && <p className="mt-1 text-sm text-secondary-text">{lede}</p>}
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  )
}

type ChipProps = {
  type: "radio" | "checkbox"
  name: string
  checked: boolean
  onChange: () => void
  children: React.ReactNode
  disabled?: boolean
}

/** A pill built on a native input, so keys and screen readers work; selected adds a border and a tint, not colour alone. */
function Chip({
  type,
  name,
  checked,
  onChange,
  children,
  disabled,
}: ChipProps) {
  return (
    <label
      className={cn(
        "inline-flex min-h-11 cursor-pointer items-center rounded-lg border-[1.5px] border-border bg-card px-4 text-[0.9375rem] font-semibold transition-colors duration-(--duration-fast) hover:border-input has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring",
        checked &&
          "border-primary bg-primary-subtle text-primary-text shadow-[inset_0_0_0_1px_var(--primary)]",
        disabled && "cursor-not-allowed opacity-60"
      )}
    >
      <input
        type={type}
        name={name}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className="sr-only"
      />
      {children}
    </label>
  )
}

const subscribe = () => () => {}

export function SettingsScreen({
  shell,
  preferences: initial,
  actions,
  exportHref = "/settings/export",
}: SettingsScreenProps) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  )
  const { motion, setMotion, textSize, setTextSize } = useAppearance()

  const [name, setName] = useState(shell.name)
  const [prefs, setPrefs] = useState(initial)
  const [status, setStatus] = useState<
    { kind: "saved" } | { kind: "error"; title: string; message: string } | null
  >(null)
  const [dialog, setDialog] = useState<
    "profile" | "goal" | "level" | "password" | "reset" | "delete" | null
  >(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [signingOut, startSignOut] = useTransition()

  /** Shows the change at once and puts the old value back, with a reason, if saving fails. */
  async function save(patch: PreferencePatch) {
    const before = prefs
    setPrefs({ ...prefs, ...patch })
    setStatus(null)
    const result = await actions.savePreferences(patch)
    if (result.ok) setStatus({ kind: "saved" })
    else {
      setPrefs(before)
      setStatus({ kind: "error", title: result.title, message: result.message })
    }
    return result
  }

  const open = (value: NonNullable<typeof dialog>) => () => setDialog(value)
  const close = (value: NonNullable<typeof dialog>) => (next: boolean) =>
    setDialog(next ? value : null)

  const rowClass = "flex items-center justify-between gap-4 py-3"

  return (
    <AppShell name={name} email={shell.email} counts={shell.counts}>
      <main
        id="main"
        className="mx-auto max-w-(--content-max) px-4 py-8 sm:px-6 lg:px-10"
      >
        <h1 className="font-display text-h1 font-bold">Profile and settings</h1>
        <p className="mt-2 max-w-[62ch] text-body-lg text-secondary-text">
          Learning choices save as you make them. Appearance choices stay on
          this device.
        </p>

        <div aria-live="polite" className="mt-4 min-h-6">
          {status?.kind === "saved" && (
            <p className="text-sm font-semibold text-success-text">Saved.</p>
          )}
        </div>
        {status?.kind === "error" && (
          <Alert tone="error" title={status.title} className="mb-4">
            {status.message}
          </Alert>
        )}
        {notice && (
          <Alert tone="success" title="Done" className="mb-4">
            {notice}
          </Alert>
        )}

        <Section title="Profile" lede="How your team sees you.">
          <div className="flex flex-wrap items-center gap-4">
            <Avatar person="me" initials={initialsFor(name) || "?"} size="xl" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xl font-bold">{name}</p>
              <p className="truncate text-secondary-text">{shell.email}</p>
            </div>
            <Button variant="outline" onClick={open("profile")}>
              Edit name and email
            </Button>
          </div>
          <ul className="mt-4 divide-y divide-border-subtle border-t border-border-subtle">
            <li className={rowClass}>
              <div>
                <p className="text-sm text-muted-foreground">Main goal</p>
                <p className="font-semibold">
                  {prefs.goal ? goalOptions[prefs.goal].title : "Not set"}
                </p>
              </div>
              <Button
                variant="link"
                aria-label="Change main goal"
                onClick={open("goal")}
              >
                Change
              </Button>
            </li>
            <li className={rowClass}>
              <div>
                <p className="text-sm text-muted-foreground">
                  Starting level (your choice)
                </p>
                <p className="font-semibold">
                  {prefs.startLevel
                    ? levelOptions[prefs.startLevel].title
                    : "Not set"}
                </p>
              </div>
              <Button
                variant="link"
                aria-label="Change starting level"
                onClick={open("level")}
              >
                Change
              </Button>
            </li>
          </ul>
        </Section>

        <Section
          title="Learning preferences"
          lede="Shapes your daily plan and missions."
        >
          <fieldset>
            <legend className="text-sm font-semibold">Daily goal</legend>
            <div className="mt-2 flex flex-wrap gap-2.5">
              {DAILY_MINUTES.map((minutes) => (
                <Chip
                  key={minutes}
                  type="radio"
                  name="daily"
                  checked={prefs.dailyMinutes === minutes}
                  onChange={() => save({ dailyMinutes: minutes })}
                >
                  {minutes} min
                </Chip>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-6">
            <legend className="text-sm font-semibold">
              Situations to practise
            </legend>
            <div className="mt-2 flex flex-wrap gap-2.5">
              {CONTEXTS.map((context) => {
                const checked = prefs.contexts.includes(context)
                return (
                  <Chip
                    key={context}
                    type="checkbox"
                    name="context"
                    checked={checked}
                    onChange={() =>
                      save({
                        contexts: checked
                          ? prefs.contexts.filter((c) => c !== context)
                          : [...prefs.contexts, context],
                      })
                    }
                  >
                    {contextOptions[context].short}
                  </Chip>
                )
              })}
            </div>
          </fieldset>

          <div className="mt-6 rounded-xl border border-border bg-card p-4">
            <label className="flex cursor-pointer items-start gap-3.5">
              <input
                type="checkbox"
                role="switch"
                checked={prefs.reminderEnabled}
                onChange={(event) =>
                  save({
                    reminderEnabled: event.target.checked,
                    reminderTime: prefs.reminderTime ?? "08:30",
                  })
                }
                className="peer sr-only"
              />
              <span
                aria-hidden="true"
                className={cn(
                  "relative mt-0.5 h-6 w-11 shrink-0 rounded-full bg-input transition-colors duration-(--duration-fast) peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring",
                  prefs.reminderEnabled && "bg-primary"
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 left-0.5 size-5 rounded-full bg-card shadow-sm transition-transform duration-(--duration-fast)",
                    prefs.reminderEnabled && "translate-x-5"
                  )}
                />
              </span>
              <span>
                <span className="font-semibold">Daily reminder</span>
                <span className="mt-0.5 block text-sm text-muted-foreground">
                  Saved as your preference. Klarlingo doesn’t send reminders
                  yet, so nothing will arrive.
                </span>
              </span>
            </label>
            {prefs.reminderEnabled && (
              <label className="mt-4 ml-[58px] flex items-center gap-3 text-sm font-semibold">
                Remind me at
                <select
                  value={prefs.reminderTime ?? "08:30"}
                  onChange={(event) =>
                    save({
                      reminderTime:
                        REMINDER_TIMES.find(
                          (time) => time === event.target.value
                        ) ?? "08:30",
                    })
                  }
                  className="h-10 rounded-md border-[1.5px] border-input bg-card px-3 text-base font-normal"
                >
                  {REMINDER_TIMES.map((time) => (
                    <option key={time}>{time}</option>
                  ))}
                </select>
              </label>
            )}
          </div>
        </Section>

        <Section
          title="Appearance and accessibility"
          lede="Saved on this device only."
        >
          <fieldset>
            <legend className="text-sm font-semibold">Theme</legend>
            <div className="mt-2 flex flex-wrap gap-2.5">
              {(
                [
                  ["light", "Light", <Sun key="s" aria-hidden="true" />],
                  ["dark", "Dark", <Moon key="m" aria-hidden="true" />],
                  ["system", "System", <Monitor key="d" aria-hidden="true" />],
                ] as const
              ).map(([value, label, icon]) => (
                <Chip
                  key={value}
                  type="radio"
                  name="theme"
                  checked={mounted && theme === value}
                  onChange={() => setTheme(value)}
                >
                  <span className="mr-2 [&_svg]:size-4">{icon}</span>
                  {label}
                </Chip>
              ))}
            </div>
          </fieldset>
          <fieldset className="mt-6">
            <legend className="text-sm font-semibold">Motion</legend>
            <div className="mt-2 flex flex-wrap gap-2.5">
              {MOTION_OPTIONS.map((value) => (
                <Chip
                  key={value}
                  type="radio"
                  name="motion"
                  checked={motion === value}
                  onChange={() => setMotion(value)}
                >
                  {value === "system" ? "Follow my device" : "Reduce motion"}
                </Chip>
              ))}
            </div>
          </fieldset>
          <fieldset className="mt-6">
            <legend className="text-sm font-semibold">Text size</legend>
            <div className="mt-2 flex flex-wrap gap-2.5">
              {TEXT_SIZE_OPTIONS.map((value) => (
                <Chip
                  key={value}
                  type="radio"
                  name="text-size"
                  checked={textSize === value}
                  onChange={() => setTextSize(value)}
                >
                  {value === "default" ? "Default" : "Larger"}
                </Chip>
              ))}
            </div>
          </fieldset>
        </Section>

        <Section title="Account" lede={`Signed in as ${shell.email}`}>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="lg" onClick={open("password")}>
              <KeyRound aria-hidden="true" data-icon="inline-start" />
              Change password
            </Button>
            <Button
              variant="outline"
              size="lg"
              disabled={signingOut}
              onClick={() => {
                resetAnalytics()
                startSignOut(() => actions.signOut())
              }}
            >
              <LogOut aria-hidden="true" data-icon="inline-start" />
              {signingOut ? "Signing out…" : "Sign out"}
            </Button>
          </div>

          <div className="mt-8 border-t border-border-subtle pt-6">
            <h3 className="font-semibold">Your data</h3>
            <p className="mt-1 text-sm text-secondary-text">
              Get a copy of your progress, phrases, mistakes and settings as a
              JSON file.
            </p>
            <a
              href={exportHref}
              download
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "mt-3"
              )}
            >
              <Download aria-hidden="true" />
              Download your data
            </a>
          </div>

          <div className="mt-8 border-t border-border-subtle pt-6">
            <h3 className="font-semibold text-danger-text">
              Reset learning progress
            </h3>
            <p className="mt-1 text-sm text-secondary-text">
              Start again from Unit 1. Your account, phrasebook and settings
              stay.
            </p>
            <Button
              variant="outline"
              size="lg"
              className="mt-3 text-danger-text"
              onClick={open("reset")}
            >
              <RefreshCcw aria-hidden="true" data-icon="inline-start" />
              Reset progress
            </Button>
          </div>

          <div className="mt-8 border-t border-border-subtle pt-6">
            <h3 className="font-semibold text-danger-text">Delete account</h3>
            <p className="mt-1 text-sm text-secondary-text">
              Removes your account, progress, words, notes and standups. This
              can’t be undone.
            </p>
            <Button
              variant="outline"
              size="lg"
              className="mt-3 text-danger-text"
              onClick={open("delete")}
            >
              <Trash2 aria-hidden="true" data-icon="inline-start" />
              Delete account
            </Button>
          </div>
        </Section>
      </main>

      <ProfileDialog
        open={dialog === "profile"}
        onOpenChange={close("profile")}
        name={name}
        email={shell.email}
        onSave={async (values) => {
          const result = await actions.updateProfile(values)
          if (result.ok) {
            setName(values.fullName)
            router.refresh()
          }
          return result
        }}
      />
      <GoalDialog
        open={dialog === "goal"}
        onOpenChange={close("goal")}
        current={prefs.goal}
        onSave={async (goal) => {
          const result = await save({ goal })
          if (result.ok) router.refresh()
          return result
        }}
      />
      <LevelDialog
        open={dialog === "level"}
        onOpenChange={close("level")}
        current={prefs.startLevel}
        onSave={async (startLevel) => {
          const result = await save({ startLevel })
          if (result.ok) router.refresh()
          return result
        }}
      />
      <PasswordDialog
        open={dialog === "password"}
        onOpenChange={close("password")}
        onSave={actions.changePassword}
      />
      <DangerDialog
        open={dialog === "reset"}
        onOpenChange={close("reset")}
        title="Reset your learning progress?"
        description="This clears your lessons, units, words, mistakes and standups, and starts you again from Unit 1. Your account, phrasebook and settings stay. You can’t undo it."
        keepLabel="Keep my progress"
        confirmLabel="Reset progress"
        onConfirm={() => actions.resetProgress()}
        onDone={(result) => {
          setNotice(result.message ?? "Your progress is reset.")
          router.refresh()
        }}
      />
      <DangerDialog
        open={dialog === "delete"}
        onOpenChange={close("delete")}
        title="Delete your account?"
        description="This removes your account and everything stored with it: progress, words, mistakes, saved phrases and standups. You can’t undo it."
        keepLabel="Keep my account"
        confirmLabel="Delete account"
        confirmWord="delete"
        onConfirm={(typed) => actions.deleteAccount({ confirmation: typed })}
      />
    </AppShell>
  )
}
