import type { Metadata, Viewport } from "next"
import {
  Bricolage_Grotesque,
  Figtree,
  JetBrains_Mono,
  Source_Serif_4,
} from "next/font/google"

import "./globals.css"
import { OfflineBanner } from "@/components/pwa/offline-banner"
import { ServiceWorkerRegister } from "@/components/pwa/service-worker-register"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

const display = Bricolage_Grotesque({
  subsets: ["latin", "latin-ext"],
  axes: ["opsz"],
  variable: "--font-bricolage",
  display: "swap",
})

const sans = Figtree({
  subsets: ["latin", "latin-ext"],
  variable: "--font-figtree",
  display: "swap",
})

const voice = Source_Serif_4({
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  variable: "--font-source-serif",
  display: "swap",
})

const mono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jetbrains",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Klarlingo · Learn German. Join the team.",
    template: "%s · Klarlingo",
  },
  description:
    "An open-source German course for software engineers joining a German-speaking team.",
  applicationName: "Klarlingo",
  icons: { apple: "/icons/apple-touch-icon.png" },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f4ee" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0d0f" },
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
      className={cn(
        display.variable,
        sans.variable,
        voice.variable,
        mono.variable
      )}
    >
      <body>
        <ThemeProvider>
          <OfflineBanner />
          {children}
        </ThemeProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  )
}
