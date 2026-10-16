"use client"

import { useEffect, useState } from "react"

/** The current time, ticking every `every` ms, for refill and boost countdowns. */
export function useNow(every = 30_000) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), every)
    return () => clearInterval(timer)
  }, [every])
  return now
}
