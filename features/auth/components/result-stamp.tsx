import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type ResultStampProps = {
  icon: LucideIcon
  tone: "success" | "primary" | "warning"
}

export function ResultStamp({ icon: Icon, tone }: ResultStampProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "mb-6 grid size-16 place-items-center rounded-full motion-safe:animate-in motion-safe:duration-[420ms] motion-safe:zoom-in-50",
        tone === "success" &&
          "bg-success-subtle text-success-text shadow-[inset_0_0_0_1.5px_var(--success-border)]",
        tone === "primary" &&
          "bg-primary-subtle text-primary-text shadow-[inset_0_0_0_1.5px_var(--primary-border)]",
        tone === "warning" &&
          "bg-reward-subtle text-reward-text shadow-[inset_0_0_0_1.5px_var(--reward-border)]"
      )}
    >
      <Icon className="size-[30px]" strokeWidth={2} />
    </span>
  )
}
