"use client"

import { Menu } from "@base-ui/react/menu"
import { Check, ChevronDown, Languages } from "lucide-react"

import {
  COURSE_COOKIE,
  landingPath,
  LOCALE_COOKIE,
  LOCALE_NAMES,
  LOCALES,
  type Course,
  type Locale,
} from "@/lib/i18n"

const ONE_YEAR = 60 * 60 * 24 * 365

const itemClass =
  "flex min-h-11 cursor-pointer items-center gap-3 rounded-md px-3 text-[0.9375rem] font-bold outline-none data-highlighted:bg-accent"

/** Remembers the choice and the course on screen, so `/` opens the same page next time. */
function remember(locale: Locale, course: Course) {
  const options = `path=/; max-age=${ONE_YEAR}; samesite=lax`
  document.cookie = `${LOCALE_COOKIE}=${locale}; ${options}`
  document.cookie = `${COURSE_COOKIE}=${course}; ${options}`
}

/**
 * Each language in its own words, as plain links to the same course in that language. A full page
 * load, not a client navigation, so the new page arrives with its own <html lang> and metadata.
 */
export function LanguageSwitcher({
  locale,
  course,
  label,
}: {
  locale: Locale
  /** Switching language keeps the course you're looking at. */
  course: Course
  /** "Language", in the page's language. */
  label: string
}) {
  return (
    <Menu.Root>
      <Menu.Trigger
        aria-label={`${label}: ${LOCALE_NAMES[locale]}`}
        className="flex h-11 items-center gap-1.5 rounded-lg px-2 font-bold text-secondary-text transition-colors duration-(--duration-fast) outline-none hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring data-popup-open:bg-accent data-popup-open:text-foreground sm:px-2.5"
      >
        <Languages aria-hidden="true" className="size-5 shrink-0" />
        <span className="hidden sm:inline">{LOCALE_NAMES[locale]}</span>
        <span className="uppercase max-[359px]:hidden sm:hidden">{locale}</span>
        <ChevronDown
          aria-hidden="true"
          className="hidden size-4 shrink-0 sm:block"
        />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner
          align="end"
          sideOffset={8}
          className="z-(--z-dropdown)"
        >
          <Menu.Popup className="min-w-44 rounded-lg border border-border-subtle bg-popover p-1.5 text-popover-foreground shadow-lg transition-[opacity,transform] duration-(--duration-fast) outline-none data-ending-style:opacity-0 data-starting-style:scale-[0.97] data-starting-style:opacity-0">
            {LOCALES.map((code) => (
              <Menu.LinkItem
                key={code}
                href={landingPath(code, course)}
                hrefLang={code}
                lang={code}
                aria-current={code === locale ? "page" : undefined}
                onClick={() => remember(code, course)}
                className={itemClass}
              >
                <span className="flex-1">{LOCALE_NAMES[code]}</span>
                {code === locale && (
                  <Check
                    aria-hidden="true"
                    className="size-4.5 text-primary-text"
                    strokeWidth={3}
                  />
                )}
              </Menu.LinkItem>
            ))}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  )
}
