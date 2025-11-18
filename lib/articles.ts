import fs from "fs"
import path from "path"
import matter from "gray-matter"

const articlesDirectory = path.join(process.cwd(), "public/articles")

export interface ArticleConfig {
  tags: string[]
  featuredTag?: string
  date: string
  author: string
}

export interface Article {
  slug: string
  title: string
  coverImage: string | null
  excerpt: string
  content: string
  tags: string[]
  featuredTag?: string
  date: string
  author: string
}

export function getArticleSlugs(): string[] {
  try {
    const slugs = fs.readdirSync(articlesDirectory)
    return slugs.filter((slug) => {
      const articlePath = path.join(articlesDirectory, slug)
      return fs.statSync(articlePath).isDirectory()
    })
  } catch (error) {
    return []
  }
}

export function getArticleBySlug(slug: string): Article | null {
  try {
    const articlePath = path.join(articlesDirectory, slug)
    const files = fs.readdirSync(articlePath)
    const mdFile = files.find((file) => file.endsWith(".md"))

    if (!mdFile) return null

    const fullPath = path.join(articlePath, mdFile)
    const fileContents = fs.readFileSync(fullPath, "utf8")
    const { data, content } = matter(fileContents)

    // Read config.json if it exists
    let config: ArticleConfig = {
      tags: [],
      date: data.date || new Date().toISOString(),
      author: data.author || "Piranha Studios",
    }

    try {
      const configPath = path.join(articlePath, "config.json")
      if (fs.existsSync(configPath)) {
        const configContent = fs.readFileSync(configPath, "utf8")
        config = { ...config, ...JSON.parse(configContent) }
      }
    } catch (error) {
      console.warn(`Could not read config for ${slug}`)
    }

    // Extract first heading as title
    const titleMatch = content.match(/^#\s+(.+)$/m)
    const title = titleMatch ? titleMatch[1].replace(/\*\*/g, "") : slug

    // Extract first image as cover
    const imageMatch = content.match(/!\[.*?\]\((.+?)\)/)
    let coverImage: string | null = null
    if (imageMatch) {
      const imagePath = imageMatch[1]
      // Convert relative path to absolute public path
      coverImage = `/articles/${slug}/${imagePath}`
    }

    // Remove markdown formatting for excerpt
    const textContent = content
      .replace(/!\[.*?\]\(.*?\)/g, "") // Remove images
      .replace(/#+\s+/g, "") // Remove headings
      .replace(/\*\*/g, "") // Remove bold
      .replace(/\*/g, "") // Remove italic
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1") // Remove links, keep text
      .trim()

    const excerpt = textContent.slice(0, 200) + "..."

    return {
      slug,
      title,
      coverImage,
      excerpt,
      content,
      tags: config.tags,
      featuredTag: config.featuredTag,
      date: config.date,
      author: config.author,
    }
  } catch (error) {
    console.error(`Error reading article ${slug}:`, error)
    return null
  }
}

export function getAllArticles(): Article[] {
  const slugs = getArticleSlugs()
  const articles = slugs
    .map((slug) => getArticleBySlug(slug))
    .filter((article): article is Article => article !== null)
    .sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })

  return articles
}

export function getAllTags(): string[] {
  const articles = getAllArticles()
  const tagSet = new Set<string>()
  
  articles.forEach((article) => {
    article.tags.forEach((tag) => tagSet.add(tag))
  })
  
  return Array.from(tagSet).sort()
}

export function getFeaturedTags(): string[] {
  const articles = getAllArticles()
  const featuredSet = new Set<string>()
  
  articles.forEach((article) => {
    if (article.featuredTag) {
      featuredSet.add(article.featuredTag)
    }
  })
  
  return Array.from(featuredSet).sort()
}

export function getArticlesByTag(tag: string): Article[] {
  return getAllArticles().filter((article) => article.tags.includes(tag))
}
