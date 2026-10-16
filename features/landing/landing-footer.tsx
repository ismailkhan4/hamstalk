import Link from "next/link"

import { Logo } from "@/components/brand/logo"

import { footerNote } from "./content"

const links = [
  { href: "#week", label: "Your first week" },
  { href: "#growth", label: "Levels" },
  { href: "#buddy", label: "Hamsti" },
  { href: "#faq", label: "FAQ" },
  { href: "/signin", label: "Sign in" },
]

export function LandingFooter() {
  return (
    <footer className="border-t-2 border-border-subtle">
      <div className="mx-auto flex max-w-280 flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <Logo symbolClassName="size-[26px]" />
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-bold text-secondary-text hover:text-foreground hover:underline hover:underline-offset-4"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <p className="mx-auto max-w-280 px-4 pb-10 text-sm font-semibold text-muted-foreground sm:px-6">
        © 2026 Hamstalk. {footerNote}
      </p>
    </footer>
  )
}
