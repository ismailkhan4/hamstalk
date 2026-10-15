"use client"

import { FileText, Play, VolumeX } from "lucide-react"
import { useState } from "react"

import { GermanText } from "@/components/learning/german-text"
import { useGermanSpeech } from "@/lib/speech"
import { cn } from "@/lib/utils"

const MAX_PLAYS = 2
const BARS = [
  10, 18, 26, 14, 30, 22, 12, 28, 16, 24, 32, 18, 10, 22, 26, 14, 20, 12,
]

type ListeningPlayerProps = {
  text: string
  plays: number
  onPlayed: () => void
}

/** Two plays, as in the design. Without a German voice it says so and offers the transcript. */
export function ListeningPlayer({
  text,
  plays,
  onPlayed,
}: ListeningPlayerProps) {
  const { status, speak } = useGermanSpeech()
  const [playing, setPlaying] = useState(false)
  const [showTranscript, setShowTranscript] = useState(false)
  const left = MAX_PLAYS - plays

  async function play() {
    if (playing || left <= 0) return
    setPlaying(true)
    await speak(text, 0.95)
    setPlaying(false)
    onPlayed()
  }

  if (status === "unavailable") {
    return (
      <div className="rounded-xl border border-warning-border bg-warning-subtle p-4 text-warning-text">
        <p className="flex items-center gap-2 font-semibold">
          <VolumeX aria-hidden="true" className="size-[18px]" />
          The audio isn’t available on this device
        </p>
        <p className="mt-1 text-sm text-foreground/80 dark:text-secondary-text">
          Your browser has no German voice installed. You can read the
          transcript and still answer.
        </p>
        {showTranscript ? (
          <p className="mt-3 rounded-lg bg-card p-3 text-foreground">
            <GermanText className="text-lg">„{text}“</GermanText>
          </p>
        ) : (
          <button
            type="button"
            onClick={() => setShowTranscript(true)}
            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-foreground underline underline-offset-[3px]"
          >
            <FileText aria-hidden="true" className="size-4" />
            Read the transcript
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-3">
      <button
        type="button"
        onClick={play}
        disabled={status !== "ready" || left <= 0 || playing}
        aria-label={
          left <= 0
            ? "No plays left"
            : playing
              ? "Playing"
              : "Play the recording"
        }
        className="grid size-12 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground disabled:bg-disabled disabled:text-disabled-foreground"
      >
        <Play aria-hidden="true" className="size-5 fill-current" />
      </button>
      <span
        aria-hidden="true"
        className="flex h-8 flex-1 items-center gap-[3px] overflow-hidden"
      >
        {BARS.map((height, i) => (
          <i
            key={i}
            className={cn(
              "w-[3px] shrink-0 rounded-full bg-neutral-border",
              (playing || plays > 0) && "bg-primary",
              playing && "motion-safe:animate-pulse"
            )}
            style={{ height }}
          />
        ))}
      </span>
      <p
        aria-live="polite"
        className="shrink-0 text-right text-sm text-muted-foreground"
      >
        {status === "checking"
          ? "Getting the audio ready…"
          : playing
            ? "Playing…"
            : left === MAX_PLAYS
              ? "You can play it twice"
              : left === 1
                ? "1 play left"
                : "No plays left. Answer from memory."}
      </p>
    </div>
  )
}
