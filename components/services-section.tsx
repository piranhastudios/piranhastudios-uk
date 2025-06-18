import { Button } from "@/components/ui/button"
import { CalendlyUrls } from "@/lib/data/calendly"
import { Check } from "lucide-react"
import Link from "next/link"

const pricingTiers = [
  {
    name: "Starter",
    price: "£200/month",
    description: "Light dev retainer for small tweaks/maintenance",
    features: ["Bug fixes", "Minor updates", "Email support", "Monthly check-ins"],
  },
  {
    name: "Growth",
    price: "£1,000/month",
    description: "Regular weekly dev + advice",
    features: ["Weekly development", "Strategic advice", "Priority support", "Feature development"],
  },
  {
    name: "Scale",
    price: "£5,000 flat fee",
    description: "Full MVP build — no rev share",
    features: ["Complete MVP", "Full ownership", "Documentation", "30-day support"],
    popular: true,
  },
  {
    name: "Custom",
    price: "£350–£1,500 + 5–10% rev share",
    description: "Mix of time and upside",
    features: ["Flexible terms", "Revenue sharing", "Long-term partnership", "Ongoing support"],
  },
]

export function ServicesSection() {
  return (
    <section id="pricing" className="py-20 px-6 bg-gradient-to-b from-transparent to-[#0f1419]/50">
      <div className="max-w-7xl mx-auto">
        {/* Startup-as-a-Service Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-[#e5e7eb] to-[#9ca3af] bg-clip-text text-transparent">
            Startup-as-a-Service
          </h2>

          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl">
              <p className="text-xl text-[#e5e7eb] mb-6">
                Get a technical co-founder without giving up equity. We help founders:
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-[#9ca3af]">
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-[#fca5a5] mr-3" />
                  Validate and scope the idea
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-[#fca5a5] mr-3" />
                  Build and launch an MVP
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-[#fca5a5] mr-3" />
                  Host and maintain early traction
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-[#fca5a5] mr-3" />
                  Iterate toward product-market fit
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 shadow-2xl hover:shadow-[#fca5a5]/10 transition-all duration-500">
              <iframe
                src="https://lottie.host/embed/5903e474-cb48-4877-abe5-a2ade8cddd05/ZeLNhobu0s.json"
                className="w-full h-80 rounded-2xl"
                scrolling="no"
                frameBorder="0"
                allowFullScreen
                style={{ backgroundColor: "transparent" }}
              />
            </div>
          </div>
        </div>

        {/* Pricing Tiers */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {pricingTiers.map((tier, index) => (
            <div
              key={index}
              className={`relative bg-white/5 backdrop-blur-md rounded-2xl p-8 border transition-all duration-500 hover:scale-105 ${
                tier.popular
                  ? "border-[#fca5a5]/50 shadow-2xl shadow-[#fca5a5]/20"
                  : "border-white/10 hover:border-[#fca5a5]/30"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-[#b91c1c] text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <h3 className="text-2xl font-bold text-[#e5e7eb] mb-2">{tier.name}</h3>
              <p className="text-3xl font-bold text-[#fca5a5] mb-4">{tier.price}</p>
              <p className="text-[#9ca3af] mb-6">{tier.description}</p>

              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-[#e5e7eb]">
                    <Check className="h-4 w-4 text-[#fca5a5] mr-3" />
                    {feature}
                  </li>
                ))}
              </ul>
          <Link href={CalendlyUrls.evaluation_url} target="_blank">

              <Button
                className={`w-full rounded-xl ${
                  tier.popular
                    ? "bg-[#b91c1c] hover:bg-[#dc2626] text-white"
                    : "bg-white/10 hover:bg-white/20 text-[#e5e7eb] border border-white/20"
                }`}
              >
                Get Started
              </Button>
            </Link>
            </div>
          ))}
        </div>

        {/* In-House Ventures */}
        <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl">
          <h3 className="text-3xl font-bold text-[#e5e7eb] mb-4">In-House Ventures</h3>
          <p className="text-xl text-[#9ca3af]">
            Piranha also builds its own tools and startups. We validate ideas internally and grow niche digital brands
            using the same stack we offer clients.
          </p>
        </div>
      </div>
    </section>
  )
}
