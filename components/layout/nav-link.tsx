"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

import type { NavItem } from "./nav-items"

export function useIsActive(href: string) {
  const pathname = usePathname()
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function SidebarLink({ item }: { item: NavItem }) {
  const active = useIsActive(item.href)
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative flex min-h-11 items-center gap-3 rounded-lg px-3 text-[15px] font-medium text-secondary-text hover:bg-accent hover:text-foreground",
        active &&
          "bg-card font-semibold text-foreground shadow-sm before:absolute before:top-2 before:bottom-2 before:-left-4 before:w-1 before:rounded-r-full before:bg-spark"
      )}
    >
      <span className="[&>svg]:size-[18px]">{item.icon}</span>
      {item.label}
    </Link>
  )
}

export function BottomNavLink({ item }: { item: NavItem }) {
  const active = useIsActive(item.href)
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className="flex min-h-14 flex-col items-center justify-center gap-1 text-[11px] font-semibold text-muted-foreground aria-[current=page]:text-foreground"
    >
      <span
        className={cn(
          "grid h-7 w-14 place-items-center rounded-full",
          active && "bg-primary-subtle text-primary-text"
        )}
      >
        <span className="[&>svg]:size-5">{item.icon}</span>
      </span>
      {item.shortLabel}
    </Link>
  )
}
