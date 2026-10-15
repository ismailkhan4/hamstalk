import { Suspense } from "react"

import { LearnerBeaconSlot } from "@/features/learner/learner-beacon-slot"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Suspense fallback={null}>
        <LearnerBeaconSlot />
      </Suspense>
    </>
  )
}
