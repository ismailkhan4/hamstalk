import { Logo } from "@/components/brand/logo"

import styles from "./landing.module.css"

const footerLinks = [
  ["#how", "How it works"],
  ["#team", "The team"],
  ["#journey", "Journey"],
  ["#features", "Features"],
  ["#open-source", "Open source"],
  ["#faq", "FAQ"],
] as const

export function LandingFooter() {
  return (
    <footer className={styles.foot}>
      <div className={`${styles.wrap} ${styles["foot-in"]}`}>
        <div>
          <Logo symbolClassName="size-[26px]" />
          <p className="mt-3.5 max-w-[48ch] text-[0.9375rem] text-secondary-text">
            Learn German. Join the team. An open-source German course for
            software engineers, from A1 towards B2.
          </p>
        </div>
        <nav aria-label="Footer">
          {footerLinks.map(([href, label]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <small>
          © 2026 Klarlingo. Open-source project in early development, released
          under the MIT License. Kaffeesatz GmbH and its team are fictional.
        </small>
      </div>
    </footer>
  )
}
