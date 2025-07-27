const SPOTIFY_TOKEN_API = 'https://accounts.spotify.com/api/token'
const SPOTIFY_NOW_PLAYING_API = 'https://api.spotify.com/v1/me/player/currently-playing'

const {
  SPOTIFY_CLIENT_ID: client_id,
  SPOTIFY_CLIENT_SECRET: client_secret,
  SPOTIFY_REFRESH_TOKEN: refresh_token,
} = import.meta.env

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64')

async function getAccessToken() {
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
  })

  return response.json()
}

export async function getNowPlaying() {
  const { access_token } = await getAccessToken()

  const res = await fetch(`${SPOTIFY_NOW_PLAYING_API}?additional_types=track,episode`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })

  if (res.status === 204 || res.status > 400) return null

  return res.json()
}