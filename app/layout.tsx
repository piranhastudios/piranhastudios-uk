import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Suspense } from "react"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { LoadingSpinner } from "@/components/loading-spinner"
import { CookieConsent } from "@/components/cookie-consent"
import { AnalyticsTracker } from "@/components/AnalyticsTracker"
import { PACKAGES } from "@/lib/data/packages"

const inter = Inter({ subsets: ["latin"] })

const SITE_URL = "https://piranha-studios.co.uk"

export const metadata: Metadata = {
  title: "Web Design & Software Studio West Midlands | Piranha Studios",
  description:
    "Websites from £100, online stores from £500, custom software on retainer. Piranha Studios makes the digital world simpler for founders & SMEs. West Midlands, UK.",
  keywords: [
    "Piranha Studios",
    "web design West Midlands",
    "website from £100",
    "online store build",
    "e-commerce development",
    "custom software development",
    "software development studio",
    "technical partner",
    "MVP development",
    "fintech development",
    "healthtech development",
    "UK software studio",
  ],
  authors: [{ name: "Piranha Studios Ltd" }],
  creator: "Piranha Studios Ltd",
  publisher: "Piranha Studios Ltd",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Piranha Studios: Websites, Stores & Software for Founders & SMEs",
    description:
      "Get online from £100. Start selling from £500. Or bring us in as your tech team. Built in the West Midlands.",
    url: SITE_URL,
    siteName: "Piranha Studios",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Piranha Studios: Websites, Stores & Software for Founders & SMEs",
    description:
      "Get online from £100. Start selling from £500. Or bring us in as your tech team. Built in the West Midlands.",
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

// LocalBusiness + published package pricing, so search engines and AI
// assistants can quote our prices without guessing.
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": SITE_URL,
  name: "Piranha Studios",
  description:
    "Software development studio building websites, online stores and custom software for founders and SMEs.",
  url: SITE_URL,
  email: "info@piranha-studios.co.uk",
  address: {
    "@type": "PostalAddress",
    addressRegion: "West Midlands",
    addressCountry: "GB",
  },
  priceRange: "££",
  // Derived from lib/data/packages so the published prices and the structured
  // data can never disagree.
  makesOffer: PACKAGES.map((pkg) => ({
    "@type": "Offer",
    name: pkg.name,
    price: String((pkg.priceMinor ?? 0) / 100),
    priceCurrency: "GBP",
    description: pkg.checkoutDescription,
  })),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
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
