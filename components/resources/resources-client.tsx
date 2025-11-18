"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import type { Article } from "@/lib/articles"

interface ResourcesClientProps {
  articles: Article[]
  featuredTags: string[]
}

export function ResourcesClient({ articles, featuredTags }: ResourcesClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tagFromUrl = searchParams.get("tag")
  const [selectedTag, setSelectedTag] = useState<string | null>(tagFromUrl)

  useEffect(() => {
    setSelectedTag(tagFromUrl)
  }, [tagFromUrl])

  const handleTagClick = (tag: string | null) => {
    if (tag) {
      router.push(`/resources?tag=${tag}`)
    } else {
      router.push("/resources")
    }
    setSelectedTag(tag)
  }

  const filteredArticles = selectedTag
    ? articles.filter((article) => article.tags.includes(selectedTag))
    : articles

  return (
    <>
      {/* Tag Filter */}
      {featuredTags.length > 0 && (
        <div className="mb-12">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => handleTagClick(null)}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                selectedTag === null
                  ? "bg-[#b91c1c] text-white"
                  : "bg-white/5 text-[#9ca3af] hover:bg-white/10 hover:text-[#fca5a5]"
              }`}
            >
              All Articles
            </button>
            {featuredTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                  selectedTag === tag
                    ? "bg-[#b91c1c] text-white"
                    : "bg-white/5 text-[#9ca3af] hover:bg-white/10 hover:text-[#fca5a5]"
                }`}
              >
                {tag
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Articles Grid */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-[#9ca3af] text-lg">No articles found for this category.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/resources/${article.slug}`}
              className="group bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden hover:border-[#fca5a5]/30 transition-all duration-300 hover:scale-105"
            >
              {/* Cover Image */}
              {article.coverImage ? (
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={article.coverImage}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="h-48 w-full bg-gradient-to-br from-[#b91c1c]/20 to-[#b91c1c]/5 flex items-center justify-center">
                  <div className="text-6xl text-[#fca5a5]/30">📄</div>
                </div>
              )}

              {/* Content */}
              <div className="p-6">
                {/* Tags */}
                {article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {article.tags.slice(0, 2).map((tag) => (
                      <button
                        key={tag}
                        onClick={(e) => {
                          e.preventDefault()
                          handleTagClick(tag)
                        }}
                        className="text-xs px-2 py-1 rounded-full bg-[#fca5a5]/10 text-[#fca5a5] border border-[#fca5a5]/20 hover:bg-[#fca5a5]/20 transition-colors"
                      >
                        {tag.split("-").join(" ")}
                      </button>
                    ))}
                  </div>
                )}
                <h2 className="text-xl font-bold text-[#e5e7eb] mb-3 group-hover:text-[#fca5a5] transition-colors">
                  {article.title}
                </h2>
                <p className="text-[#9ca3af] text-sm line-clamp-3">{article.excerpt}</p>
                <div className="mt-4 text-[#fca5a5] text-sm font-medium">Read more →</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
