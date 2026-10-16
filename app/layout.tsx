import type { Metadata, Viewport } from "next"
import { Fredoka, JetBrains_Mono, Nunito } from "next/font/google"

import "./globals.css"
import { AppearanceSync } from "@/components/appearance-sync"
import { OfflineBanner } from "@/components/pwa/offline-banner"
import { ServiceWorkerRegister } from "@/components/pwa/service-worker-register"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

/** Headings, numbers and celebrations: round and bouncy. */
const display = Fredoka({
  subsets: ["latin", "latin-ext"],
  variable: "--font-fredoka",
  display: "swap",
})

/** Everything else, English and German alike: a friendly rounded sans. */
const sans = Nunito({
  subsets: ["latin", "latin-ext"],
  variable: "--font-nunito",
  display: "swap",
})

const mono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jetbrains",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Hamstalk · Learn German. Join the team.",
    template: "%s · Hamstalk",
  },
  description:
    "The German course for software engineers joining a German-speaking team.",
  applicationName: "Hamstalk",
  icons: { apple: "/icons/apple-touch-icon.png" },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#111d22" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(display.variable, sans.variable, mono.variable)}
    >
      <body>
        <ThemeProvider>
          <OfflineBanner />
          {children}
        </ThemeProvider>
        <ServiceWorkerRegister />
        <AppearanceSync />
      </body>
    </html>
  )
}
