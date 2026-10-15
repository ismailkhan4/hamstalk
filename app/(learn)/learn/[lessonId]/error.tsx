"use client"

import { TriangleAlert } from "lucide-react"
import Link from "next/link"

import { EmptyState } from "@/components/feedback/empty-state"
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button-variants"

export default function LessonError({
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <main
      id="main"
      className="grid min-h-svh place-items-center bg-background px-4"
    >
      <EmptyState
        icon={TriangleAlert}
        tone="offline"
        title="This lesson didn’t load"
        actions={
          <>
            <Button size="lg" onClick={reset}>
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
        The connection dropped before the lesson finished loading. Nothing
        you’ve done is lost.
      </EmptyState>
    </main>
  )
}
