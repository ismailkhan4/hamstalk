import { feedbackPreferences } from "@/lib/appearance"

/**
 * Sound and vibration for the moments that matter. Sounds are synthesised with the Web Audio API,
 * so there are no audio files to download or license, and each one is short and soft enough to
 * hear a hundred times a day without it grating.
 *
 * Sound only plays after the learner has interacted with the page (browsers require it), which is
 * always true here: every cue answers something they just did.
 */
export type FeedbackKind =
  "tap" | "correct" | "incorrect" | "combo" | "complete" | "perfect" | "streak"

type Note = {
  /** Hz. */
  freq: number
  /** Seconds after the cue starts. */
  at: number
  /** Seconds. */
  length: number
  type?: OscillatorType
  volume?: number
  /** Slide to this frequency over the note, for swoops. */
  glideTo?: number
}

// A major-ish palette around A5, bright without being shrill.
const C5 = 523.25
const E5 = 659.25
const G5 = 783.99
const A5 = 880
const C6 = 1046.5
const E6 = 1318.5
const G6 = 1568
const C7 = 2093

const CUES: Record<FeedbackKind, Note[]> = {
  // A warm swoosh up into a bell chord: the flame catching.
  streak: [
    {
      freq: 320,
      at: 0,
      length: 0.35,
      type: "sine",
      volume: 0.35,
      glideTo: 880,
    },
    { freq: E5, at: 0.3, length: 0.6, type: "triangle", volume: 0.4 },
    { freq: A5, at: 0.3, length: 0.6, type: "triangle", volume: 0.35 },
    { freq: E6, at: 0.3, length: 0.7, type: "sine", volume: 0.25 },
    { freq: A5 * 2, at: 0.42, length: 0.5, type: "sine", volume: 0.15 },
  ],
  tap: [{ freq: 1400, at: 0, length: 0.03, type: "triangle", volume: 0.12 }],
  // Two rising notes: "ding-ding!"
  correct: [
    { freq: A5, at: 0, length: 0.11, type: "triangle", volume: 0.5 },
    { freq: E6, at: 0.085, length: 0.22, type: "triangle", volume: 0.55 },
    { freq: E6 * 2, at: 0.085, length: 0.16, type: "sine", volume: 0.12 },
  ],
  // A soft, low "bonk" that sounds like a shrug, not an alarm.
  incorrect: [
    {
      freq: 260,
      at: 0,
      length: 0.16,
      type: "sine",
      volume: 0.55,
      glideTo: 200,
    },
    {
      freq: 196,
      at: 0.13,
      length: 0.22,
      type: "sine",
      volume: 0.45,
      glideTo: 150,
    },
  ],
  // A quick arpeggio up: momentum.
  combo: [
    { freq: C6, at: 0, length: 0.07, type: "square", volume: 0.12 },
    { freq: E6, at: 0.055, length: 0.07, type: "square", volume: 0.12 },
    { freq: G6, at: 0.11, length: 0.07, type: "square", volume: 0.12 },
    { freq: C7, at: 0.165, length: 0.2, type: "triangle", volume: 0.35 },
  ],
  // A little fanfare that lands on a chord.
  complete: [
    { freq: C5, at: 0, length: 0.12, type: "triangle", volume: 0.45 },
    { freq: E5, at: 0.11, length: 0.12, type: "triangle", volume: 0.45 },
    { freq: G5, at: 0.22, length: 0.12, type: "triangle", volume: 0.45 },
    { freq: C6, at: 0.33, length: 0.5, type: "triangle", volume: 0.5 },
    { freq: E6, at: 0.33, length: 0.5, type: "sine", volume: 0.25 },
    { freq: G6, at: 0.33, length: 0.5, type: "sine", volume: 0.18 },
  ],
  // The fanfare, plus a sparkle on top.
  perfect: [
    { freq: C5, at: 0, length: 0.1, type: "triangle", volume: 0.45 },
    { freq: E5, at: 0.09, length: 0.1, type: "triangle", volume: 0.45 },
    { freq: G5, at: 0.18, length: 0.1, type: "triangle", volume: 0.45 },
    { freq: C6, at: 0.27, length: 0.6, type: "triangle", volume: 0.5 },
    { freq: E6, at: 0.27, length: 0.6, type: "sine", volume: 0.25 },
    { freq: G6, at: 0.45, length: 0.08, type: "sine", volume: 0.2 },
    { freq: C7, at: 0.53, length: 0.08, type: "sine", volume: 0.2 },
    { freq: C7 * 1.5, at: 0.61, length: 0.25, type: "sine", volume: 0.18 },
  ],
}

/** Vibration patterns (ms on, off, on…). Haptics carry the low end; sound carries the sparkle. */
const BUZZ: Record<FeedbackKind, number[]> = {
  tap: [6],
  correct: [14],
  incorrect: [35, 50, 35],
  combo: [10, 30, 10, 30, 22],
  complete: [18, 40, 18, 40, 60],
  perfect: [18, 40, 18, 40, 18, 40, 80],
  streak: [30, 60, 80],
}

const MASTER_VOLUME = 0.32

let context: AudioContext | null = null

function audio() {
  if (typeof window === "undefined" || !("AudioContext" in window)) return null
  context ??= new AudioContext()
  if (context.state === "suspended") void context.resume()
  return context
}

function play(notes: Note[]) {
  const ctx = audio()
  if (!ctx) return
  const master = ctx.createGain()
  master.gain.value = MASTER_VOLUME
  master.connect(ctx.destination)
  const start = ctx.currentTime + 0.005
  for (const note of notes) {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = note.type ?? "sine"
    const t = start + note.at
    osc.frequency.setValueAtTime(note.freq, t)
    if (note.glideTo)
      osc.frequency.exponentialRampToValueAtTime(note.glideTo, t + note.length)
    // Fast attack, smooth exponential release: no clicks.
    gain.gain.setValueAtTime(0.0001, t)
    gain.gain.exponentialRampToValueAtTime(note.volume ?? 0.4, t + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + note.length)
    osc.connect(gain).connect(master)
    osc.start(t)
    osc.stop(t + note.length + 0.02)
  }
}

/** Plays a cue's sound and vibration, each only if the learner has it switched on. Never throws. */
export function playFeedback(kind: FeedbackKind) {
  try {
    const preferences = feedbackPreferences()
    if (preferences.sound) play(CUES[kind])
    // Browsers ignore (and warn about) vibration before the first tap.
    if (
      preferences.haptics &&
      "vibrate" in navigator &&
      navigator.userActivation?.hasBeenActive !== false
    )
      navigator.vibrate(BUZZ[kind])
  } catch {
    // Feedback is a nicety. A blocked audio context must never break a lesson.
  }
}
