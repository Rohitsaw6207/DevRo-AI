export const config = { runtime: 'nodejs' }

const ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

const API_KEY = process.env.GEMINI_API_KEY_REACT
if (!API_KEY) throw new Error('GEMINI_API_KEY_REACT missing')

async function callGemini(prompt) {
  const res = await fetch(`${ENDPOINT}?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 4096
      }
    })
  })

  if (!res.ok) {
    const t = await res.text()
    throw new Error(t)
  }

  const data = await res.json()
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

function extractJSON(text) {
  const s = text.indexOf('{')
  const e = text.lastIndexOf('}')
  return s === -1 || e === -1 ? null : text.slice(s, e + 1)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { prompt } = req.body || {}
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt required' })
  }

  try {
    const raw = await callGemini(`
You are a senior frontend engineer.

Return ONLY valid JSON.

FORMAT:
{
  "type": "react",
  "entry": "index.html",
  "description": "short summary",
  "files": {
    "index.html": "...",
    "package.json": "...",
    "vite.config.js": "...",
    "src/main.jsx": "...",
    "src/App.jsx": "...",
    "src/index.css": "..."
  }
}

USER PROMPT:
${prompt}
`)

    const jsonText = extractJSON(raw)
    if (!jsonText) throw new Error('Invalid JSON from Gemini')

    const parsed = JSON.parse(jsonText)

    res.status(200).json({
      type: 'react',
      entry: parsed.entry,
      description: parsed.description || '',
      files: Object.entries(parsed.files).map(([path, content]) => ({
        path,
        content
      }))
    })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
