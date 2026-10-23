import Link from "next/link"

import { Logo } from "@/components/brand/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { buttonVariants } from "@/components/ui/button-variants"
import { cn } from "@/lib/utils"

import type { LandingProps } from "./landing-page"
import { LanguageSwitcher } from "./language-switcher"

export function LandingHeader({ copy, story, locale, cta }: LandingProps) {
  return (
    <header className="sticky top-0 z-(--z-header) border-b-2 border-border-subtle bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-17 max-w-280 items-center gap-1 px-4 sm:gap-2 sm:px-6">
        <a href="#top" aria-label={copy.nav.home} className="mr-auto">
          <Logo symbolClassName="size-[30px]" />
        </a>
        <LanguageSwitcher
          locale={locale}
          course={story.course}
          label={copy.nav.language}
        />
        {/* The smallest phones have room for language or theme, and language matters more. */}
        <ThemeToggle
          className="max-[359px]:hidden"
          labels={{
            toLight: copy.nav.themeToLight,
            toDark: copy.nav.themeToDark,
          }}
        />
        <Link
          href="/signin"
          className={cn(
            buttonVariants({ variant: "ghost", size: "md" }),
            "px-3 sm:px-4"
          )}
        >
          {copy.cta.signIn}
        </Link>
        <Link
          href={cta.href}
          className={cn(
            buttonVariants({ size: "md" }),
            "hidden lg:inline-flex"
          )}
        >
          {cta.label}
        </Link>
      </div>
    </header>
  )
}
