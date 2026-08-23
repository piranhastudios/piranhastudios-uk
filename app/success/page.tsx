"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Link from "next/link"

// The package flow returns to /book after checkout, so this page is only a
// fallback for older payment links. The deposit is recorded by the Stripe
// webhook, not here, so there is nothing to do on load.
function SuccessContent() {
  const sessionId = useSearchParams().get("session_id")

  return (
    <div className="max-w-md w-full">
      <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl text-center">
        <div className="h-16 w-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="h-8 w-8 text-white" />
        </div>

        <h1 className="text-3xl font-bold text-[#e5e7eb] mb-4">Payment received</h1>

        <p className="text-[#9ca3af] mb-6">
          Thank you. Your receipt is on its way from Stripe and we&apos;ll be in touch to get started.
        </p>

        {sessionId && (
          <div className="bg-white/5 rounded-xl p-4 mb-6">
            <p className="text-sm text-[#9ca3af] mb-2">Reference:</p>
            <p className="text-xs text-[#e5e7eb] font-mono break-all">{sessionId}</p>
          </div>
        )}

        <div className="space-y-4">
          <Link href="/book">
            <Button className="w-full bg-[#b91c1c] hover:bg-[#dc2626] text-white rounded-xl">
              Book your call
            </Button>
          </Link>

          <Link href="/">
            <Button variant="outline" className="w-full border-white/20 bg-transparent text-[#e5e7eb] hover:bg-white/10 rounded-xl">
              Return to homepage
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-[#9ca3af]">
          Questions? Contact us at{" "}
          <a href="mailto:info@piranha-studios.co.uk" className="text-[#fca5a5] hover:underline">
            info@piranha-studios.co.uk
          </a>
        </p>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1419] via-[#1a1f2e] to-[#0f1419] flex items-center justify-center px-6">
      <Suspense fallback={null}>
        <SuccessContent />
      </Suspense>
    </div>
  )
}
