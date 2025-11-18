"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, CircleHelp, Phone } from "lucide-react"
import { CalendlyUrls } from "@/lib/data/calendly"
import { StatusIndicator, isAcceptingProjects } from "@/components/status-indicator"

const navigationItems = [
  { href: "/portfolio", label: "Work" },
  { href: "/resources", label: "Resources" },
  { href: "/#services", label: "Services" },
  { href: "/#contact", label: "Contact" },
]

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
          <StatusIndicator size="sm" className="mr-4" />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[#9ca3af] hover:text-[#fca5a5] transition-colors duration-300 font-medium"
              >
                {item.label}
              </Link>
            ))}
            {isAcceptingProjects && (
              <Link href={CalendlyUrls.evaluation_url} target="_blank">
                <Button
                  size="sm"
                  className="bg-[#b91c1c] hover:bg-[#dc2626] text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-[#b91c1c]/25 transition-all duration-300 hover:scale-105"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Discovery Call
                </Button>
              </Link>
            )}
            <Link href={CalendlyUrls.qa_url} target="_blank">
              <Button
                variant={"outline"}
                size="sm"
                className="border-[#fca5a5] text-[#fca5a5] px-4 py-2 hover:bg-[#fca5a5]/10 hover:text-[#b91c1c] text-lg rounded-xl transition-all duration-300"
              >
                <CircleHelp className="mr-2 h-4 w-4" />
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
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-3 py-2 text-[#9ca3af] hover:text-[#fca5a5] hover:bg-white/5 rounded-xl transition-all duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="px-3 py-2 space-y-2">
                {isAcceptingProjects && (
                  <Link href={CalendlyUrls.evaluation_url} target="_blank">
                    <Button
                      size="sm"
                      className="w-full bg-[#b91c1c] hover:bg-[#dc2626] text-white rounded-xl"
                      onClick={() => setIsOpen(false)}
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      Discovery Call
                    </Button>
                  </Link>
                )}
                <Link href={CalendlyUrls.qa_url} target="_blank">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-[#fca5a5] text-[#fca5a5] hover:bg-[#fca5a5]/10 hover:text-[#b91c1c] rounded-xl transition-all duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    <CircleHelp className="mr-2 h-4 w-4" />
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
