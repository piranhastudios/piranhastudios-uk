import { Code, Database, Globe, Zap, Shield, Cloud, Cog } from "lucide-react"

const techCategories = [
  {
    icon: Globe,
    title: "Frontend",
    description: "Modern, type-safe user interfaces",
    technologies: [
      { name: "Next.js", detail: "App Router" },
      { name: "shadcn/ui", detail: "Component Library" },
      { name: "Tailwind CSS", detail: "Styling" },
      { name: "react-hook-form", detail: "Forms" },
      { name: "Zod", detail: "Validation" },
      { name: "Zustand", detail: "State Management" },
    ],
  },
  {
    icon: Database,
    title: "Backend",
    description: "High-performance server architecture",
    technologies: [
      { name: "Golang", detail: "Primary Language" },
      { name: "REST + WebSocket", detail: "API Layer" },
      { name: "PostgreSQL", detail: "via Supabase" },
      { name: "Redis", detail: "Pub/Sub & Caching" },
      { name: "tRPC", detail: "Type-safe APIs" },
      { name: "Render.com", detail: "Hosting" },
    ],
  },
  {
    icon: Shield,
    title: "Authentication & Security",
    description: "Enterprise-grade security",
    technologies: [
      { name: "Clerk", detail: "Auth & User Management" },
      { name: "Supabase Auth", detail: "Database Auth" },
      { name: "JWT", detail: "Token Management" },
      { name: "Webhook Security", detail: "Stripe Validation" },
      { name: "CORS", detail: "Cross-Origin Security" },
      { name: "Rate Limiting", detail: "API Protection" },
    ],
  },
  {
    icon: Zap,
    title: "Real-time & Payments",
    description: "Live data and payment processing",
    technologies: [
      { name: "Supabase Realtime", detail: "Live Updates" },
      { name: "Redis Pub/Sub", detail: "Custom Real-time" },
      { name: "Stripe", detail: "Payments & Webhooks" },
      { name: "Open Banking APIs", detail: "Bank Integration" },
      { name: "WebSocket", detail: "Live Communication" },
      { name: "Subscription Logic", detail: "Recurring Billing" },
    ],
  },
  {
    icon: Cloud,
    title: "Infrastructure & DevOps",
    description: "Scalable cloud infrastructure",
    technologies: [
      { name: "Supabase", detail: "Database & Storage" },
      { name: "Vercel", detail: "Frontend Hosting" },
      { name: "Render.com", detail: "Backend Hosting" },
      { name: "Axiom", detail: "Monitoring & Logs" },
      { name: "SanityCMS", detail: "Content Management" },
      { name: "Zapier", detail: "Automation" },
    ],
  },
  {
    icon: Cog,
    title: "Specialized Tools",
    description: "Reusable utilities and internal tooling for client delivery",
    technologies: [
      { name: "Medusa Plugin Library", detail: "Internal modules for faster builds" },
      { name: "Supabase Boilerplate", detail: "Pre-configured stack for MVPs" },
      { name: "Admin Dashboard Starter", detail: "Base UI for client ops portals" },
      { name: "Multi-step Form Wizard", detail: "Used in onboarding flows" },
      { name: "Sanity + Stripe Sync", detail: "E-commerce content & payment pairing" },
      { name: "Auth Wrapper", detail: "Clerk + Supabase auth integration" },
    ],
  }
]

export function TechStackSection() {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-transparent to-[#0f1419]/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-[#e5e7eb] to-[#9ca3af] bg-clip-text text-transparent">
            Technology Stack (2025)
          </h2>
          <p className="text-xl text-[#9ca3af] max-w-3xl mx-auto">
            Modern, type-safe, and scalable technologies for building enterprise-grade applications without vendor
            lock-in.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {techCategories.map((category, index) => (
            <div
              key={index}
              className="group bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-lg hover:shadow-[#fca5a5]/20 transition-all duration-500 hover:scale-105 hover:bg-white/10"
            >
              <div className="mb-6">
                <category.icon className="h-12 w-12 text-[#fca5a5] group-hover:text-[#b91c1c] transition-colors duration-300 mb-4" />
                <h3 className="text-xl font-semibold text-[#e5e7eb] group-hover:text-white transition-colors duration-300 mb-2">
                  {category.title}
                </h3>
                <p className="text-[#9ca3af] group-hover:text-[#e5e7eb] transition-colors duration-300">
                  {category.description}
                </p>
              </div>

              <div className="space-y-3">
                {category.technologies.map((tech, techIndex) => (
                  <div
                    key={techIndex}
                    className="flex items-center justify-between py-3 px-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors duration-300"
                  >
                    <div className="flex flex-col">
                      <span className="text-[#e5e7eb] font-medium">{tech.name}</span>
                      <span className="text-[#9ca3af] text-sm">{tech.detail}</span>
                    </div>
                    <div className="w-2 h-2 bg-[#fca5a5] rounded-full"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* What Sets Us Apart */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl">
            <h3 className="text-2xl font-bold text-[#e5e7eb] mb-4 flex items-center">
              <Code className="h-6 w-6 text-[#fca5a5] mr-3" />
              Fast, Reliable Delivery
            </h3>
            <p className="text-[#9ca3af] leading-relaxed">
              We turn startup ideas into working products in under 8 weeks. No bloated dev cycles. No agency overhead. Just lean, focused execution with weekly updates and working demos.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl">
            <h3 className="text-2xl font-bold text-[#e5e7eb] mb-4 flex items-center">
              <Zap className="h-6 w-6 text-[#fca5a5] mr-3" />
              Founder-Aligned Model
            </h3>
            <p className="text-[#9ca3af] leading-relaxed">
              We don’t take equity or control — just a small upfront fee and a revenue share if you win. That means we only succeed when you do. You stay in charge. We stay accountable.
            </p>
          </div>
        </div>


        {/* Open Source Philosophy */}
        <div className="mt-8 bg-gradient-to-r from-[#b91c1c]/10 to-[#fca5a5]/10 backdrop-blur-md rounded-3xl p-12 border border-[#fca5a5]/20 shadow-2xl text-center">
          <h3 className="text-3xl font-bold text-[#e5e7eb] mb-6">Modern Architecture, Zero Vendor Lock-in</h3>
          <p className="text-xl text-[#9ca3af] max-w-4xl mx-auto leading-relaxed">
            Our 2025 stack combines the performance of Go backends with the developer experience of Next.js frontends.
            Every technology choice prioritizes scalability, type safety, and your ability to own and modify your
            codebase.
          </p>
        </div>
      </div>
    </section>
  )
}
