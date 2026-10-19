"use server"

import Anthropic from "@anthropic-ai/sdk"
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod"
import { z } from "zod"

import { ACTIVE_COURSE } from "@/content/courses"
import { MASCOT_NAME } from "@/features/celebrations/mascot-name"
import { aiDefaults, claude } from "@/lib/ai/claude"
import { trackServer } from "@/lib/analytics/server"
import { requireUser } from "@/lib/auth/session"
import { createClient } from "@/lib/supabase/server"

export type Explanation = {
  /** Why the answer didn't work, in a sentence or two. */
  why: string
  /** The rule behind it. */
  rule: string
  /** One more example, in the target language and in English. */
  example: { target: string; native: string }
}

export type ExplainResult =
  { ok: true; explanation: Explanation } | { ok: false; message: string }

const text = (max: number) => z.string().trim().min(1).max(max)

const input = z.object({
  lessonId: z.string().min(1).max(64),
  topic: z.string().max(120).optional(),
  prompt: text(400),
  learnerAnswer: text(300),
  correctAnswer: text(300),
  reason: z.string().max(600).optional(),
})

const explanationSchema = z.object({
  why: z.string(),
  rule: z.string(),
  example: z.object({ target: z.string(), native: z.string() }),
})

// Stable across every request, so it can be cached.
const SYSTEM = `You are ${MASCOT_NAME}, the friendly hamster tutor in Hamstalk, an app that teaches ${ACTIVE_COURSE.language} to adults who are starting work in a ${ACTIVE_COURSE.language}-speaking team.

A learner just answered an exercise wrong. Explain the mistake for their exact answer.

- why: one or two short sentences on why their answer doesn't fit here. Name what they wrote. Be kind and plain; never make them feel silly.
- rule: the rule or pattern behind the right answer, in one or two sentences, at beginner (A1) level. No grammar jargon unless you explain it.
- example: one new short example in ${ACTIVE_COURSE.language} (target) that uses the same rule, with an English translation (native). Keep it workplace or everyday.

Write in English except for ${ACTIVE_COURSE.language} words and the example. Under 70 words in total. If the learner's answer is also correct, say so in "why" and explain why the exercise wanted the other one.`

/** Explains a missed answer in the learner's own terms. Counted against a daily limit. */
export async function explainAnswerAction(
  raw: unknown
): Promise<ExplainResult> {
  const parsed = input.safeParse(raw)
  if (!parsed.success)
    return { ok: false, message: "That answer can’t be explained." }
  const client = claude()
  if (!client)
    return { ok: false, message: "Explanations aren’t switched on here." }
  const user = await requireUser(`/learn/${parsed.data.lessonId}`)
  const supabase = await createClient()
  const { data: allowed, error } = await supabase.rpc("ai_allow", {
    p_kind: "explain",
  })
  if (error) return { ok: false, message: "Explanations aren’t set up yet." }
  if (!allowed)
    return {
      ok: false,
      message: `${MASCOT_NAME} has explained a lot today. Explanations come back tomorrow.`,
    }

  const answer = parsed.data
  try {
    const response = await client.beta.messages.parse({
      ...aiDefaults(),
      max_tokens: 2000,
      system: [
        { type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } },
      ],
      messages: [
        {
          role: "user",
          content: [
            answer.topic ? `Topic: ${answer.topic}` : null,
            `Exercise: ${answer.prompt}`,
            `Learner's answer: ${answer.learnerAnswer}`,
            `Right answer: ${answer.correctAnswer}`,
            answer.reason ? `Note from the lesson: ${answer.reason}` : null,
          ]
            .filter(Boolean)
            .join("\n"),
        },
      ],
      output_config: {
        effort: "low",
        format: betaZodOutputFormat(explanationSchema),
      },
    })
    if (response.stop_reason === "refusal" || !response.parsed_output)
      return {
        ok: false,
        message: `${MASCOT_NAME} couldn’t explain this one. The note above still has the answer.`,
      }
    trackServer(user.id, "answer_explained", { lesson_id: answer.lessonId })
    return { ok: true, explanation: response.parsed_output }
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Anthropic.RateLimitError
          ? "Lots of learners are asking right now. Try again in a minute."
          : "The explanation didn’t come through. Try again in a moment.",
    }
  }
}
