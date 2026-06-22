import type { SanityImageSource } from "@sanity/image-url"
import type { Article } from "@/lib/articles"
import { sanityClient } from "./client"
import { urlForImage } from "./image"

export const CATEGORY_LABELS: Record<string, string> = {
  blog: "Blog",
  "success-story": "Client Success Story",
}

const imgUrl = (image: SanityImageSource | undefined, w: number, h: number) =>
  image ? urlForImage(image).width(w).height(h).fit("crop").url() : null

// The cover image is the gallery item flagged as the thumbnail, falling back to
// the legacy top-level `image` field for posts created before the gallery.
const COVER = `"cover": coalesce(gallery[isThumbnail == true][0].image, image)`

export type GalleryImage = { url: string; alt: string }

type RawGalleryItem = { image?: SanityImageSource; alt?: string }

const mapGallery = (items: RawGalleryItem[] | undefined): GalleryImage[] =>
  (items ?? [])
    .filter((i): i is { image: SanityImageSource; alt?: string } => Boolean(i.image))
    .map((i) => ({ url: urlForImage(i.image).width(1600).fit("max").url(), alt: i.alt ?? "" }))

/* -------------------------------- Blog -------------------------------- */

type RawBlogListItem = {
  title: string
  slug: string
  author?: string
  publishedAt?: string
  description?: string
  cover?: SanityImageSource
}

// Returns blog posts mapped onto the existing Article shape used by the
// resources listing/cards.
export async function getBlogPosts(): Promise<Article[]> {
  const posts = await sanityClient.fetch<RawBlogListItem[]>(
    `*[_type == "post" && category == "blog" && defined(slug.current)] | order(publishedAt desc){
      title, "slug": slug.current, author, publishedAt, description, ${COVER}
    }`,
  )
  return posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    coverImage: imgUrl(p.cover, 800, 600),
    excerpt: p.description ?? "",
    content: "",
    tags: [],
    date: p.publishedAt ?? "",
    author: p.author ?? "Piranha Studios",
  }))
}

export type BlogPost = {
  title: string
  author?: string
  publishedAt?: string
  coverImage: string | null
  gallery: GalleryImage[]
  body: unknown[]
}

type RawBlogPost = Omit<BlogPost, "coverImage" | "gallery"> & {
  cover?: SanityImageSource
  gallery?: RawGalleryItem[]
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const post = await sanityClient.fetch<RawBlogPost | null>(
    `*[_type == "post" && category == "blog" && slug.current == $slug][0]{
      title, author, publishedAt, ${COVER}, gallery[]{image, alt}, body
    }`,
    { slug },
  )
  if (!post) return null
  return {
    title: post.title,
    author: post.author,
    publishedAt: post.publishedAt,
    coverImage: imgUrl(post.cover, 1200, 600),
    gallery: mapGallery(post.gallery),
    body: post.body ?? [],
  }
}

export async function getBlogPostSlugs(): Promise<string[]> {
  return sanityClient.fetch<string[]>(
    `*[_type == "post" && category == "blog" && defined(slug.current)].slug.current`,
  )
}

/* --------------------------- Success stories --------------------------- */

export type SuccessStoryCard = {
  slug: string
  title: string
  client?: string
  description?: string
  image: string | null
  tech: string[]
  timeline?: string
  status?: string
  outcome?: string
  featured?: boolean
}

type RawStoryCard = Omit<SuccessStoryCard, "image" | "tech"> & {
  cover?: SanityImageSource
  tech?: string[]
}

// Powers the portfolio "Client Projects" section.
export async function getSuccessStories(): Promise<SuccessStoryCard[]> {
  const rows = await sanityClient.fetch<RawStoryCard[]>(
    `*[_type == "post" && category == "success-story" && defined(slug.current)] | order(featured desc, publishedAt desc){
      "slug": slug.current, title, client, description, ${COVER}, tech, timeline, status, outcome, featured
    }`,
  )
  return rows.map((r) => ({
    slug: r.slug,
    title: r.title,
    client: r.client,
    description: r.description,
    image: imgUrl(r.cover, 800, 500),
    tech: r.tech ?? [],
    timeline: r.timeline,
    status: r.status,
    outcome: r.outcome,
    featured: r.featured,
  }))
}

export type SuccessStory = {
  title: string
  client?: string
  description?: string
  coverImage: string | null
  tech: string[]
  timeline?: string
  status?: string
  outcome?: string
  liveUrl?: string
  isConfidential?: boolean
  author?: string
  publishedAt?: string
  gallery: GalleryImage[]
  body: unknown[]
}

type RawStory = Omit<SuccessStory, "coverImage" | "tech" | "gallery"> & {
  cover?: SanityImageSource
  gallery?: RawGalleryItem[]
  tech?: string[]
}

export async function getSuccessStoryBySlug(slug: string): Promise<SuccessStory | null> {
  const story = await sanityClient.fetch<RawStory | null>(
    `*[_type == "post" && category == "success-story" && slug.current == $slug][0]{
      title, client, description, ${COVER}, gallery[]{image, alt}, tech, timeline, status, outcome,
      liveUrl, isConfidential, author, publishedAt, body
    }`,
    { slug },
  )
  if (!story) return null
  return {
    title: story.title,
    client: story.client,
    description: story.description,
    coverImage: imgUrl(story.cover, 1200, 600),
    gallery: mapGallery(story.gallery),
    tech: story.tech ?? [],
    timeline: story.timeline,
    status: story.status,
    outcome: story.outcome,
    liveUrl: story.liveUrl,
    isConfidential: story.isConfidential,
    author: story.author,
    publishedAt: story.publishedAt,
    body: story.body ?? [],
  }
}

export async function getSuccessStorySlugs(): Promise<string[]> {
  return sanityClient.fetch<string[]>(
    `*[_type == "post" && category == "success-story" && defined(slug.current)].slug.current`,
  )
}
