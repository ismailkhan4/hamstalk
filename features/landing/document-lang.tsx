"use client"

import { useEffect } from "react"

import { DEFAULT_LOCALE } from "@/lib/i18n"

/**
 * Sets <html lang> for a page in another language than the root layout's. The root layout is
 * shared with the whole app and stays static, so it can't know the page's language: the landing
 * page sets it here, and hands back the app's own language when you navigate away. An inline
 * script in the page does the same before first paint (see LandingPage).
 */
export function DocumentLang({ lang }: { lang: string }) {
  useEffect(() => {
    document.documentElement.lang = lang
    return () => {
      document.documentElement.lang = DEFAULT_LOCALE
    }
  }, [lang])
  return null
}
