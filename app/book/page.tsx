import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { BookingFlow } from "@/components/booking/booking-flow"

export const metadata = {
  title: "Get in Touch | Piranha Studios",
  description: "Tell us about your enquiry and book a time with the Piranha Studios team.",
}

export default function BookPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#091113] via-[#0f1419] to-[#1a1f24] text-[#e5e7eb]">
      <Navigation />

      <main className="pt-24 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#e5e7eb] to-[#9ca3af] bg-clip-text text-transparent">
              Talk to us
            </h1>
            <p className="text-xl text-[#9ca3af] max-w-2xl mx-auto">
              Share a few details, then pick a time and we&apos;ll be ready for the call.
            </p>
          </div>

          <BookingFlow />
        </div>
      </main>

      <Footer />
    </div>
  )
}
