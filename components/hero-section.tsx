import { Button } from "@/components/ui/button"
import { CalendlyUrls } from "@/lib/data/calendly"
import { ArrowDown, Zap } from "lucide-react"
import Link from "next/link"
import { StatusIndicator, isAcceptingProjects } from "@/components/status-indicator"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#091113] via-[#0f1419] to-[#091113]" />

      {/* Floating glass panels background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-32 bg-white/5 backdrop-blur-sm rounded-2xl rotate-12 animate-pulse" />
        <div className="absolute top-40 right-20 w-48 h-48 bg-[#fca5a5]/10 backdrop-blur-sm rounded-3xl -rotate-6 animate-pulse delay-1000" />
        <div className="absolute bottom-32 left-1/4 w-56 h-28 bg-white/3 backdrop-blur-sm rounded-2xl rotate-6 animate-pulse delay-2000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="md:grid lg:grid-cols-2 md:gap-12 items-center min-h-screen md:py-20">
          {/* Right Column - Animated Lottie Hero Visual (shows first on mobile) */}
          <div className="relative lg:order-2">
            <div className="mb-4 bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl hover:shadow-[#fca5a5]/10 transition-all duration-500 hover:scale-105">
              <iframe
                src="https://lottie.host/embed/7df4062f-b98a-4682-8843-ba12dea182ba/yzqTsY2u51.json"
                className="w-full lg:h-96 h-[30vh] rounded-2xl"
                scrolling="no"
                frameBorder="0"
                allowFullScreen
                style={{ backgroundColor: "transparent" }}
              />
            </div>
          </div>

          {/* Left Column - Text Content (shows second on mobile) */}
          <div className="text-left lg:order-1">
            {/* Status Indicator */}
            <div className="mb-6">
              <StatusIndicator 
                className="bg-white/5 backdrop-blur-md rounded-full px-4 py-2 border border-white/10 inline-flex" 
                size="md"
              />
            </div>

            {/* Main headline */}
            <h1 className="text-3xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-[#e5e7eb] to-[#9ca3af] bg-clip-text text-transparent">
              We Build Products That Work
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl mb-12 text-[#9ca3af] leading-relaxed">
              You have an idea. We turn it into a working product. Then we help you grow it. Design, development, strategy — everything you need under one roof.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6">
              {isAcceptingProjects ? (
                <Link href={CalendlyUrls.evaluation_url} target="_blank">
                  <Button
                    size="lg"
                    className="bg-[#b91c1c] hover:bg-[#dc2626] text-white px-8 py-4 text-lg rounded-2xl shadow-lg hover:shadow-[#b91c1c]/25 hover:shadow-2xl transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-[#b91c1c]/20"
                  >
                    <Zap className="mr-2 h-5 w-5" />
                    Start Your Project
                  </Button>
                </Link>
              ) : (
                <Link href={CalendlyUrls.evaluation_url} target="_blank">
                  <Button
                    size="lg"
                    className="bg-[#b91c1c] hover:bg-[#dc2626] text-white px-8 py-4 text-lg rounded-2xl shadow-lg hover:shadow-[#b91c1c]/25 hover:shadow-2xl transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-[#b91c1c]/20"
                  >
                    <Zap className="mr-2 h-5 w-5" />
                    Get on the Waitlist
                  </Button>
                </Link>
              )}
              <Link href="/#services">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-[#fca5a5]/30 text-[#fca5a5] hover:bg-[#fca5a5]/10 px-8 py-4 text-lg rounded-2xl backdrop-blur-sm hover:border-[#fca5a5]/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#fca5a5]/20"
                >
                  <ArrowDown className="mr-2 h-5 w-5" />
                  See What We Do
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
