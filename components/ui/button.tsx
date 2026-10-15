"use client"

"use client"

import { Button as ButtonPrimitive } from "@base-ui/react/button"
import type { VariantProps } from "class-variance-authority"

import { buttonVariants } from "@/components/ui/button-variants"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

type ButtonProps = Omit<ButtonPrimitive.Props, "className"> &
  Omit<VariantProps<typeof buttonVariants>, "iconOnly"> & {
    className?: string
    /** A rendered icon element, so Server Components can pass it across the client boundary. */
    iconLeft?: React.ReactElement
    iconRight?: React.ReactElement
    /** Shows a spinner, keeps the button's width and accessible name, and blocks presses. */
    loading?: boolean
    loadingText?: string
  }

function Button({
  className,
  variant,
  size,
  fullWidth,
  iconLeft,
  iconRight,
  loading = false,
  loadingText,
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
      {loading && loadingText ? (
        <span className="inline-flex items-center justify-center gap-[inherit]">
          <Spinner />
          {loadingText}
        </span>
      ) : (
        <>
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
        </>
      )}
    </ButtonPrimitive>
  )
}

export { Button }
export type { ButtonProps }
