import { Button } from "@/components/ui/button"
import { ExternalLink, Lock, TrendingUp } from "lucide-react"
import Link from "next/link"

const clientProjects = [
  {
    title: "GFA Exchange",
    client: "Fintech Data Platform",
    description:
      "Real-time financial visibility and ESG insights platform for SMEs, enabling institutions to trade verified business data.",
    tech: ["Go", "Next.js", "Supabase", "Clerk Auth", "Stripe", "tRPC", "PostgreSQL"],
    timeline: "Ongoing",
    outcome: "Nominated for business cloud Fintech UK top 50",
    status: "Live Beta",
    image: "/images/gfa-exchange-screenshot.png",
    isConfidential: false,
    liveUrl: "https://app.gfaexchange.com",
    featured: true,
  },
  {
    title: "ChefUp",
    client: "Food Tech Marketplace",
    description:
      "Marketplace platform connecting local chefs with customers for meal prep, catering, and food experiences. Empowering community chefs to build micro food businesses.",
    tech: ["Next.js", "React", "Tailwind CSS", "Supabase", "Stripe Connect"],
    timeline: "Ongoing",
    outcome: "Clear product roadmap for MVP development",
    status: "Project Planning",
    image: "/images/chefup-screenshot.png",
    isConfidential: true,
    liveUrl: "https://chefup-platfform.vercel.app",
  },
  {
    title: "Premier Health Centres",
    client: "Healthcare Delivery Venture",
    description:
      "Western-standard clinical care delivery in Sub-Saharan Africa. Fully operational healthcare centers with ongoing EHR system development.",
    tech: ["Next.js", "PostgreSQL", "Healthcare APIs", "EHR Integration"],
    timeline: "Ongoing",
    outcome: "Fully operational, serving patients",
    status: "In development",
    image: "/images/premier-health-screenshot.png",
    isConfidential: false,
    liveUrl: "https://premierhealthcentrescameroon.com/gb",
    isFamily: true,
  },
  {
    title: "Carmen's Caribbean",
    client: "Food Product Business",
    description:
      "E-commerce platform for authentic frozen Caribbean meal boxes. Ready-to-launch food product business bringing traditional flavors to mainstream retail.",
    tech: ["Next.js", "Shopify", "Stripe", "Inventory Management"],
    timeline: "6 weeks",
    outcome: "Working E-commerce platform ready for launch",
    status: "Complete",
    image: "/images/carmen-caribbean-screenshot.png",
    isConfidential: true,
    liveUrl: "https://carmens-carribiean-cuisuine.vercel.app/gb",
  },
  {
    title: "Skeendeep Aesthetics",
    client: "Aesthetic Dermatology Clinic",
    description:
      "Professional website for non-invasive aesthetic dermatology clinic, featuring appointment booking and treatment information.",
    tech: ["Next.js", "Booking System", "CMS", "Responsive Design"],
    timeline: "6 weeks",
    outcome: "Increased bookings by 40%",
    status: "200+ monthly visitors",
    image: "/images/skeendeep-screenshot.png",
    isConfidential: false,
    liveUrl: "https://www.skeendeep.co.uk",
  },
]

export function ClientProjectsSection() {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-[#0f1419]/30 to-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-[#e5e7eb] to-[#9ca3af] bg-clip-text text-transparent">
            Client Success Stories
          </h2>
          <p className="text-xl text-[#9ca3af] max-w-3xl mx-auto">
            From fintech platforms to healthcare ventures — see how we've helped clients across diverse industries build
            and launch successful digital products.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {clientProjects.map((project, index) => (
            <div
              key={index}
              className={`group bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg hover:shadow-[#fca5a5]/20 transition-all duration-500 hover:scale-105 hover:bg-white/10 overflow-hidden ${project.featured ? "ring-2 ring-[#fca5a5]/30" : ""
                }`}
            >
              {project.featured && (
                <div className="bg-gradient-to-r from-[#b91c1c] to-[#fca5a5] px-4 py-2">
                  <p className="text-white font-semibold text-center text-sm">Featured Project</p>
                </div>
              )}

              {/* Project Image */}
              <div className="relative">
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
              </div>

              <div className="p-6">
                {/* Project Title & Client */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-[#e5e7eb] group-hover:text-white transition-colors duration-300 mb-1">
                    {project.title}
                  </h3>
                  <p className="text-[#fca5a5] font-medium">{project.client}</p>
                </div>

                {/* Description */}
                <p className="text-[#9ca3af] mb-4 leading-relaxed group-hover:text-[#e5e7eb] transition-colors duration-300">
                  {project.description}
                </p>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <p className="text-[#fca5a5] text-sm font-semibold mb-1">Timeline</p>
                    <p className="text-[#e5e7eb] font-bold text-sm">{project.timeline}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <p className="text-[#fca5a5] text-sm font-semibold mb-1">Status</p>
                    <p className="text-[#e5e7eb] font-bold text-sm">{project.status}</p>
                  </div>
                </div>

                {/* Outcome */}
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-4">
                  <div className="flex items-center mb-1">
                    <TrendingUp className="h-4 w-4 text-green-400 mr-2" />
                    <p className="text-green-400 text-sm font-semibold">Key Outcome</p>
                  </div>
                  <p className="text-[#e5e7eb] text-sm font-medium">{project.outcome}</p>
                </div>

                {/* Tech Stack */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-1">
                    {project.tech.slice(0, 3).map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-2 py-1 bg-[#fca5a5]/20 text-[#fca5a5] rounded text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.tech.length > 3 && (
                      <span className="px-2 py-1 bg-white/10 text-[#9ca3af] rounded text-xs">
                        +{project.tech.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                {!project.isConfidential && (
                  <Link href={project.liveUrl} target="_blank">
                    <Button className="w-full bg-[#b91c1c] hover:bg-[#dc2626] text-white rounded-xl">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Project
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="flex flex-col items-center bg-white/5 backdrop-blur-md rounded-3xl p-12 border border-white/10 shadow-2xl">
            <h3 className="text-3xl font-bold text-[#e5e7eb] mb-4">Ready to Join Our Success Stories?</h3>
            <p className="text-xl text-[#9ca3af] mb-8 max-w-2xl mx-auto">
              Let's discuss your project and see how we can help you build something amazing.
            </p>
            <Button
              size="lg"
              className="bg-[#b91c1c] hover:bg-[#dc2626] text-white px-8 py-4 text-lg rounded-2xl shadow-lg hover:shadow-[#b91c1c]/25 hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              Book Your Evaluation – £50
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
