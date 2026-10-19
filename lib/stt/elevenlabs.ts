/**
 * One request to ElevenLabs speech-to-text (Scribe). Server only: it needs ELEVENLABS_API_KEY, with
 * the key's "Speech to Text" permission on. Returns the words heard with how sure Scribe is of
 * each, or throws with ElevenLabs' status.
 */
export const STT_MODEL = "scribe_v2"

export type HeardWord = {
  text: string
  /** Natural log of Scribe's confidence: 0 is certain, -0.7 is about 50%. */
  logprob: number
}

export type Transcript = { text: string; words: HeardWord[] }

const response = (value: unknown) =>
  value as {
    text?: string
    words?: { text: string; type: string; logprob?: number }[]
  }

export async function transcribe(
  audio: Blob,
  languageCode: string,
  apiKey: string
): Promise<Transcript> {
  const form = new FormData()
  form.append("model_id", STT_MODEL)
  form.append("language_code", languageCode)
  // A learner's answer, not a recording of the room: no laughter or noise tags.
  form.append("tag_audio_events", "false")
  form.append("file", audio, "answer")

  const result = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
    method: "POST",
    headers: { "xi-api-key": apiKey },
    body: form,
  })
  if (!result.ok)
    throw new Error(
      `ElevenLabs ${result.status}: ${(await result.text()).slice(0, 200)}`
    )
  const data = response(await result.json())
  return {
    text: data.text ?? "",
    words: (data.words ?? [])
      .filter((word) => word.type === "word")
      .map((word) => ({ text: word.text, logprob: word.logprob ?? 0 })),
  }
}
