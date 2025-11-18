"use client"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendlyUrls } from "@/lib/data/calendly"
import { Check, Clock, Package } from "lucide-react"
import Link from "next/link"
import { createCheckoutSession } from "@/lib/stripe/client"
import { useState } from "react"

const serviceCategories = [
  {
    id: "ui-ux",
    name: "UI/UX Design",
    icon: "🎨",
    description: "User experience and interface design services",
    services: [
      {
        name: "UX/UI Design Consulting",
        description: "Your users don't care about your product. They care about their problems. We map out exactly how your product solves those problems — so people actually want to use it.",
        time: "3-6 weeks",
        deliverables: [
          "User research session (we listen to real people, not guesses)",
          "Clear user personas & flows (who uses it and why)",
          "Wireframes that make sense",
          "UI designs that work on every device",
          "Style guide your team can actually use",
        ],
        process: [
          "We audit what you have now",
          "Map out how people actually use it",
          "Design the interface",
          "You review, we refine",
          "Hand off everything you need to build it",
        ],
      },
      {
        name: "Usability Testing Services",
        description: "You think your product works great. But does it? We put real users in front of it and find out exactly where they get stuck, confused, or give up.",
        time: "2-4 weeks",
        deliverables: [
          "Test plan focused on what actually matters",
          "5-10 real people using your product",
          "Video proof of what works and what doesn't",
          "Ranked list of fixes (biggest problems first)",
        ],
        process: [
          "Define what success looks like",
          "Find people who match your real users",
          "Watch them use your product (and record it)",
          "Analyze what went wrong and why",
          "Show you exactly what to fix first",
        ],
      },
      {
        name: "UX Research Services",
        description: "Most products fail because nobody wanted them. We find out what people actually need before you spend months building the wrong thing.",
        time: "3-5 weeks",
        deliverables: [
          "Research plan (no fluff, just facts)",
          "Real conversations with real users",
          "What your competitors are doing (and missing)",
          "User personas based on truth, not imagination",
          "Roadmap recommendations that make money",
        ],
        process: [
          "Define what we need to learn",
          "Talk to actual people in your market",
          "Find patterns in what they say",
          "Show you what it means",
          "Plan your product with your team",
        ],
      },
      {
        name: "Website Redesign Services",
        description: "Your website should make you money. If it's slow, ugly, or confusing, it's costing you customers. We fix that.",
        time: "4-10 weeks",
        deliverables: [
          "Audit showing what's broken right now",
          "New structure that makes sense",
          "Modern design for key pages",
          "Everything your developers need",
          "Works perfectly on phones and computers",
        ],
        process: [
          "Find every problem with your current site",
          "Redesign the user experience",
          "Design the new look",
          "Package it for your developers",
          "Test it and launch it",
        ],
      },
    ],
  },
  {
    id: "development",
    name: "App & Software Development",
    icon: "💻",
    description: "Custom development solutions for web and mobile",
    services: [
      {
        name: "MVP Development Services",
        description: "Stop planning and start testing. We build the simplest version of your idea that real customers can use — so you learn what works before spending a fortune.",
        time: "8-16 weeks",
        deliverables: [
          "Working product with essential features only",
          "Web, mobile, or both (whatever makes sense)",
          "Analytics to track what users actually do",
          "Live and ready for real customers",
        ],
        process: [
          "Figure out what you really need to build",
          "Design the technical foundation",
          "Build in focused sprints",
          "Test with real users",
          "Launch and plan what's next",
        ],
      },
      {
        name: "Custom Web App Development Services",
        description: "Off-the-shelf software doesn't fit your business. We build exactly what you need — tools that work the way you work, not the other way around.",
        time: "12-40 weeks",
        deliverables: [
          "Complete web application (front and back)",
          "Built to scale with modern tech",
          "Admin panel, user permissions, integrations",
          "Performance monitoring and optimization",
          "Documentation that makes sense",
        ],
        process: [
          "Deep dive into what you actually need",
          "Design the system architecture and UI",
          "Build in 2-week cycles (you see progress constantly)",
          "Test everything under real conditions",
          "Launch and optimize for performance",
        ],
      },
      {
        name: "Custom Mobile App Development Services",
        description: "Your customers are on their phones. We build native apps that work flawlessly on iPhone and Android — and connect to your existing systems.",
        time: "10-30 weeks",
        deliverables: [
          "iOS and/or Android apps that feel native",
          "Backend integration with your systems",
          "User accounts, notifications, tracking",
          "Help getting it approved and published",
        ],
        process: [
          "Choose the right platform for your needs",
          "Design mobile-first experiences",
          "Build mobile and backend in parallel",
          "Beta test with real devices",
          "Launch on the App Store and Play Store",
        ],
      },
      {
        name: "Dedicated Development Team Services",
        description: "Hiring developers is expensive and risky. Get an entire team that knows your product inside out — developers, designers, and a project manager who keeps everything moving.",
        time: "Ongoing (minimum 3-6 months)",
        deliverables: [
          "Full team: tech lead, developers, designer",
          "Sprint planning and organized backlog",
          "New features, fixes, and ongoing support",
          "Clear reports on what's getting done",
        ],
        process: [
          "Set up your dedicated team",
          "Plan your roadmap and priorities",
          "Start building in sprint cycles",
          "Monthly reviews and adjustments",
          "Scale the team up or down as needed",
        ],
      },
    ],
  },
  {
    id: "strategy",
    name: "Product Strategy",
    icon: "🎯",
    description: "Strategic planning and product consulting",
    services: [
      {
        name: "Product Strategy Sprint Package",
        description: "Two weeks to turn your vague idea into a clear plan. No endless meetings. Just focused work to define exactly what you're building and why.",
        time: "2 weeks",
        deliverables: [
          "Clear product vision (no corporate jargon)",
          "User personas and why they'd pay you",
          "What your competitors miss (your opportunity)",
          "Feature roadmap and MVP definition",
          "Technical plan to actually build it",
        ],
        process: [
          "Workshop to align on the vision",
          "Research market and competitors",
          "Define who you're selling to and why they'll buy",
          "Present the complete plan",
        ],
      },
      {
        name: "Product-Market Fit Consulting & Services",
        description: "You have a product. But does anyone actually want it? We help you find the customers who will pay for what you're selling — before you run out of money.",
        time: "4-10 weeks",
        deliverables: [
          "User research and real validation",
          "Market analysis (who pays, who doesn't)",
          "Business model that actually works",
          "Go-to-market strategy (how to sell it)",
          "Metrics to know if you're winning",
        ],
        process: [
          "Research and validate assumptions",
          "Test market demand with real people",
          "Design business model and sales approach",
          "Set up tracking and KPIs",
          "Hand off actionable next steps",
        ],
      },
      {
        name: "Product Growth Services",
        description: "Your product works. Now you need more users, better retention, and actual revenue growth. We find what's working and do more of it.",
        time: "Ongoing (3-6 months minimum)",
        deliverables: [
          "Growth audit (what's broken, what's working)",
          "Dashboard showing what matters",
          "Feature priorities that drive growth",
          "A/B test roadmap and execution",
          "Retention and engagement improvements",
        ],
        process: [
          "Audit your current performance",
          "Set realistic growth goals",
          "Build backlog of experiments",
          "Run tests and measure results",
          "Double down on what works",
        ],
      },
      {
        name: "Digital Product Audit Services",
        description: "Something's wrong with your product but you don't know what. We find every problem — technical, design, market fit — and tell you exactly what to fix first.",
        time: "2-4 weeks",
        deliverables: [
          "Technical review (what's broken or risky)",
          "UX/UI audit (where users get stuck)",
          "Market fit assessment (is this what people want?)",
          "Performance and security check",
          "Prioritized fix list (biggest wins first)",
        ],
        process: [
          "Collect all documentation and access",
          "Deep audit of tech and design",
          "Review your data and analytics",
          "Present findings and roadmap",
          "Plan the fixes together",
        ],
      },
    ],
  },
];

const subscriptionPackages = [
  {
    name: "� Consulting Support",
    price: "£500/month", 
    description: "Ongoing maintenance and updates",
    features: [
      "Website maintenance",
      "Security updates",
      "Dedicated consulting hours",
      "Priority response times",
      "Weekly Strategic planning sessions",
      "Advanced Ecommerce site with custom features",
    ],
  },
  {
    name: "💼 Tech Partner",
    price: "£5,000/month",
    description: "Complete tech partnership",
    features: [
      "Everything in Consulting Support",
      "Dedicated account manager",
      "Custom feature development",
      "Monthly performance reports",
      "Priority support",
      "Integrated strategy",
      "Quarterly strategy sessions",
      "Annual roadmap planning",
    ],
    popular: true,
  },
];

export function ServicesSection() {
  const [selectedCategory, setSelectedCategory] = useState(serviceCategories[0].id);
  const [selectedService, setSelectedService] = useState(serviceCategories[0].services[0].name);
  
  const currentCategory = serviceCategories.find(cat => cat.id === selectedCategory) || serviceCategories[0];

  // Update selected service when category changes
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const newCategory = serviceCategories.find(cat => cat.id === categoryId);
    if (newCategory) {
      setSelectedService(newCategory.services[0].name);
    }
  };

  return (
    <section id="services" className="py-20 px-6 bg-gradient-to-b from-transparent to-[#0f1419]/50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#e5e7eb] to-[#9ca3af] bg-clip-text text-transparent">
            What We Build
          </h2>
          <p className="text-xl text-[#9ca3af] max-w-3xl mx-auto">
            Pick what you need. We'll build it right.
          </p>
        </div>

        {/* Category Selector */}
        <div className="mb-12">
          <div className="overflow-x-auto scrollbar-hide -mx-6 px-6 lg:mx-0 lg:px-0">
            <div className="flex lg:justify-center gap-4 min-w-max lg:min-w-0 lg:flex-wrap">
              {serviceCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
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

        {/* Services Tabs */}
        <Tabs key={selectedCategory} value={selectedService} onValueChange={setSelectedService} className="w-full">
          {/* Mobile Select Dropdown */}
          <div className="lg:hidden mb-8">
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger className="w-full px-4 py-3 h-auto rounded-xl bg-white/5 text-[#e5e7eb] border-white/10 focus:border-[#b91c1c] focus:ring-[#b91c1c]/25">
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent className="bg-[#0f1419] border-white/10">
                {currentCategory.services.map((service) => (
                  <SelectItem 
                    key={service.name} 
                    value={service.name}
                    className="text-[#e5e7eb] focus:bg-white/10 focus:text-[#e5e7eb]"
                  >
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden lg:block overflow-x-auto scrollbar-hide -mx-6 px-6 lg:mx-0 lg:px-0 mb-8">
            <TabsList className="w-full lg:flex lg:flex-wrap lg:justify-center gap-2 bg-transparent h-auto p-0 inline-flex lg:w-auto min-w-max lg:min-w-0">
              {currentCategory.services.map((service) => (
                <TabsTrigger
                  key={service.name}
                  value={service.name}
                  className="px-4 py-2 rounded-xl data-[state=active]:bg-[#b91c1c] data-[state=active]:text-white bg-white/5 text-[#9ca3af] border border-white/10 hover:bg-white/10 transition-all whitespace-nowrap"
                >
                  {service.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {currentCategory.services.map((service) => (
            <TabsContent key={service.name} value={service.name} className="mt-0">
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
                      <h4 className="text-xl font-bold text-[#e5e7eb] mb-2">Let's talk</h4>
                      <p className="text-[#9ca3af] mb-4">
                        Book a call. We'll tell you exactly what this will cost and how long it takes.
                      </p>
                      <Link href={CalendlyUrls.qa_url} target="_blank">
                        <Button className="w-full bg-[#b91c1c] hover:bg-[#dc2626] text-white rounded-xl shadow-lg hover:shadow-[#b91c1c]/25 transition-all duration-300">
                          Book a Call
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Monthly Support Packages */}
        <div className="mt-20">
          <h3 className="text-3xl font-bold text-center text-[#e5e7eb] mb-4">Monthly Support</h3>
          <p className="text-center text-[#9ca3af] mb-12">Keep your product running and growing</p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {subscriptionPackages.map((pkg, index) => (
              <div
                key={index}
                className={`relative bg-white/5 backdrop-blur-md rounded-2xl p-8 border transition-all duration-500 hover:scale-105 flex flex-col justify-between ${
                  pkg.popular
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

                <Button
                  onClick={() => {
                    createCheckoutSession({
                      name: pkg.name,
                      price: pkg.price,
                      description: pkg.description,
                      features: pkg.features,
                    });
                  }}
                  className={`w-full rounded-xl ${
                    pkg.popular
                      ? "bg-[#b91c1c] hover:bg-[#dc2626] text-white"
                      : "bg-gray-800 hover:bg-[#b91c1c] text-[#e5e7eb] border border-white/20"
                  }`}
                >
                  Get Started
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
