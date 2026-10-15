"use client"

import * as Sentry from "@sentry/nextjs"
import { TriangleAlert } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"

import { EmptyState } from "@/components/feedback/empty-state"
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button-variants"

/** The last safety net. It never shows the error itself, which can contain details a learner shouldn’t see. */
export default function AppError({
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
    <main
      id="main"
      className="grid min-h-svh place-items-center bg-background px-4"
    >
      <EmptyState
        icon={TriangleAlert}
        tone="error"
        title="Something went wrong"
        actions={
          <>
            <Button size="lg" onClick={retry}>
              Try again
            </Button>
            <Link
              href="/home"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Back to home
            </Link>
          </>
        }
      >
        That didn’t load. Anything you finished was saved when you finished it.
        Try again, or come back in a moment.
      </EmptyState>
    </main>
  )
}
