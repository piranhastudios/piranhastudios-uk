import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Link from "next/link"
import { PACKAGES, depositMinor, balanceMinor, formatGBP, DEPOSIT_RATE } from "@/lib/data/packages"

const DEPOSIT_LABEL = `${Math.round(DEPOSIT_RATE * 100)}%`

export function PackagesSection() {
  return (
    <section id="packages" className="py-20 px-6 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#e5e7eb] to-[#9ca3af] bg-clip-text text-transparent">
            Three ways to work with us
          </h2>
          <p className="text-xl text-[#9ca3af] max-w-3xl mx-auto">
            Plain prices. No quotes, no mystery. Pick the one that fits and we'll get you started.
          </p>
          <p className="text-[#9ca3af]/70 mt-3">
            Fixed-price packages start with a {DEPOSIT_LABEL} deposit. The balance is due on completion.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {PACKAGES.map((pkg) => {
            const deposit = depositMinor(pkg)
            const balance = balanceMinor(pkg)
            return (
              <div
                key={pkg.id}
                className={`h-full flex flex-col bg-white/5 backdrop-blur-md rounded-3xl p-8 border shadow-lg transition-all duration-500 hover:bg-white/10 hover:scale-[1.02] ${
                  pkg.featured
                    ? "border-[#b91c1c]/40 shadow-[#b91c1c]/10 lg:-mt-4 lg:pb-12"
                    : "border-white/10 hover:shadow-[#fca5a5]/20"
                }`}
              >
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-[#e5e7eb] mb-2">{pkg.name}</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-bold text-[#fca5a5]">{pkg.price}</span>
                    {pkg.priceNote && <span className="text-[#9ca3af] text-lg">{pkg.priceNote}</span>}
                  </div>
                  <p className="text-sm text-[#9ca3af]/80 mb-3">
                    {deposit !== null && balance !== null
                      ? `${formatGBP(deposit)} to start, ${formatGBP(balance)} on completion`
                      : "No deposit. Scoped on the call, invoiced monthly."}
                  </p>
                  <p className="text-[#e5e7eb] font-medium">{pkg.tagline}</p>
                </div>

                <ul className="space-y-3 mb-6 flex-1">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-start text-[#9ca3af]">
                      <Check className="h-4 w-4 text-[#fca5a5] mr-3 mt-1 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {pkg.footnote && <p className="text-sm text-[#9ca3af]/70 mb-6 italic">{pkg.footnote}</p>}

                <Link href={`/book?package=${pkg.id}`} className="mt-auto">
                  <Button
                    className={`w-full rounded-xl py-6 text-base shadow-lg transition-all duration-300 ${
                      pkg.featured
                        ? "bg-[#b91c1c] hover:bg-[#dc2626] text-white hover:shadow-[#b91c1c]/25"
                        : "bg-white/10 hover:bg-white/20 text-[#e5e7eb] border border-white/20"
                    }`}
                  >
                    {pkg.cta}
                  </Button>
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
