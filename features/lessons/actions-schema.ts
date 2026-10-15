import { z } from "zod"

export const outcomeSchema = z.enum(["first_try", "second_try", "shown"])

export const lessonIdSchema = z.string().regex(/^[a-z0-9-]{3,64}$/)

export const saveProgressInput = z.object({
  lessonId: lessonIdSchema,
  step: z.number().int().min(0).max(49),
  outcomes: z.array(outcomeSchema).max(50),
})

export const completeInput = z.object({
  lessonId: lessonIdSchema,
  outcomes: z.array(outcomeSchema).max(50),
})

export const mistakeInput = z.object({
  lessonId: lessonIdSchema,
  itemKey: z.string().min(1).max(80),
  topic: z.string().max(80).nullable(),
  prompt: z.string().min(1).max(400),
  learnerAnswer: z.string().max(400),
  correctAnswer: z.string().min(1).max(400),
  reason: z.string().max(600),
})

export const savePhraseInput = z.object({
  lessonId: lessonIdSchema,
  saveKey: z.string().min(1).max(40),
  save: z.boolean(),
})
