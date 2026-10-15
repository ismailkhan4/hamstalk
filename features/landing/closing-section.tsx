import { CalendarDays, MapPin, UserRound } from "lucide-react"
import Link from "next/link"

import { Avatar } from "@/components/learning/avatar"
import { buttonVariants } from "@/components/ui/button-variants"
import { Mascot } from "@/features/celebrations/mascot"

import { cta, hero, invite } from "./content"

/** The last push is a calendar invite to your first standup. Accepting it signs you up. */
export function ClosingSection() {
  return (
    <section
      aria-labelledby="invite-title"
      className="border-t-2 border-border-subtle bg-background-subtle py-16 md:py-24"
    >
      <div className="mx-auto flex max-w-280 flex-col items-center px-4 text-center sm:px-6">
        <h2
          id="invite-title"
          className="font-display text-[clamp(2.25rem,5.5vw,4rem)] leading-[1.05] font-semibold"
        >
          {invite.heading}
        </h2>
        <div className="relative mt-10 w-full max-w-105">
          <div className="absolute -top-11 -right-3 z-10 motion-safe:animate-float">
            <Mascot mood="happy" size={84} />
          </div>
          <div className="overflow-hidden rounded-3xl border-2 border-border bg-card text-left shadow-[0_6px_0_var(--border)]">
            <p className="bg-info px-5 py-2.5 text-sm font-extrabold tracking-wide text-info-foreground uppercase">
              Invitation
            </p>
            <div className="p-5">
              <p className="font-display text-2xl font-semibold">
                {invite.event}
              </p>
              <ul className="mt-3 flex flex-col gap-2 font-semibold text-secondary-text">
                <li className="flex items-center gap-2.5">
                  <CalendarDays
                    aria-hidden="true"
                    className="size-5 shrink-0"
                  />
                  {invite.when}
                </li>
                <li className="flex items-center gap-2.5">
                  <MapPin aria-hidden="true" className="size-5 shrink-0" />
                  <span lang="de">{invite.where}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <UserRound aria-hidden="true" className="size-5 shrink-0" />
                  Organiser: {invite.organiser}
                  <Avatar person="lf" initials="LF" size="sm" />
                </li>
              </ul>
              <p className="mt-4 rounded-2xl bg-background-subtle px-4 py-3 font-semibold">
                {invite.note}
              </p>
              <Link
                href="/signup"
                className={`${buttonVariants({ size: "lg", fullWidth: true })} mt-5`}
              >
                {invite.accept}
              </Link>
            </div>
          </div>
        </div>
        <p className="mt-6 font-semibold text-muted-foreground">
          {hero.signInPrompt}{" "}
          <Link
            href="/signin"
            className="font-extrabold text-primary-text underline decoration-2 underline-offset-4"
          >
            {cta.signIn}
          </Link>
        </p>
      </div>
    </section>
  )
}
