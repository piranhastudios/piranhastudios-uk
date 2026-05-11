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
  title: "Piranha Studios — Applied AI & Software Systems for Ambitious Founders",
  description:
    "A UK-based development studio and tech holding company building applied AI and production software for fintech, healthtech, and e-commerce.",
  keywords: [
    "Piranha Studios",
    "applied AI",
    "AI systems",
    "software development studio",
    "MVP development",
    "fintech development",
    "healthtech development",
    "e-commerce development",
    "Medusa development",
    "StoreFactory",
    "UK software studio",
    "Stoke-on-Trent",
  ],
  authors: [{ name: "Piranha Studios Ltd" }],
  creator: "Piranha Studios Ltd",
  publisher: "Piranha Studios Ltd",
  metadataBase: new URL("https://piranhastudios.co.uk"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Piranha Studios — Applied AI & Software Systems for Ambitious Founders",
    description:
      "We build applied AI and production software for fintech, healthtech, and e-commerce. A UK development studio and tech holding company.",
    url: "https://piranhastudios.co.uk",
    siteName: "Piranha Studios",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Piranha Studios — Applied AI & Software Systems for Ambitious Founders",
    description:
      "UK development studio building applied AI and production software for fintech, healthtech, and e-commerce.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
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
