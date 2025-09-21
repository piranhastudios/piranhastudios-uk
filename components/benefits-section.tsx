import { Rocket, DollarSign, Wrench, Handshake, PoundSterling } from "lucide-react"

const benefits = [
  {
    icon: Rocket,
    title: "MVPs in as little as 4 weeks",
    description: "Fast turnaround from idea to working product",
  },
  {
    icon: PoundSterling,
    title: "Founder-friendly pricing",
    description: "Flexible payment options that work for startups",
  },
  {
    icon: Wrench,
    title: "Built with open-source tech",
    description: "No vendor lock-in, full code ownership",
  },
  {
    icon: Handshake,
    title: "Revenue share or pay once",
    description: "Choose the model that fits your situation",
  },
]

export function BenefitsSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-[#e5e7eb] to-[#9ca3af] bg-clip-text text-transparent">
          Why Choose Piranha Studios
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-lg hover:shadow-[#fca5a5]/20 transition-all duration-500 hover:scale-105 hover:bg-white/10"
            >
              <div className="mb-6">
                <benefit.icon className="h-12 w-12 text-[#fca5a5] group-hover:text-[#b91c1c] transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-[#e5e7eb] group-hover:text-white transition-colors duration-300">
                {benefit.title}
              </h3>
              <p className="text-[#9ca3af] group-hover:text-[#e5e7eb] transition-colors duration-300">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
