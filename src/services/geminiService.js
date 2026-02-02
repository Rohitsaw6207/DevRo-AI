import { GoogleGenAI } from "@google/genai";

/* =========================
   MODEL 
========================= */

const MODEL = "gemini-2.5-flash";

/* =========================
   CLIENTS 2 KEYS
========================= */

const htmlAI = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY_HTML
});

const reactAI = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY_REACT
});

/* =========================
   HELPERS
========================= */

// Extract text safely from Gemini SDK
function getText(res) {
  return res?.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

// Forgiving markdown extraction (HTML mode)
function extractCode(text) {
  const match = text.match(/```(?:html)?\n?([\s\S]*?)```/i);
  return match ? match[1].trim() : text.trim();
}

// Strict JSON extraction (React mode)
function extractJSON(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) {
    console.error("RAW GEMINI OUTPUT:\n", text);
    throw new Error("Invalid JSON from Gemini");
  }
  return JSON.parse(text.slice(start, end + 1));
}

/* =========================
   HTML GENERATION 
========================= */

async function generateHTML(prompt) {
  const res = await htmlAI.models.generateContent({
    model: MODEL,
    contents: `
You are a senior frontend developer.

Generate a COMPLETE, modern, responsive website in a SINGLE HTML FILE.

Rules:
- Include HTML, CSS, and JavaScript in the same file
- Use clean structure and modern styling
- Add subtle animations and interactions where appropriate
- Make it responsive
- Return ONLY the code
- Wrap the code in a Markdown HTML code block
- Do NOT include explanations

USER PROMPT:
${prompt}
`
  });

  const code = extractCode(getText(res));

  return {
    type: "html",
    entry: "index.html",
    description: "",
    files: [
      {
        path: "index.html",
        content: code
      }
    ]
  };
}

/* =========================
   REACT — SAFE MULTI STEP
========================= */

async function getReactStructure(prompt) {
  const res = await reactAI.models.generateContent({
    model: MODEL,
    contents: `
Return ONLY valid JSON.

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
`
  });

  return extractJSON(getText(res));
}

async function getReactFile(path, prompt) {
  const res = await reactAI.models.generateContent({
    model: MODEL,
    contents: `
Return ONLY raw file content.
NO markdown.

File: ${path}

USER PROMPT:
${prompt}
`
  });

  return getText(res);
}

/* =========================
   MAIN EXPORT
========================= */

export async function generateProject({ prompt, stack }) {
  if (!prompt || !stack) {
    throw new Error("Prompt and stack required");
  }

  // HTML → simple, stable, one-shot
  if (stack === "html") {
    return generateHTML(prompt);
  }

  // React → structured, multi-step
  const structure = await getReactStructure(prompt);
  const files = [];

  for (const path of structure.files) {
    const content = await getReactFile(path, prompt);
    files.push({ path, content });
  }

  return {
    type: "react",
    entry: structure.entry,
    description: "",
    files
  };
}
