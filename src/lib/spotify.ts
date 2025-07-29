const SPOTIFY_TOKEN_API = 'https://accounts.spotify.com/api/token'
const SPOTIFY_NOW_PLAYING_API = 'https://api.spotify.com/v1/me/player/currently-playing'

const {
  SPOTIFY_CLIENT_ID: client_id,
  SPOTIFY_CLIENT_SECRET: client_secret,
  SPOTIFY_REFRESH_TOKEN: refresh_token,
} = import.meta.env

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64')

export async function getAccessToken() {
  const response = await fetch(SPOTIFY_TOKEN_API, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token,
    }),
    cache: 'no-store', // Don't cache token request
  })

  const json = await response.json()
  console.log('Fetched new access token:', json.access_token ? '✅ success' : '❌ failed')
  return json
}

export async function getNowPlaying() {
  const start = Date.now()

  try {
    const { access_token } = await getAccessToken()
    const url = `${SPOTIFY_NOW_PLAYING_API}?additional_types=track,episode`

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      cache: 'no-store',
    })

    const timeFetched = new Date().toISOString()

    if (res.status === 204 || res.status > 400) {
      return {
        ok: false,
        fetchedAt: timeFetched,
        status: res.status,
        message: 'Nothing is playing or error occurred.',
      }
    }

    const data = await res.json()

    return {
      ok: true,
      fetchedAt: timeFetched,
      status: res.status,
      name: data.item?.name || 'Unknown',
      artists: data.item?.artists?.map((a: { name: string }) => a.name).join(', '),
      raw: data,
    }
  } catch (err) {
    return {
      ok: false,
      fetchedAt: new Date().toISOString(),
      status: 0,
      message: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}
 
