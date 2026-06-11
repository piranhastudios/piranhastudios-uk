"use client"
import { Button } from "@/components/ui/button"
import { Check, Clock, Package } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const serviceCategories = [
  {
    id: "ecommerce",
    name: "E-commerce",
    icon: "🛒",
    service: {
      name: "E-commerce Store Build",
      description: "We build stores designed to convert — not just look good. From product setup to checkout, everything is built to drive revenue.",
      time: "2–6 weeks",
      deliverables: [
        "Fully functional store ready to sell",
        "Payments, shipping, and checkout setup",
        "Mobile-optimised design",
        "Analytics and tracking",
      ],
      process: [
        "Understand your product and customers",
        "Design store structure",
        "Build and configure",
        "Test and launch",
      ],
    },
  },
  {
    id: "custom-apps",
    name: "Custom Apps",
    icon: "📱",
    service: {
      name: "Custom App Development",
      description: "We build web and mobile apps that solve real problems — from MVP to full-scale product.",
      time: "4–12 weeks",
      deliverables: [
        "Working app (web, mobile, or both)",
        "User authentication and data management",
        "Scalable backend infrastructure",
        "App store deployment (if mobile)",
      ],
      process: [
        "Define core features and scope",
        "Design and prototype",
        "Build in sprints",
        "Test and deploy",
      ],
    },
  },
  {
    id: "internal-tools",
    name: "Internal Tools",
    icon: "⚙️",
    service: {
      name: "Custom Internal Tools",
      description: "We build tools that automate your operations and save time — from dashboards to admin systems.",
      time: "3–8 weeks",
      deliverables: [
        "Custom dashboards or admin panels",
        "Workflow automation",
        "User roles and permissions",
        "Clean, simple interface",
      ],
      process: [
        "Identify bottlenecks",
        "Design system",
        "Build and iterate",
        "Deploy and refine",
      ],
    },
  },
  {
    id: "integrations",
    name: "Integrations",
    icon: "🔗",
    service: {
      name: "System Integrations",
      description: "We connect your tools so everything works together — payments, CRM, inventory, and more.",
      time: "1–4 weeks",
      deliverables: [
        "Connected systems (Stripe, CRM, etc.)",
        "Automated workflows",
        "Data syncing across platforms",
      ],
      process: [
        "Audit current systems",
        "Map integrations",
        "Implement connections",
        "Test and monitor",
      ],
    },
  },
  {
    id: "tech-advisory",
    name: "Tech Advisory",
    icon: "🧭",
    service: {
      name: "Tech Advisory",
      description: "Expert guidance on your technology decisions: architecture, tooling, hiring, and roadmap, without committing to a full build.",
      time: "One-off or ongoing",
      deliverables: [
        "Technical roadmap and recommendations",
        "Architecture and tooling review",
        "Vendor and hiring guidance",
        "Clear next steps you can action",
      ],
      process: [
        "Understand your goals and stack",
        "Review what you have",
        "Recommend a path forward",
        "Support you as you execute",
      ],
    },
  },
];

export function ServicesSection() {
  const [selectedCategory, setSelectedCategory] = useState(serviceCategories[0].id);
  
  const currentCategory = serviceCategories.find(cat => cat.id === selectedCategory) || serviceCategories[0];
  const service = currentCategory.service;

  return (
    <section id="services" className="py-20 px-6 bg-gradient-to-b from-transparent to-[#0f1419]/50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#e5e7eb] to-[#9ca3af] bg-clip-text text-transparent">
            What We Do
          </h2>
          <p className="text-xl text-[#9ca3af] max-w-3xl mx-auto">
            Pick what you need. We'll handle the rest.
          </p>
        </div>

        {/* Category Selector */}
        <div className="mb-12">
          <div className="overflow-x-auto scrollbar-hide -mx-6 px-6 lg:mx-0 lg:px-0">
            <div className="flex lg:justify-center gap-4 min-w-max lg:min-w-0 lg:flex-wrap">
              {serviceCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 whitespace-nowrap ${
                    selectedCategory === category.id
                      ? "bg-[#b91c1c] text-white shadow-lg shadow-[#b91c1c]/25 scale-105"
                      : "bg-white/5 text-[#9ca3af] hover:bg-white/10 border border-white/10"
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Service Content */}
        <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Service Details */}
            <div>
              <h3 className="text-3xl font-bold text-[#e5e7eb] mb-4">{service.name}</h3>
              <p className="text-[#9ca3af] text-lg mb-6">{service.description}</p>

              {/* Time */}
              <div className="flex gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-[#fca5a5]" />
                  <div>
                    <p className="text-xs text-[#9ca3af]">Timeline</p>
                    <p className="text-[#e5e7eb] font-semibold">{service.time}</p>
                  </div>
                </div>
              </div>

              {/* Deliverables */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Package className="h-5 w-5 text-[#fca5a5]" />
                  <h4 className="text-xl font-bold text-[#e5e7eb]">What You Get</h4>
                </div>
                <ul className="space-y-2">
                  {service.deliverables.map((deliverable, index) => (
                    <li key={index} className="flex items-start text-[#9ca3af]">
                      <Check className="h-4 w-4 text-[#fca5a5] mr-3 mt-1 flex-shrink-0" />
                      {deliverable}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column - Process & CTA */}
            <div>
              {/* Process */}
              <div className="bg-white/5 rounded-2xl p-6 mb-6">
                <h4 className="text-xl font-bold text-[#e5e7eb] mb-4">Our Process</h4>
                <div className="space-y-4">
                  {service.process.map((step, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#b91c1c] flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <p className="text-[#9ca3af] pt-1">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-br from-[#b91c1c]/20 to-[#dc2626]/10 rounded-2xl p-6 border border-[#b91c1c]/30">
                <h4 className="text-xl font-bold text-[#e5e7eb] mb-2">Get a clear plan</h4>
                <p className="text-[#9ca3af] mb-4">
                  Book a call and we'll tell you exactly what to build, how long it takes, and what it costs.
                </p>
                <Link href="/book">
                  <Button className="w-full bg-[#b91c1c] hover:bg-[#dc2626] text-white rounded-xl shadow-lg hover:shadow-[#b91c1c]/25 transition-all duration-300">
                    Book a Call
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="mt-20 max-w-3xl mx-auto text-center bg-white/5 backdrop-blur-md rounded-2xl p-10 border border-white/10 shadow-lg">
          <h3 className="text-3xl font-bold text-[#e5e7eb] mb-4">Flexible Pricing</h3>
          <p className="text-xl text-[#9ca3af] mb-8">
            Our services start from{" "}
            <span className="text-[#fca5a5] font-semibold">£100</span> and can accommodate a range of budgets.
          </p>
          <Link href="/book">
            <Button className="bg-[#b91c1c] hover:bg-[#dc2626] text-white rounded-xl px-8 shadow-lg hover:shadow-[#b91c1c]/25 transition-all duration-300">
              Book a Call
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
