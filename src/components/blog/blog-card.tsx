import Image from "next/image"
import Link from "next/link";

interface Author {
    name: string
    avatar: string
}

interface BlogCardProps {
    featured?: boolean
    date: string
    title: string
    slug: string
    description?: string
    author: Author
    tags: string[]
    imageUrl: string
}

export default function BlogCard({
                                     featured = false,
                                     date,
                                     title,
                                     slug,
                                     description,
                                     author,
                                     tags,
                                     imageUrl,
                                 }: BlogCardProps) {
    return (
        <Link href={`/blog/${slug}`}
              className={`overflow-hidden rounded-lg bg-white ${featured ? "md:grid md:grid-cols-2" : ""}`}>
            <div className="relative aspect-video md:aspect-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20"/>
                <img src={imageUrl || "https://placehold.co/600x400?text=placeholder"} alt={title}
                     className="object-cover w-full h-full"/>
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage:
                            "url(\"data.ts:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h100v100H0z' fill='none' stroke='%23fff' stroke-width='0.25' stroke-opacity='0.1'/%3E%3C/svg%3E\")",
                        backgroundSize: "50px 50px",
                    }}
                />
            </div>
            <div className={`p-6 bg-white ${featured ? "md:p-8" : ""}`}>
                <div className="space-y-4">
                    <time className="text-sm text-gray-500">{date}</time>
                    <h3 className={`font-bold text-gray-900 ${featured ? "text-2xl md:text-3xl" : "text-xl"}`}>{title}</h3>
                    <p className="text-gray-600">{description}</p>
                    <div className="flex items-center justify-between pt-4">
                        <div className="flex items-center space-x-2">
                            <img
                                src={author.avatar || "https://placehold.co/600x400?text=placeholder"}
                                alt={author.name}
                                width={32}
                                height={32}
                                className="rounded-full"
                            />
                            <span className="text-sm text-gray-600">{author.name}</span>
                        </div>
                        <div className="flex space-x-2">
                            {tags.map((tag) => (
                                <span key={tag} className="text-xs text-gray-500">
                  #{tag}
                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}

