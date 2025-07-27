export async function GET() {
  return new Response(import.meta.env.SPOTIFY_CLIENT_ID)
}