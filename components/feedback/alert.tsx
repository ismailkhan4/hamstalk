import { cva, type VariantProps } from "class-variance-authority"
import { CircleAlert, CircleCheck, Info, TriangleAlert } from "lucide-react"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "flex gap-3 rounded-lg border p-4 text-sm leading-[1.45]",
  {
    variants: {
      tone: {
        error: "border-danger-border bg-danger-subtle text-danger-text",
        success: "border-success-border bg-success-subtle text-success-text",
        warning: "border-warning-border bg-warning-subtle text-warning-text",
        info: "border-primary-border bg-primary-subtle text-primary-text",
      },
    },
    defaultVariants: { tone: "info" },
  }
)

const icons = {
  error: CircleAlert,
  success: CircleCheck,
  warning: TriangleAlert,
  info: Info,
}

type AlertProps = VariantProps<typeof alertVariants> & {
  title: string
  children?: React.ReactNode
  action?: React.ReactNode
  className?: string
  id?: string
}

/** Errors are announced immediately; success, warning and guidance are announced politely. */
function Alert({
  tone = "info",
  title,
  children,
  action,
  className,
  id,
}: AlertProps) {
  const Icon = icons[tone ?? "info"]
  return (
    <div
      id={id}
      role={tone === "error" ? "alert" : "status"}
      data-slot="alert"
      className={cn(alertVariants({ tone }), className)}
    >
      <Icon aria-hidden="true" className="mt-0.5 size-[18px] shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="font-bold">{title}</p>
        {children && (
          <div className="mt-0.5 text-foreground/85 dark:text-secondary-text">
            {children}
          </div>
        )}
        {action && <div className="mt-3">{action}</div>}
      </div>
    </div>
  )
}

export { Alert }
export type { AlertProps }
