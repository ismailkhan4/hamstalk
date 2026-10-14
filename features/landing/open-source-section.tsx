import { Info } from "lucide-react"

import { principles } from "./content"
import styles from "./landing.module.css"

export function OpenSourceSection() {
  return (
    <section className={styles.sec} id="open-source" aria-labelledby="os-title">
      <div className={`${styles.wrap} ${styles.os}`}>
        <div>
          <h2 className={styles.h2} id="os-title">
            Built for learners. Open to everyone.
          </h2>
          <p className={`${styles.lede} mt-5`}>
            Klarlingo is being built in the open as a free-first project that
            one developer or a small community can maintain. These are the
            commitments it is designed around.
          </p>
          <p className={styles.repo}>
            <Info aria-hidden="true" className={styles.icon} />
            The code is released under the MIT License. The repository and
            contribution guide will be linked here once they are public.
          </p>
        </div>
        <dl className={styles.principles}>
          {principles.map(([title, text]) => (
            <div key={title}>
              <dt>{title}</dt>
              <dd>{text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
