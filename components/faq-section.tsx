import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "How fast can you get me online?",
    answer:
      "Presence sites go live within 48 hours of receiving your details. Business builds take 4 working days from the day we have your logo, photos and product list.",
  },
  {
    question: "Do I need to buy anything else?",
    answer:
      "No. Domain, hosting and setup are included. Your site runs on our platform with a simple monthly subscription that covers hosting, updates and support.",
  },
  {
    question: "What happens after launch?",
    answer:
      "We don't disappear. Your subscription includes support, and you can upgrade from a one-page site to a full store, or from a store to custom software, without rebuilding from scratch.",
  },
  {
    question: "Can I start small and upgrade later?",
    answer:
      "Yes, that's the point. Every Presence site has a shop built in, dormant until you need it. Switching it on is a conversation, not a rebuild.",
  },
  {
    question: "Who owns the code and IP?",
    answer:
      "For Partner engagements, you do, delivered in your repositories. For Presence and Business, you own your domain, content and data, and can export at any time.",
  },
  {
    question: "What kind of projects do you take on?",
    answer:
      "Everything from one-page sites for local businesses to full platforms for funded startups in fintech, healthtech and e-commerce.",
  },
]

// Derived from the same array the page renders, so the rich result can never
// drift from what a visitor actually reads.
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
}

export function FAQSection() {
  return (
    <section id="faq" className="py-20 px-6 scroll-mt-20 bg-gradient-to-b from-transparent to-[#0f1419]/50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
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
