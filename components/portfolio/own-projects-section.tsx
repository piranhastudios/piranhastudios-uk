import { Button } from "@/components/ui/button"
import { ExternalLink, Github } from "lucide-react"
import Link from "next/link";

const ownProjects = [
  {
    title: "Piranha Studios Library",
    description:
      "A curated set of plugins and boilerplates built for common use cases in e-commerce, healthcare and beyond. Focused on speeding up delivery for Piranha client projects while laying the foundation for a future open-source toolkit.",
    tech: ["Golang", "TypeScript", "Node.js"],
    status: "In Progress",
    revenue: "Not monetized (internal use)",
    users: "Used in client MVP builds",
    image: "/images/medusa-js-plugin-library.png",
    featured: true,
    liveUrl: null,
    githubUrl: null
  },
  {
    title: "Habitate.uk",
    description:
      "A mobile-first co-living subscription platform allowing members to live flexibly across a network of managed homes. For a fixed monthly fee, tenants can move between properties in different cities—solving London’s cost crisis and Northern under-occupancy. The app handles payments, property discovery, room switching, and tenant onboarding.",
    tech: ["React", "React-Native", "Supabase", "Clerk", "Stripe", "Next.js", "Tailwind CSS"],
    status: "MVP in Development",
    revenue: "Not launched (subscription model planned)",
    users: "Private beta tenants (planned)",
    image: "/images/habitateuk.png",
    liveUrl: null,
    githubUrl: null
  },
];

export function OwnProjectsSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-[#e5e7eb] to-[#9ca3af] bg-clip-text text-transparent">
            Our Own Ventures
          </h2>
          <p className="text-xl text-[#9ca3af] max-w-3xl mx-auto">
            We don't just build for clients — we validate ideas and grow our own digital products using the same proven
            process.
          </p>
        </div>

        <div className="space-y-12">
          {ownProjects.map((project, index) => (
            <div
              key={index}
              className={`group bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl hover:shadow-[#fca5a5]/10 transition-all duration-500 overflow-hidden ${project.featured ? "ring-2 ring-[#fca5a5]/30" : ""
                }`}
            >
              {project.featured && (
                <div className="bg-gradient-to-r from-[#b91c1c] to-[#fca5a5] px-6 py-2">
                  <p className="text-white font-semibold text-center">Featured Project</p>
                </div>
              )}

                <div
                className={`grid lg:grid-cols-2 gap-8 p-8 ${
                  index % 2 === 1 ? "lg:grid-flow-col-dense" : ""
                } items-center justify-center text-center lg:text-left`}
                >
                {/* Project Image */}
                <div className={`${index % 2 === 1 ? "lg:col-start-2" : ""}`}>
                  <div className="bg-white/10 rounded-2xl p-4 hover:scale-105 transition-transform duration-500">
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-64 object-cover rounded-xl"
                    />
                  </div>
                </div>

                {/* Project Details */}
                <div className={`flex flex-col justify-center ${index % 2 === 1 ? "lg:col-start-1" : ""}`}>
                  <div className="flex items-center gap-4 mb-4">
                    <h3 className="text-3xl font-bold text-[#e5e7eb] group-hover:text-white transition-colors duration-300">
                      {project.title}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${project.status === "Live"
                        ? "bg-green-500/20 text-green-400"
                        : project.status === "Beta"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-blue-500/20 text-blue-400"
                        }`}
                    >
                      {project.status}
                    </span>
                  </div>

                  <p className="text-[#9ca3af] text-lg mb-6 leading-relaxed group-hover:text-[#e5e7eb] transition-colors duration-300">
                    {project.description}
                  </p>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <p className="text-[#fca5a5] font-semibold mb-1">Revenue</p>
                      <p className="text-[#e5e7eb] font-bold">{project.revenue}</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <p className="text-[#fca5a5] font-semibold mb-1">Users</p>
                      <p className="text-[#e5e7eb] font-bold">{project.users}</p>
                    </div>
                  </div>

                  {/* Tech Stack */}
                  <div className="mb-6">
                    <p className="text-[#9ca3af] mb-3">Built with:</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-3 py-1 bg-[#fca5a5]/20 text-[#fca5a5] rounded-full text-sm font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    {
                      project.liveUrl ?
                        <Link href={project.liveUrl}>
                          <Button className="bg-[#b91c1c] hover:bg-[#dc2626] text-white rounded-xl">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Live
                          </Button>
                        </Link>
                        : null}
                    {
                      project.githubUrl ?
                        <Link href={project.githubUrl}>
                          <Button
                            variant="outline"
                            className="border-[#fca5a5]/30 text-[#fca5a5] hover:bg-[#fca5a5]/10 rounded-xl"
                          >
                            <Github className="mr-2 h-4 w-4" />
                            Source Code
                          </Button>
                        </Link>
                        : null
                    }
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
