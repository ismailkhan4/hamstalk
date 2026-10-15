"use client"

import type { Standup } from "@/content/courses/de/standup"

import { completeStandupAction } from "./actions"
import { StandupSession } from "./standup-session"

export function StandupClient(props: {
  standup: Standup
  firstName: string
  initials: string
}) {
  return <StandupSession {...props} onComplete={completeStandupAction} />
}
