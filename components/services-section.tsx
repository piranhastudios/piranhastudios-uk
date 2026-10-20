"use client"
import { Button } from "@/components/ui/button"
import { Check, Clock, Package } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const serviceCategories = [
  {
    id: "strategy-advisory",
    name: "Strategy and advisory",
    icon: "🧭",
    service: {
      name: "Strategy and advisory",
      description: "Architecture reviews, roadmaps, tooling decisions and help hiring engineers, explained in plain English.",
      time: "Project-based or ongoing",
      deliverables: [
        "Technical roadmaps and recommendations",
        "Architecture and tooling reviews",
        "Hiring guidance for technical roles",
        "Plain-English explanations and next steps",
      ],
      process: [
        "Understand your business goals",
        "Assess your current technical landscape",
        "Develop strategic recommendations",
        "Provide ongoing guidance and support",
      ],
    },
  },
  {
    id: "platforms-software",
    name: "Platforms and software",
    icon: "💻",
    service: {
      name: "Platforms and software",
      description: "SaaS products, MVPs for funded startups, marketplaces, customer portals and internal tools.",
      time: "4 to 16 weeks (MVP to full platform)",
      deliverables: [
        "Custom web/mobile applications",
        "Scalable backend infrastructure",
        "User authentication and data management",
        "Deployment to chosen environment",
      ],
      process: [
        "Define core features and user stories",
        "Design and prototype key interfaces",
        "Develop in agile sprints",
        "Test, refine, and deploy",
      ],
    },
  },
  {
    id: "ecommerce-websites",
    name: "E-commerce and websites",
    icon: "🛒",
    service: {
      name: "E-commerce and websites",
      description: "Business websites and online stores with payments, delivery and compliance set up properly.",
      time: "2 to 8 weeks",
      deliverables: [
        "Fully functional business website or online store",
        "Secure payment gateway integration",
        "Shipping and delivery setup",
        "Compliance (GDPR, accessibility) considerations",
      ],
      process: [
        "Understand your brand and sales goals",
        "Design user experience and visual layout",
        "Build and configure platform",
        "Test, launch, and optimize",
      ],
    },
  },
  {
    id: "integrations-automation",
    name: "Integrations and automation",
    icon: "🔗",
    service: {
      name: "Integrations and automation",
      description: "Joining up payments, CRM, inventory and the systems that were never designed to talk to each other.",
      time: "2 to 6 weeks",
      deliverables: [
        "Seamless data flow between systems",
        "Automated workflows to reduce manual tasks",
        "Custom APIs or middleware if needed",
        "Monitoring and error handling solutions",
      ],
      process: [
        "Audit existing systems and data flows",
        "Map integration points and automation opportunities",
        "Implement connections and custom logic",
        "Test, validate, and document integrations",
      ],
    },
  },
  {
    id: "launch-grow",
    name: "Launch and grow",
    icon: "🚀",
    service: {
      name: "Launch and grow",
      description: "Hosting, support and ongoing development come as standard. We don’t disappear after launch.",
      time: "Ongoing (post-launch support)",
      deliverables: [
        "Reliable hosting and infrastructure management",
        "Continuous monitoring and security updates",
        "Dedicated technical support",
        "Ongoing feature development and scaling",
      ],
      process: [
        "Deploy to production environment",
        "Establish monitoring and support channels",
        "Plan for iterative improvements and new features",
        "Provide regular performance reviews and recommendations",
      ],
    },
  },
];

export function ServicesSection() {
  const [selectedCategory, setSelectedCategory] = useState(serviceCategories[0].id);
  
  const currentCategory = serviceCategories.find(cat => cat.id === selectedCategory) || serviceCategories[0];
  const service = currentCategory.service;

  return (
    <section id="services" className="py-20 px-6 scroll-mt-20 bg-gradient-to-b from-transparent to-[#0f1419]/50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#e5e7eb] to-[#9ca3af] bg-clip-text text-transparent">
            What We Do
          </h2>
          <p className="text-xl text-[#9ca3af] max-w-3xl mx-auto">
            You bring the market, the relationships and the problem worth solving. We bring everything else.
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
          <h3 className="text-3xl font-bold text-[#e5e7eb] mb-4">Not sure which you need?</h3>
          <p className="text-xl text-[#9ca3af] mb-8">
            Our packages start at{" "}
            <span className="text-[#fca5a5] font-semibold">£100</span>. Anything custom gets a fixed quote after
            one call, before any work starts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#packages">
              <Button className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-[#e5e7eb] border border-white/20 rounded-xl px-8 transition-all duration-300">
                See Packages
              </Button>
            </Link>
            <Link href="/book">
              <Button className="w-full sm:w-auto bg-[#b91c1c] hover:bg-[#dc2626] text-white rounded-xl px-8 shadow-lg hover:shadow-[#b91c1c]/25 transition-all duration-300">
                Book a Call
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
