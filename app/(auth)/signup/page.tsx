import type { Metadata } from "next"

import { signUpAction } from "@/features/auth/actions"
import { SignUpScreen } from "@/features/auth/components/sign-up-screen"

export const metadata: Metadata = { title: "Create your account" }

type Props = { searchParams: Promise<{ email?: string | string[] }> }

export default async function SignUpPage({ searchParams }: Props) {
  const { email } = await searchParams
  const defaultEmail =
    typeof email === "string" ? email.slice(0, 254) : undefined
  return (
    <SignUpScreen
      action={signUpAction}
      {...(defaultEmail ? { defaultEmail } : {})}
    />
  )
}
