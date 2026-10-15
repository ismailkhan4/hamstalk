import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const cardVariants = cva("rounded-xl text-card-foreground", {
  variants: {
    variant: {
      default: "border border-border bg-card",
      interactive:
        "border border-border bg-card transition-[border-color,box-shadow] duration-(--duration-fast) ease-out hover:border-input hover:shadow-sm has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ring",
      selected: "border-2 border-primary bg-primary-subtle",
      elevated: "border border-border-subtle bg-card shadow-md",
      inset: "bg-inset",
      locked:
        "border border-dashed border-border bg-background-subtle text-muted-foreground",
    },
    padding: {
      none: "",
      sm: "p-4",
      md: "p-4 sm:p-5",
      lg: "p-5 sm:p-6 lg:p-7",
    },
  },
  defaultVariants: { variant: "default", padding: "md" },
})

type CardProps = React.ComponentProps<"div"> & VariantProps<typeof cardVariants>

function Card({ className, variant, padding, ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      className={cn(cardVariants({ variant, padding }), className)}
      {...props}
    />
  )
}

export { Card, cardVariants }
export type { CardProps }
