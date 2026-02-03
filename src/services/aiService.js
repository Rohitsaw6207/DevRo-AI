import Groq from "groq-sdk";

/* =========================
   CONFIG
========================= */

const MODEL = "llama-3.1-8b-instant";

/* =========================
   CLIENT (BROWSER SAFE MODE)
========================= */

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

/* =========================
   UTILITIES
========================= */

// Prevent hitting TPM too fast
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Extract assistant text
function getText(res) {
  return res?.choices?.[0]?.message?.content?.trim() || "";
}

// Extract HTML from markdown
function extractCode(text) {
  const match = text.match(/```(?:html)?\n?([\s\S]*?)```/i);
  return match ? match[1].trim() : text.trim();
}

// Extract strict JSON
function extractJSON(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");

  if (start === -1 || end === -1) {
    console.error("RAW AI OUTPUT:\n", text);
    throw new Error("Invalid JSON from AI");
  }

  return JSON.parse(text.slice(start, end + 1));
}

/* =========================
   HTML GENERATION (SINGLE FILE)
========================= */

async function generateHTML(prompt) {
  const res = await groq.chat.completions.create({
    model: MODEL,
    temperature: 0.35,
    messages: [
      {
        role: "system",
        content:
          "You are a senior frontend developer. CSS is mandatory."
      },
      {
        role: "user",
        content: `
TASK:
Generate a COMPLETE single-file website.

MANDATORY RULES (FAIL IF BROKEN):
- MUST include <style> with real CSS
- MUST use Flexbox or Grid
- MUST be responsive
- MUST include hover/transition animations
- HTML-only output is INVALID

TECH RULES:
- One HTML file only
- CSS inside <style>
- JS inside <script> if needed
- No frameworks
- No libraries
- No explanations

OUTPUT:
- Return ONLY code
- Wrap everything in \`\`\`html\`\`\`

IDEA:
${prompt}
`
      }
    ]
  });

  const raw = getText(res);
  if (!raw) throw new Error("Empty response from AI");

  const code = extractCode(raw);

  // Hard safety check
  if (!code.includes("<style")) {
    throw new Error("CSS missing. Try again.");
  }

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
   REACT STRUCTURE
========================= */

async function getReactStructure(prompt) {
  const res = await groq.chat.completions.create({
    model: MODEL,
    temperature: 0.3,
    messages: [
      {
        role: "system",
        content:
          "You are a senior React developer. Return STRICT JSON only."
      },
      {
        role: "user",
        content: `
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

PROJECT IDEA:
${prompt}
`
      }
    ]
  });

  return extractJSON(getText(res));
}

/* =========================
   REACT FILE CONTENT
========================= */

async function getReactFile(path, prompt) {
  const res = await groq.chat.completions.create({
    model: MODEL,
    temperature: 0.3,
    messages: [
      {
        role: "system",
        content:
          "You are a senior React developer. Return RAW file content only."
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

  const text = getText(res);
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

  /* ---------- HTML ---------- */
  if (stack === "html") {
    return generateHTML(prompt);
  }

  /* ---------- REACT (RATE SAFE) ---------- */
  const structure = await getReactStructure(prompt);
  const files = [];

  for (const path of structure.files) {
    await sleep(400); // 🔒 TPM protection
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
