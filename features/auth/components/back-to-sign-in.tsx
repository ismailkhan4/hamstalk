import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export function BackToSignIn() {
  return (
    <Link
      href="/signin"
      className="mb-6 inline-flex min-h-11 items-center gap-2 rounded-md text-[15px] font-semibold text-secondary-text hover:text-foreground"
    >
      <ArrowLeft aria-hidden="true" className="size-[18px]" />
      Back to sign in
    </Link>
  )
}
