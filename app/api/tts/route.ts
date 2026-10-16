import { NextResponse, type NextRequest } from "next/server"
import { z } from "zod"

import { getPublicEnv } from "@/lib/env"
import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import {
  MAX_TTS_CHARS,
  SPEEDS,
  TTS_BUCKET,
  audioPath,
  normaliseText,
  publicAudioUrl,
  voiceIdFor,
} from "@/lib/tts/core"
import { synthesize } from "@/lib/tts/elevenlabs"

const input = z.object({
  text: z.string().min(1).max(MAX_TTS_CHARS),
  speaker: z.string().max(16).nullish(),
  speed: z.enum(Object.keys(SPEEDS) as ["normal", "slow"]),
})

/** The whole app's on-demand recording budget per UTC day, in characters. */
const DAILY_CHARS = Number(process.env.TTS_DAILY_CHAR_BUDGET) || 100_000

/**
 * Returns the URL of a recording, making it first if it doesn't exist yet. Most lines are recorded
 * ahead of time by `bun run audio:generate`; this covers the rest, such as lines with the learner's
 * name. Recording costs money, so it needs a signed-in learner and stays within the daily limits.
 */
export async function POST(request: NextRequest) {
  const parsed = input.safeParse(await request.json().catch(() => null))
  if (!parsed.success)
    return NextResponse.json({ error: "invalid" }, { status: 400 })
  const text = normaliseText(parsed.data.text)
  const { speaker, speed } = parsed.data
  const path = await audioPath(text, speaker, speed)
  const voice = voiceIdFor(speaker)
  if (!path || !voice)
    return NextResponse.json({ error: "no-voice" }, { status: 404 })

  const url = publicAudioUrl(getPublicEnv().NEXT_PUBLIC_SUPABASE_URL, path)
  const existing = await fetch(url, { method: "HEAD" })
  if (existing.ok) return NextResponse.json({ url })

  const apiKey = process.env.ELEVENLABS_API_KEY
  const admin = createAdminClient()
  if (!apiKey || !admin)
    return NextResponse.json({ error: "not-configured" }, { status: 503 })

  const supabase = await createClient()
  const { data: claims } = await supabase.auth.getClaims()
  if (!claims?.claims?.sub)
    return NextResponse.json({ error: "sign-in" }, { status: 401 })
  const { data: allowed } = await supabase.rpc("tts_allow", {
    p_chars: text.length,
    p_daily_chars: DAILY_CHARS,
  })
  if (!allowed) return NextResponse.json({ error: "limit" }, { status: 429 })

  try {
    const audio = await synthesize(text, voice, speed, apiKey)
    const { error } = await admin.storage.from(TTS_BUCKET).upload(path, audio, {
      contentType: "audio/mpeg",
      cacheControl: "31536000",
      upsert: false,
    })
    // Someone else recorded the same line a moment ago: theirs is just as good.
    if (error && !/exists/i.test(error.message))
      return NextResponse.json({ error: "storage" }, { status: 502 })
    return NextResponse.json({ url })
  } catch {
    return NextResponse.json({ error: "tts" }, { status: 502 })
  }
}
