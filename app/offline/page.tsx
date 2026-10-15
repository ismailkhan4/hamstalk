import { WifiOff } from "lucide-react"
import type { Metadata } from "next"

import { Logo } from "@/components/brand/logo"
import { OfflineRetry } from "./offline-retry"

export const metadata: Metadata = {
  title: "You’re offline",
  robots: { index: false },
}

/** Public and static: the service worker keeps a copy to show when a page can’t be reached. */
export default function OfflinePage() {
  return (
    <main
      id="main"
      className="mx-auto flex min-h-svh max-w-md flex-col items-center justify-center px-6 py-10 text-center"
    >
      <Logo symbolClassName="size-10" />
      <span className="mt-8 grid size-14 place-items-center rounded-full bg-warning-subtle text-warning-text">
        <WifiOff aria-hidden="true" className="size-7" />
      </span>
      <h1 className="mt-5 font-display text-h2 font-bold">You’re offline</h1>
      <p className="mt-2 text-secondary-text">
        Klarlingo needs a connection to load your lessons and save your
        progress. Nothing you did before this was lost; reconnect and pick up
        where you left off.
      </p>
      <OfflineRetry />
    </main>
  )
}
