import Link from "next/link"

import { buttonVariants } from "@/components/ui/button-variants"
import { cn } from "@/lib/utils"

import styles from "./landing.module.css"

export function ClosingSection() {
  return (
    <section className={styles.close} aria-labelledby="close-title">
      <div className={styles.wrap}>
        <div className={styles["close-in"]}>
          <span className={styles.rail} aria-hidden="true" />
          <h2 id="close-title">
            <span className={styles.lead}>Your next chapter starts with</span>
            <span className={cn(styles.gm, styles.de)} lang="de">
              <i className={cn(styles.node, styles.you)} aria-hidden="true" />
              Guten Morgen.
            </span>
          </h2>
          <p className={styles.lede}>
            Build your German one conversation, one mission and one day at a
            time. Unit 1 starts with your very first Hallo.
          </p>
          <div className={styles.ctas}>
            <Link
              href="/signup"
              className={cn(
                buttonVariants({ size: "xl" }),
                "h-auto min-h-14 max-w-full shrink py-3 text-center whitespace-normal"
              )}
            >
              Get started
            </Link>
            <a className={styles.tlink} href="#how">
              See how it works
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
