export const config = {
  runtime: 'nodejs'
}

const GEMINI_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

if (!GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set on the server')
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms))

async function callGemini(prompt, attempt = 1) {
  const res = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 4096   // ⬅️ IMPORTANT: reduce from 8192
      }
    })
  })

  if (res.status === 429) {
    if (attempt >= 3) {
      throw new Error('Gemini rate limit exceeded')
    }
    await sleep(1000 * attempt)
    return callGemini(prompt, attempt + 1)
  }

  if (!res.ok) {
    const text = await res.text()
    console.error('Gemini raw error:', text)
    throw new Error('Gemini API request failed')
  }

  const data = await res.json()
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

function extractJSON(text) {
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start === -1 || end === -1) return null
  return text.slice(start, end + 1)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { prompt, stack } = req.body || {}

  if (!prompt || !stack) {
    return res.status(400).json({ error: 'Prompt and stack required' })
  }

  try {
    const systemPrompt =
      stack === 'react'
        ? `
You are a senior frontend engineer.

Generate a COMPLETE Vite + React project.

STRICT RULES:
- Output ONLY valid JSON
- No markdown
- No explanations
- Start with { and end with }
- Every file must be inside "files"

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
`
        : `
You are a senior frontend engineer.

Generate a COMPLETE HTML/CSS/JS project.

STRICT RULES:
- Output ONLY valid JSON
- No markdown
- No explanations

FORMAT:
{
  "type": "html",
  "entry": "index.html",
  "description": "short summary",
  "files": {
    "index.html": "...",
    "style.css": "...",
    "script.js": "..."
  }
}

USER PROMPT:
${prompt}
`

    const raw = await callGemini(systemPrompt)
    const jsonText = extractJSON(raw)

    if (!jsonText) {
      console.error('❌ RAW OUTPUT:', raw)
      throw new Error('Invalid JSON from Gemini')
    }

    const parsed = JSON.parse(jsonText)

    const files = Object.entries(parsed.files).map(([path, content]) => ({
      path,
      content
    }))

    return res.status(200).json({
      type: parsed.type,
      entry: parsed.entry,
      description: parsed.description || '',
      files
    })
  } catch (err) {
    console.error('❌ API ERROR:', err)
    return res.status(500).json({ error: err.message })
  }
}
