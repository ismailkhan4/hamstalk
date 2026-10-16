import { notFound } from "next/navigation"

import { AppShell } from "@/components/layout/app-shell"
import { Lanyard } from "@/features/economy/components/lanyard"
import { ShopView } from "@/features/economy/components/shop-view"
import { TodayPlan } from "@/features/economy/components/today-plan"
import { EconomyProvider } from "@/features/economy/economy-context"
import { devPreviewsEnabled } from "@/lib/dev-preview"

import { sampleEconomy } from "../sample-economy"

type Props = { searchParams: Promise<{ stash?: string }> }

async function fakeBuy() {
  "use server"
  return { ok: true as const }
}

/**
 * Development only: the shop, today's plan and the lanyard for a sample stash.
 * `?stash=fresh|busy|low|empty`. Buying always succeeds and changes nothing.
 */
export default async function DevShopPage({ searchParams }: Props) {
  if (!devPreviewsEnabled) notFound()
  const economy = sampleEconomy((await searchParams).stash)
  return (
    <EconomyProvider economy={economy}>
      <AppShell name="Sam Haddad" email="sam@example.com">
        <ShopView economy={economy} buy={fakeBuy} />
        <div className="mx-auto flex max-w-(--reading-max) flex-col gap-6 px-4 pb-12 sm:px-6">
          <TodayPlan economy={economy} />
          <Lanyard pins={economy.pins} />
        </div>
      </AppShell>
    </EconomyProvider>
  )
}
