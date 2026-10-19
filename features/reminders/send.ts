import "server-only"

import webpush from "web-push"

export type PushTarget = { endpoint: string; p256dh: string; auth: string }
export type PushMessage = {
  title: string
  body: string
  url: string
  tag: string
}

/** Whether VAPID keys are set, so push can be sent at all. */
export function pushConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY
  )
}

let vapidSet = false
function setVapid() {
  if (vapidSet) return
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || "mailto:hello@hamstalk.com",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  )
  vapidSet = true
}

/**
 * Sends one push. "gone" means the browser dropped the subscription (the learner turned
 * notifications off or reset the browser), so it should be deleted.
 */
export async function sendPush(
  target: PushTarget,
  message: PushMessage
): Promise<"sent" | "gone" | "failed"> {
  setVapid()
  try {
    await webpush.sendNotification(
      {
        endpoint: target.endpoint,
        keys: { p256dh: target.p256dh, auth: target.auth },
      },
      JSON.stringify(message),
      { TTL: 4 * 60 * 60, urgency: "normal", topic: message.tag }
    )
    return "sent"
  } catch (error) {
    const status = (error as { statusCode?: number }).statusCode
    return status === 404 || status === 410 ? "gone" : "failed"
  }
}

/** Whether email can be sent: a Resend key and a sender on a verified domain. */
export function emailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.REMINDER_FROM_EMAIL)
}

const escape = (text: string) =>
  text.replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ]!
  )

/** Sends a reminder email through Resend's API. */
export async function sendEmail(
  to: string,
  message: PushMessage,
  settingsUrl: string
): Promise<boolean> {
  const html = `<!doctype html><html><body style="margin:0;background:#f6f8f4;font-family:system-ui,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" style="max-width:480px;background:#ffffff;border-radius:20px;padding:28px">
<tr><td>
<p style="margin:0 0 4px;font-size:22px;font-weight:700;color:#1d2b33">${escape(message.title)}</p>
<p style="margin:0 0 20px;font-size:16px;color:#4a5a54">${escape(message.body)}</p>
<a href="${escape(message.url)}" style="display:inline-block;background:#14b8a6;color:#042f2c;font-weight:700;text-decoration:none;padding:12px 22px;border-radius:12px">Open Hamstalk</a>
<p style="margin:24px 0 0;font-size:13px;color:#7a8a84">You get this because reminders are on. <a href="${escape(settingsUrl)}" style="color:#7a8a84">Change reminders</a></p>
</td></tr></table></td></tr></table></body></html>`
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.REMINDER_FROM_EMAIL,
        to,
        subject: message.title,
        html,
        text: `${message.body}\n\n${message.url}\n\nChange reminders: ${settingsUrl}`,
        headers: { "List-Unsubscribe": `<${settingsUrl}>` },
      }),
    })
    return response.ok
  } catch {
    return false
  }
}
