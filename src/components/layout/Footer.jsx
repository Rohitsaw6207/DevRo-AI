import { Link } from 'react-router-dom'
import { Github, Linkedin } from 'lucide-react'

import logo from '../../assets/devro-logo.svg'

const Footer = () => {
  return (
    <footer className="border-t border-neutral-900 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-6 py-14">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center">

          {/* LEFT — LOGO + DESCRIPTION */}
          <div className="space-y-4">
            <img
              src={logo}
              alt="DevRo AI"
              className="h-8"
            />

            <p className="text-sm text-neutral-400 max-w-sm">
              DevRo AI helps developers turn plain-language ideas into structured,
              production-ready React projects.
            </p>
          </div>

          {/* CENTER — COPYRIGHT + PRIVACY */}
          <div className="flex items-center justify-center gap-3 text-sm text-neutral-500">
            <span>© 2026 DevRo AI. All rights reserved.</span>

            <span className="text-neutral-700">|</span>

            <Link
              to="/privacy-policy"
              className="
                px-3 py-1 rounded-md
                border border-neutral-800
                text-neutral-400
                hover:text-neutral-100
                hover:border-neutral-600
                hover:bg-neutral-900
                transition
              "
            >
              Privacy Policy
            </Link>
          </div>

          {/* RIGHT — SOCIAL LINKS */}
          <div className="flex justify-start md:justify-end gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="
                h-10 w-10 flex items-center justify-center
                rounded-md
                bg-neutral-900
                border border-neutral-800
                text-neutral-400
                hover:text-neutral-100
                hover:border-neutral-600
                transition
              "
            >
              <Github size={18} />
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="
                h-10 w-10 flex items-center justify-center
                rounded-md
                bg-neutral-900
                border border-neutral-800
                text-neutral-400
                hover:text-neutral-100
                hover:border-neutral-600
                transition
              "
            >
              <Linkedin size={18} />
            </a>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer
