import { BookMarked, House, NotebookPen, Repeat, Route, Users, } from "lucide-react"

import type { NotebookCounts } from "@/features/review/data"

export type NavItem = {
  href: string
  label: string
  shortLabel: string
  icon: React.ReactElement
  count?: keyof NotebookCounts
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
{
    href: "/review",
    label: "Review",
    shortLabel: "Review",
    icon: <Repeat aria-hidden="true" />,
    count: "due",
  },
  {
    href: "/team",
    label: "Team",
    shortLabel: "Team",
    icon: <Users aria-hidden="true" />,
  },
]

export const notesNav: NavItem[] = [
  {
    href: "/phrasebook",
    label: "Phrasebook",
    shortLabel: "Phrases",
    icon: <BookMarked aria-hidden="true" />,
    count: "phrases",
  },
  {
    href: "/mistakes",
    label: "Mistakes",
    shortLabel: "Mistakes",
    icon: <NotebookPen aria-hidden="true" />,
    count: "mistakes",
  },
]

export const allNav = [...primaryNav, ...notesNav]