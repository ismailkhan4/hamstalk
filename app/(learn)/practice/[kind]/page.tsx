import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { PracticeSession } from "@/features/session-generator/components/practice-session"

type Props = { params: Promise<{ kind: string }> }

export const metadata: Metadata = { title: "Practice" }

/** /practice/smart and /practice/mistakes. */
export default async function PracticeSessionPage({ params }: Props) {
  const { kind } = await params
  if (kind !== "smart" && kind !== "mistakes") notFound()
  return <PracticeSession kind={kind} />
}
