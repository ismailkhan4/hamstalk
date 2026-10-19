import { TARGET_LANG } from "@/content/courses"
import { Avatar } from "@/components/learning/avatar"
import { initialsFor } from "@/components/learning/team-badge"

const team = [
  { person: "lf", initials: "LF", name: "Lena Fischer", role: "Team lead" },
  { person: "jk", initials: "JK", name: "Jonas Krüger", role: "Backend" },
  { person: "ao", initials: "AÖ", name: "Aylin Öztürk", role: "Design" },
] as const

const steps = [
  "Your goal",
  "Your starting level",
  "Where you’ll use German",
  "Your daily time",
  "Your first missions",
]

export function WelcomeStep({
  firstName,
  fullName,
}: {
  firstName: string
  fullName: string
}) {
  return (
    <>
      <h1
        lang={TARGET_LANG}
        className="font-voice text-[clamp(44px,5.6vw,72px)] leading-[1.02] tracking-[-0.022em]"
      >
        Willkommen im Team!
      </h1>
      <p className="mt-4 max-w-[56ch] text-body-lg text-secondary-text">
        You’re joining Hamstalk. Let’s set up your German-learning journey so
        your first mission fits your goals.
      </p>
      <ol
        aria-label="Your team at Kaffeesatz GmbH"
        className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4"
      >
        {team.map((member) => (
          <li key={member.name}>
            <Avatar
              person={member.person}
              initials={member.initials}
              size="xl"
            />
            <p className="mt-3 text-[0.9375rem] font-semibold">{member.name}</p>
            <p className="text-sm text-muted-foreground">{member.role}</p>
          </li>
        ))}
        <li>
          <Avatar
            person="me"
            initials={initialsFor(fullName) || "?"}
            size="xl"
            className="shadow-[0_0_0_3px_var(--background),0_0_0_5px_var(--spark)]"
          />
          <p className="mt-3 text-[0.9375rem] font-semibold text-spark-text">
            {firstName} (you)
          </p>
          <p className="text-sm text-muted-foreground">Frontend, from today</p>
        </li>
      </ol>
      <ol className="mt-10 grid gap-4 border-t border-border pt-5 sm:grid-cols-5">
        {steps.map((step, i) => (
          <li key={step} className="text-sm">
            <span className="block text-xs font-semibold text-muted-foreground">
              {i + 1}
            </span>
            <span
              className={
                i === 4
                  ? "font-semibold text-primary-text"
                  : "text-secondary-text"
              }
            >
              {step}
            </span>
          </li>
        ))}
      </ol>
    </>
  )
}
