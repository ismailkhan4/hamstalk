import { ACTIVE_COURSE } from "@/content/courses"

/**
 * Recorded speech, shared by the browser, the /api/tts route and the generation script. Every
 * recording is stored once under a key made from what shaped it (model, voice, speed and text), so
 * the same line is never paid for twice, and changing a voice or the model records fresh files.
 * No secrets here: this module runs in the browser too.
 */

/** ElevenLabs' highest-quality multilingual model. */
export const TTS_MODEL = "eleven_v4"

/** Playback speeds: a natural pace, and a slower one for listening exercises. */
export const SPEEDS = { normal: 0.95, slow: 0.75 } as const
export type Speed = keyof typeof SPEEDS

export const TTS_BUCKET = "tts"
/** The longest line that can be recorded on demand. */
export const MAX_TTS_CHARS = 300

/** The voice for a speaker (an avatar id), falling back to the narrator. Null when none is set. */
export function voiceIdFor(speaker?: string | null) {
  const voices = ACTIVE_COURSE.voices
  return (speaker && voices[speaker]) || voices.narrator || null
}

export const recordedSpeechEnabled = () => Boolean(voiceIdFor())

/** Whitespace and Unicode tidied, so equal lines share one recording. */
export const normaliseText = (text: string) =>
  text.normalize("NFC").replace(/\s+/g, " ").trim()

async function sha256(value: string) {
  const bytes = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value)
  )
  return Array.from(new Uint8Array(bytes), (b) =>
    b.toString(16).padStart(2, "0")
  ).join("")
}

/** Where a recording lives in the bucket, or null when there's no voice to record it with. */
export async function audioPath(
  text: string,
  speaker: string | null | undefined,
  speed: Speed
) {
  const voice = voiceIdFor(speaker)
  if (!voice) return null
  const key = await sha256(
    [TTS_MODEL, voice, SPEEDS[speed], normaliseText(text)].join("|")
  )
  return `${ACTIVE_COURSE.id}/${key}.mp3`
}

export function publicAudioUrl(supabaseUrl: string, path: string) {
  return `${supabaseUrl}/storage/v1/object/public/${TTS_BUCKET}/${path}`
}

/** The speaker of a listening clip, from its caption ("0:02 · Jonas"). */
export function speakerFromCaption(caption: string) {
  return (
    ACTIVE_COURSE.pacers.find((pacer) =>
      caption.includes(pacer.name.split(" ")[0]!)
    )?.id ?? null
  )
}
