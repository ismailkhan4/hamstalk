import { faqs } from "./content"
import styles from "./landing.module.css"

export function FaqSection() {
  return (
    <section className={styles.sec} id="faq" aria-labelledby="faq-title">
      <div className={`${styles.wrap} ${styles["faq-grid"]}`}>
        <h2 className={styles.h2} id="faq-title">
          Questions, answered honestly.
        </h2>
        <div className={styles.faq}>
          {faqs.map((item) => (
            <details key={item.q}>
              <summary>
                {item.q}
                <span className={styles.pm} aria-hidden="true" />
              </summary>
              <p className={styles.a}>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}