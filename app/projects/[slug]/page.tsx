import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ExternalLink, TrendingUp } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { PostBody } from "@/components/resources/post-body"
import { getSuccessStoryBySlug, getSuccessStorySlugs } from "@/lib/sanity/posts"

export const revalidate = 60

export async function generateStaticParams() {
  const slugs = await getSuccessStorySlugs()
  return slugs.map((slug) => ({ slug }))
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = await getSuccessStoryBySlug(slug)

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#091113] via-[#0f1419] to-[#1a1f24] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#e5e7eb] mb-4">Project Not Found</h1>
          <Link href="/portfolio" className="text-[#fca5a5] hover:underline">
            Back to Portfolio
          </Link>
        </div>
      </div>
    )
  }

  const hasBody = Array.isArray(project.body) && project.body.length > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#091113] via-[#0f1419] to-[#1a1f24]">
      <Navigation />

      <main className="pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Link */}
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-[#9ca3af] hover:text-[#fca5a5] transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Portfolio
          </Link>

          {/* Cover Image */}
          {project.coverImage && (
            <div className="relative h-[400px] w-full rounded-3xl overflow-hidden mb-8 border border-white/10">
              <Image src={project.coverImage} alt={project.title} fill className="object-cover" priority />
            </div>
          )}

          {/* Title + client */}
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-[#e5e7eb] to-[#9ca3af] bg-clip-text text-transparent">
              {project.title}
            </h1>
            {project.client && <p className="text-xl text-[#fca5a5] font-medium">{project.client}</p>}
            {project.description && <p className="text-[#9ca3af] mt-4 text-lg leading-relaxed">{project.description}</p>}
          </header>

          {/* Meta grid */}
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {project.timeline && (
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-[#fca5a5] text-sm font-semibold mb-1">Timeline</p>
                <p className="text-[#e5e7eb] font-bold">{project.timeline}</p>
              </div>
            )}
            {project.status && (
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-[#fca5a5] text-sm font-semibold mb-1">Status</p>
                <p className="text-[#e5e7eb] font-bold">{project.status}</p>
              </div>
            )}
          </div>

          {/* Outcome */}
          {project.outcome && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-8">
              <div className="flex items-center mb-1">
                <TrendingUp className="h-4 w-4 text-green-400 mr-2" />
                <p className="text-green-400 text-sm font-semibold">Key Outcome</p>
              </div>
              <p className="text-[#e5e7eb] font-medium">{project.outcome}</p>
            </div>
          )}

          {/* Tech stack */}
          {project.tech.length > 0 && (
            <div className="mb-8">
              <p className="text-[#fca5a5] text-sm font-semibold mb-2">Tech stack</p>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-[#fca5a5]/20 text-[#fca5a5] rounded-full text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Body */}
          {hasBody && <PostBody value={project.body as React.ComponentProps<typeof PostBody>["value"]} />}

          {/* Live link */}
          {project.liveUrl && !project.isConfidential && (
            <div className="mt-10">
              <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                <Button className="bg-[#b91c1c] hover:bg-[#dc2626] text-white rounded-xl px-6">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Visit the live site
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
