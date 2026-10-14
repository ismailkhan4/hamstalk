import { Compass } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"

import { EmptyState } from "@/components/feedback/empty-state"
import { buttonVariants } from "@/components/ui/button-variants"

export const metadata: Metadata = { title: "Page not found" }

export default function NotFound() {
  return (
    <main
      id="main"
      className="grid min-h-svh place-items-center bg-background px-4"
    >
      <EmptyState
        icon={Compass}
        title="We can’t find that page"
        actions={
          <Link href="/home" className={buttonVariants({ size: "lg" })}>
            Back to home
          </Link>
        }
      >
        The link may be old or mistyped. Your progress is safe.
      </EmptyState>
    </main>
  )
}
