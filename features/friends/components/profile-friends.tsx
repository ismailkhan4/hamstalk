import Link from "next/link"

import type { Friend, ProfileFriends as Friends } from "../model"
import { InitialsBadge } from "./initials-badge"

/** Who a learner follows and who follows them, on their profile page. */
export function ProfileFriends({ friends }: { friends: Friends }) {
  return (
    <section
      aria-label="Friends"
      className="grid gap-4 rounded-3xl border-2 border-border bg-card p-5 sm:grid-cols-2"
    >
      <FriendList
        title="Following"
        count={friends.followingCount}
        people={friends.following}
        empty="Not following anyone yet."
      />
      <FriendList
        title="Followers"
        count={friends.followersCount}
        people={friends.followers}
        empty="No followers yet."
      />
    </section>
  )
}

function FriendList({
  title,
  count,
  people,
  empty,
}: {
  title: string
  count: number
  people: Friend[]
  empty: string
}) {
  return (
    <div>
      <h2 className="font-display text-lg font-semibold">
        {title}{" "}
        <span className="text-muted-foreground tabular-nums">{count}</span>
      </h2>
      {people.length === 0 ? (
        <p className="mt-2 text-sm font-semibold text-muted-foreground">
          {empty}
        </p>
      ) : (
        <ul className="mt-2 flex flex-col gap-1">
          {people.map((person) => (
            <li key={person.handle}>
              <Link
                href={`/u/${person.handle}`}
                className="-mx-2 flex min-h-11 items-center gap-2.5 rounded-xl px-2 hover:bg-background-subtle"
              >
                <InitialsBadge name={person.displayName} me={person.me} />
                <span className="min-w-0 flex-1 truncate font-bold">
                  {person.displayName}
                  {person.me && (
                    <span className="ml-1.5 text-sm font-semibold text-muted-foreground">
                      (you)
                    </span>
                  )}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
