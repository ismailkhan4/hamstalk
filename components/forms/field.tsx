"use client"

import { CircleAlert, CircleCheck } from "lucide-react"
import { createContext, useContext, useId } from "react"

import { cn } from "@/lib/utils"

type FieldContextValue = {
  controlId: string
  describedBy: string | undefined
  invalid: boolean
  valid: boolean
  required: boolean
}

const FieldContext = createContext<FieldContextValue | null>(null)

/** Props a control inside a Field spreads so its label, help and error are wired up. */
function useFieldControl(ownId?: string) {
  const field = useContext(FieldContext)
  if (!field) return { id: ownId }
  return {
    id: ownId ?? field.controlId,
    "aria-describedby": field.describedBy,
    "aria-invalid": field.invalid || undefined,
    "aria-required": field.required || undefined,
    "data-valid": field.valid || undefined,
  }
}

type FieldProps = {
  label: string
  helper?: React.ReactNode
  error?: string | undefined
  success?: string | undefined
  required?: boolean
  optional?: boolean
  invalid?: boolean
  labelAside?: React.ReactNode
  className?: string
  children: React.ReactNode
}

function Field({
  label,
  helper,
  error,
  success,
  required = false,
  optional = false,
  invalid = false,
  labelAside,
  className,
  children,
}: FieldProps) {
  const baseId = useId()
  const controlId = `${baseId}-control`
  const helperId = helper ? `${baseId}-helper` : undefined
  const messageId = error || success ? `${baseId}-message` : undefined
  const describedBy =
    [messageId, helperId].filter(Boolean).join(" ") || undefined

  return (
    <FieldContext.Provider
      value={{
        controlId,
        describedBy,
        invalid: Boolean(error) || invalid,
        valid: Boolean(success) && !error,
        required,
      }}
    >
      <div data-slot="field" className={cn("flex flex-col gap-1.5", className)}>
        <div className="flex items-baseline justify-between gap-3">
          <label
            htmlFor={controlId}
            className="flex items-baseline gap-1.5 text-sm leading-5 font-semibold"
          >
            {label}
            {required && (
              <span aria-hidden="true" className="text-danger-text">
                *
              </span>
            )}
            {optional && (
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            )}
          </label>
          {labelAside}
        </div>
        {children}
        {error ? (
          <p
            id={messageId}
            className="flex items-start gap-1.5 text-caption text-danger-text"
          >
            <CircleAlert aria-hidden="true" className="mt-px size-4 shrink-0" />
            <span>{error}</span>
          </p>
        ) : success ? (
          <p
            id={messageId}
            className="flex items-start gap-1.5 text-caption text-success-text"
          >
            <CircleCheck aria-hidden="true" className="mt-px size-4 shrink-0" />
            <span>{success}</span>
          </p>
        ) : null}
        {helper && (
          <p id={helperId} className="text-caption text-muted-foreground">
            {helper}
          </p>
        )}
      </div>
    </FieldContext.Provider>
  )
}

export { Field, useFieldControl }
export type { FieldProps }
