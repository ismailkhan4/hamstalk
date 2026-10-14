import { z } from "zod"

const person = z.enum(["lf", "jk", "ao", "aw", "mb", "bk", "cm", "me"])

const voice = z.object({
  person,
  initials: z.string().min(1),
  label: z.string().min(1),
})

const optionIndex = z.number().int().min(0)

const feedback = z
  .object({
    right: z.string().min(1),
    alternative: z.record(z.string(), z.string()).default({}),
    wrong: z.record(z.string(), z.string()).default({}),
  })
  .strict()

function checkOptions(
  value: {
    options: unknown[]
    correct: number
    alternatives: number[]
    feedback: z.infer<typeof feedback>
  },
  ctx: z.RefinementCtx
) {
  const count = value.options.length
  const accepted = new Set([value.correct, ...value.alternatives])
  if (
    value.correct >= count ||
    value.alternatives.some((index) => index >= count)
  ) {
    ctx.addIssue({
      code: "custom",
      message: "An accepted option index is out of range.",
    })
  }
  for (let index = 0; index < count; index++) {
    if (accepted.has(index)) continue
    if (!value.feedback.wrong[String(index)]) {
      ctx.addIssue({
        code: "custom",
        message: `Option ${index} needs feedback that explains why it is wrong.`,
      })
    }
  }
  for (const index of value.alternatives) {
    if (!value.feedback.alternative[String(index)]) {
      ctx.addIssue({
        code: "custom",
        message: `Accepted alternative ${index} needs its own note.`,
      })
    }
  }
}

const discoverLine = z.object({
  speaker: voice,
  de: z.string().min(1),
  en: z.string().min(1),
  note: z.string().optional(),
  saveKey: z.string().optional(),
})

export const discoverExercise = z.object({
  type: z.literal("discover"),
  kind: z.string(),
  title: z.string(),
  sub: z.string(),
  lines: z.array(discoverLine).min(1),
})

export const tipExercise = z.object({
  type: z.literal("tip"),
  kind: z.string(),
  title: z.string(),
  sub: z.string(),
  columns: z.array(z.string()).min(2),
  rows: z.array(z.array(z.string())).min(1),
  examples: z.array(z.object({ de: z.string(), en: z.string() })),
  note: z.string(),
})

export const choiceExercise = z
  .object({
    type: z.literal("choice"),
    variant: z.enum(["multiple-choice", "fill", "listening"]),
    kind: z.string(),
    prompt: z.string().min(1),
    optionsLanguage: z.enum(["de", "en"]),
    options: z.array(z.string().min(1)).min(2).max(4),
    correct: optionIndex,
    alternatives: z.array(optionIndex).default([]),
    feedback,
    topic: z.string().optional(),
    revisits: z.number().int().min(0).optional(),
    fill: z.object({ before: z.string(), after: z.string() }).optional(),
    listening: z
      .object({ clip: z.string(), translation: z.string(), meta: z.string() })
      .optional(),
  })
  .superRefine(checkOptions)
  .superRefine((value, ctx) => {
    if (value.variant === "fill" && !value.fill)
      ctx.addIssue({ code: "custom", message: "A fill exercise needs fill." })
    if (value.variant === "listening" && !value.listening) {
      ctx.addIssue({
        code: "custom",
        message: "A listening exercise needs listening.",
      })
    }
  })

export const matchExercise = z
  .object({
    type: z.literal("match"),
    kind: z.string(),
    prompt: z.string(),
    sub: z.string(),
    pairs: z
      .array(z.object({ phrase: z.string(), meaning: z.string() }))
      .min(2)
      .max(6),
    meaningOrder: z.array(z.string()),
    labels: z.object({
      phrases: z.string(),
      meanings: z.string(),
      empty: z.string(),
      joiner: z.string(),
    }),
    meaningsLanguage: z.enum(["de", "en"]).default("en"),
    explanation: z.string(),
    topic: z.string().optional(),
    revisits: z.number().int().min(0).optional(),
  })
  .superRefine((value, ctx) => {
    const meanings = value.pairs.map((pair) => pair.meaning).sort()
    const offered = [...value.meaningOrder].sort()
    if (JSON.stringify(meanings) !== JSON.stringify(offered)) {
      ctx.addIssue({
        code: "custom",
        message: "meaningOrder must list exactly the meanings of the pairs.",
      })
    }
  })

export const buildExercise = z
  .object({
    type: z.literal("build"),
    kind: z.string(),
    prompt: z.string(),
    sub: z.string(),
    tiles: z.array(z.string()).min(2),
    answer: z.array(optionIndex).min(2),
    feedback: z.object({ right: z.string(), wrong: z.string() }),
    topic: z.string().optional(),
    revisits: z.number().int().min(0).optional(),
  })
  .superRefine((value, ctx) => {
    if (value.answer.some((index) => index >= value.tiles.length)) {
      ctx.addIssue({
        code: "custom",
        message: "An answer index is out of range.",
      })
    }
    if (new Set(value.answer).size !== value.answer.length) {
      ctx.addIssue({
        code: "custom",
        message: "A tile can only be used once in the answer.",
      })
    }
  })

const turn = z
  .object({
    speaker: voice,
    line: z.string(),
    translation: z.string(),
    task: z.string(),
    options: z
      .array(z.object({ de: z.string(), en: z.string() }))
      .min(2)
      .max(4),
    correct: optionIndex,
    alternatives: z.array(optionIndex).default([]),
    feedback,
    revisits: z.number().int().min(0).optional(),
  })
  .superRefine(checkOptions)

export const conversationExercise = z.object({
  type: z.literal("conversation"),
  kind: z.string(),
  prompt: z.string(),
  sub: z.string(),
  turns: z.array(turn).min(2).max(5),
  closing: z.object({ speaker: voice, de: z.string(), en: z.string() }),
  topic: z.string().optional(),
})

export const exerciseSchema = z.discriminatedUnion("type", [
  discoverExercise,
  tipExercise,
  choiceExercise,
  matchExercise,
  buildExercise,
  conversationExercise,
])

export const lessonSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]{3,64}$/),
  kind: z.enum(["lesson", "review"]),
  title: z.string(),
  titleIsGerman: z.boolean(),
  titleEn: z.string(),
  goal: z.string(),
  minutes: z.number().int().positive(),
  xp: z.number().int().positive(),
  focus: z.string(),
  intro: z.object({
    speaker: z.object({ person, initials: z.string() }),
    de: z.string(),
    en: z.string(),
  }),
  phrases: z.array(z.string()),
  practised: z.array(z.string()),
  canDo: z.array(z.string()),
  exercises: z.array(exerciseSchema).min(1).max(12),
  revisitedLessons: z
    .array(
      z.object({ lessonId: z.string(), label: z.string(), title: z.string() })
    )
    .optional(),
})

export type Voice = z.infer<typeof voice>
export type DiscoverExercise = z.infer<typeof discoverExercise>
export type TipExercise = z.infer<typeof tipExercise>
export type ChoiceExercise = z.infer<typeof choiceExercise>
export type MatchExercise = z.infer<typeof matchExercise>
export type BuildExercise = z.infer<typeof buildExercise>
export type ConversationExercise = z.infer<typeof conversationExercise>
export type ConversationTurn = z.infer<typeof turn>
export type Exercise = z.infer<typeof exerciseSchema>
export type Lesson = z.infer<typeof lessonSchema>
export type GradedExercise =
  ChoiceExercise | MatchExercise | BuildExercise | ConversationExercise

export function isGraded(exercise: Exercise): exercise is GradedExercise {
  return exercise.type !== "discover" && exercise.type !== "tip"
}

export function personalise(
  text: string,
  learner: { firstName: string; initials: string }
) {
  return text
    .replaceAll("%N", learner.firstName)
    .replaceAll("%I", learner.initials)
}
