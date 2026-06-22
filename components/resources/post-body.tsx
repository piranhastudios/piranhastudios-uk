import Image from "next/image"
import { PortableText } from "@portabletext/react"
import { urlForImage } from "@/lib/sanity/image"

type PTValue = React.ComponentProps<typeof PortableText>["value"]
type PTComponents = React.ComponentProps<typeof PortableText>["components"]

const components: PTComponents = {
  block: {
    h2: ({ children }) => <h2 className="text-3xl font-bold mt-12 mb-4 text-[#e5e7eb]">{children}</h2>,
    h3: ({ children }) => <h3 className="text-2xl font-bold mt-8 mb-3 text-[#e5e7eb]">{children}</h3>,
    h4: ({ children }) => <h4 className="text-xl font-bold mt-6 mb-2 text-[#e5e7eb]">{children}</h4>,
    normal: ({ children }) => <p className="text-[#9ca3af] mb-6 leading-relaxed">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-[#fca5a5] pl-6 py-2 mb-6 italic text-[#e5e7eb]">{children}</blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc list-inside mb-6 text-[#9ca3af] space-y-2">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal list-inside mb-6 text-[#9ca3af] space-y-2">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="text-[#9ca3af]">{children}</li>,
    number: ({ children }) => <li className="text-[#9ca3af]">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="text-[#e5e7eb] font-semibold">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ children, value }) => (
      <a
        href={(value as { href?: string })?.href}
        className="text-[#fca5a5] hover:text-[#b91c1c] underline transition-colors"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }) => {
      const source = value as SanityImageValue
      if (!source?.asset) return null
      return (
        <div className="relative w-full h-[400px] my-8 rounded-xl overflow-hidden border border-white/10">
          <Image src={urlForImage(source).width(1200).url()} alt={source.alt ?? ""} fill className="object-cover" />
        </div>
      )
    },
  },
}

type SanityImageValue = { asset?: { _ref?: string }; alt?: string }

export function PostBody({ value }: { value: PTValue }) {
  return (
    <article className="prose prose-invert prose-lg max-w-none">
      <PortableText value={value} components={components} />
    </article>
  )
}
