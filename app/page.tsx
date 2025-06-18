import { HeroSection } from "@/components/hero-section"
import { IntroSection } from "@/components/intro-section"
import { BenefitsSection } from "@/components/benefits-section"
import { ServicesSection } from "@/components/services-section"
import { EvaluationSection } from "@/components/evaluation-section"
import { ProcessSection } from "@/components/process-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { FAQSection } from "@/components/faq-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#091113] text-[#e5e7eb]">
      <HeroSection />
      <IntroSection />
      <BenefitsSection />
      <div id="services">
        <ServicesSection />
      </div>
      <EvaluationSection />
      <div id="process">
        <ProcessSection />
      </div>
      <TestimonialsSection />
      <FAQSection />
      <div id="contact">
        <ContactSection />
      </div>
      <Footer />
    </div>
  )
}
