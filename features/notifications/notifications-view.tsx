import { Bell, Flag, Info, Repeat, Route, Users } from "lucide-react"
import Link from "next/link"

import { EmptyState } from "@/components/feedback/empty-state"
import { AppShell } from "@/components/layout/app-shell"
import { buttonVariants } from "@/components/ui/button-variants"
import type { NotebookCounts } from "@/features/review/data"

import type { Notification } from "./items"

const icons = {
  review: <Repeat aria-hidden="true" />,
  lesson: <Route aria-hidden="true" />,
  standup: <Users aria-hidden="true" />,
}

type Props = {
  name: string
  email: string
  counts: NotebookCounts
  items: Notification[]
}

export function NotificationsView({ name, email, counts, items }: Props) {
  return (
    <AppShell name={name} email={email} counts={counts}>
      <main
        id="main"
        className="mx-auto max-w-(--content-max) px-4 py-8 sm:px-6 lg:px-10"
      >
        <h1 className="font-display text-h1 font-bold">Notifications</h1>
        <p className="mt-2 max-w-[62ch] text-body-lg text-secondary-text">
          What is waiting for you right now. Nothing urgent, ever.
        </p>

        {items.length === 0 ? (
          <EmptyState
            icon={Flag}
            title="You’re all caught up"
            className="mx-0 items-start px-0 text-left"
            actions={
              <Link
                href="/home"
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                Back to home
              </Link>
            }
          >
            No words are due and nothing is waiting. New things show up here
            after you finish lessons.
          </EmptyState>
        ) : (
          <ul className="mt-6 max-w-3xl divide-y divide-border-subtle border-y border-border-subtle">
            {items.map((item) => (
              <li key={item.id} className="flex gap-4 py-5">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary-subtle text-primary-text [&_svg]:size-5">
                  {icons[item.kind]}
                </span>
                <div className="min-w-0">
                  <h2 className="font-semibold">{item.title}</h2>
                  <p className="mt-0.5 text-secondary-text">{item.text}</p>
                  <Link
                    href={item.href}
                    className={buttonVariants({
                      variant: "outline",
                      className: "mt-3",
                    })}
                  >
                    {item.action}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-8 flex max-w-3xl gap-2.5 text-sm text-secondary-text">
          <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <span>
            This list is worked out each time you open it. Klarlingo doesn’t
            send reminders, emails or push notifications, so there is nothing to
            mark as read.
          </span>
        </p>
        <p className="mt-3 flex max-w-3xl gap-2.5 text-sm text-muted-foreground">
          <Bell aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <span>
            Your reminder choice in{" "}
            <Link
              href="/settings"
              className="font-semibold text-primary-text underline underline-offset-[3px]"
            >
              settings
            </Link>{" "}
            is saved, but no reminder is sent yet.
          </span>
        </p>
      </main>
    </AppShell>
  )
}
