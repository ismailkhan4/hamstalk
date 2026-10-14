import Link from "next/link"

import { Logo } from "@/components/brand/logo"
import { Avatar } from "@/components/learning/avatar"

type Greeting = { de: string; en: string }

const greetings = {
  signup: { de: "Schön, dass du da bist.", en: "Good to have you here." },
  signin: { de: "Willkommen zurück.", en: "Welcome back." },
  recover: {
    de: "Kein Problem.",
    en: "No problem. It happens to everyone. Let’s get you back to your team.",
  },
  verify: {
    de: "Fast geschafft.",
    en: "Almost there. One click in your inbox and your desk is ready.",
  },
} satisfies Record<string, Greeting>

type AuthShellProps = {
  variant: keyof typeof greetings
  /** Replaces the default English line under the greeting on wide screens. */
  panelText?: string
  /** Extra panel content under the greeting, such as the live team badge on sign-up. */
  panelExtra?: React.ReactNode
  children: React.ReactNode
}

function Node({ className }: { className?: string }) {
  return (
    <i
      aria-hidden="true"
      className={`absolute block size-3.5 rounded-full bg-spark shadow-[0_0_0_5px_color-mix(in_srgb,var(--spark)_22%,transparent)] ${className ?? ""}`}
    />
  )
}

export function AuthShell({
  variant,
  panelText,
  panelExtra,
  children,
}: AuthShellProps) {
  const greeting = greetings[variant]

  return (
    <div className="grid min-h-svh grid-cols-1 bg-background lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <aside className="relative hidden flex-col justify-between gap-10 overflow-hidden bg-deep py-9 pr-12 pl-[72px] text-deep-foreground lg:flex">
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-8 w-0.5 bg-deep-line"
        />
        <Link
          href="/"
          aria-label="Klarlingo home"
          className="w-fit [&_span]:text-deep-foreground"
        >
          <Logo symbolClassName="size-[30px]" />
        </Link>
        <div className="flex flex-col gap-10">
          <div className="relative">
            <Node className="top-[0.55em] -left-[46px] text-[clamp(36px,3.2vw,46px)]" />
            <p
              lang="de"
              className="font-voice text-[clamp(36px,3.2vw,46px)] leading-[1.12] tracking-[-0.012em] text-balance"
            >
              {greeting.de}
            </p>
            <p className="mt-3 max-w-[40ch] text-base text-deep-muted">
              {panelText ?? greeting.en}
            </p>
          </div>
          {variant === "signin" && (
            <p className="flex items-center gap-3 text-sm text-deep-muted">
              <span className="flex [&>*]:shadow-[0_0_0_2px_var(--deep)] [&>*+*]:-ml-2">
                <Avatar person="lf" initials="LF" size="sm" />
                <Avatar person="jk" initials="JK" size="sm" />
                <Avatar person="ao" initials="AÖ" size="sm" />
              </span>
              Lena, Jonas and Aylin
            </p>
          )}
          {panelExtra}
        </div>
        <p className="max-w-[40ch] text-[13.5px] leading-normal text-deep-muted">
          Kaffeesatz GmbH and its team are fictional. The German you learn there
          is real.
        </p>
      </aside>

      <main
        id="main"
        className="flex min-w-0 flex-col px-[clamp(20px,4vw,48px)] pt-5 pb-7"
      >
        <div className="flex min-h-12 items-center lg:hidden">
          <Link href="/" aria-label="Klarlingo home">
            <Logo symbolClassName="size-[30px]" />
          </Link>
        </div>
        <div className="relative mt-3 hidden overflow-hidden rounded-xl bg-deep py-5 pr-6 pl-[52px] text-deep-foreground sm:block lg:hidden">
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-6 w-0.5 bg-deep-line"
          />
          <Node className="top-[1.65rem] left-[19px] size-3" />
          <p lang="de" className="font-voice text-2xl leading-tight">
            {greeting.de}
          </p>
          <span className="mt-1 block text-[14.5px] text-deep-muted">
            {greeting.en.split(".")[0]}.
          </span>
        </div>
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-[440px]">{children}</div>
        </div>
      </main>
    </div>
  )
}
