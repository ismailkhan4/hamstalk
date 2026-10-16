import { SPEEDS, TTS_MODEL, normaliseText, type Speed } from "./core"

/**
 * One request to ElevenLabs text-to-speech. Server and scripts only: it needs ELEVENLABS_API_KEY.
 * Returns MP3 bytes, or throws with ElevenLabs' status.
 */
export async function synthesize(
  text: string,
  voiceId: string,
  speed: Speed,
  apiKey: string
): Promise<Uint8Array> {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}?output_format=mp3_44100_64`,
    {
      method: "POST",
      headers: { "xi-api-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        text: normaliseText(text),
        model_id: TTS_MODEL,
        // A fixed seed keeps re-recordings as close as ElevenLabs allows.
        seed: 7,
        voice_settings: {
          stability: 0.55,
          similarity_boost: 0.75,
          style: 0,
          use_speaker_boost: true,
          speed: SPEEDS[speed],
        },
      }),
    }
  )
  if (!response.ok)
    throw new Error(
      `ElevenLabs ${response.status}: ${(await response.text()).slice(0, 200)}`
    )
  return new Uint8Array(await response.arrayBuffer())
}
