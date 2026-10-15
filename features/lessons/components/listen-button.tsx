"use client"

import { Turtle, Volume2, VolumeX } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { useGermanSpeech } from "@/lib/speech"

type ListenButtonProps = {
  text: string
  label?: string
  /** Also offer a slower replay, for listening exercises. */
  slow?: boolean
  variant?: "outline" | "secondary"
}

/** Plays German with the browser's voice. Without one it says so and never pretends to play. */
export function ListenButton({
  text,
  label = "Listen",
  slow = false,
  variant = "secondary",
}: ListenButtonProps) {
  const { status, speak } = useGermanSpeech()
  const [playing, setPlaying] = useState<"normal" | "slow" | null>(null)

  async function play(speed: "normal" | "slow") {
    setPlaying(speed)
    await speak(text, speed === "slow" ? 0.7 : 0.95)
    setPlaying(null)
  }

  if (status === "unavailable") {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
        <VolumeX aria-hidden="true" className="size-4" />
        No German voice on this device
      </span>
    )
  }

  return (
    <span className="inline-flex gap-2">
      <Button
        variant={variant}
        size="sm"
        iconLeft={<Volume2 />}
        disabled={status === "checking" || playing !== null}
        onClick={() => play("normal")}
      >
        {playing === "normal" ? "Playing…" : label}
      </Button>
      {slow && (
        <Button
          variant="outline"
          size="sm"
          iconLeft={<Turtle />}
          disabled={status === "checking" || playing !== null}
          onClick={() => play("slow")}
        >
          {playing === "slow" ? "Playing…" : "Slower"}
        </Button>
      )}
    </span>
  )
}
