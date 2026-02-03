import { GoogleGenAI } from "@google/genai";
import Groq from "groq-sdk";

/* =========================
   MODELS
========================= */

const GEMINI_MODEL = "gemini-2.5-flash";
const GROQ_MODEL = "llama-3.1-8b-instant";

/* =========================
   CLIENTS
========================= */

// Gemini → HTML
const gemini = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY_HTML
});

// Groq → React (browser allowed intentionally)
const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

/* =========================
   UTILITIES
========================= */

// Rate-limit safety
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Gemini text extractor
function getGeminiText(res) {
  return res?.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

// Groq text extractor
function getGroqText(res) {
  return res?.choices?.[0]?.message?.content?.trim() || "";
}

// Extract HTML from markdown
function extractHTML(text) {
  const match = text.match(/```(?:html)?\n?([\s\S]*?)```/i);
  return match ? match[1].trim() : text.trim();
}

// Extract strict JSON
function extractJSON(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");

  if (start === -1 || end === -1) {
    console.error("RAW OUTPUT:\n", text);
    throw new Error("Invalid JSON from AI");
  }

  return JSON.parse(text.slice(start, end + 1));
}

/* =========================
   HTML → GEMINI (PREVIEW)
========================= */

async function generateHTML(prompt) {
  const res = await gemini.models.generateContent({
    model: GEMINI_MODEL,
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `
You are a senior frontend developer.

TASK:
Generate a COMPLETE modern website in ONE HTML FILE.

MANDATORY:
- HTML + CSS + JS in the same file
- CSS inside <style> (REQUIRED)
- Responsive (Flexbox/Grid)
- Hover effects + transitions
- Clean modern UI
- No frameworks

OUTPUT RULES:
- Return ONLY code
- Wrap in \`\`\`html\`\`\`
- No explanations

PROJECT IDEA:
${prompt}
`
          }
        ]
      }
    ]
  });

  const raw = getGeminiText(res);
  if (!raw) throw new Error("Empty response from Gemini");

  const code = extractHTML(raw);

  if (!code.includes("<style")) {
    throw new Error("CSS missing in HTML output");
  }

  return {
    type: "html",
    entry: "index.html",
    files: [
      {
        path: "index.html",
        content: code
      }
    ]
  };
}

/* =========================
   REACT → GROQ (NO PREVIEW)
========================= */

async function getReactStructure(prompt) {
  const res = await groq.chat.completions.create({
    model: GROQ_MODEL,
    temperature: 0.25,
    messages: [
      {
        role: "system",
        content: "Return STRICT valid JSON only."
      },
      {
        role: "user",
        content: `
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

PROJECT IDEA:
${prompt}
`
      }
    ]
  });

  return extractJSON(getGroqText(res));
}

async function getReactFile(path, prompt) {
  const res = await groq.chat.completions.create({
    model: GROQ_MODEL,
    temperature: 0.25,
    messages: [
      {
        role: "system",
        content: "Return RAW file content only."
      },
      {
        role: "user",
        content: `
RULES:
- NO markdown
- NO explanations
- Return ONLY file content

FILE: ${path}

PROJECT IDEA:
${prompt}
`
      }
    ]
  });

  const text = getGroqText(res);
  if (!text) throw new Error(`Empty content for ${path}`);

  return text.trim();
}

/* =========================
   MAIN EXPORT
========================= */

export async function generateProject({ prompt, stack }) {
  if (!prompt?.trim() || !stack) {
    throw new Error("Prompt and stack required");
  }

  // HTML → Gemini
  if (stack === "html") {
    return generateHTML(prompt);
  }

  // React → Groq (rate-safe)
  const structure = await getReactStructure(prompt);
  const files = [];

  for (const path of structure.files) {
    await sleep(350); // TPM protection
    const content = await getReactFile(path, prompt);
    files.push({ path, content });
  }

  return {
    type: "react",
    entry: structure.entry,
    files
  };
}
