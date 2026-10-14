"use server"

import { z } from "zod"

import { choiceNote } from "@/features/lessons/engine/grading"
import { gradeRetry } from "@/features/lessons/lookup"
import { isMissingTable } from "@/features/onboarding/data"
import { requireUser } from "@/lib/auth/session"
import { createClient } from "@/lib/supabase/server"

export type RetryResult =
  { ok: true; correct: boolean; note: string } | { ok: false; message: string }

const input = z.object({
  itemKey: z.string().min(1).max(80),
  selection: z.number().int().min(0).max(3),
})

const FAILED = "That answer wasn’t saved. Check your connection and try again."

/**
 * The server asks the question again from the lesson's content and grades the answer itself, so a
 * mistake can only be marked learned by answering it right. A right answer sets learned_at.
 */
export async function retryMistakeAction(raw: unknown): Promise<RetryResult> {
  const parsed = input.safeParse(raw)
  if (!parsed.success) return { ok: false, message: FAILED }
  await requireUser("/mistakes")
  const graded = gradeRetry(parsed.data.itemKey, parsed.data.selection)
  if (!graded) return { ok: false, message: FAILED }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("mistakes")
    .select("item_key")
    .eq("item_key", parsed.data.itemKey)
    .maybeSingle()
  if (error || !data)
    return {
      ok: false,
      message: isMissingTable(error)
        ? "The database isn’t set up yet."
        : FAILED,
    }

  const note = choiceNote(graded.question.item, parsed.data.selection)
  if (graded.verdict === "wrong") return { ok: true, correct: false, note }

  const { error: updateError } = await supabase
    .from("mistakes")
    .update({ learned_at: new Date().toISOString() })
    .eq("item_key", parsed.data.itemKey)
  return updateError
    ? { ok: false, message: FAILED }
    : { ok: true, correct: true, note }
}
