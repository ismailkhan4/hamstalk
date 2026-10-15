import { Plus } from "lucide-react"

import { faq } from "./content"

export function FaqSection() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="border-t-2 border-border-subtle py-16 md:py-24"
    >
      <div className="mx-auto grid max-w-280 grid-cols-1 gap-10 px-4 sm:px-6 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
        <h2
          id="faq-title"
          className="font-display text-[clamp(2rem,4.6vw,3.25rem)] leading-[1.08] font-semibold text-balance"
        >
          {faq.title}
        </h2>
        <div className="flex flex-col gap-3">
          {faq.items.map((item) => (
            <details
              key={item.q}
              className="group rounded-2xl border-2 border-border bg-card shadow-[0_4px_0_var(--border)]"
            >
              <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-4 text-lg font-extrabold [&::-webkit-details-marker]:hidden">
                <span className="flex-1">{item.q}</span>
                <Plus
                  aria-hidden="true"
                  className="size-5 shrink-0 text-muted-foreground transition-transform duration-(--duration-base) group-open:rotate-45"
                  strokeWidth={3}
                />
              </summary>
              <p className="px-5 pb-5 font-semibold text-secondary-text">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
