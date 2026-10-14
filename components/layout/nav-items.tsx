import { House, Route } from "lucide-react"

export type NavItem = {
  href: string
  label: string
  shortLabel: string
  icon: React.ReactElement
}

/**
 * Only destinations that exist are listed, so navigation never leads to an empty page.
 * Practice, Team, Progress, Phrasebook and Mistakes join as their screens ship.
 * Icons are elements, because Server Components cannot pass component functions to client components.
 */
export const primaryNav: NavItem[] = [
  {
    href: "/home",
    label: "Home",
    shortLabel: "Home",
    icon: <House aria-hidden="true" />,
  },
  {
    href: "/path",
    label: "Learning path",
    shortLabel: "Path",
    icon: <Route aria-hidden="true" />,
  },
]
