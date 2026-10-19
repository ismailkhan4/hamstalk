import { Flame, Lock, TramFront, Zap } from "lucide-react"

import { TARGET_LANG } from "@/content/courses"
import { initialsFor } from "@/components/learning/team-badge"
import { Lanyard } from "@/features/economy/components/lanyard"

import type { ProfileInput, ProfileSaveResult } from "../actions"
import { divisionName, type Profile } from "../model"
import { DivisionCrest } from "./division-crest"
import { ProfileForm } from "./profile-form"

const joined = (iso: string) =>
  new Date(iso).toLocaleDateString("en", { month: "long", year: "numeric" })

/**
 * A learner's public page: name, division, streak, XP and pins. Your own adds the edit form.
 * `actions` sit under the name (Follow, Share) and `friends` below the pins, when friends are on.
 */
export function ProfileView({
  profile,
  save,
  actions,
  friends,
  allowNudges = null,
}: {
  profile: Profile
  save?: (input: ProfileInput) => Promise<ProfileSaveResult>
  actions?: React.ReactNode
  friends?: React.ReactNode
  /** Null hides the nudges setting (before friends.sql). */
  allowNudges?: boolean | null
}) {
  const stats = [
    {
      label: "Day streak",
      value: profile.streak,
      icon: Flame,
      tone: "text-spark-text",
    },
    {
      label: "Longest streak",
      value: profile.longestStreak,
      icon: Flame,
      tone: "text-muted-foreground",
    },
    { label: "XP", value: profile.xp, icon: Zap, tone: "text-reward-text" },
    {
      label: "Lessons",
      value: profile.lessons,
      icon: TramFront,
      tone: "text-primary-text",
    },
  ]

  return (
    <main
      id="main"
      className="mx-auto flex max-w-(--reading-max) flex-col gap-6 px-4 py-8 sm:px-6"
    >
      <header className="flex flex-wrap items-center gap-4">
        <span
          aria-hidden="true"
          className="grid size-20 place-items-center rounded-full bg-(--person-me) font-display text-2xl font-semibold text-(--person-me-foreground)"
        >
          {initialsFor(profile.displayName)}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-h1 leading-tight font-semibold">
            {profile.displayName}
          </h1>
          <p className="font-semibold text-muted-foreground">
            @{profile.handle} · learning since {joined(profile.joinedAt)}
          </p>
          {actions && (
            <div className="mt-3 flex flex-wrap items-start gap-2">
              {actions}
            </div>
          )}
          {profile.me && !profile.isPublic && (
            <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-bold text-secondary-text">
              <Lock aria-hidden="true" className="size-4" />
              Only you can see this page
            </p>
          )}
        </div>
        <span className="flex items-center gap-2 rounded-2xl bg-background-subtle px-3 py-2">
          <DivisionCrest division={profile.division} size={32} />
          <span lang={TARGET_LANG} className="font-extrabold">
            {divisionName(profile.division)}
          </span>
        </span>
      </header>

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, tone }) => (
          <div
            key={label}
            className="rounded-2xl border-2 border-border bg-card p-4"
          >
            <dt className="flex items-center gap-1.5 text-sm font-bold text-muted-foreground">
              <Icon aria-hidden="true" className={`size-4 ${tone}`} />
              {label}
            </dt>
            <dd className="mt-1 font-display text-2xl font-semibold tabular-nums">
              {value.toLocaleString("en")}
            </dd>
          </div>
        ))}
      </dl>

      <Lanyard pins={profile.pins} />

      {friends}

      {profile.me && save && (
        <ProfileForm
          displayName={profile.displayName}
          isPublic={profile.isPublic}
          allowNudges={allowNudges}
          save={save}
        />
      )}
    </main>
  )
}
