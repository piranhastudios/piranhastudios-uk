import { Button } from "@/components/ui/button"
import { CalendlyUrls } from "@/lib/data/calendly"
import { Check } from "lucide-react"
import Link from "next/link"

const serviceCategories = [
  {
    name: "🤖 AI & Productivity",
    description: "Custom AI solutions and productivity tools to streamline your business",
    services: [
      "Your GPT (Custom AI Chat App)",
      "Additional GPT Integrations", 
      "AI workflow automation",
      "Business intelligence tools",
    ],
  },
  {
    name: "🛒 E-commerce Design & Setup",
    description: "Complete e-commerce solutions from design to deployment",
    services: [
      "Shopify/Medusa Themes (Pre-made & Custom)",
      "Premium themes with animations & layouts",
      "Backend setup with payments & shipping",
      "Notifications & abandoned cart recovery",
      "Globalisation (multi-language/currency)",
      "Advanced analytics & tracking",
    ],
  },
  {
    name: "🏢 Business Systems & Enterprise",
    description: "Professional business tools and management systems",
    services: [
      "Landing pages with Calendly integration",
      "Admin dashboards & client portals",
      "ClickUp task management setup",
      "Multi-user secure systems",
      "Custom business workflows",
    ],
  },
  {
    name: "🔗 Integrations & Automations",
    description: "Connect and automate your business processes",
    services: [
      "API system integrations",
      "n8n automation workflows",
      "Third-party tool connections",
      "Manual process automation",
      "System synchronization",
    ],
  },
];

const subscriptionPackages = [
  {
    name: "🔧 Tech Partner Retainer",
    price: "£300/month",
    price_id: "price_1S99IkCuZKBciN27N5dFfJnq", // Stripe Price ID for annual plan
    description: "Monthly insights + proposals",
    features: [
      "Monthly strategic insights",
      "Technology proposals",
      "Architecture reviews",
      "Growth recommendations",
    ],
  },
  {
    name: "💻 Web Development Support",
    price: "£300/month", 
    price_id: "price_1S99LrCuZKBciN27I5DMBwfg", // Stripe Price ID for annual plan
    description: "Ongoing maintenance and updates",
    features: [
      "Website maintenance",
      "Security updates",
      "Performance monitoring",
      "Feature updates",
    ],
  },
  {
    name: "🎯 Combined Retainer",
    price: "£500/month",
    price_id: "price_1S99OsCuZKBciN27SIKSH5j5", // Stripe Price ID for annual plan
    description: "Both Tech + Web Dev Support",
    features: [
      "All Tech Partner benefits",
      "All Web Dev Support benefits",
      "Priority support",
      "Integrated strategy",
    ],
    popular: true,
  },
  {
    name: "📅 Annual Plan",
    price: "£3,000/year",
    price_id: "price_1S99OsCuZKBciN27UR1CDoea", // Stripe Price ID for annual plan
    description: "Save £600 (instead of £3,600)",
    features: [
      "Combined retainer benefits",
      "2 months free",
      "Quarterly strategy sessions",
      "Annual roadmap planning",
    ],
    savings: "Save £600",
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="py-20 px-6 bg-gradient-to-b from-transparent to-[#0f1419]/50">
      <div className="max-w-7xl mx-auto">
        {/* Venture Studio Services */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-[#e5e7eb] to-[#9ca3af] bg-clip-text text-transparent">
            How We Partner With You
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

        {/* Services We Offer */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-[#e5e7eb] mb-12">Our Core Services</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {serviceCategories.map((category, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-[#fca5a5]/30 transition-all duration-500 hover:scale-105"
              >
                <h4 className="text-xl font-bold text-[#e5e7eb] mb-3">{category.name}</h4>
                <p className="text-[#9ca3af] mb-4">{category.description}</p>
                <ul className="space-y-2">
                  {category.services.map((service, serviceIndex) => (
                    <li key={serviceIndex} className="flex items-start text-[#e5e7eb] text-sm">
                      <Check className="h-3 w-3 text-[#fca5a5] mr-2 mt-1 flex-shrink-0" />
                      {service}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Book Consultation CTA */}
        <div className="text-center mb-16">
          <p className="text-lg text-[#9ca3af] mb-6">
            Our core services are here to help you build and grow your enterprise. These are available at any time.
          </p>
          <Link href={CalendlyUrls.qa_url} target="_blank">
            <Button
              size="lg"
              className="bg-[#b91c1c] hover:bg-[#dc2626] text-white px-8 py-4 text-lg rounded-2xl shadow-lg hover:shadow-[#b91c1c]/25 hover:shadow-2xl transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-[#b91c1c]/20"
            >
              Book a Free Q&A session to find out more
            </Button>
          </Link>
        </div>

        {/* Monthly Support Packages */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-[#e5e7eb] mb-4">🔁 Monthly Support Packages</h3>
          <p className="text-center text-[#9ca3af] mb-12">Ongoing partnership to keep your venture thriving</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {subscriptionPackages.map((pkg, index) => (
              <div
                key={index}
                className={`relative bg-white/5 backdrop-blur-md rounded-2xl p-8 border transition-all duration-500 hover:scale-105 flex flex-col justify-between ${pkg.popular
                    ? "border-[#fca5a5]/50 shadow-2xl shadow-[#fca5a5]/20"
                    : "border-white/10 hover:border-[#fca5a5]/30"
                  }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-[#b91c1c] text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                {pkg.savings && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      {pkg.savings}
                    </span>
                  </div>
                )}

                <div>
                  <h4 className="text-xl font-bold text-[#e5e7eb] mb-2">{pkg.name}</h4>
                  <p className="text-2xl font-bold text-[#fca5a5] mb-4">{pkg.price}</p>
                  <p className="text-[#9ca3af] mb-6">{pkg.description}</p>

                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-[#e5e7eb]">
                        <Check className="h-4 w-4 text-[#fca5a5] mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link href={CalendlyUrls.evaluation_url} target="_blank">
                    <Button
                    className={`w-full rounded-xl ${pkg.popular
                      ? "bg-[#b91c1c] hover:bg-[#dc2626] text-white"
                      : "bg-gray-800 hover:bg-[#b91c1c] text-[#e5e7eb] border border-white/20"
                      }`}
                    >
                    Get Started
                    </Button>
                </Link>
              </div>
            ))}
          </div>
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
