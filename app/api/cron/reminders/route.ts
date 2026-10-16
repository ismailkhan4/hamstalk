import { timingSafeEqual } from "node:crypto"

import { NextResponse } from "next/server"

import {
  pickTemplate,
  type ReminderFacts,
  type ReminderKind,
} from "@/features/reminders/templates"
import {
  emailConfigured,
  pushConfigured,
  sendEmail,
  sendPush,
  type PushTarget,
} from "@/features/reminders/send"
import { trackServer } from "@/lib/analytics/server"
import { createAdminClient } from "@/lib/supabase/admin"

export const maxDuration = 60

function authorised(request: Request) {
  const secret = process.env.CRON_SECRET
  const given = request.headers.get("authorization") ?? ""
  const expected = `Bearer ${secret}`
  if (!secret || given.length !== expected.length) return false
  return timingSafeEqual(Buffer.from(given), Buffer.from(expected))
}

/**
 * Sends the reminders that are due. Called every 15 minutes by pg_cron (see the README) with
 * `Authorization: Bearer $CRON_SECRET`. reminders_due() decides who is due; each kind goes to a
 * learner at most once a local day, which the log's unique index enforces even if two runs overlap.
 */
async function run(request: Request) {
  if (!authorised(request))
    return NextResponse.json({ error: "unauthorised" }, { status: 401 })
  const supabase = createAdminClient()
  if (!supabase)
    return NextResponse.json(
      { error: "SUPABASE_SECRET_KEY is not set" },
      { status: 503 }
    )

  const { data: due, error } = await supabase.rpc("reminders_due", {})
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin
  const canPush = pushConfigured()
  const canEmail = emailConfigured()
  const stats = new Map<
    ReminderKind,
    Map<string, { sends: number; wins: number }>
  >()
  async function statsFor(kind: ReminderKind) {
    if (!stats.has(kind)) {
      const { data } = await supabase!.rpc("reminder_template_stats", {
        p_kind: kind,
      })
      stats.set(kind, new Map((data ?? []).map((row) => [row.template, row])))
    }
    return stats.get(kind)!
  }

  // One reminder per learner per run: the streak-saver wins over the daily one, which is logged
  // as skipped so it doesn't follow an hour later.
  const byUser = new Map<string, (typeof due)[number]>()
  const skipped: (typeof due)[number][] = []
  for (const row of due ?? []) {
    const other = byUser.get(row.user_id)
    if (!other) byUser.set(row.user_id, row)
    else if (row.kind === "streak_saver") {
      skipped.push(other)
      byUser.set(row.user_id, row)
    } else skipped.push(row)
  }
  for (const row of skipped)
    await supabase.from("notification_log").insert({
      user_id: row.user_id,
      kind: row.kind,
      channel: "skipped",
      template: "skipped",
      local_date: row.local_date,
    })

  let pushed = 0
  let emailed = 0
  for (const row of byUser.values()) {
    const kind = row.kind as ReminderKind
    const facts: ReminderFacts = {
      firstName: row.full_name.split(/\s+/)[0] ?? "",
      streak: row.streak,
      freezes: row.freezes,
      xpToday: row.xp_today,
      goalXp: row.goal_xp,
      dueWords: row.due_words,
    }
    const template = pickTemplate(kind, facts, await statsFor(kind))
    const copy = template.write(facts)
    const targets =
      (row.subscriptions as unknown as (PushTarget & { id: string })[]) ?? []

    const channels: ("push" | "email")[] = []
    if (canPush && targets.length > 0) channels.push("push")
    if (canEmail && row.email_reminders && row.email) channels.push("email")

    for (const channel of channels) {
      // Log first: the unique index makes this the lock against sending twice.
      const { data: log } = await supabase
        .from("notification_log")
        .insert({
          user_id: row.user_id,
          kind,
          channel,
          template: template.id,
          local_date: row.local_date,
        })
        .select("id")
        .single()
      if (!log) continue
      const url = `${origin}/r/${log.id}?to=${encodeURIComponent(copy.href)}`
      const message = { title: copy.title, body: copy.body, url, tag: kind }

      if (channel === "push") {
        const results = await Promise.all(
          targets.map(async (target) => ({
            target,
            result: await sendPush(target, message),
          }))
        )
        const gone = results.filter((r) => r.result === "gone")
        if (gone.length > 0)
          await supabase
            .from("push_subscriptions")
            .delete()
            .in(
              "id",
              gone.map((r) => r.target.id)
            )
        const sent = results.filter((r) => r.result === "sent")
        if (sent.length > 0) {
          pushed += 1
          await supabase
            .from("push_subscriptions")
            .update({ last_sent_at: new Date().toISOString() })
            .in(
              "id",
              sent.map((r) => r.target.id)
            )
        }
      } else if (await sendEmail(row.email, message, `${origin}/settings`))
        emailed += 1

      trackServer(row.user_id, "reminder_sent", {
        kind,
        channel,
        template: template.id,
      })
    }
  }

  return NextResponse.json({
    due: due?.length ?? 0,
    pushed,
    emailed,
    push: canPush,
    email: canEmail,
  })
}

export const GET = run
export const POST = run
