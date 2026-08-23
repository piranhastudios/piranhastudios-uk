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
  title: "Web Design & Software Development Stoke-on-Trent | Piranha Studios",
  description:
    "Web design and software development studio in Stoke-on-Trent, Staffordshire. Websites from £100, online stores from £500, custom software on retainer. UK-wide.",
  keywords: [
    "Piranha Studios",
    "web design Stoke-on-Trent",
    "website design Staffordshire",
    "software developer Stoke-on-Trent",
    "web developer Staffordshire",
    "ecommerce website Stoke-on-Trent",
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
      "Get online from £100. Start selling from £500. Or bring us in as your tech team. Built in Stoke-on-Trent.",
    url: SITE_URL,
    siteName: "Piranha Studios",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Piranha Studios: Websites, Stores & Software for Founders & SMEs",
    description:
      "Get online from £100. Start selling from £500. Or bring us in as your tech team. Built in Stoke-on-Trent.",
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
    "Software development studio based in Stoke-on-Trent, Staffordshire, building websites, online stores and custom software for founders and SMEs. One-page websites from £100 live in 48 hours, e-commerce stores from £500 live in 4 working days, and embedded technical teams from £600 per month. Fixed-price packages start with a 30% deposit, balance due on completion. Domain, hosting, GDPR compliance setup and ongoing support are included. Work covers business websites, online stores, SaaS platforms and MVPs, customer portals, internal tools and dashboards, and integrations for payments, CRM and inventory. Built on open-source technology including Next.js, React, TypeScript and PostgreSQL; clients own their code and IP. Delivered in fintech, healthtech, e-commerce, hospitality and professional services. In person across Stoke-on-Trent and Staffordshire, remote throughout the UK.",
  slogan: "Get your business online. Properly.",
  url: SITE_URL,
  email: "info@piranha-studios.co.uk",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Stoke-on-Trent",
    addressRegion: "Staffordshire",
    addressCountry: "GB",
  },
  areaServed: [
    { "@type": "City", name: "Stoke-on-Trent" },
    { "@type": "AdministrativeArea", name: "Staffordshire" },
    { "@type": "AdministrativeArea", name: "West Midlands" },
    { "@type": "Country", name: "United Kingdom" },
  ],
  sameAs: [
    "https://github.com/piranhastudios/",
    "https://www.linkedin.com/company/piranha-studios-solutions",
  ],
  knowsAbout: [
    "Web design",
    "Web development",
    "E-commerce development",
    "Custom software development",
    "SaaS development",
    "MVP development",
    "System integration",
    "Next.js",
    "React",
    "TypeScript",
    "PostgreSQL",
  ],
  priceRange: "££",
  // Derived from lib/data/packages so the published prices and the structured
  // data can never disagree.
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Services",
    itemListElement: [
      "Business website design and development",
      "E-commerce store build, including payments and delivery setup",
      "Custom software development: SaaS platforms, MVPs and customer portals",
      "Internal tools, dashboards and workflow automation",
      "System integrations for payments, CRM and inventory",
      "Technical advisory: architecture, tooling, roadmap and hiring",
    ].map((name) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name, provider: { "@id": SITE_URL } },
    })),
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    email: "info@piranha-studios.co.uk",
    areaServed: "GB",
    availableLanguage: "English",
  },
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
        {/*
          Points machine readers at the long-form brief. A <link rel="alternate">
          is the discoverable way to advertise it; the meta description is left
          for humans, since that is what shows under the result in search.
        */}
        <link
          rel="alternate"
          type="text/plain"
          href="/llms.txt"
          title="Piranha Studios: plain-text brief for AI assistants"
        />
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
