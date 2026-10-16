import type { Metadata } from "next"

import { PracticeSession } from "@/features/session-generator/components/practice-session"

type Props = { params: Promise<{ unitId: string }> }

export const metadata: Metadata = { title: "Express" }

export default async function ExpressPage({ params }: Props) {
  return <PracticeSession kind="express" unitId={(await params).unitId} />
}
