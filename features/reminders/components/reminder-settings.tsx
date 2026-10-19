"use client"

import { BellRing, Smartphone } from "lucide-react"
import { useEffect, useState, useTransition } from "react"

import { Alert } from "@/components/feedback/alert"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import type { ReminderResult } from "../actions"
import type { ReminderSetup } from "../data"
import {
  currentSubscription,
  pushSupport,
  subscribe,
  unsubscribe,
  type PushSupport,
} from "../push-client"

export type ReminderActions = {
  savePush: (
    subscription: PushSubscriptionJSON,
    userAgent?: string
  ) => Promise<ReminderResult>
  removePush: (endpoint: string) => Promise<ReminderResult>
  savePrefs: (patch: {
    streakSaver?: boolean
    emailReminders?: boolean
  }) => Promise<ReminderResult>
}

/**
 * Where reminders arrive and which ones: notifications on this device, the evening streak-saver
 * and email. Sits under the daily reminder time in Settings.
 */
export function ReminderSettings({
  setup,
  actions,
}: {
  setup: ReminderSetup
  actions: ReminderActions
}) {
  const [support, setSupport] = useState<PushSupport | null>(null)
  const [device, setDevice] = useState<boolean | null>(null)
  const [streakSaver, setStreakSaver] = useState(setup.streakSaver)
  const [email, setEmail] = useState(setup.emailReminders)
  const [problem, setProblem] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  // What this browser can do is only known in the browser.
  useEffect(() => {
    const here = pushSupport()
    void currentSubscription().then((subscription) => {
      setSupport(here)
      setDevice(Boolean(subscription))
    })
  }, [])

  function turnOn() {
    setProblem(null)
    startTransition(async () => {
      const result = await subscribe()
      if (!result.ok) {
        setProblem(
          result.reason === "denied"
            ? "Notifications are blocked for Hamstalk in this browser. Allow them in the site settings, then try again."
            : "This browser couldn’t turn on notifications. Try again, or use another browser."
        )
        return
      }
      const saved = await actions.savePush(
        result.subscription,
        navigator.userAgent
      )
      if (saved.ok) setDevice(true)
      else setProblem(saved.message)
    })
  }

  function turnOff() {
    setProblem(null)
    startTransition(async () => {
      const endpoint = await unsubscribe()
      if (endpoint) await actions.removePush(endpoint)
      setDevice(false)
    })
  }

  function toggle(patch: { streakSaver?: boolean; emailReminders?: boolean }) {
    const before = { streakSaver, email }
    if (patch.streakSaver !== undefined) setStreakSaver(patch.streakSaver)
    if (patch.emailReminders !== undefined) setEmail(patch.emailReminders)
    setProblem(null)
    startTransition(async () => {
      const result = await actions.savePrefs(patch)
      if (!result.ok) {
        setStreakSaver(before.streakSaver)
        setEmail(before.email)
        setProblem(result.message)
      }
    })
  }

  return (
    <div className="mt-4 flex flex-col gap-4 rounded-xl border border-border bg-card p-4">
      <Switch
        checked={streakSaver}
        onChange={(checked) => toggle({ streakSaver: checked })}
        label="Streak saver"
        hint="An evening nudge after 21:00 when your streak would end at midnight."
      />

      <div className="flex flex-wrap items-center gap-3 border-t border-border-subtle pt-4">
        <Smartphone
          aria-hidden="true"
          className="size-5 shrink-0 text-muted-foreground"
        />
        <div className="min-w-[12rem] flex-1">
          <p className="font-semibold">Notifications on this device</p>
          <p className="text-sm text-muted-foreground">
            {!setup.push
              ? "Not available yet: push isn’t set up on this server."
              : support === "needs-install"
                ? "On iPhone and iPad, add Hamstalk to your Home Screen first (Share, then Add to Home Screen), then open it from there."
                : support === "unsupported"
                  ? "This browser can’t show notifications."
                  : device
                    ? "On. Reminders arrive here."
                    : "Off. Turn on to get your reminders here."}
          </p>
        </div>
        {setup.push && support === "supported" && device !== null && (
          <Button
            variant={device ? "outline" : "primary"}
            size="sm"
            loading={pending}
            onClick={device ? turnOff : turnOn}
          >
            {!device && <BellRing aria-hidden="true" />}
            {device ? "Turn off" : "Turn on"}
          </Button>
        )}
      </div>

      <div className="border-t border-border-subtle pt-4">
        <Switch
          checked={email && setup.email}
          disabled={!setup.email}
          onChange={(checked) => toggle({ emailReminders: checked })}
          label="Email reminders"
          hint={
            setup.email
              ? "The same reminders, by email."
              : "Not available yet: email sending isn’t set up."
          }
        />
      </div>

      {problem && (
        <Alert tone="error" title="Not changed">
          {problem}
        </Alert>
      )}
    </div>
  )
}

function Switch({
  checked,
  onChange,
  label,
  hint,
  disabled = false,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  hint: string
  disabled?: boolean
}) {
  return (
    <label
      className={cn(
        "flex items-start gap-3.5",
        disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"
      )}
    >
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className={cn(
          "relative mt-0.5 h-6 w-11 shrink-0 rounded-full bg-input transition-colors duration-(--duration-fast) peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring",
          checked && "bg-primary"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 size-5 rounded-full bg-card shadow-sm transition-transform duration-(--duration-fast)",
            checked && "translate-x-5"
          )}
        />
      </span>
      <span>
        <span className="font-semibold">{label}</span>
        <span className="mt-0.5 block text-sm text-muted-foreground">
          {hint}
        </span>
      </span>
    </label>
  )
}
