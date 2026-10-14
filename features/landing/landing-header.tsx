import { Menu, X } from "lucide-react"
import Link from "next/link"

import { Logo } from "@/components/brand/logo"
import { buttonVariants } from "@/components/ui/button-variants"
import { cn } from "@/lib/utils"

import { navLinks } from "./content"
import styles from "./landing.module.css"

export function LandingHeader() {
  return (
    <header className={styles.nav}>
      <div className={cn(styles.wrap, styles["nav-in"])}>
        <a className={styles.brand} href="#top" aria-label="Klarlingo home">
          <Logo symbolClassName="size-[30px]" />
        </a>
        <nav className={styles.links} aria-label="Main">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className={cn(styles.navcta, "flex items-center gap-2")}>
          <Link
            href="/signin"
            className={buttonVariants({ variant: "ghost", size: "md" })}
          >
            Sign in
          </Link>
          <Link href="/signup" className={buttonVariants({ size: "md" })}>
            Get started
          </Link>
        </div>
        <details className={styles.mnav}>
          <summary aria-label="Menu">
            <Menu aria-hidden="true" className={cn(styles.icon, styles.bars)} />
            <X aria-hidden="true" className={cn(styles.icon, styles.x)} />
          </summary>
          <nav className={styles["mnav-panel"]} aria-label="Main, mobile">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
            <Link href="/signin">Sign in</Link>
            <Link
              href="/signup"
              className={cn(buttonVariants({ size: "lg" }), "mt-5")}
            >
              Get started
            </Link>
          </nav>
        </details>
      </div>
    </header>
  )
}
