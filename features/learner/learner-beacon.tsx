"use client"

import { useEffect } from "react"

import { identify, resetAnalytics } from "@/lib/analytics/client"

import { syncTimezoneAction } from "./actions"

const USER_KEY = "hamstalk:analytics-user"
const ZONE_KEY = "hamstalk:timezone-synced"

function read(storage: Storage, key: string) {
  try {
    return storage.getItem(key)
  } catch {
    return null
  }
}

function write(storage: Storage, key: string, value: string) {
  try {
    storage.setItem(key, value)
  } catch {}
}

/**
 * Renders nothing. Once per signed-in visit it ties analytics to the learner and records their
 * time zone, so "today" for goals and streaks is their own day.
 */
type LearnerBeaconProps = {
  userId: string
  email: string
  fullName: string
}

export function LearnerBeacon({ userId, email, fullName }: LearnerBeaconProps) {
  useEffect(() => {
    // A different learner on this device: start a fresh anonymous profile before identifying, so
    // the previous learner's events never merge into this one.
    const previous = read(localStorage, USER_KEY)
    if (previous && previous !== userId) resetAnalytics()
    identify(userId, {
      ...(email ? { email } : {}),
      ...(fullName ? { name: fullName } : {}),
    })
    write(localStorage, USER_KEY, userId)

    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (read(sessionStorage, ZONE_KEY) === `${userId}:${zone}`) return
    void syncTimezoneAction(zone)
      .then((saved) => {
        if (saved) write(sessionStorage, ZONE_KEY, `${userId}:${zone}`)
      })
      .catch(() => {})
  }, [userId, email, fullName])

  return null
}
