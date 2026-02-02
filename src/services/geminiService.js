export async function generateProject({ prompt, stack }) {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ prompt, stack })
  })

  if (!res.ok) {
    let message = 'Generation failed'
    try {
      const err = await res.json()
      message = err.error || message
    } catch {
      // response was not JSON (404 / HTML)
      message = `API error (${res.status})`
    }
    throw new Error(message)
  }

  return res.json()
}
