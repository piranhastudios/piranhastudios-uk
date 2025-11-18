import Link from "next/link"
import Image from "next/image"
import { getAllArticles, getFeaturedTags } from "@/lib/articles"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ResourcesClient } from "@/components/resources/resources-client"
import { ResourcesSkeleton } from "@/components/resources/resources-skeleton"
import { Suspense } from "react"

export default function ResourcesPage() {
  const articles = getAllArticles()
  const featuredTags = getFeaturedTags()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#091113] via-[#0f1419] to-[#1a1f24]">
      <Navigation />

      <main className="pt-24 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#e5e7eb] to-[#9ca3af] bg-clip-text text-transparent">
              Resources & Insights
            </h1>
            <p className="text-xl text-[#9ca3af] max-w-3xl mx-auto">
              Practical advice on building better products, faster
            </p>
          </div>
          <Suspense fallback={<ResourcesSkeleton />}>
            <ResourcesClient articles={articles} featuredTags={featuredTags} />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  )
}
