import type { MetadataRoute } from "next"
import { getBlogPostSlugs, getSuccessStorySlugs } from "@/lib/sanity/posts"

const SITE_URL = "https://piranha-studios.co.uk"

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/book`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/portfolio`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/resources`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/legal`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ]

  // Sanity is the source of truth for both content types. A CMS outage must not
  // produce an empty sitemap, so fall back to the static routes.
  const [blog, stories] = await Promise.all([
    getBlogPostSlugs().catch(() => [] as string[]),
    getSuccessStorySlugs().catch(() => [] as string[]),
  ])

  return [
    ...staticRoutes,
    ...blog.map(slug => ({
      url: `${SITE_URL}/resources/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...stories.map(slug => ({
      url: `${SITE_URL}/projects/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ]
}
