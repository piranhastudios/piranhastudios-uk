"use client";
import { Button } from "@/components/ui/button"
import { CalendlyUrls } from "@/lib/data/calendly"
import { CheckCircle2, Zap } from "lucide-react"
import Link from "next/link"
import { useAnalytics } from "./AnalyticsTracker"

const smallProjectFeatures = [
  "Understand your business goals",
  "Define core features",
  "Map key user journey",
  "Outline the system",
  "Timeline + cost estimate",
]

const smallProjectTypes = [
  "Websites",
  "Landing pages",
  "Simple e-commerce",
  "Booking systems",
  "Content sites",
]

const largeProjectFeatures = [
  "Full technical architecture",
  "Data models & workflows",
  "API landscape mapping",
  "Security & compliance review",
  "UI/UX flows",
  "Multi-team delivery roadmap",
]

const largeProjectTypes = [
  "Healthcare platforms",
  "Finance & fintech",
  "Marketplaces",
  "Data platforms",
  "Multi-team SaaS",
  "Real-time systems",
]

export function EvaluationSection() {
  const trackEvent = useAnalytics();
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#e5e7eb] to-[#9ca3af] bg-clip-text text-transparent">
            Discovery – The Obvious Choice
          </h2>
          <p className="text-xl md:text-2xl text-[#9ca3af] max-w-3xl mx-auto leading-relaxed">
            Every project needs clarity before build.
            <br />
            Small projects need just enough clarity to get started.
            <br />
            Large projects need full clarity to avoid expensive mistakes.
          </p>
          <p className="text-2xl text-[#fca5a5] mt-6 font-semibold">
            So we offer exactly two options. Nothing more. Nothing less.
          </p>
        </div>

        {/* Two Options */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* 4-Hour Session */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col">
           <div className="absolute top-4 right-4 bg-[#b91c1c] text-white px-4 py-1 rounded-full text-sm font-semibold">
              Most Popular
            </div>
            <div className="bg-gradient-to-br from-[#b91c1c]/20 to-[#b91c1c]/5 p-8 border-b border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="h-8 w-8 text-[#fca5a5]" />
                <h3 className="text-3xl font-bold text-[#e5e7eb]">4-Hour Session</h3>
              </div>
              <p className="text-lg text-[#fca5a5] font-semibold mb-2">For Simple Projects</p>
              <div className="text-5xl font-bold text-white mb-2">£250</div>
              <p className="text-[#9ca3af]">Get clarity fast</p>
            </div>

            <div className="p-8 flex flex-col justify-between flex-1">
              <div>
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-[#fca5a5] mb-4">Perfect for:</h4>
                  <div className="space-y-2">
                    {smallProjectTypes.map((type, index) => (
                      <div key={index} className="flex items-center gap-2 text-[#e5e7eb]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#fca5a5]" />
                        {type}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-[#e5e7eb] mb-4">What happens:</h4>
                  <div className="space-y-3">
                    {smallProjectFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-[#fca5a5] flex-shrink-0 mt-0.5" />
                        <span className="text-[#9ca3af]">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="bg-[#fca5a5]/10 rounded-xl p-4 border border-[#fca5a5]/20 mb-6">
                  <p className="text-[#e5e7eb] font-semibold">What you receive:</p>
                  <p className="text-[#9ca3af] mt-1">
                    A Mini Technical Blueprint you can build from immediately — with us or on your own.
                  </p>
                </div>

                <Link href={CalendlyUrls.evaluation_url} target="_blank" className="block" onClick={() => trackEvent('cta_click', { type: 'discovery session', plan: '4-hour session' })}>
                  <Button
                    size="lg"
                    className="w-full bg-[#b91c1c] hover:bg-[#dc2626] text-white py-6 text-lg rounded-2xl shadow-lg hover:shadow-[#b91c1c]/25 hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    Book 4-Hour Session
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* 2-Week Sprint */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-[#fca5a5]/30 shadow-2xl overflow-hidden relative">
            <div className="bg-gradient-to-br from-[#b91c1c]/30 to-[#b91c1c]/10 p-8 border-b border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="h-8 w-8 text-[#fca5a5]" />
                <h3 className="text-3xl font-bold text-[#e5e7eb]">2-Week Sprint</h3>
              </div>
              <p className="text-lg text-[#fca5a5] font-semibold mb-2">For Large Projects</p>
              <div className="text-5xl font-bold text-white mb-2">£2,500</div>
              <p className="text-[#9ca3af]">Start with £250, pay full amount only if you proceed</p>
            </div>

            <div className="p-8">
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-[#fca5a5] mb-4">Perfect for:</h4>
                <div className="space-y-2">
                  {largeProjectTypes.map((type, index) => (
                    <div key={index} className="flex items-center gap-2 text-[#e5e7eb]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#fca5a5]" />
                      {type}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h4 className="text-lg font-semibold text-[#e5e7eb] mb-4">What you get:</h4>
                <div className="space-y-3">
                  {largeProjectFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-[#fca5a5] flex-shrink-0 mt-0.5" />
                      <span className="text-[#9ca3af]">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#fca5a5]/10 rounded-xl p-4 border border-[#fca5a5]/20 mb-6">
                <p className="text-[#e5e7eb] font-semibold">What you receive:</p>
                <p className="text-[#9ca3af] mt-1">
                  A full, implementation-ready specification covering every technical and operational detail.
                </p>
              </div>

              <Link href={CalendlyUrls.evaluation_url} target="_blank" className="block" onClick={() => trackEvent('cta_click', { type: 'discovery session', plan: '2-week session' })}>
                <Button
                  size="lg"
                  className="w-full bg-[#b91c1c] hover:bg-[#dc2626] text-white py-6 text-lg rounded-2xl shadow-lg hover:shadow-[#b91c1c]/25 hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  Book 2-Week Sprint
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Why This Matters */}
        <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-8 md:p-12 text-center">
          <h3 className="text-3xl font-bold text-[#e5e7eb] mb-6">Why it's obvious</h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left mb-8">
            <div>
              <p className="text-[#fca5a5] font-semibold mb-2">Small projects</p>
              <p className="text-[#9ca3af]">
                Don't need 2 weeks of work. They need clarity fast. We give them exactly that.
              </p>
            </div>
            <div>
              <p className="text-[#fca5a5] font-semibold mb-2">Large projects</p>
              <p className="text-[#9ca3af]">
                Fail without detailed planning. Two weeks is the minimum to prevent disaster.
              </p>
            </div>
          </div>
          <p className="text-2xl text-[#e5e7eb] font-semibold mb-2">
            Simple projects get simplicity. Complex projects get depth.
          </p>
          <p className="text-xl text-[#fca5a5]">Everyone gets certainty.</p>
          
          <div className="mt-8">
            <Link href={CalendlyUrls.qa_url} target="_blank">
              <Button
                variant="outline"
                size="lg"
                className="border-[#fca5a5]/30 text-[#fca5a5] hover:bg-[#fca5a5]/10 px-8 py-3 text-lg rounded-2xl transition-all duration-300"
              >
                Not sure which one? Book a free call
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
