import { notFound } from "next/navigation"

import { Mascot, type MascotMood } from "@/features/celebrations/mascot"
import { devPreviewsEnabled } from "@/lib/dev-preview"

const MOODS: MascotMood[] = [
  "idle",
  "happy",
  "sad",
  "thinking",
  "cheer",
  "dance",
  "sleepy",
  "onFire",
]

/** Development only: every mood of Hamsti side by side. */
export default function DevMascotPage() {
  if (!devPreviewsEnabled) notFound()
  return (
    <main className="grid min-h-svh grid-cols-2 gap-6 bg-background p-6 sm:grid-cols-4">
      {MOODS.map((mood) => (
        <figure
          key={mood}
          className="flex flex-col items-center gap-2 rounded-2xl border-2 border-border bg-card p-4"
        >
          <Mascot mood={mood} size={120} />
          <figcaption className="font-display text-lg font-semibold">
            {mood}
          </figcaption>
        </figure>
      ))}
    </main>
  )
}
