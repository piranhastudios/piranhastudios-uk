import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
const faqs = [
  {
    question: "What kind of projects do you take on?",
    answer:
      "Piranha Studios works with founders and SMEs that need stable, scalable digital infrastructure. We build SaaS platforms, marketplaces, data-driven dashboards, operational backends, healthcare systems, fintech tooling, and modern e-commerce setups. If you need a long-term technical partner rather than one-off freelancers, we’re a strong fit.",
  },
  {
    question: "What does the initial discovery include?",
    answer:
      "For small projects, we run a focused 4-hour discovery session to map out your goals, core features, user journeys, and technical approach. For larger or complex products, we run a full two-week discovery sprint covering architecture, data models, integrations, workflows, UX flows, and delivery planning. You always walk away with a clear, build-ready blueprint.",
  },
  {
    question: "Can I upgrade from a subscription to a full build later?",
    answer:
      "Yes. Many clients start on a subscription to validate ideas, launch early features, or get initial traction. When the business is ready, we transition into a full build. Everything created during the subscription phase rolls into the final system with no wasted work.",
  },
  {
    question: "Do you help after the MVP is live?",
    answer:
      "Yes. Ongoing support is part of how we work. Subscription clients stay with us month-to-month, and full-build clients get structured post-launch support with the option to continue on a long-term plan. We stay involved to keep the system stable, secure, and evolving.",
  },
  {
    question: "Who owns the code and IP?",
    answer:
      "You own everything. All code, architecture, designs, and intellectual property belong to you. We build using open, modern technologies so you’re never locked into proprietary platforms or dependent on a single developer.",
  },
  {
    question: "Do you support e-commerce, health, and fintech projects?",
    answer:
      "Yes. We work across multiple industries, but we specialise in marketplaces, SaaS products, and operational platforms. For regulated sectors like healthcare and finance, we align architecture with the required compliance standards during discovery.",
  },
];


export function FAQSection() {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-transparent to-[#0f1419]/50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-[#e5e7eb] to-[#9ca3af] bg-clip-text text-transparent">
          Frequently Asked Questions
        </h2>

        <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-white/10 last:border-b-0">
                <AccordionTrigger className="px-8 py-6 text-left text-[#e5e7eb] hover:text-[#fca5a5] transition-colors duration-300 text-lg font-semibold">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-8 pb-6 text-[#9ca3af] text-base leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
