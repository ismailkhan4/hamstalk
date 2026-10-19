"use client"

import { BellRing } from "lucide-react"
import { useEffect, useState, useTransition } from "react"

import { Button } from "@/components/ui/button"
import { Mascot } from "@/features/celebrations/mascot"
import { MASCOT_NAME } from "@/features/celebrations/mascot-name"
import { REMINDER_TIMES } from "@/features/onboarding/options"

import type { ReminderResult } from "../actions"
import { currentSubscription, pushSupport, subscribe } from "../push-client"

const ASKED_KEY = "hamstalk:reminder-asked"

/**
 * After a finished lesson: would the learner like a nudge tomorrow? Asked once per device, only
 * where notifications work and haven't been decided yet, never before the learner has done
 * something worth coming back for.
 */
export function ReminderPrompt({
  enable,
}: {
  enable: (
    input: {
      subscription: PushSubscriptionJSON
      time: (typeof REMINDER_TIMES)[number]
    },
    userAgent?: string
  ) => Promise<ReminderResult>
}) {
  const [show, setShow] = useState(false)
  const [time, setTime] = useState<(typeof REMINDER_TIMES)[number]>("18:00")
  const [state, setState] = useState<"ask" | "done" | "blocked">("ask")
  const [pending, startTransition] = useTransition()

  useEffect(() => {
    let asked = true
    try {
      asked = localStorage.getItem(ASKED_KEY) !== null
    } catch {}
    if (
      asked ||
      !process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
      pushSupport() !== "supported" ||
      Notification.permission !== "default"
    )
      return
    void currentSubscription().then((subscription) => {
      if (!subscription) setShow(true)
    })
  }, [])

  function remember() {
    try {
      localStorage.setItem(ASKED_KEY, new Date().toISOString())
    } catch {}
  }

  if (!show) return null

  return (
    <section
      aria-labelledby="reminder-prompt"
      className="mt-8 flex flex-wrap items-center gap-4 rounded-3xl border-2 border-info-border bg-info-subtle p-5 motion-safe:animate-rise"
    >
      <Mascot mood={state === "done" ? "cheer" : "happy"} size={64} />
      <div className="min-w-[14rem] flex-1">
        <h2 id="reminder-prompt" className="font-display text-xl font-semibold">
          {state === "done"
            ? "See you tomorrow!"
            : state === "blocked"
              ? "No problem"
              : "Want a nudge tomorrow?"}
        </h2>
        <p className="font-semibold text-secondary-text">
          {state === "done"
            ? `${MASCOT_NAME} will remind you at ${time}, and in the evening if your streak needs saving. Change it any time in Settings.`
            : state === "blocked"
              ? "Notifications stay off. You can turn them on later in Settings."
              : `${MASCOT_NAME} can remind you on days you haven’t practised yet, so your streak keeps going.`}
        </p>
        {state === "ask" && (
          <label className="mt-3 flex items-center gap-2 text-sm font-bold">
            Remind me at
            <select
              value={time}
              onChange={(event) =>
                setTime(
                  REMINDER_TIMES.find((t) => t === event.target.value) ??
                    "18:00"
                )
              }
              className="h-10 rounded-md border-[1.5px] border-input bg-card px-3 text-base font-normal"
            >
              {REMINDER_TIMES.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
        )}
      </div>
      {state === "ask" && (
        <div className="flex flex-wrap gap-2">
          <Button
            loading={pending}
            onClick={() =>
              startTransition(async () => {
                remember()
                const result = await subscribe()
                if (!result.ok) {
                  setState("blocked")
                  return
                }
                const saved = await enable(
                  { subscription: result.subscription, time },
                  navigator.userAgent
                )
                setState(saved.ok ? "done" : "blocked")
              })
            }
          >
            <BellRing aria-hidden="true" />
            Yes, remind me
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              remember()
              setShow(false)
            }}
          >
            Not now
          </Button>
        </div>
      )}
    </section>
  )
}
