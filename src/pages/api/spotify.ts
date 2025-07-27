import { getNowPlaying } from '@/lib/spotify'

export async function GET() {
  const data = await getNowPlaying()

  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
    },
  })
}
