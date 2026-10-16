"use client"

/** Browser-side web push: whether it works here, and subscribing or unsubscribing this device. */

export type PushSupport =
  /** Works here. */
  | "supported"
  /** iPhone or iPad in Safari: push needs the app on the home screen first. */
  | "needs-install"
  | "unsupported"

export function pushSupport(): PushSupport {
  if (typeof window === "undefined") return "unsupported"
  const ios = /iPad|iPhone|iPod/.test(navigator.userAgent)
  const standalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  if (ios && !standalone) return "needs-install"
  if (
    !("serviceWorker" in navigator) ||
    !("PushManager" in window) ||
    !("Notification" in window)
  )
    return "unsupported"
  return "supported"
}

function keyBytes(base64: string) {
  const padded = (base64 + "=".repeat((4 - (base64.length % 4)) % 4))
    .replace(/-/g, "+")
    .replace(/_/g, "/")
  const raw = atob(padded)
  return Uint8Array.from(raw, (char) => char.charCodeAt(0))
}

async function registration() {
  return (
    (await navigator.serviceWorker.getRegistration("/")) ??
    (await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    }))
  )
}

/** This device's current subscription, if any. */
export async function currentSubscription() {
  if (pushSupport() !== "supported") return null
  const reg = await navigator.serviceWorker.getRegistration("/")
  return (await reg?.pushManager.getSubscription()) ?? null
}

/**
 * Asks for permission and subscribes. Returns the subscription as JSON for the server, or the
 * reason it didn't happen.
 */
export async function subscribe(): Promise<
  | { ok: true; subscription: PushSubscriptionJSON }
  | { ok: false; reason: "denied" | "unsupported" | "no-key" | "failed" }
> {
  if (pushSupport() !== "supported") return { ok: false, reason: "unsupported" }
  const key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  if (!key) return { ok: false, reason: "no-key" }
  const permission = await Notification.requestPermission()
  if (permission !== "granted") return { ok: false, reason: "denied" }
  try {
    const reg = await registration()
    await navigator.serviceWorker.ready
    const subscription =
      (await reg.pushManager.getSubscription()) ??
      (await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: keyBytes(key),
      }))
    return { ok: true, subscription: subscription.toJSON() }
  } catch {
    return { ok: false, reason: "failed" }
  }
}

/** Unsubscribes this device. Returns the endpoint so the server can forget it. */
export async function unsubscribe() {
  const subscription = await currentSubscription()
  if (!subscription) return null
  const endpoint = subscription.endpoint
  await subscription.unsubscribe().catch(() => {})
  return endpoint
}
