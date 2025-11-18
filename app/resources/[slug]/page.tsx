import Image from "next/image"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { getArticleBySlug, getArticleSlugs } from "@/lib/articles"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export async function generateStaticParams() {
  const slugs = getArticleSlugs()
  return slugs.map((slug) => ({ slug }))
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = getArticleBySlug(slug)

  if (!article) {
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

  // Remove m-dashes and clean content
  const cleanContent = article.content
    .replace(/—/g, "-") // Replace em dash with regular dash
    .replace(/–/g, "-") // Replace en dash with regular dash

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
          {article.coverImage && (
            <div className="relative h-[400px] w-full rounded-3xl overflow-hidden mb-8 border border-white/10">
              <Image
                src={article.coverImage}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Article Content */}
          <article className="prose prose-invert prose-lg max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#e5e7eb] to-[#9ca3af] bg-clip-text text-transparent">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-3xl font-bold mt-12 mb-4 text-[#e5e7eb]">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-2xl font-bold mt-8 mb-3 text-[#e5e7eb]">{children}</h3>
                ),
                p: ({ children }) => <p className="text-[#9ca3af] mb-6 leading-relaxed">{children}</p>,
                ul: ({ children }) => <ul className="list-disc list-inside mb-6 text-[#9ca3af] space-y-2">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside mb-6 text-[#9ca3af] space-y-2">{children}</ol>,
                li: ({ children }) => <li className="text-[#9ca3af]">{children}</li>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-[#fca5a5] pl-6 py-2 mb-6 italic text-[#e5e7eb]">
                    {children}
                  </blockquote>
                ),
                code: ({ children }) => (
                  <code className="bg-white/5 px-2 py-1 rounded text-[#fca5a5] text-sm">
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre className="bg-white/5 p-4 rounded-xl overflow-x-auto mb-6 border border-white/10">
                    {children}
                  </pre>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    className="text-[#fca5a5] hover:text-[#b91c1c] underline transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
                img: ({ src, alt }) => {
                  // Skip the first image if it's the cover image
                  if (src === article.coverImage?.replace(`/articles/${article.slug}/`, "")) {
                    return null
                  }
                  return (
                    <div className="relative w-full h-[400px] my-8 rounded-xl overflow-hidden border border-white/10">
                      <Image
                        src={typeof src === 'string' && src.startsWith("/") ? src : `/articles/${article.slug}/${src}`}
                        alt={alt || ""}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )
                },
                hr: () => <hr className="border-white/10 my-12" />,
              }}
            >
              {cleanContent}
            </ReactMarkdown>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  )
}
