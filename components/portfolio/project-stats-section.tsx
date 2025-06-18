import { Calendar, DollarSign, Layers, TrendingUp, Users, Zap } from "lucide-react"

const stats = [
  {
    icon: Zap,
    value: "4–8 weeks",
    label: "MVP Turnaround",
    description: "From idea to live product using lean dev sprints",
  },
  {
    icon: Users,
    value: "10+ founders",
    label: "Collaborated With",
    description: "Helping early-stage startups go from 0 to 1",
  },
  {
    icon: TrendingUp,
    value: "2 ventures",
    label: "Built In-House",
    description: "Habitate.uk and the Medusa plugin library",
  },
  {
    icon: Layers,
    value: "Open-source first",
    label: "Development Stack",
    description: "Speed, flexibility and transparency for every build",
  },
];

export function ProjectStatsSection() {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-transparent to-[#0f1419]/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-[#e5e7eb] to-[#9ca3af] bg-clip-text text-transparent">
            Track Record
          </h2>
          <p className="text-xl text-[#9ca3af] max-w-3xl mx-auto">
            Numbers that matter — real impact for real businesses
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-lg hover:shadow-[#fca5a5]/20 transition-all duration-500 hover:scale-105 hover:bg-white/10 text-center"
            >
              <div className="mb-6 flex justify-center">
                <stat.icon className="h-12 w-12 text-[#fca5a5] group-hover:text-[#b91c1c] transition-colors duration-300" />
              </div>
              <h3 className="text-3xl font-bold text-[#e5e7eb] mb-2 group-hover:text-white transition-colors duration-300">
                {stat.value}
              </h3>
              <p className="text-lg font-semibold text-[#fca5a5] mb-2">{stat.label}</p>
              <p className="text-[#9ca3af] group-hover:text-[#e5e7eb] transition-colors duration-300">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
