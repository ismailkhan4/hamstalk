/**
 * Records every fixed line of the course with ElevenLabs, in each character's voice, and uploads
 * the MP3s to the public "tts" bucket. Lines already recorded are skipped, so it is safe to run
 * after every content change. Lines with the learner's name (%N) are recorded on demand instead.
 *
 *   bun run audio:generate            list what's missing and how many characters it would cost
 *   bun run audio:generate --write    record and upload the missing lines
 *
 * Needs NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY and ELEVENLABS_API_KEY (from .env.local), and
 * voice ids in content/courses/<id>/course.ts.
 */
import { createClient } from "@supabase/supabase-js"

import { lessons } from "@/content/courses/de/lessons/registry"
import { roleplays } from "@/content/courses/de/roleplays"
import { standups } from "@/content/courses/de/standup"
import {
  TTS_BUCKET,
  audioPath,
  normaliseText,
  publicAudioUrl,
  speakerFromCaption,
  voiceIdFor,
  type Speed,
} from "@/lib/tts/core"
import { synthesize } from "@/lib/tts/elevenlabs"

type Line = {
  text: string
  speaker: string | null
  speed: Speed
  where: string
}

function collect(): Line[] {
  const lines: Line[] = []
  const add = (
    text: string,
    speaker: string | null,
    where: string,
    speed: Speed = "normal"
  ) => lines.push({ text: normaliseText(text), speaker, speed, where })

  for (const lesson of lessons) {
    for (const entry of lesson.vocabulary)
      add(entry.word, null, `${lesson.id} words`)
    lesson.exercises.forEach((exercise, i) => {
      const where = `${lesson.id}:${i}`
      if (exercise.type === "discover")
        for (const line of exercise.lines)
          add(line.target, line.speaker.person, where)
      if (exercise.type === "conversation")
        for (const turn of exercise.turns)
          add(turn.line, turn.speaker.person, where)
      if (exercise.type === "translate") add(exercise.source, null, where)
      if (exercise.type === "speak") {
        add(exercise.target, exercise.speaker ?? null, where)
        add(exercise.target, exercise.speaker ?? null, where, "slow")
      }
      if (exercise.type === "choice" && exercise.listening) {
        const speaker = speakerFromCaption(exercise.listening.meta)
        add(exercise.listening.clip, speaker, where)
        add(exercise.listening.clip, speaker, where, "slow")
      }
    })
  }
  for (const standup of standups)
    for (const prompt of standup.prompts) {
      if (prompt.ask) add(prompt.ask.target, "lf", `standup ${standup.unitId}`)
      if (prompt.react)
        add(prompt.react.target, "lf", `standup ${standup.unitId}`)
    }
  for (const roleplay of roleplays)
    add(roleplay.opening.target, roleplay.character, `roleplay ${roleplay.id}`)

  // The learner's name is only known at play time.
  return lines.filter((line) => line.text && !line.text.includes("%N"))
}

async function main() {
  const write = process.argv.includes("--write")
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl) throw new Error("NEXT_PUBLIC_SUPABASE_URL is missing.")
  if (!voiceIdFor())
    throw new Error(
      "No voices yet: paste ElevenLabs voice ids into `voices` in content/courses/de/course.ts (at least `narrator`)."
    )

  // One recording per distinct path, whatever number of places use it.
  const unique = new Map<string, Line>()
  for (const line of collect()) {
    const path = await audioPath(line.text, line.speaker, line.speed)
    if (path && !unique.has(path)) unique.set(path, line)
  }

  const missing: [string, Line][] = []
  for (const [path, line] of unique) {
    const head = await fetch(publicAudioUrl(supabaseUrl, path), {
      method: "HEAD",
    })
    if (!head.ok) missing.push([path, line])
  }
  const chars = missing.reduce((sum, [, line]) => sum + line.text.length, 0)
  console.log(
    `Lines: ${unique.size} · already recorded: ${unique.size - missing.length} · to record: ${missing.length} (${chars.toLocaleString("en")} characters)`
  )
  if (!write) {
    for (const [, line] of missing.slice(0, 15))
      console.log(
        `  ${line.where} [${line.speaker ?? "narrator"}${line.speed === "slow" ? ", slow" : ""}] ${line.text}`
      )
    if (missing.length > 15) console.log(`  … and ${missing.length - 15} more`)
    console.log("Dry run. Add --write to record them.")
    return
  }

  const apiKey = process.env.ELEVENLABS_API_KEY
  const secret = process.env.SUPABASE_SECRET_KEY
  if (!apiKey || !secret)
    throw new Error(
      "ELEVENLABS_API_KEY and SUPABASE_SECRET_KEY are needed to record."
    )
  const storage = createClient(supabaseUrl, secret, {
    auth: { persistSession: false },
  }).storage
  const { error: bucketError } = await storage.getBucket(TTS_BUCKET)
  if (bucketError)
    throw new Error(
      `The "${TTS_BUCKET}" bucket is missing (${bucketError.message}). Apply supabase/migrations/audio.sql first.`
    )
  const bucket = storage.from(TTS_BUCKET)

  let done = 0
  let failed = 0
  // Set when ElevenLabs refuses the account itself (key, plan, suspension): no point going on.
  let stop: string | null = null
  // Two at a time: the free and Starter plans allow two concurrent requests.
  const queue = [...missing]
  async function record(line: Line) {
    for (let attempt = 0; ; attempt++) {
      try {
        return await synthesize(
          line.text,
          voiceIdFor(line.speaker)!,
          line.speed,
          apiKey!
        )
      } catch (error) {
        const status = Number(
          /^ElevenLabs (\d+)/.exec((error as Error).message)?.[1]
        )
        if (status === 429 && attempt < 5) {
          await new Promise((resolve) =>
            setTimeout(resolve, 2000 * 2 ** attempt)
          )
          continue
        }
        if (status === 401 || status === 402) stop = (error as Error).message
        throw error
      }
    }
  }
  async function worker() {
    for (let next = queue.shift(); next && !stop; next = queue.shift()) {
      const [path, line] = next
      try {
        const audio = await record(line)
        const { error } = await bucket.upload(path, audio, {
          contentType: "audio/mpeg",
          cacheControl: "31536000",
          upsert: true,
        })
        if (error) throw new Error(error.message)
        done += 1
        if (done % 10 === 0) console.log(`  ${done}/${missing.length}`)
      } catch (error) {
        failed += 1
        console.error(`  failed ${line.where}: ${(error as Error).message}`)
      }
    }
  }
  await Promise.all([worker(), worker()])
  console.log(`Recorded ${done}, failed ${failed}.`)
  if (stop)
    console.error(
      `Stopped early, ${queue.length} lines not tried. ElevenLabs refused the account: ${stop}`
    )
  if (failed > 0) process.exitCode = 1
}

await main()
