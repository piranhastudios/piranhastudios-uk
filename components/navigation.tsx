"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Phone, ChevronDown, ExternalLink } from "lucide-react"
import { StatusIndicator } from "@/components/status-indicator"

const navigationItems = [
  { href: "/#packages", label: "Pricing" },
  { href: "/portfolio", label: "Work" },
  { href: "/resources", label: "Resources" },
  { href: "/#services", label: "Services" },
  { href: "/#contact", label: "Contact" },
]

const solutionsItems = [
  {
    href: "https://storefactory.shop",
    label: "E-commerce",
    description: "Online stores built to sell from day one",
  },
  {
    href: "https://b2b-template.storefactory.shop",
    label: "Trade Portal",
    description: "B2B ordering, quoting and account pricing",
  },
  {
    href: null,
    label: "Healthcare (EHR Solution)",
    description: "Coming soon",
  },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSolutionsOpen, setIsSolutionsOpen] = useState(false)
  const [isMobileSolutionsOpen, setIsMobileSolutionsOpen] = useState(false)
  const solutionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isSolutionsOpen) return

    const handlePointerDown = (event: MouseEvent) => {
      if (solutionsRef.current && !solutionsRef.current.contains(event.target as Node)) {
        setIsSolutionsOpen(false)
      }
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsSolutionsOpen(false)
    }

    document.addEventListener("mousedown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("mousedown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isSolutionsOpen])

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
            {/* Solutions dropdown */}
            <div
              ref={solutionsRef}
              className="relative"
              onMouseEnter={() => setIsSolutionsOpen(true)}
              onMouseLeave={() => setIsSolutionsOpen(false)}
            >
              <button
                type="button"
                aria-expanded={isSolutionsOpen}
                aria-haspopup="true"
                onClick={() => setIsSolutionsOpen((open) => !open)}
                className="flex items-center gap-1 text-[#9ca3af] hover:text-[#fca5a5] transition-colors duration-300 font-medium"
              >
                Solutions
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-300 ${isSolutionsOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isSolutionsOpen && (
                <div className="absolute left-0 top-full pt-3 w-72">
                  <div className="bg-[#0f1419]/95 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl p-2">
                    {solutionsItems.map((item) =>
                      item.href ? (
                        <a
                          key={item.label}
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setIsSolutionsOpen(false)}
                          className="block px-3 py-2 rounded-xl hover:bg-white/5 transition-all duration-300 group"
                        >
                          <span className="flex items-center gap-2 text-[#e5e7eb] group-hover:text-[#fca5a5] font-medium transition-colors duration-300">
                            {item.label}
                            <ExternalLink className="h-3 w-3 opacity-60" />
                          </span>
                          <span className="block text-sm text-[#9ca3af] mt-0.5">{item.description}</span>
                        </a>
                      ) : (
                        <div key={item.label} className="block px-3 py-2 rounded-xl cursor-default">
                          <span className="flex items-center gap-2 text-[#9ca3af] font-medium">
                            {item.label}
                            <span className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded-md border border-white/10 text-[#9ca3af]">
                              TBC
                            </span>
                          </span>
                          <span className="block text-sm text-[#6b7280] mt-0.5">{item.description}</span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>

            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[#9ca3af] hover:text-[#fca5a5] transition-colors duration-300 font-medium"
              >
                {item.label}
              </Link>
            ))}
            <Link href="/book">
              <Button
                size="sm"
                className="bg-[#b91c1c] hover:bg-[#dc2626] text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-[#b91c1c]/25 transition-all duration-300 hover:scale-105"
              >
                <Phone className="mr-2 h-4 w-4" />
                Book a Call
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
              {/* Solutions accordion */}
              <button
                type="button"
                aria-expanded={isMobileSolutionsOpen}
                onClick={() => setIsMobileSolutionsOpen((open) => !open)}
                className="flex w-full items-center justify-between px-3 py-2 text-[#9ca3af] hover:text-[#fca5a5] hover:bg-white/5 rounded-xl transition-all duration-300"
              >
                Solutions
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-300 ${isMobileSolutionsOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isMobileSolutionsOpen && (
                <div className="pl-3 space-y-1">
                  {solutionsItems.map((item) =>
                    item.href ? (
                      <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-[#9ca3af] hover:text-[#fca5a5] hover:bg-white/5 rounded-xl transition-all duration-300"
                      >
                        {item.label}
                        <ExternalLink className="h-3 w-3 opacity-60" />
                      </a>
                    ) : (
                      <div
                        key={item.label}
                        className="flex items-center gap-2 px-3 py-2 text-[#6b7280] rounded-xl"
                      >
                        {item.label}
                        <span className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded-md border border-white/10">
                          TBC
                        </span>
                      </div>
                    ),
                  )}
                </div>
              )}

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
              <div className="px-3 py-2">
                <Link href="/book">
                  <Button
                    size="sm"
                    className="w-full bg-[#b91c1c] hover:bg-[#dc2626] text-white rounded-xl"
                    onClick={() => setIsOpen(false)}
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    Book a Call
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
