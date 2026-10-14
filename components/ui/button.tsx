"use client"

import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center gap-2 font-semibold tracking-[-0.005em] whitespace-nowrap transition-[background-color,color,box-shadow,transform] duration-(--duration-fast) ease-out select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:translate-y-px disabled:pointer-events-none disabled:bg-disabled disabled:text-disabled-foreground disabled:shadow-none data-[loading]:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground shadow-[inset_0_-2px_0_rgb(0_0_0/0.18)] hover:bg-primary-hover active:bg-primary-active active:shadow-none data-[loading]:bg-primary-active",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary-hover",
        outline:
          "bg-card text-foreground shadow-[inset_0_0_0_1.5px_var(--border)] hover:bg-background-subtle hover:shadow-[inset_0_0_0_1.5px_var(--input)]",
        ghost: "text-secondary-text hover:bg-accent hover:text-foreground",
        danger:
          "bg-danger text-danger-foreground shadow-[inset_0_-2px_0_rgb(0_0_0/0.16)] hover:bg-danger-hover active:bg-danger-active active:shadow-none",
        success:
          "bg-success text-success-foreground shadow-[inset_0_-2px_0_rgb(0_0_0/0.16)] hover:bg-success-hover active:shadow-none",
        reward:
          "bg-reward text-reward-foreground shadow-[inset_0_-2px_0_rgb(0_0_0/0.12)] hover:bg-reward-hover active:shadow-none",
        link: "h-auto px-0 text-primary-text underline decoration-1 underline-offset-[3px] hover:decoration-2 active:translate-y-0",
        inverse:
          "bg-deep-foreground text-deep shadow-[inset_0_-2px_0_rgb(0_0_0/0.12)] hover:bg-card",
      },
      size: {
        xs: "h-7 rounded-sm px-2.5 text-[13px] [&_svg]:size-3.5",
        sm: "h-8 rounded-sm px-3 text-sm [&_svg]:size-4",
        md: "h-10 rounded-md px-4 text-[15px] [&_svg]:size-[18px]",
        lg: "h-12 rounded-lg px-5 text-base [&_svg]:size-5",
        xl: "h-14 rounded-lg px-7 text-[17px] [&_svg]:size-5",
      },
      iconOnly: { true: "aspect-square px-0" },
      fullWidth: { true: "w-full" },
    },
    compoundVariants: [{ variant: "link", className: "h-auto px-0" }],
    defaultVariants: { variant: "primary", size: "md" },
  }
)

type ButtonProps = Omit<ButtonPrimitive.Props, "className"> &
  Omit<VariantProps<typeof buttonVariants>, "iconOnly"> & {
    className?: string
    /** A rendered icon element, so Server Components can pass it across the client boundary. */
    iconLeft?: React.ReactElement
    iconRight?: React.ReactElement
    /** Shows a spinner, keeps the button's width and accessible name, and blocks presses. */
    loading?: boolean
  }

function Button({
  className,
  variant,
  size,
  fullWidth,
  iconLeft,
  iconRight,
  loading = false,
  children,
  onClick,
  ...props
}: ButtonProps) {
  const iconOnly = !children && Boolean(iconLeft ?? iconRight)

  return (
    <ButtonPrimitive
      data-slot="button"
      data-loading={loading || undefined}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      className={cn(
        buttonVariants({ variant, size, fullWidth, iconOnly }),
        className
      )}
      onClick={(event) => {
        if (loading) {
          event.preventDefault()
          return
        }
        onClick?.(event)
      }}
      {...props}
    >
      <span
        className={cn(
          "inline-flex items-center justify-center gap-[inherit]",
          loading && "opacity-0"
        )}
      >
        {iconLeft}
        {children}
        {iconRight}
      </span>
      {loading && (
        <span className="absolute inset-0 grid place-items-center">
          <Spinner />
        </span>
      )}
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants }
export type { ButtonProps }
