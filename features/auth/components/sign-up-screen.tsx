"use client"

import { useState } from "react"

import { TeamBadge } from "@/components/learning/team-badge"

import type { SignUpValues } from "../schemas"
import type { AuthAction } from "../types"
import { AuthShell } from "./auth-shell"
import { SignUpForm } from "./sign-up-form"

type SignUpScreenProps = {
  action: AuthAction<SignUpValues>
  defaultEmail?: string
}

/** The team badge on the panel previews the name as the learner types it. */
export function SignUpScreen({ action, defaultEmail }: SignUpScreenProps) {
  const [name, setName] = useState("")

  return (
    <AuthShell
      variant="signup"
      panelText="Good to have you here. Your team badge is ready for a name."
      panelExtra={
        <TeamBadge
          name={name}
          className="rotate-[-1.5deg] border-0 shadow-[0_30px_60px_-24px_rgb(0_0_0/0.55)]"
          rows={[
            { label: "Team", value: "Product · Frontend" },
            { label: "First day", value: "Today" },
          ]}
        />
      }
    >
      <SignUpForm
        action={action}
        onNameChange={setName}
        {...(defaultEmail ? { defaultEmail } : {})}
      />
    </AuthShell>
  )
}
