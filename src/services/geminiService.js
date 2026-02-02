const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY

const GEMINI_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

/* =========================
   UTILITIES
========================= */

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

/* =========================
   SAFE GEMINI CALL
========================= */

async function callGemini(prompt, attempt = 1) {
  try {
    const res = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 4096
        }
      })
    })

    // 🚨 RATE LIMIT
    if (res.status === 429) {
      if (attempt > 3) {
        throw new Error('Gemini rate limit exceeded')
      }

      // Exponential backoff
      const delay = 1000 * attempt
      await sleep(delay)
      return callGemini(prompt, attempt + 1)
    }

    if (!res.ok) {
      throw new Error('Gemini API request failed')
    }

    const data = await res.json()
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
  } catch (err) {
    throw err
  }
}

/* =========================
   JSON EXTRACTOR
========================= */

function extractJSON(text) {
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start === -1 || end === -1) return null
  return text.slice(start, end + 1)
}

/* =========================
   HTML GENERATION
========================= */

async function generateHTMLProject(prompt) {
  const raw = await callGemini(`
You are a senior frontend engineer.

Generate a COMPLETE HTML/CSS/JS project.

STRICT RULES:
- Output ONLY valid JSON
- Start with '{' and end with '}'
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
  `)

  const jsonText = extractJSON(raw)
  if (!jsonText) {
    console.error('❌ RAW HTML OUTPUT:\n', raw)
    throw new Error('Gemini returned invalid JSON')
  }

  const parsed = JSON.parse(jsonText)

  return {
    type: 'html',
    entry: parsed.entry,
    description: parsed.description || '',
    files: Object.entries(parsed.files).map(([path, content]) => ({
      path,
      content
    }))
  }
}

/* =========================
   REACT — STRUCTURE
========================= */

async function getReactStructure(prompt) {
  const raw = await callGemini(`
You are a senior frontend engineer.

Return ONLY valid JSON.
Do NOT include file contents.

FORMAT:
{
  "entry": "index.html",
  "files": [
    "index.html",
    "package.json",
    "vite.config.js",
    "src/main.jsx",
    "src/App.jsx",
    "src/index.css"
  ]
}

USER PROMPT:
${prompt}
  `)

  const jsonText = extractJSON(raw)
  if (!jsonText) {
    console.error('❌ RAW STRUCTURE OUTPUT:\n', raw)
    throw new Error('Invalid React structure JSON')
  }

  return JSON.parse(jsonText)
}

/* =========================
   REACT — FILE CONTENT
========================= */

async function getReactFile(path, prompt) {
  const content = await callGemini(`
You are a senior frontend engineer.

Return ONLY the raw file content.
NO markdown.
NO explanations.

File path: ${path}

USER PROMPT:
${prompt}
  `)

  // ⏱ Small delay to avoid burst limits
  await sleep(350)

  return content
}

/* =========================
   MAIN EXPORT
========================= */

export async function generateProject({ prompt, stack }) {
  if (!prompt || !stack) {
    throw new Error('Prompt and stack are required')
  }

  // HTML — single request
  if (stack === 'html') {
    return generateHTMLProject(prompt)
  }

  // REACT — multi step
  const structure = await getReactStructure(prompt)

  const files = []

  for (const path of structure.files) {
    const content = await getReactFile(path, prompt)
    files.push({ path, content })
  }

  return {
    type: 'react',
    entry: structure.entry,
    description: '',
    files
  }
}
