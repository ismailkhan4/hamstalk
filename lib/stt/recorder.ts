"use client"

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react"

/** The longest answer recorded; it stops by itself after this. */
export const MAX_RECORDING_MS = 10_000

export type RecorderStatus =
  "idle" | "asking" | "recording" | "denied" | "unsupported"

/** Formats in order of preference: Opus in Chrome and Firefox, AAC in Safari. */
const FORMATS = ["audio/webm;codecs=opus", "audio/ogg;codecs=opus", "audio/mp4"]

export function canRecord() {
  return (
    typeof window !== "undefined" &&
    typeof MediaRecorder !== "undefined" &&
    Boolean(navigator.mediaDevices?.getUserMedia)
  )
}

/**
 * Records one spoken answer from the microphone. `start()` asks for the mic the first time; the
 * recording ends on `stop()` or after MAX_RECORDING_MS, and `onRecorded` gets the audio. The mic is
 * released as soon as each recording ends, so the browser's recording indicator goes away.
 */
export function useRecorder(onRecorded: (audio: Blob) => void) {
  const [status, setStatus] = useState<RecorderStatus>("idle")
  // Known only in the browser; the server render assumes it can.
  const supported = useSyncExternalStore(noop, canRecord, () => true)
  const recorder = useRef<MediaRecorder | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const done = useRef(onRecorded)
  useEffect(() => {
    done.current = onRecorded
  })

  const stop = useCallback(() => {
    if (timer.current) clearTimeout(timer.current)
    if (recorder.current?.state === "recording") recorder.current.stop()
  }, [])

  const start = useCallback(async () => {
    if (!canRecord() || recorder.current?.state === "recording") return
    setStatus("asking")
    let stream: MediaStream
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    } catch {
      setStatus("denied")
      return
    }
    const mimeType = FORMATS.find((format) =>
      MediaRecorder.isTypeSupported(format)
    )
    const media = new MediaRecorder(stream, mimeType ? { mimeType } : {})
    const chunks: Blob[] = []
    media.ondataavailable = (event) => {
      if (event.data.size) chunks.push(event.data)
    }
    media.onstop = () => {
      for (const track of stream.getTracks()) track.stop()
      recorder.current = null
      setStatus("idle")
      const audio = new Blob(chunks, { type: media.mimeType })
      if (audio.size) done.current(audio)
    }
    recorder.current = media
    media.start()
    setStatus("recording")
    timer.current = setTimeout(stop, MAX_RECORDING_MS)
  }, [stop])

  // Leaving the exercise mid-recording drops the recording and frees the mic.
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
      const media = recorder.current
      if (media?.state === "recording") {
        media.onstop = null
        media.stop()
        for (const track of media.stream.getTracks()) track.stop()
      }
    },
    []
  )

  return { status: supported ? status : "unsupported", start, stop }
}

const noop = () => () => {}
