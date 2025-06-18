import { Button } from "@/components/ui/button"
import { CalendlyUrls } from "@/lib/data/calendly"
import { ArrowDown, Zap } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#091113] via-[#0f1419] to-[#091113]" />

      {/* Floating glass panels background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-32 bg-white/5 backdrop-blur-sm rounded-2xl rotate-12 animate-pulse" />
        <div className="absolute top-40 right-20 w-48 h-48 bg-[#fca5a5]/10 backdrop-blur-sm rounded-3xl -rotate-6 animate-pulse delay-1000" />
        <div className="absolute bottom-32 left-1/4 w-56 h-28 bg-white/3 backdrop-blur-sm rounded-2xl rotate-6 animate-pulse delay-2000" />
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        {/* Main headline */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-[#e5e7eb] to-[#9ca3af] bg-clip-text text-transparent">
          Startup MVPs Built Fast
        </h1>
        <h2 className="text-3xl md:text-4xl font-light mb-8 text-[#9ca3af]">Without Giving Up Equity</h2>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl mb-12 text-[#9ca3af] max-w-3xl mx-auto leading-relaxed">
          A venture studio helping founders launch bold products and launching our own.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link href={CalendlyUrls.evaluation_url} target="_blank">
            <Button
              size="lg"
              className="bg-[#b91c1c] hover:bg-[#dc2626] text-white px-8 py-4 text-lg rounded-2xl shadow-lg hover:shadow-[#b91c1c]/25 hover:shadow-2xl transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-[#b91c1c]/20"
            >
              <Zap className="mr-2 h-5 w-5" />
              Book Your Evaluation – £50
            </Button>
          </Link>
          <Link href="/#pricing">
            <Button
              variant="outline"
              size="lg"
              className="border-[#fca5a5]/30 text-[#fca5a5] hover:bg-[#fca5a5]/10 px-8 py-4 text-lg rounded-2xl backdrop-blur-sm hover:border-[#fca5a5]/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#fca5a5]/20"
            >
              <ArrowDown className="mr-2 h-5 w-5" />
              See Pricing
            </Button>
          </Link>
        </div>

        {/* Animated Lottie Hero Visual */}
        <div className="mt-16 relative">
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl hover:shadow-[#fca5a5]/10 transition-all duration-500 hover:scale-105">
            <iframe
              src="https://lottie.host/embed/7df4062f-b98a-4682-8843-ba12dea182ba/yzqTsY2u51.json"
              className="w-full h-96 rounded-2xl"
              scrolling="no"
              frameBorder="0"
              allowFullScreen
              style={{ backgroundColor: "transparent" }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
