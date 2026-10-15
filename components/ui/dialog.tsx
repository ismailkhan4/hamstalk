"use client"

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"

import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogClose = DialogPrimitive.Close

type DialogContentProps = DialogPrimitive.Popup.Props & {
  size?: "sm" | "md" | "lg"
}

/** Centred dialog on wide screens; a bottom sheet below 640 px, as on the layout board. */
function DialogContent({
  className,
  size = "md",
  children,
  ...props
}: DialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Backdrop className="fixed inset-0 z-(--z-overlay) bg-backdrop transition-opacity duration-(--duration-base) data-ending-style:opacity-0 data-starting-style:opacity-0" />
      <DialogPrimitive.Popup
        className={cn(
          "fixed z-(--z-modal) bg-popover text-popover-foreground shadow-xl transition-[opacity,transform] duration-(--duration-base) ease-out outline-none",
          "inset-x-0 bottom-0 max-h-[90svh] overflow-y-auto rounded-t-2xl p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] data-ending-style:translate-y-4 data-ending-style:opacity-0 data-starting-style:translate-y-4 data-starting-style:opacity-0",
          "sm:inset-auto sm:top-1/2 sm:left-1/2 sm:w-[calc(100%-32px)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:p-7 sm:data-ending-style:translate-y-[calc(-50%+8px)] sm:data-starting-style:translate-y-[calc(-50%+8px)]",
          size === "sm" && "sm:max-w-[400px]",
          size === "md" && "sm:max-w-[520px]",
          size === "lg" && "sm:max-w-[680px]",
          "motion-reduce:transition-opacity motion-reduce:data-ending-style:translate-y-0 motion-reduce:data-starting-style:translate-y-0",
          className
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Popup>
    </DialogPrimitive.Portal>
  )
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      className={cn("font-display text-h3 font-bold", className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      className={cn("mt-2 text-body text-secondary-text", className)}
      {...props}
    />
  )
}

function DialogActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogActions,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
}
