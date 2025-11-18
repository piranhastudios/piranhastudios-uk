import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Suspense } from "react"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { LoadingSpinner } from "@/components/loading-spinner"
import { CookieConsent } from "@/components/cookie-consent"
import { AnalyticsTracker } from "@/components/AnalyticsTracker"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Piranha Studios - Startup MVPs Built Fast",
  description:
    "A solo studio helping founders launch bold products without giving up equity. From idea to MVP in 4-8 weeks.",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AnalyticsTracker>
          <Navigation />
          <Suspense fallback={<LoadingSpinner />}>
            <main className="pt-16">{children}</main>
          </Suspense>
          <CookieConsent />
        </AnalyticsTracker>
      </body>
    </html>
  )
}
