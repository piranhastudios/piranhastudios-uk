import { HeroSection } from "@/components/hero-section"
import { PackagesSection } from "@/components/packages-section"
import { IntroSection } from "@/components/intro-section"
import { BenefitsSection } from "@/components/benefits-section"
import { ServicesSection } from "@/components/services-section"
import { ProcessSection } from "@/components/process-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { FAQSection } from "@/components/faq-section"
import { ContactSection } from "@/components/contact-section"
import { AeoSection } from "@/components/aeo-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#091113] text-[#e5e7eb]">
      <HeroSection />
      <PackagesSection />
      <IntroSection />
      <BenefitsSection />
      <ServicesSection />
      <div id="process" className="scroll-mt-20">
        <ProcessSection />
      </div>
      <TestimonialsSection />
      <FAQSection />
      <div id="contact" className="scroll-mt-20">
        <ContactSection />
      </div>
      <AeoSection />
      <Footer />
    </div>
  )
}
