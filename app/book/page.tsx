import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { BookingFlow } from "@/components/booking/booking-flow"

export const metadata = {
  title: "Start a Project | Piranha Studios",
  description:
    "Pick your package, tell us about your business, pay your deposit and book your call. Websites from £100, stores from £500.",
}

/**
 * Read the query on the SERVER and hand it down as props.
 *
 * Doing this with useSearchParams() inside the client component instead would
 * push the whole flow into the Suspense fallback on a prerendered page, so
 * /book?package=business would serve a bare spinner and only pick the package
 * up after hydration. Reading searchParams here makes the page dynamic and the
 * chosen package is selected in the first paint.
 */
export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? null

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#091113] via-[#0f1419] to-[#1a1f24] text-[#e5e7eb]">
      <Navigation />

      <main className="pt-24 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#e5e7eb] to-[#9ca3af] bg-clip-text text-transparent">
              Let&apos;s get started
            </h1>
            <p className="text-xl text-[#9ca3af] max-w-2xl mx-auto">
              Pick your package, send us your details, then choose a time. We&apos;ll be ready for the call.
            </p>
          </div>

          <BookingFlow
            initialPackage={first(params.package)}
            sessionId={first(params.session_id)}
            cancelled={first(params.cancelled) === "1"}
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}
