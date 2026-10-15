"use client"

import * as Sentry from "@sentry/nextjs"
import { useEffect } from "react"

/** Catches errors in the root layout. Renders its own document, so it stays plain: no app styles reach it. */
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="en">
      <body
        style={{
          display: "grid",
          minHeight: "100svh",
          placeItems: "center",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
        }}
      >
        <main>
          <h1>Something went wrong</h1>
          <p>Anything you finished was saved when you finished it.</p>
          <button type="button" onClick={retry}>
            Try again
          </button>
        </main>
      </body>
    </html>
  )
}
