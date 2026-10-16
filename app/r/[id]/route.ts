import { NextResponse, type NextRequest } from "next/server"
import { z } from "zod"

import { safeNextPath } from "@/lib/auth/routes"
import { createClient } from "@/lib/supabase/server"

/**
 * The link inside every reminder: records that it was opened (for the learner it was sent to) and
 * goes on to the page it points at. Only in-app paths are allowed as the destination.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const to = safeNextPath(request.nextUrl.searchParams.get("to"), "/home")
  if (z.uuid().safeParse(id).success) {
    const supabase = await createClient()
    await supabase.rpc("reminder_opened", { p_id: id })
  }
  return NextResponse.redirect(new URL(to, request.url))
}
