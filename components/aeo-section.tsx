import { getPackage, formatGBP } from "@/lib/data/packages"

/**
 * Compact, human-facing summary line.
 *
 * The long-form detail this used to carry now lives where machines are meant
 * to read it: the LocalBusiness JSON-LD in app/layout.tsx and /llms.txt. Those
 * are invisible to a visitor by design, which is the legitimate way to do this.
 * Hiding on-page text from users while serving it to crawlers is cloaking, and
 * risks the whole domain.
 *
 * What stays visible is what a real visitor benefits from anyway: where we are,
 * what it costs, and how to reach us.
 */
export function AeoSection() {
  const presence = getPackage("presence")!
  const business = getPackage("business")!
  const partner = getPackage("partner")!

  return (
    <section className="px-6 pb-12">
      <div className="max-w-4xl mx-auto">
        <p className="text-xs text-[#9ca3af]/60 leading-relaxed text-center">
          Piranha Studios is a software development studio in Stoke-on-Trent, Staffordshire, working across the
          UK. Websites from {formatGBP(presence.priceMinor!)}, online stores from{" "}
          {formatGBP(business.priceMinor!)}, embedded technical teams from {formatGBP(partner.priceMinor!)} per
          month.{" "}
          <a href="mailto:info@piranha-studios.co.uk" className="hover:text-[#fca5a5] transition-colors duration-300">
            info@piranha-studios.co.uk
          </a>
        </p>
      </div>
    </section>
  )
}
