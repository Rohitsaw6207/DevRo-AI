import { useState, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiSend,
  FiEye,
  FiCode,
  FiDownload,
  FiMenu,
  FiX,
  FiLoader,
  FiFile
} from 'react-icons/fi'

import Navbar from '../components/layout/Navbar'
import { generateProject } from '../services/geminiService'
import { downloadZip } from '../services/zipService'

export default function Coding() {
  const location = useLocation()

  // ===== RECEIVE FROM HOME =====
  const initialPrompt = location.state?.prompt || ''
  const initialStack = location.state?.stack || 'html'

  const [prompt, setPrompt] = useState(initialPrompt)
  const [stack, setStack] = useState(initialStack)

  const [activeTab, setActiveTab] = useState('preview')
  const [showPromptMobile, setShowPromptMobile] = useState(false)

  // ===== GEMINI STATE =====
  const [loading, setLoading] = useState(false)
  const [project, setProject] = useState(null)
  const [error, setError] = useState(null)

  // ===== CODE VIEW STATE =====
  const [selectedFile, setSelectedFile] = useState(null)

  // SAFETY ON REFRESH
  useEffect(() => {
    if (location.state?.prompt) setPrompt(location.state.prompt)
    if (location.state?.stack) setStack(location.state.stack)
  }, [location.state])

  // ===== GENERATE HANDLER =====
  const handleGenerate = async () => {
    if (!prompt.trim()) return

    try {
      setLoading(true)
      setError(null)
      setProject(null)
      setSelectedFile(null)
      setActiveTab('preview')

      const result = await generateProject({ prompt, stack })
      setProject(result)

      if (result?.files?.length) {
        setSelectedFile(result.files[0])
      }
    } catch (err) {
      console.error(err)
      setError(err.message || 'Generation failed')
    } finally {
      setLoading(false)
      setShowPromptMobile(false)
    }
  }

  /* =========================
     FULL HTML PREVIEW COMPOSER
  ========================= */

  const htmlPreview = useMemo(() => {
    if (!project || project.type !== 'html') return ''

    const html =
      project.files.find(f => f.path === 'index.html')?.content || ''
    const css =
      project.files.find(f => f.path === 'style.css')?.content || ''
    const js =
      project.files.find(f => f.path === 'script.js')?.content || ''

    return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<style>${css}</style>
</head>
<body>
${html}
<script>${js}</script>
</body>
</html>
    `
  }, [project])

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <Navbar />

      <div className="pt-20 h-screen flex flex-col">
        <div className="flex-1 flex overflow-hidden">

          {/* LEFT — PROMPT (DESKTOP) */}
          <div className="hidden md:flex w-[360px] border-r border-neutral-800 flex-col">
            <PromptPanel
              prompt={prompt}
              setPrompt={setPrompt}
              stack={stack}
              onSend={handleGenerate}
              loading={loading}
            />
          </div>

          {/* RIGHT — OUTPUT */}
          <div className="flex-1 flex flex-col">

            {/* TOP BAR */}
            <div className="flex items-center justify-between border-b border-neutral-800 px-4">

              {/* MOBILE PROMPT */}
              <button
                className="md:hidden p-2 text-neutral-300 hover:text-white"
                onClick={() => setShowPromptMobile(true)}
              >
                <FiMenu size={20} />
              </button>

              {/* TABS */}
              <div className="flex gap-1">
                {[
                  { key: 'preview', label: 'Preview', icon: FiEye },
                  { key: 'code', label: 'Code', icon: FiCode }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`
                      flex items-center gap-2 px-4 py-3 text-sm transition
                      ${
                        activeTab === tab.key
                          ? 'text-white border-b-2 border-white'
                          : 'text-neutral-400 hover:text-neutral-200'
                      }
                    `}
                  >
                    <tab.icon size={14} />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* DOWNLOAD BUTTON */}
              <button
                disabled={!project}
                onClick={() => downloadZip(project.files)}
                className={`
                  p-2 rounded-lg transition
                  ${
                    project
                      ? 'text-neutral-200 hover:text-white hover:bg-neutral-800'
                      : 'text-neutral-600 cursor-not-allowed'
                  }
                `}
                title="Download ZIP"
              >
                <FiDownload size={18} />
              </button>
            </div>

            {/* OUTPUT AREA */}
            <div className="flex-1 overflow-auto p-6">

              {/* LOADING */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex items-center justify-center"
                >
                  <div className="text-center space-y-4">
                    <FiLoader className="animate-spin mx-auto" size={32} />
                    <p className="text-sm text-neutral-400">
                      Building your project…
                    </p>
                  </div>
                </motion.div>
              )}

              {/* ERROR */}
              {error && (
                <div className="text-center text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* PREVIEW */}
              {!loading && project && activeTab === 'preview' && (
                project.type === 'html' ? (
                  <motion.iframe
                    key={htmlPreview}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    srcDoc={htmlPreview}
                    title="Preview"
                    className="w-full h-full rounded-xl border border-neutral-800 bg-white"
                  />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-neutral-400 text-sm gap-2">
                    <p>React preview is not available</p>
                    <p className="italic text-neutral-500">Coming soon 🚧</p>
                  </div>
                )
              )}

              {/* CODE */}
              {!loading && project && activeTab === 'code' && (
                <div className="flex h-full rounded-xl border border-neutral-800 overflow-hidden">

                  {/* FILE LIST */}
                  <div className="w-64 bg-neutral-900 border-r border-neutral-800 p-3 space-y-1">
                    {project.files.map(file => (
                      <button
                        key={file.path}
                        onClick={() => setSelectedFile(file)}
                        className={`
                          w-full flex items-center gap-2 px-2 py-1 rounded text-sm
                          ${
                            selectedFile?.path === file.path
                              ? 'bg-neutral-800 text-white'
                              : 'text-neutral-400 hover:text-neutral-200'
                          }
                        `}
                      >
                        <FiFile size={14} />
                        {file.path}
                      </button>
                    ))}
                  </div>

                  {/* CODE VIEW */}
                  <div className="flex-1 bg-neutral-950 p-4 overflow-auto">
                    {selectedFile ? (
                      <pre className="text-xs text-neutral-200 whitespace-pre-wrap">
                        {selectedFile.content}
                      </pre>
                    ) : (
                      <div className="text-neutral-500 text-sm">
                        Select a file to view its content
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* EMPTY */}
              {!loading && !project && (
                <div className="h-full flex items-center justify-center text-neutral-500 text-sm">
                  Generate a project to see output
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE PROMPT */}
      <AnimatePresence>
        {showPromptMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-0 left-0 right-0 bg-neutral-950 border-t border-neutral-800 rounded-t-2xl"
            >
              <div className="flex items-center justify-between p-4 border-b border-neutral-800">
                <h3 className="font-medium">Your Prompt</h3>
                <button onClick={() => setShowPromptMobile(false)}>
                  <FiX size={20} />
                </button>
              </div>

              <PromptPanel
                prompt={prompt}
                setPrompt={setPrompt}
                stack={stack}
                onSend={handleGenerate}
                loading={loading}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* =========================
   PROMPT PANEL (UNCHANGED)
========================= */

function PromptPanel({ prompt, setPrompt, stack, onSend, loading }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 py-5">
        {prompt ? (
          <div className="rounded-xl bg-neutral-900 border border-neutral-800 p-4 text-sm text-neutral-300 space-y-2">
            <div className="text-xs text-neutral-500">
              Stack:{' '}
              <span className="text-neutral-300">
                {stack.toUpperCase()}
              </span>
            </div>
            <div>{prompt}</div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-neutral-500 text-sm">
            Describe what you want to build
          </div>
        )}
      </div>

      <div className="border-t border-neutral-800 p-4">
        <div className="flex gap-2">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={`Describe your ${stack.toUpperCase()} project…`}
            className="
              flex-1 px-4 py-3 rounded-xl
              bg-neutral-900 border border-neutral-800
              outline-none text-sm
              placeholder:text-neutral-500
            "
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSend}
            disabled={loading}
            className="
              px-4 rounded-xl
              bg-neutral-800 hover:bg-neutral-700
              transition flex items-center justify-center
              disabled:opacity-50
            "
          >
            <FiSend size={18} />
          </motion.button>
        </div>
      </div>
    </div>
  )
}
