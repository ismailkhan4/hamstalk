const CACHE = "klarlingo-static-v1"
const OFFLINE_URL = "/offline"
const REFRESH_AFTER_MS = 6 * 60 * 60 * 1000
let lastRefresh = 0

const isStaticAsset = (url) =>
  url.pathname.startsWith("/_next/static/") ||
  url.pathname.startsWith("/icons/")

async function cacheOfflinePage() {
  const cache = await caches.open(CACHE)
  const response = await fetch(OFFLINE_URL, { cache: "reload" })
  if (!response.ok) return
  const html = await response.clone().text()
  await cache.put(OFFLINE_URL, response)
  const assets = new Set(html.match(/\/_next\/static\/[^"'\\\s)]+/g) ?? [])
  await Promise.all(
    [...assets].map(async (asset) => {
      if (await cache.match(asset)) return
      const res = await fetch(asset)
      if (res.ok) await cache.put(asset, res)
    })
  )
  lastRefresh = Date.now()
}

self.addEventListener("install", (event) => {
  event.waitUntil(cacheOfflinePage().then(() => self.skipWaiting()))
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      for (const key of await caches.keys())
        if (key !== CACHE) await caches.delete(key)
      await self.clients.claim()
    })()
  )
})

self.addEventListener("fetch", (event) => {
  const { request } = event
  if (request.method !== "GET") return
  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).then(
        (response) => {
          if (Date.now() - lastRefresh > REFRESH_AFTER_MS) {
            lastRefresh = Date.now()
            event.waitUntil(cacheOfflinePage().catch(() => {}))
          }
          return response
        },
        async () =>
          (await caches.match(OFFLINE_URL)) ??
          new Response("You’re offline.", {
            status: 503,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
          })
      )
    )
    return
  }

  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ??
          fetch(request).then((response) => {
            if (response.ok) {
              const copy = response.clone()
              event.waitUntil(
                caches.open(CACHE).then((cache) => cache.put(request, copy))
              )
            }
            return response
          })
      )
    )
  }
})
