"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

import type { NavItem } from "./nav-items"

export function useIsActive(href: string) {
  const pathname = usePathname()
  return pathname === href || pathname.startsWith(`${href}/`)
}

type CountProps = { item: NavItem; count: number | undefined }

function countLabel(count: number | undefined) {
  return count && count > 0 ? String(count) : null
}

export function SidebarLink({ item, count }: CountProps) {
  const active = useIsActive(item.href)
  const shown = countLabel(count)
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
      <span className="flex-1">{item.label}</span>
      {shown && (
        <span className="text-xs font-semibold text-muted-foreground tabular-nums">
          <span className="sr-only">, </span>
          {shown}
          <span className="sr-only">
            {" "}
            {item.count === "due" ? "due" : "saved"}
          </span>
        </span>
      )}
    </Link>
  )
}

export function BottomNavLink({ item, count }: CountProps) {
  const active = useIsActive(item.href)
  const shown = countLabel(count)
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className="flex min-h-14 flex-col items-center justify-center gap-1 text-[11px] font-semibold text-muted-foreground aria-[current=page]:text-foreground"
    >
      <span
        className={cn(
          "relative grid h-7 w-14 place-items-center rounded-full",
          active && "bg-primary-subtle text-primary-text"
        )}
      >
        <span className="[&>svg]:size-5">{item.icon}</span>
        {shown && (
          <span className="absolute top-0 right-2 min-w-4 rounded-full bg-spark px-1 text-[10px] leading-4 text-primary-foreground dark:text-background">
            {shown}
          </span>
        )}
      </span>
      {item.shortLabel}
      {shown && <span className="sr-only">, {shown}</span>}
    </Link>
  )
}
