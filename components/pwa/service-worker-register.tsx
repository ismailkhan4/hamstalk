"use client"

import { useEffect } from "react"

/** Registers the service worker in production builds only, so development never serves stale files. */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return
    if (!("serviceWorker" in navigator)) return
    navigator.serviceWorker
      .register("/sw.js", { scope: "/", updateViaCache: "none" })
      .catch(() => {})
  }, [])
  return null
}
