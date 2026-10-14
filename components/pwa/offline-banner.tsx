"use client"

import { WifiOff } from "lucide-react"
import { useState, useSyncExternalStore } from "react"

function subscribe(onChange: () => void) {
  window.addEventListener("online", onChange)
  window.addEventListener("offline", onChange)
  return () => {
    window.removeEventListener("online", onChange)
    window.removeEventListener("offline", onChange)
  }
}

/** Whether the browser reports a connection. Server and first render assume online. */
function useOnline() {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true
  )
}

/**
 * Says plainly when the connection is gone. Klarlingo keeps nothing for offline use, so the message
 * names what stops working instead of promising what doesn't exist.
 */
export function OfflineBanner() {
  const online = useOnline()
  return online ? null : <OfflineNotice />
}

function OfflineNotice() {
  const [checking, setChecking] = useState(false)
  const [stillOffline, setStillOffline] = useState(false)

  async function retry() {
    setChecking(true)
    setStillOffline(false)
    try {
      const response = await fetch("/manifest.webmanifest", {
        cache: "no-store",
      })
      if (response.ok) window.location.reload()
      else setStillOffline(true)
    } catch {
      setStillOffline(true)
    }
    setChecking(false)
  }

  return (
    <div
      role="status"
      className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-warning-border bg-warning-subtle px-4 py-2.5 text-sm text-warning-text"
    >
      <WifiOff aria-hidden="true" className="size-4 shrink-0" />
      <p className="min-w-0 flex-1">
        You’re offline. Klarlingo needs a connection to load lessons and save
        your progress, so what’s on screen stays, but nothing new is saved until
        you’re back.
        {stillOffline && " Still no connection."}
      </p>
      <button
        type="button"
        onClick={retry}
        disabled={checking}
        className="min-h-11 font-semibold underline underline-offset-[3px] disabled:opacity-60"
      >
        {checking ? "Checking…" : "Try to reconnect"}
      </button>
    </div>
  )
}
