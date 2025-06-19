import { Github, Linkedin, Mail } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-[#0f1419]/80 backdrop-blur-md border-t border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and tagline */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 flex items-center justify-center">
                <img src="/logo.png" />
              </div>
              <span className="text-xl font-bold text-[#e5e7eb] hover:text-white transition-colors duration-300">
                Piranha Studios
              </span>
            </Link>
            <p className="text-[#9ca3af] mb-6 max-w-md">Proudly solo-built in Stoke. Powered by open-source.</p>
            <div className="flex space-x-4">
              <Link href="https://github.com/piranhastudios/" className="text-[#9ca3af] hover:text-[#fca5a5] transition-colors duration-300">
                <Github className="h-6 w-6" />
              </Link>
              <Link href="https://www.linkedin.com/company/piranha-studios-solutions" className="text-[#9ca3af] hover:text-[#fca5a5] transition-colors duration-300">
                <Linkedin className="h-6 w-6" />
              </Link>
              <Link href="mailto:info@piranha-studios.co.uk" className="text-[#9ca3af] hover:text-[#fca5a5] transition-colors duration-300">
                <Mail className="h-6 w-6" />
              </Link>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[#e5e7eb] font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-[#9ca3af] hover:text-[#fca5a5] transition-colors duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-[#9ca3af] hover:text-[#fca5a5] transition-colors duration-300">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#9ca3af] hover:text-[#fca5a5] transition-colors duration-300">
                  Evaluation
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#9ca3af] hover:text-[#fca5a5] transition-colors duration-300">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-[#e5e7eb] font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-[#9ca3af] hover:text-[#fca5a5] transition-colors duration-300">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#9ca3af] hover:text-[#fca5a5] transition-colors duration-300">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#9ca3af] hover:text-[#fca5a5] transition-colors duration-300">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#9ca3af] hover:text-[#fca5a5] transition-colors duration-300">
                  Legal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center">
          <p className="text-[#9ca3af]">© {new Date().getFullYear()} Piranha Studios. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
