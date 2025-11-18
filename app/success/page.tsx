"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Check, Loader2 } from "lucide-react"
import Link from "next/link"

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [webhookSent, setWebhookSent] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const sendWebhook = async () => {
      if (!sessionId) {
        setIsLoading(false)
        return
      }

      try {
        // First get session details from our API
        const sessionResponse = await fetch(`/api/get-session-details?session_id=${sessionId}`)
        const sessionData = await sessionResponse.json()

        const response = await fetch(process.env.NEXT_PUBLIC_CLIENT_ONBOARDING_N8N_URL as string, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            session_id: sessionId,
            timestamp: new Date().toISOString(),
            event: "checkout_success",
            package_name: sessionData?.package_name,
            package_price: sessionData?.package_price,
            customer_email: sessionData?.customer_email,
            subscription_id: sessionData?.subscription_id,
          }),
        })

        if (response.ok) {
          setWebhookSent(true)
        }
      } catch (error) {
        console.error("Failed to send webhook:", error)
      } finally {
        setIsLoading(false)
      }
    }

    sendWebhook()
  }, [sessionId])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1419] via-[#1a1f2e] to-[#0f1419] flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl text-center">
          {isLoading ? (
            <>
              <Loader2 className="h-16 w-16 text-[#fca5a5] mx-auto mb-6 animate-spin" />
              <h1 className="text-2xl font-bold text-[#e5e7eb] mb-4">
                Processing your subscription...
              </h1>
              <p className="text-[#9ca3af] mb-6">
                Please wait while we set up your account.
              </p>
            </>
          ) : (
            <>
              <div className="h-16 w-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="h-8 w-8 text-white" />
              </div>
              
              <h1 className="text-3xl font-bold text-[#e5e7eb] mb-4">
                Payment Successful!
              </h1>
              
              <p className="text-[#9ca3af] mb-6">
                Thank you for subscribing to our services. Your subscription has been activated and you'll receive a confirmation email shortly.
              </p>

              {sessionId && (
                <div className="bg-white/5 rounded-xl p-4 mb-6">
                  <p className="text-sm text-[#9ca3af] mb-2">Session ID:</p>
                  <p className="text-xs text-[#e5e7eb] font-mono break-all">{sessionId}</p>
                  {webhookSent && (
                    <p className="text-xs text-green-400 mt-2">✓ Notification sent</p>
                  )}
                </div>
              )}

              <div className="space-y-4">
                <Link href="/">
                  <Button className="w-full bg-[#b91c1c] hover:bg-[#dc2626] text-white rounded-xl">
                    Return to Homepage
                  </Button>
                </Link>
                
                <Link href="/#services">
                  <Button variant="outline" className="w-full border-white/20 text-[#e5e7eb] hover:bg-white/10 rounded-xl">
                    View Services
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-[#9ca3af]">
            Questions? Contact us at{" "}
            <a href="mailto:support@piranhastudios.co.uk" className="text-[#fca5a5] hover:underline">
              support@piranhastudios.co.uk
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
