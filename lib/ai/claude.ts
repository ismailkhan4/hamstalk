import "server-only"

import Anthropic from "@anthropic-ai/sdk"

/**
 * The Claude client for Hamstalk's AI features. Null when ANTHROPIC_API_KEY isn't set, so the
 * features hide themselves instead of failing.
 */
export function claude() {
  if (!process.env.ANTHROPIC_API_KEY) return null
  return new Anthropic({ timeout: 30_000, maxRetries: 1 })
}

export const aiEnabled = () => Boolean(process.env.ANTHROPIC_API_KEY)

/** The model every AI feature uses. Override with HAMSTALK_AI_MODEL. */
export const AI_MODEL = process.env.HAMSTALK_AI_MODEL || "claude-opus-5-5"

/**
 * Settings shared by every call: a declined request is retried server-side on Anthropic's
 * recommended fallback model. Calls add `output_config: { effort: "low" }` to keep replies quick
 * for a learner who is waiting on them.
 */
export function aiDefaults() {
  return {
    model: AI_MODEL,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default" as const,
  }
}
