import { cva, type VariantProps } from "class-variance-authority"
import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full font-semibold whitespace-nowrap [&_svg]:shrink-0",
  {
    variants: {
      tone: {
        neutral: "",
        primary: "",
        success: "",
        danger: "",
        warning: "",
        info: "",
        spark: "",
        gold: "",
      },
      appearance: { subtle: "", solid: "", outline: "border bg-card" },
      size: {
        sm: "h-5 px-2 text-[11px] leading-4 [&_svg]:size-3",
        md: "h-6 px-2.5 text-xs leading-4 [&_svg]:size-3.5",
      },
    },
    compoundVariants: [
      {
        tone: "neutral",
        appearance: "subtle",
        className: "bg-muted text-secondary-text",
      },
      {
        tone: "primary",
        appearance: "subtle",
        className: "bg-primary-subtle text-primary-text",
      },
      {
        tone: "success",
        appearance: "subtle",
        className: "bg-success-subtle text-success-text",
      },
      {
        tone: "danger",
        appearance: "subtle",
        className: "bg-danger-subtle text-danger-text",
      },
      {
        tone: "warning",
        appearance: "subtle",
        className: "bg-warning-subtle text-warning-text",
      },
      {
        tone: "info",
        appearance: "subtle",
        className: "bg-info-subtle text-info-text",
      },
      {
        tone: "spark",
        appearance: "subtle",
        className: "bg-spark-subtle text-spark-text",
      },
      {
        tone: "gold",
        appearance: "subtle",
        className: "bg-reward-subtle text-reward-text",
      },
      {
        tone: "neutral",
        appearance: "solid",
        className: "bg-inverse text-inverse-foreground",
      },
      {
        tone: "primary",
        appearance: "solid",
        className: "bg-primary text-primary-foreground",
      },
      {
        tone: "success",
        appearance: "solid",
        className: "bg-success text-success-foreground",
      },
      {
        tone: "danger",
        appearance: "solid",
        className: "bg-danger text-danger-foreground",
      },
      {
        tone: "warning",
        appearance: "solid",
        className: "bg-warning text-reward-foreground",
      },
      {
        tone: "info",
        appearance: "solid",
        className: "bg-info text-primary-foreground dark:text-background",
      },
      {
        tone: "spark",
        appearance: "solid",
        className: "bg-spark text-primary-foreground dark:text-background",
      },
      {
        tone: "gold",
        appearance: "solid",
        className: "bg-reward text-reward-foreground",
      },
      {
        tone: "neutral",
        appearance: "outline",
        className: "border-border text-secondary-text",
      },
      {
        tone: "primary",
        appearance: "outline",
        className: "border-primary-border text-primary-text",
      },
      {
        tone: "success",
        appearance: "outline",
        className: "border-success-border text-success-text",
      },
      {
        tone: "danger",
        appearance: "outline",
        className: "border-danger-border text-danger-text",
      },
      {
        tone: "warning",
        appearance: "outline",
        className: "border-warning-border text-warning-text",
      },
      {
        tone: "info",
        appearance: "outline",
        className: "border-info-border text-info-text",
      },
      {
        tone: "spark",
        appearance: "outline",
        className: "border-spark-border text-spark-text",
      },
      {
        tone: "gold",
        appearance: "outline",
        className: "border-reward-border text-reward-text",
      },
    ],
    defaultVariants: { tone: "neutral", appearance: "subtle", size: "md" },
  }
)

type BadgeProps = React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { icon?: LucideIcon }

function Badge({
  className,
  tone,
  appearance,
  size,
  icon: Icon,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ tone, appearance, size }), className)}
      {...props}
    >
      {Icon && <Icon aria-hidden="true" />}
      {children}
    </span>
  )
}

export { Badge, badgeVariants }
export type { BadgeProps }
