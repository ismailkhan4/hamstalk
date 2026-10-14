"use client"

import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"

import { Input, type InputProps } from "@/components/ui/input"

/** Paste and password managers stay allowed (WCAG 3.3.8); the toggle only changes visibility. */
export function PasswordInput(props: Omit<InputProps, "type" | "trailing">) {
  const [visible, setVisible] = useState(false)

  return (
    <Input
      {...props}
      type={visible ? "text" : "password"}
      spellCheck={false}
      autoCapitalize="none"
      trailing={
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="grid size-9 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          {visible ? (
            <EyeOff aria-hidden="true" className="size-[18px]" />
          ) : (
            <Eye aria-hidden="true" className="size-[18px]" />
          )}
        </button>
      }
    />
  )
}
