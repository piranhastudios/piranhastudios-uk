import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { PostBody } from "@/components/resources/post-body"
import { getBlogPostBySlug, getBlogPostSlugs } from "@/lib/sanity/posts"

export const revalidate = 60

export async function generateStaticParams() {
  const slugs = await getBlogPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#091113] via-[#0f1419] to-[#1a1f24] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#e5e7eb] mb-4">Article Not Found</h1>
          <Link href="/resources" className="text-[#fca5a5] hover:underline">
            Back to Resources
          </Link>
        </div>
      </div>
    )
  }

  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })
    : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#091113] via-[#0f1419] to-[#1a1f24]">
      <Navigation />

      <main className="pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Link */}
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 text-[#9ca3af] hover:text-[#fca5a5] transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Resources
          </Link>

          {/* Cover Image */}
          {post.coverImage && (
            <div className="relative h-[400px] w-full rounded-3xl overflow-hidden mb-8 border border-white/10">
              <Image src={post.coverImage} alt={post.title} fill className="object-cover" priority />
            </div>
          )}

          {/* Title + meta */}
          <header className="mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#e5e7eb] to-[#9ca3af] bg-clip-text text-transparent">
              {post.title}
            </h1>
            <p className="text-[#9ca3af]">
              {post.author}
              {date ? ` · ${date}` : ""}
            </p>
          </header>

          {/* Body */}
          <PostBody value={post.body as React.ComponentProps<typeof PostBody>["value"]} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
