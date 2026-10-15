import { Mascot } from "@/features/celebrations/mascot"

import { buddy } from "./content"

/** Hamsti, introduced like a colleague: four moods, four lines. */
export function BuddySection() {
  return (
    <section
      id="buddy"
      aria-labelledby="buddy-title"
      className="border-t-2 border-border-subtle bg-reward-subtle py-16 md:py-24"
    >
      <div className="mx-auto max-w-280 px-4 sm:px-6">
        <div className="max-w-2xl">
          <h2
            id="buddy-title"
            className="font-display text-[clamp(2rem,4.6vw,3.25rem)] leading-[1.08] font-semibold text-balance"
          >
            {buddy.title}
          </h2>
          <p className="mt-4 text-lg font-semibold text-secondary-text">
            {buddy.lede.before}
            <i lang="de">{buddy.lede.word}</i>
            {buddy.lede.after}
          </p>
        </div>
        <ul className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {buddy.moods.map((item) => (
            <li
              key={item.mood}
              className="flex flex-col items-center gap-2 rounded-3xl border-2 border-reward-border bg-card p-4 text-center shadow-[0_4px_0_var(--reward-border)]"
            >
              <Mascot mood={item.mood} size={104} />
              <p className="font-extrabold">{item.caption}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
