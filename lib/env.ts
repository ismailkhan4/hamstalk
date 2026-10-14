import { z } from "zod"

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url({
    error: "NEXT_PUBLIC_SUPABASE_URL must be the URL of your Supabase project.",
  }),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z
    .string({ error: "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is missing." })
    .min(1, { error: "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is missing." }),
})

export type PublicEnv = z.infer<typeof publicEnvSchema>

export function parsePublicEnv(source: Record<string, string | undefined>) {
  const result = publicEnvSchema.safeParse(source)
  if (!result.success) {
    const problems = result.error.issues.map((issue) => `- ${issue.message}`)
    throw new Error(
      `Invalid public environment variables. Copy .env.example to .env.local and fill it in.\n${problems.join("\n")}`
    )
  }
  return result.data
}

// Next.js inlines NEXT_PUBLIC_ values only when they are referenced by their full name.
export function getPublicEnv(): PublicEnv {
  return parsePublicEnv({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  })
}