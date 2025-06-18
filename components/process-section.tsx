import { Search, FileText, Code, TestTube, Rocket } from "lucide-react"

const steps = [
  {
    icon: Search,
    title: "Evaluate",
    description: "Paid discovery call and project brief",
  },
  {
    icon: FileText,
    title: "Plan",
    description: "Scope, architecture docs, roadmap",
  },
  {
    icon: Code,
    title: "Build",
    description: "Lean, open-source MVP build in 4–8 weeks",
  },
  {
    icon: TestTube,
    title: "Pilot",
    description: "Private alpha or closed beta test",
  },
  {
    icon: Rocket,
    title: "Launch",
    description: "Public alpha release with feedback loop",
  },
]

export function ProcessSection() {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-[#0f1419]/50 to-transparent">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-[#e5e7eb] to-[#9ca3af] bg-clip-text text-transparent">
          How It Works
        </h2>

        {/* Add Lottie animation */}
        <div className="flex justify-center mb-16">
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 shadow-2xl hover:shadow-[#fca5a5]/10 transition-all duration-500 hover:scale-105">
            <iframe
              src="https://lottie.host/embed/a45aecb6-8c8d-44af-b7a0-6e8d5f288ec8/huIqNpbmx7.json"
              className="w-full h-80 rounded-2xl"
              scrolling="no"
              frameBorder="0"
              allowFullScreen
              style={{ backgroundColor: "transparent" }}
            />
          </div>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-[#fca5a5]/20 via-[#fca5a5]/50 to-[#fca5a5]/20 transform -translate-y-1/2"></div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                <div className="h-full bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-lg hover:shadow-[#fca5a5]/20 transition-all duration-500 hover:scale-105 hover:bg-white/10 text-center">
                  {/* Step number */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-[#b91c1c] rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>

                  <div className="mb-6 flex justify-center">
                    <step.icon className="h-12 w-12 text-[#fca5a5] group-hover:text-[#b91c1c] transition-colors duration-300" />
                  </div>

                  <h3 className="text-xl font-semibold mb-4 text-[#e5e7eb] group-hover:text-white transition-colors duration-300">
                    {step.title}
                  </h3>

                  <p className="text-[#9ca3af] group-hover:text-[#e5e7eb] transition-colors duration-300">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
