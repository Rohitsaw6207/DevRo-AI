# 🚀 DevRo AI

DevRo AI is an AI-powered web platform that converts ideas into **production-ready projects**.  
Users describe what they want to build, and DevRo AI generates either:

- a **fully styled HTML website with live preview**, or  
- a **complete React project structure** ready to download and run locally.

The goal is simple: **turn ideas into real code, fast.**

---

## 🌐 Live Preview

> Deployed on Vercel  
https://devro-ai.vercel.app/

---

## 🧠 How DevRo AI Works

DevRo AI uses **two different AI engines**, each optimized for a specific task:

| Stack | AI Used | Reason |
|------|--------|--------|
| HTML | **Gemini 2.5 Flash** | High-quality UI, CSS, animations, live preview |
| React | **Groq (llama-3.1-8b-instant)** | Fast, scalable, code-only generation |

This split avoids weak UI output and prevents broken previews.

---

## ✨ Key Features

- 🔤 **Prompt-to-Project Generation**  
  Describe your idea in plain English.

- 🌐 **HTML Website Generator**
  - Single-file HTML (HTML + CSS + JS)
  - Responsive layout
  - Modern styling and animations
  - Live preview inside the app

- ⚛️ **React Project Generator**
  - Full Vite project structure
  - Clean file separation
  - Downloadable ZIP

- 📁 **Real File Structure**
  - Not snippets
  - Not demos
  - Actual project files you can run

- 🔐 **Authentication & Plans**
  - Firebase Authentication
  - Plan-based feature access
  - React generation gated behind Pro plan

- 💳 **Payment Integration**
  - Razorpay (test mode)
  - Ready for monetization

---

## 🖼️ Application Screenshots

### Landing Page
![Landing Page](public/preview/landing-page.png)

### Home Page
![Home Page](public/preview/home-page.png)

### Coding Page – Preview Mode
![Coding Preview](public/preview/coding-page-preview.png)

### Coding Page – Code View
![Coding Code](public/preview/coding-page-code.png)

### Pricing Page
![Pricing Page](public/preview/pricing-page.png)

### Profile Page
![Profile Page](public/preview/profile-page.png)

---

## 🛠️ Tech Stack

### Frontend
- React + Vite
- Tailwind CSS
- Framer Motion

### AI & APIs
- Google Gemini 2.5 Flash 
- Groq API

### Auth & Services
- Firebase Authentication
- Razorpay (test mode)

### Deployment
- Vercel
- Environment-based configuration

---

## 🧩 Architecture Highlights

- AI usage is **intentionally split by responsibility**
- Live preview only where technically valid
- No fake or broken previews
- Rate-limit-safe multi-step generation
- Designed around real developer workflows

---

## ⚠️ Known Limitations

- React preview is currently unavailable  
  _(React projects must be downloaded and run locally)_

- Free AI quotas are limited by provider policies

---

## 🚧 Future Improvements

- React live preview
- Project history & caching
- AI usage optimization
- Export to GitHub
- Custom templates

---

## 🧑‍💻 Author

**Rohit Kumar**  
 Developer & Builder

- GitHub: https://github.com/Rohitsaw6207  
- LinkedIn: https://www.linkedin.com/in/rohit-kumar-saw6207/

---

## 📜 License

This project is licensed for educational and portfolio purposes.
