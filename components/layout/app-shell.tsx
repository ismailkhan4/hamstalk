import Link from "next/link"

import { Logo } from "@/components/brand/logo"
import { initialsFor } from "@/components/learning/team-badge"

import type { NotebookCounts } from "@/features/review/data"

import { allNav, notesNav, primaryNav } from "./nav-items"
import { BottomNavLink, SidebarLink } from "./nav-link"
import { ProfileMenu } from "./profile-menu"

type AppShellProps = {
  name: string
  email: string
  counts?: NotebookCounts
  children: React.ReactNode
}

/** Sidebar from 1024 px; below that a top bar and a bottom nav, as the prototype does (audit C3). */
export function AppShell({ name, email, counts, children }: AppShellProps) {
  const initials = initialsFor(name) || "?"

  return (
    <div className="min-h-svh bg-background lg:grid lg:grid-cols-[var(--sidebar-width)_minmax(0,1fr)]">
      <a
        href="#main"
        className="sr-only z-(--z-toast) rounded-md bg-card px-3 py-2 shadow-lg focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>

      <aside className="sticky top-0 hidden h-svh flex-col border-r border-border-subtle px-4 py-5 lg:flex">
        <Link href="/home" aria-label="Klarlingo home" className="w-fit px-2">
          <Logo symbolClassName="size-[30px]" />
        </Link>
        <nav aria-label="Main" className="mt-8 flex flex-col gap-1">
          {primaryNav.map((item) => (
            <SidebarLink
              key={item.href}
              item={item}
              count={item.count ? counts?.[item.count] : undefined}
            />
          ))}
        </nav>
        <p className="mt-8 px-3 text-xs font-semibold text-muted-foreground">
          Your notes
        </p>
        <nav aria-label="Your notes" className="mt-2 flex flex-col gap-1">
          {notesNav.map((item) => (
            <SidebarLink
              key={item.href}
              item={item}
              count={item.count ? counts?.[item.count] : undefined}
            />
          ))}
        </nav>
        <div className="mt-auto">
          <ProfileMenu name={name} email={email} initials={initials} />
        </div>
      </aside>

      <header className="sticky top-0 z-(--z-header) flex h-14 items-center justify-between border-b border-border-subtle bg-background/95 px-4 backdrop-blur lg:hidden">
        <Link href="/home" aria-label="Klarlingo home">
          <Logo symbolClassName="size-[30px]" />
        </Link>
        <ProfileMenu name={name} email={email} initials={initials} compact />
      </header>

      <div className="min-w-0 pb-[calc(var(--bottom-nav-height)+env(safe-area-inset-bottom))] lg:pb-0">
        {children}
      </div>

      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-(--z-sticky) grid border-t border-border-subtle bg-card pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_-16px_rgb(20_33_28/0.25)] lg:hidden"
        style={{
          gridTemplateColumns: `repeat(${allNav.length}, minmax(0, 1fr))`,
        }}
      >
        {allNav.map((item) => (
          <BottomNavLink
            key={item.href}
            item={item}
            count={item.count ? counts?.[item.count] : undefined}
          />
        ))}
      </nav>
    </div>
  )
}