"use client"

import { Check, Share2 } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"

/**
 * Shares the learner's profile link: the system share sheet where there is one, otherwise the
 * link is copied. Whoever opens it lands on the profile with a Follow button.
 */
export function ShareProfile({
  handle,
  variant = "outline",
}: {
  handle: string
  variant?: "outline" | "secondary"
}) {
  const [copied, setCopied] = useState(false)

  async function share() {
    const url = `${window.location.origin}/u/${handle}`
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Learn German with me on Hamstalk",
          url,
        })
        return
      } catch (error) {
        // Closing the share sheet isn't a failure.
        if ((error as Error).name === "AbortError") return
      }
    }
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      window.prompt("Copy your profile link", url)
    }
  }

  return (
    <Button
      variant={variant}
      iconLeft={copied ? <Check /> : <Share2 />}
      onClick={() => void share()}
    >
      <span aria-live="polite">{copied ? "Link copied" : "Share profile"}</span>
    </Button>
  )
}
