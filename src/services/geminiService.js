export async function generateProject({ prompt, stack }) {
  const endpoint =
    stack === 'react'
      ? '/api/generate-react'
      : '/api/generate-html'

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  })

  if (!res.ok) {
    let msg = `API error (${res.status})`
    try {
      const e = await res.json()
      msg = e.error || msg
    } catch {}
    throw new Error(msg)
  }

  return res.json()
}
