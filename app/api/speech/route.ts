import { NextResponse, type NextRequest } from "next/server"

import { ACTIVE_COURSE } from "@/content/courses"
import { createClient } from "@/lib/supabase/server"
import { transcribe } from "@/lib/stt/elevenlabs"

/** The largest answer accepted: 15 seconds is well under this in every browser's format. */
const MAX_BYTES = 2_000_000

/** The whole app's transcriptions per UTC day. */
const DAILY_TOTAL = Number(process.env.SPEECH_DAILY_LIMIT) || 3_000

/**
 * Transcribes a spoken answer to a speaking exercise. The browser grades it, as it grades every
 * other exercise; this only turns audio into words. Transcribing costs money, so it needs a
 * signed-in learner and stays within the daily limits in speaking.sql.
 */
export async function POST(request: NextRequest) {
  const apiKey = process.env.ELEVENLABS_API_KEY
  if (!apiKey)
    return NextResponse.json({ error: "not-configured" }, { status: 503 })

  const form = await request.formData().catch(() => null)
  const audio = form?.get("audio")
  if (!(audio instanceof Blob) || audio.size === 0 || audio.size > MAX_BYTES)
    return NextResponse.json({ error: "invalid" }, { status: 400 })

  const supabase = await createClient()
  const { data: claims } = await supabase.auth.getClaims()
  if (!claims?.claims?.sub)
    return NextResponse.json({ error: "sign-in" }, { status: 401 })
  const { data: allowed, error } = await supabase.rpc("speech_allow", {
    p_daily_total: DAILY_TOTAL,
  })
  if (error)
    return NextResponse.json({ error: "not-configured" }, { status: 503 })
  if (!allowed) return NextResponse.json({ error: "limit" }, { status: 429 })

  try {
    return NextResponse.json(await transcribe(audio, ACTIVE_COURSE.id, apiKey))
  } catch {
    return NextResponse.json({ error: "stt" }, { status: 502 })
  }
}
