"use client"

import {
  audioPath,
  publicAudioUrl,
  recordedSpeechEnabled,
  type Speed,
} from "./core"

let current: HTMLAudioElement | null = null

/** Plays a URL to the end. False if it can't be loaded or played. */
function playUrl(url: string) {
  current?.pause()
  const audio = new Audio(url)
  current = audio
  return new Promise<boolean>((resolve) => {
    audio.onended = () => resolve(true)
    audio.onerror = () => resolve(false)
    audio.play().catch(() => resolve(false))
  })
}

/**
 * Plays a line in its speaker's recorded voice: straight from storage when it's been recorded,
 * otherwise asking the server to record it first. False when there's no recording to be had (no
 * voices set up, signed out, over a limit), so the caller can fall back to the browser's voice.
 */
export async function playRecorded(
  text: string,
  speaker: string | null | undefined,
  speed: Speed
) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl || !recordedSpeechEnabled()) return false
  const path = await audioPath(text, speaker, speed)
  if (!path) return false
  if (await playUrl(publicAudioUrl(supabaseUrl, path))) return true

  const response = await fetch("/api/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, speaker, speed }),
  }).catch(() => null)
  if (!response?.ok) return false
  const { url } = (await response.json()) as { url?: string }
  return url ? playUrl(url) : false
}

export function stopRecorded() {
  current?.pause()
}
