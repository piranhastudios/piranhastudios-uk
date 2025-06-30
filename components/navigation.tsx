"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Zap } from "lucide-react"
import { CalendlyUrls } from "@/lib/data/calendly"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#091113]/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 flex items-center justify-center">
              <img src="/logo.png" />
            </div>
            <span className="text-xl font-bold text-[#e5e7eb] hover:text-white transition-colors duration-300">
              Piranha Studios
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-[#9ca3af] hover:text-[#fca5a5] transition-colors duration-300 font-medium">
              Home
            </Link>
            <Link
              href="/portfolio"
              className="text-[#9ca3af] hover:text-[#fca5a5] transition-colors duration-300 font-medium"
            >
              Portfolio
            </Link>
            <Link
              href="/#services"
              className="text-[#9ca3af] hover:text-[#fca5a5] transition-colors duration-300 font-medium"
            >
              Services
            </Link>
            <Link
              href="/#process"
              className="text-[#9ca3af] hover:text-[#fca5a5] transition-colors duration-300 font-medium"
            >
              Process
            </Link>
            <Link
              href="/#contact"
              className="text-[#9ca3af] hover:text-[#fca5a5] transition-colors duration-300 font-medium"
            >
              Contact
            </Link>
          <Link href={CalendlyUrls.evaluation_url} target="_blank">

            <Button
              size="sm"
              className="bg-[#b91c1c] hover:bg-[#dc2626] text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-[#b91c1c]/25 transition-all duration-300 hover:scale-105"
            >
              <Zap className="mr-2 h-4 w-4" />
              Book Evaluation
            </Button>
            </Link>
            <Link href={CalendlyUrls.qa_url} target="_blank">
            <Button
            variant={"outline"}
              size="sm"
              className="border-[#fca5a5] text-[#fca5a5] px-4 py-2 hover:bg-[#fca5a5]/10 hover:text-[#b91c1c] text-lg rounded-xl transition-all duration-300"
            >
              <Zap className="mr-2 h-4 w-4" />
              Book free Q&amp;A
            </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[#9ca3af] hover:text-[#fca5a5] transition-colors duration-300"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-[#0f1419]/95 backdrop-blur-md rounded-2xl mt-2 border border-white/10">
              <Link
                href="/"
                className="block px-3 py-2 text-[#9ca3af] hover:text-[#fca5a5] hover:bg-white/5 rounded-xl transition-all duration-300"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/portfolio"
                className="block px-3 py-2 text-[#9ca3af] hover:text-[#fca5a5] hover:bg-white/5 rounded-xl transition-all duration-300"
                onClick={() => setIsOpen(false)}
              >
                Portfolio
              </Link>
              <Link
                href="#services"
                className="block px-3 py-2 text-[#9ca3af] hover:text-[#fca5a5] hover:bg-white/5 rounded-xl transition-all duration-300"
                onClick={() => setIsOpen(false)}
              >
                Services
              </Link>
              <Link
                href="#process"
                className="block px-3 py-2 text-[#9ca3af] hover:text-[#fca5a5] hover:bg-white/5 rounded-xl transition-all duration-300"
                onClick={() => setIsOpen(false)}
              >
                Process
              </Link>
              <Link
                href="#contact"
                className="block px-3 py-2 text-[#9ca3af] hover:text-[#fca5a5] hover:bg-white/5 rounded-xl transition-all duration-300"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
              <div className="px-3 py-2">
                <Link href={CalendlyUrls.evaluation_url} target="_blank">
                <Button
                  size="sm"
                  className="w-full bg-[#b91c1c] hover:bg-[#dc2626] text-white rounded-xl"
                  onClick={() => setIsOpen(false)}
                  >
                  <Zap className="mr-2 h-4 w-4" />
                  Book Evaluation
                </Button>
                </Link>
                <Link href={CalendlyUrls.qa_url} target="_blank">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-[#fca5a5] text-[#fca5a5] hover:bg-[#fca5a5]/10 hover:text-[#b91c1c] text-lg rounded-2xl transition-all duration-300 mt-2"
                  onClick={() => setIsOpen(false)}
                >
                  <Zap className="mr-2 h-4 w-4" />
                  Book free Q&amp;A
                </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
