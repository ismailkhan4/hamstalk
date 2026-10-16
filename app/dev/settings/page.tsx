import { notFound } from "next/navigation"

import { SettingsPreview } from "@/features/settings/settings-preview"
import { devPreviewsEnabled } from "@/lib/dev-preview"

type Props = { searchParams: Promise<{ fail?: string }> }

/** Development only: Settings with stand-in actions, including reminders. `?fail=1` fails saves. */
export default async function DevSettingsPage({ searchParams }: Props) {
  if (!devPreviewsEnabled) notFound()
  return <SettingsPreview fail={(await searchParams).fail === "1"} />
}
