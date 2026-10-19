"use client"

import { useState, useTransition } from "react"

import { Alert } from "@/components/feedback/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import type { ProfileInput, ProfileSaveResult } from "../actions"

/** How others see the learner: the name in league tables, and whether the profile page is open. */
export function ProfileForm({
  displayName,
  isPublic,
  allowNudges,
  save,
}: {
  displayName: string
  isPublic: boolean
  /** Null hides the setting (before friends.sql). */
  allowNudges: boolean | null
  save: (input: ProfileInput) => Promise<ProfileSaveResult>
}) {
  const [name, setName] = useState(displayName)
  const [open, setOpen] = useState(isPublic)
  const [nudges, setNudges] = useState(allowNudges)
  const [pending, startTransition] = useTransition()
  const [message, setMessage] = useState<ProfileSaveResult | null>(null)

  return (
    <form
      className="flex flex-col gap-4 rounded-3xl border-2 border-border bg-card p-5"
      onSubmit={(event) => {
        event.preventDefault()
        setMessage(null)
        startTransition(async () => {
          setMessage(
            await save({
              displayName: name,
              isPublic: open,
              ...(nudges === null ? {} : { allowNudges: nudges }),
            })
          )
        })
      }}
    >
      <h2 className="font-display text-xl font-semibold">How others see you</h2>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="display-name" className="font-bold">
          Name in league tables
        </label>
        <Input
          id="display-name"
          value={name}
          maxLength={40}
          autoComplete="nickname"
          onChange={(event) => setName(event.target.value)}
        />
        <p className="text-sm text-muted-foreground">
          A first name and an initial is plenty. Other learners in your table
          see it.
        </p>
      </div>
      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={open}
          onChange={(event) => setOpen(event.target.checked)}
          className="mt-1 size-5 accent-(--primary)"
        />
        <span>
          <span className="block font-bold">Show my profile page</span>
          <span className="block text-sm text-muted-foreground">
            Learners can open it from the league table to see your streak, XP
            and pins, and follow you. When it’s off, they only see your name.
          </span>
        </span>
      </label>
      {nudges !== null && (
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={nudges}
            onChange={(event) => setNudges(event.target.checked)}
            className="mt-1 size-5 accent-(--primary)"
          />
          <span>
            <span className="block font-bold">Let friends nudge me</span>
            <span className="block text-sm text-muted-foreground">
              Friends you follow back can send you a reminder on days you
              haven’t practised yet, at most once a day each.
            </span>
          </span>
        </label>
      )}
      {message && (
        <Alert
          tone={message.ok ? "success" : "error"}
          title={message.ok ? "Saved" : "Not saved"}
        >
          {message.ok ? "Your profile is up to date." : message.message}
        </Alert>
      )}
      <Button type="submit" loading={pending} className="self-start">
        Save
      </Button>
    </form>
  )
}
