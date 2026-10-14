"use client"

import { Menu } from "@base-ui/react/menu"
import { ChevronUp, ListChecks, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"

import { Avatar } from "@/components/learning/avatar"
import { signOutAction } from "@/features/auth/actions"
import { cn } from "@/lib/utils"

type ProfileMenuProps = {
  name: string
  email: string
  initials: string
  compact?: boolean
}

const itemClass =
  "flex min-h-11 cursor-pointer items-center gap-3 rounded-md px-3 text-[15px] outline-none data-highlighted:bg-accent"

export function ProfileMenu({
  name,
  email,
  initials,
  compact = false,
}: ProfileMenuProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  return (
    <Menu.Root>
      <Menu.Trigger
        aria-label={compact ? `Profile menu for ${name}` : undefined}
        className={cn(
          "flex items-center gap-3 rounded-lg text-left outline-none hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          compact ? "p-1" : "w-full p-2"
        )}
      >
        <Avatar person="me" initials={initials} size={compact ? "md" : "md"} />
        {!compact && (
          <>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold">
                {name}
              </span>
              <span className="block truncate text-xs text-muted-foreground">
                Profile and plan
              </span>
            </span>
            <ChevronUp
              aria-hidden="true"
              className="size-4 text-muted-foreground"
            />
          </>
        )}
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner
          side={compact ? "bottom" : "top"}
          align={compact ? "end" : "start"}
          sideOffset={8}
          className="z-(--z-dropdown)"
        >
          <Menu.Popup className="min-w-60 rounded-lg border border-border-subtle bg-popover p-1.5 text-popover-foreground shadow-lg transition-[opacity,transform] duration-(--duration-fast) outline-none data-ending-style:opacity-0 data-starting-style:scale-[0.97] data-starting-style:opacity-0">
            <div className="px-3 py-2">
              <p className="truncate text-sm font-semibold">{name}</p>
              <p className="truncate text-xs text-muted-foreground">{email}</p>
            </div>
            <Menu.Separator className="my-1 h-px bg-border-subtle" />
            <Menu.Item
              className={itemClass}
              onClick={() => router.push("/onboarding/plan")}
            >
              <ListChecks
                aria-hidden="true"
                className="size-[18px] text-muted-foreground"
              />
              Your plan and goals
            </Menu.Item>
            <Menu.Item
              className={itemClass}
              disabled={pending}
              onClick={() => startTransition(() => signOutAction())}
            >
              <LogOut
                aria-hidden="true"
                className="size-[18px] text-muted-foreground"
              />
              {pending ? "Signing out…" : "Sign out"}
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  )
}
