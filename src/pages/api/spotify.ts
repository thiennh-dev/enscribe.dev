import { getNowPlaying } from '@/lib/spotify'

export async function GET() {
  const data = await getNowPlaying()

  const responseInit = {
    headers: {
      'Content-Type': 'application/json',
      // Prevent all forms of caching (browser & edge)
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
    // Cloudflare-specific caching instructions
    cf: {
      cacheTtl: 0,
      cacheEverything: false,
    },
  } as any  // 👈 cast as `any` to bypass TS error on `cf`

  return new Response(JSON.stringify(data), responseInit)
}
