import {
  BookMarked,
  ChartNoAxesColumn,
  House,
  NotebookPen,
  Route,
  Target,
  Trophy,
  Users,
} from "lucide-react"

import type { NotebookCounts } from "@/features/review/data"

export type NavItem = {
  href: string
  /** Other places that belong to this destination, so it stays highlighted there. */
  also?: string[]
  label: string
  shortLabel: string
  icon: React.ReactElement
  /** Which count, if any, is shown beside the label. */
  count?: keyof NotebookCounts
}

/**
 * Only destinations that exist are listed, so navigation never leads to an empty page.
 * The phone bar shows only these main destinations; notes are reached from Practice. Icons are elements, because Server
 * Components cannot pass component functions to client components.
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
    href: "/practice",
    also: ["/review"],
    label: "Practice",
    shortLabel: "Practice",
    icon: <Target aria-hidden="true" />,
    count: "due",
  },
  {
    href: "/league",
    also: ["/u"],
    label: "League",
    shortLabel: "League",
    icon: <Trophy aria-hidden="true" />,
  },
  {
    href: "/team",
    label: "Team",
    shortLabel: "Team",
    icon: <Users aria-hidden="true" />,
  },
  {
    href: "/progress",
    label: "Progress",
    shortLabel: "Progress",
    icon: <ChartNoAxesColumn aria-hidden="true" />,
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
