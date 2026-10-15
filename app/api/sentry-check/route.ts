// TEMPORARY: production Sentry check. Delete after confirming.
export function GET(request: Request) {
  const key = new URL(request.url).searchParams.get("key")
  if (key !== "efb7a6770be44dd5da9fa710")
    return new Response(null, { status: 404 })
  throw new Error(`Sentry production check ${new Date().toISOString()}`)
}
