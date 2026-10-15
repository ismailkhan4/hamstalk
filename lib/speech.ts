"use client"

import { useCallback, useEffect, useSyncExternalStore } from "react"

import { ACTIVE_COURSE } from "@/content/courses"

export type SpeechStatus = "checking" | "ready" | "unavailable"

const VOICE_WAIT_MS = 2500
let waitedForVoices = false

function synth() {
  return typeof window !== "undefined" && "speechSynthesis" in window
    ? window.speechSynthesis
    : null
}

/** A voice for the course's language: a local one for its main locale if there is one. */
function targetVoice() {
  const { lang, locale } = ACTIVE_COURSE
  const matching = (synth()?.getVoices() ?? []).filter((voice) =>
    voice.lang.toLowerCase().startsWith(lang)
  )
  return (
    matching.find((voice) => voice.lang === locale && voice.localService) ??
    matching[0] ??
    null
  )
}

function subscribe(onChange: () => void) {
  const speech = synth()
  if (!speech) return () => {}
  speech.addEventListener("voiceschanged", onChange)
  // Some browsers load voices late and never fire voiceschanged when there are none.
  const timer = window.setTimeout(() => {
    waitedForVoices = true
    onChange()
  }, VOICE_WAIT_MS)
  return () => {
    speech.removeEventListener("voiceschanged", onChange)
    window.clearTimeout(timer)
  }
}

function getStatus(): SpeechStatus {
  if (!synth()) return "unavailable"
  if (targetVoice()) return "ready"
  return waitedForVoices ? "unavailable" : "checking"
}

/**
 * German speech from the browser's own voices. No recordings exist yet, so when no German voice is
 * installed the status is "unavailable" and callers offer the transcript instead of pretending to play.
 */
export function useGermanSpeech() {
  const status = useSyncExternalStore(
    subscribe,
    getStatus,
    () => "checking" as const
  )

  useEffect(() => () => synth()?.cancel(), [])

  const speak = useCallback((text: string, rate = 1) => {
    const speech = synth()
    const voice = targetVoice()
    if (!speech || !voice) return Promise.resolve(false)
    speech.cancel()
    return new Promise<boolean>((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.voice = voice
      utterance.lang = voice.lang
      utterance.rate = rate
      utterance.onend = () => resolve(true)
      utterance.onerror = () => resolve(false)
      speech.speak(utterance)
    })
  }, [])

  const stop = useCallback(() => synth()?.cancel(), [])

  return { status, speak, stop }
}
