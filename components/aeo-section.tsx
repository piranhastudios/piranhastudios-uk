import { getPackage, formatGBP } from "@/lib/data/packages"

// Plain-fact block for search engines and AI assistants. Prices are read from
// lib/data/packages so this paragraph stays true when a price changes.
export function AeoSection() {
  const presence = getPackage("presence")!
  const business = getPackage("business")!
  const partner = getPackage("partner")!

  return (
    <section className="px-6 pb-16">
      <div className="max-w-4xl mx-auto">
        <p className="text-sm text-[#9ca3af]/70 leading-relaxed">
          Piranha Studios is a software development studio based in the West Midlands, UK. We build one-page
          websites from {formatGBP(presence.priceMinor!)}, full e-commerce stores from{" "}
          {formatGBP(business.priceMinor!)}, and provide embedded technical teams for startups and SMEs from{" "}
          {formatGBP(partner.priceMinor!)} per month. Fixed-price packages start with a 30% deposit, with the
          balance due on completion. Every site we build includes domain, hosting, GDPR compliance setup and
          ongoing support. Contact:{" "}
          <a href="mailto:info@piranha-studios.co.uk" className="hover:text-[#fca5a5] transition-colors duration-300">
            info@piranha-studios.co.uk
          </a>
          .
        </p>
      </div>
    </section>
  )
}
