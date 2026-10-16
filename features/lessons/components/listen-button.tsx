"use client"

import { Turtle, Volume2, VolumeX } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { useGermanSpeech } from "@/lib/speech"
import { recordedSpeechEnabled } from "@/lib/tts/core"
import { playRecorded } from "@/lib/tts/player"

type ListenButtonProps = {
  text: string
  label?: string
  /** Also offer a slower replay, for listening exercises. */
  slow?: boolean
  /** Who says it (an avatar id), for their recorded voice. Words and prompts use the narrator. */
  speaker?: string | null
  variant?: "outline" | "secondary"
}

/**
 * Plays the line in its speaker's recorded voice (ElevenLabs), falling back to the browser's voice.
 * With neither it says so and never pretends to play.
 */
export function ListenButton({
  text,
  label = "Listen",
  slow = false,
  variant = "secondary",
  speaker = null,
}: ListenButtonProps) {
  const { status, speak } = useGermanSpeech()
  const [playing, setPlaying] = useState<"normal" | "slow" | null>(null)

  async function play(speed: "normal" | "slow") {
    setPlaying(speed)
    const recorded = await playRecorded(text, speaker, speed)
    if (!recorded) await speak(text, speed === "slow" ? 0.7 : 0.95)
    setPlaying(null)
  }

  const recordings = recordedSpeechEnabled()
  if (status === "unavailable" && !recordings) {
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
        disabled={(!recordings && status === "checking") || playing !== null}
        onClick={() => play("normal")}
      >
        {playing === "normal" ? "Playing…" : label}
      </Button>
      {slow && (
        <Button
          variant="outline"
          size="sm"
          iconLeft={<Turtle />}
          disabled={(!recordings && status === "checking") || playing !== null}
          onClick={() => play("slow")}
        >
          {playing === "slow" ? "Playing…" : "Slower"}
        </Button>
      )}
    </span>
  )
}
