import Link from "next/link"

import { Logo } from "@/components/brand/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { buttonVariants } from "@/components/ui/button-variants"
import { cn } from "@/lib/utils"

import { cta } from "./content"

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-(--z-header) border-b-2 border-border-subtle bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-17 max-w-280 items-center gap-2 px-4 sm:px-6">
        <a href="#top" aria-label="Hamstalk home" className="mr-auto">
          <Logo symbolClassName="size-[30px]" />
        </a>
        <ThemeToggle />
        <Link
          href="/signin"
          className={buttonVariants({ variant: "ghost", size: "md" })}
        >
          {cta.signIn}
        </Link>
        <Link
          href="/signup"
          className={cn(
            buttonVariants({ size: "md" }),
            "hidden sm:inline-flex"
          )}
        >
          {cta.start}
        </Link>
      </div>
    </header>
  )
}
