import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "What kind of projects do you take on?",
    answer:
      "I focus on early-stage startups building web applications, SaaS tools, and digital products. I work with founders who need technical expertise but want to maintain equity and control.",
  },
  {
    question: "What do I get in the £50 evaluation?",
    answer:
      "A comprehensive 30-45 minute call where we discuss your idea, I provide honest feedback on viability, create a custom project brief, and potentially provide early UI mockups or improvement suggestions.",
  },
  {
    question: "Can I upgrade from subscription to full build later?",
    answer:
      "Many clients start with the Growth plan to test the waters, then upgrade to Scale or Custom when they're ready for a full MVP build.",
  },
  {
    question: "Do you help after the MVP is live?",
    answer:
      "Yes, I offer ongoing support through the Starter and Growth plans. Even Scale clients get 30 days of included support, with options to continue with monthly retainers.",
  },
  {
    question: "Who owns the code and IP?",
    answer:
      "You own everything. All code, designs, and intellectual property belong to you. I use open-source technologies to ensure no vendor lock-in.",
  },
  {
    question: "Do you support e-commerce/health/fintech?",
    answer:
      "I work across various industries, but I'm particularly experienced with SaaS, marketplaces, and productivity tools. For highly regulated industries like fintech or health, we'll discuss compliance requirements during the evaluation.",
  },
]

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
