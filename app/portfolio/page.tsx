import { PortfolioHero } from "@/components/portfolio/portfolio-hero"
import { OwnProjectsSection } from "@/components/portfolio/own-projects-section"
import { ClientProjectsSection } from "@/components/portfolio/client-projects-section"
import { ProjectStatsSection } from "@/components/portfolio/project-stats-section"
import { TechStackSection } from "@/components/portfolio/tech-stack-section"
import { Footer } from "@/components/footer"

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-[#091113] text-[#e5e7eb]">
      <PortfolioHero />
      <ProjectStatsSection />
      <ClientProjectsSection />
      <TechStackSection />
      <Footer />
    </div>
  )
}
