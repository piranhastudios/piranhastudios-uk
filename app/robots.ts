import type { MetadataRoute } from "next"

const SITE_URL = "https://piranha-studios.co.uk"

// The long-form brief for assistants lives at /llms.txt; it is advertised via
// <link rel="alternate"> in the layout and a footer link, since robots.txt has
// no directive for it.
//
// Nothing here was being served before, so crawlers had no sitemap and no
// guidance. Client-only areas are excluded; everything public is open,
// including to the AI crawlers that answer "who builds websites in
// Stoke-on-Trent" style questions.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/client-portal", "/success", "/test"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
