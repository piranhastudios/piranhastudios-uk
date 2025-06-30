import { Button } from "@/components/ui/button"
import { CalendlyUrls } from "@/lib/data/calendly"
import { Calendar, FileText, Lightbulb, MessageSquare, Target } from "lucide-react"
import Link from "next/link"

const benefits = [
  {
    icon: Calendar,
    text: "30–45 min call with our business analyst",
  },
  {
    icon: FileText,
    text: "A custom project brief",
  },
  {
    icon: Lightbulb,
    text: "Early UI mockup or offer improvement notes",
  },
  {
    icon: MessageSquare,
    text: "Honest feedback on viability",
  },
]

export function EvaluationSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-[#e5e7eb] to-[#9ca3af] bg-clip-text text-transparent">
          Book a Project Evaluation – £50
        </h2>

        <div className="bg-white/5 backdrop-blur-md px-2 py-4 sm:px-12 sm:py-12 rounded-3xl border border-white/10 shadow-2xl hover:shadow-[#fca5a5]/10 transition-all duration-500">
          <p className="text-xl text-[#e5e7eb] mb-8">
            Every project starts with a paid 1-on-1 session. Why? Because we only work with startups we believe can
            succeed.
          </p>

          <h3 className="text-2xl font-semibold text-[#fca5a5] mb-8">You'll Get:</h3>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center text-left">
                <benefit.icon className="h-6 w-6 text-[#fca5a5] mr-4 flex-shrink-0" />
                <span className="text-[#e5e7eb]">{benefit.text}</span>
              </div>
            ))}
          </div>

          <div className="bg-[#fca5a5]/10 rounded-2xl p-6 mb-8 border border-[#fca5a5]/20">
            <div className="flex items-center justify-center mb-4">
              <Target className="h-6 w-6 text-[#fca5a5] mr-2" />
              <span className="text-[#fca5a5] font-semibold">If it's a fit</span>
              <span className="text-[#e5e7eb] ml-2">— we'll draft the full project plan.</span>
            </div>
            <div className="flex items-center justify-center">
              <Target className="h-6 w-6 text-[#fca5a5] mr-2" />
              <span className="text-[#fca5a5] font-semibold">If not</span>
              <span className="text-[#e5e7eb] ml-2">— you still walk away with real value.</span>
            </div>
          </div>

          <Link href={CalendlyUrls.evaluation_url} target="_blank">
            <Button
              size="lg"
              className="bg-[#b91c1c] hover:bg-[#dc2626] text-white px-12 py-4 text-xl rounded-2xl shadow-lg hover:shadow-[#b91c1c]/25 hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              Book Your Call Now
            </Button>
          </Link>
          <div className="mt-6">
            <Link href={CalendlyUrls.qa_url} target="_blank">
              <Button
                variant="outline"
                size="lg"
                className="border-[#fca5a5] text-[#fca5a5] hover:bg-[#fca5a5]/10 hover:text-[#b91c1c] px-8 py-3 text-lg rounded-2xl transition-all duration-300"
              >
                Not sure yet? Book free Q&amp;A
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
