import { Button } from "@/components/ui/button"
import { CalendlyUrls } from "@/lib/data/calendly"
import { ArrowRight, Code, Link, Users } from "lucide-react"

export function PortfolioHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#091113] via-[#0f1419] to-[#091113]" />

      {/* Floating glass panels background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-32 left-16 w-72 h-40 bg-white/5 backdrop-blur-sm rounded-3xl rotate-12 animate-pulse" />
        <div className="absolute top-48 right-24 w-56 h-56 bg-[#fca5a5]/10 backdrop-blur-sm rounded-3xl -rotate-6 animate-pulse delay-1000" />
        <div className="absolute bottom-40 left-1/3 w-64 h-32 bg-white/3 backdrop-blur-sm rounded-2xl rotate-6 animate-pulse delay-2000" />
      </div>

      <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
        {/* Main headline */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-[#e5e7eb] to-[#9ca3af] bg-clip-text text-transparent">
          Built to Scale
        </h1>
        <h2 className="text-3xl md:text-4xl font-light mb-8 text-[#9ca3af]">Real Products, Real Results</h2>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl mb-12 text-[#9ca3af] max-w-4xl mx-auto leading-relaxed">
          From internal ventures to client MVPs — see how we turn ideas into profitable digital products using lean,
          open-source technology stacks.
        </p>

        {/* Quick stats */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-lg hover:shadow-[#fca5a5]/20 transition-all duration-500 hover:scale-105">
            <div className="flex items-center justify-center mb-4">
              <Code className="h-8 w-8 text-[#fca5a5]" />
            </div>
            <h3 className="text-3xl font-bold text-[#e5e7eb] mb-2">10+</h3>
            <p className="text-[#9ca3af]">Projects Delivered</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-lg hover:shadow-[#fca5a5]/20 transition-all duration-500 hover:scale-105">
            <div className="flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-[#fca5a5]" />
            </div>
            <h3 className="text-3xl font-bold text-[#e5e7eb] mb-2">5</h3>
            <p className="text-[#9ca3af]">Happy Clients</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-lg hover:shadow-[#fca5a5]/20 transition-all duration-500 hover:scale-105">
            <div className="flex items-center justify-center mb-4">
              <ArrowRight className="h-8 w-8 text-[#fca5a5]" />
            </div>
            <h3 className="text-3xl font-bold text-[#e5e7eb] mb-2">4-8</h3>
            <p className="text-[#9ca3af]">Weeks to MVP</p>
          </div>
        </div>

        {/* CTA */}
        <Link href={CalendlyUrls.evaluation_url} target="_blank">
          <Button
            size="lg"
            className="bg-[#b91c1c] hover:bg-[#dc2626] text-white px-8 py-4 text-lg rounded-2xl shadow-lg hover:shadow-[#b91c1c]/25 hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            Start Your Project
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    </section>
  )
}
