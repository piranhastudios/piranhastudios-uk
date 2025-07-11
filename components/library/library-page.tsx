"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PluginCard } from "./plugin-card"
import { ThemeCard } from "./theme-card"
import { ItemModal } from "./item-modal"
import {
    Search,
    Filter,
    Download,
    Code,
    Shield,
    BarChart3,
    Mail,
    CreditCard,
    FileText,
    MessageSquare,
    ShoppingCart,
    Layers,
    Palette,
    Briefcase,
    Camera,
    Utensils,
    LucideIcon,
    HardDrive
} from "lucide-react"

// Type definitions
interface Plugin {
    id: number
    name: string
    description: string
    category: string
    icon: LucideIcon
    price: string
    originalPrice: string | null
    downloads: string
    rating: number
    tags: string[]
    versions: string[]
    featured: boolean
    author: string
    lastUpdated: string
    version: string
    demo: string
    github: string
    documentation: string
    image?: string
    longDescription: string
    features: string[]
    techStack: string[]
    installation: string
    type: "plugin"
}

interface Theme {
    id: number
    name: string
    description: string
    category: string
    icon: LucideIcon
    price: string
    originalPrice: string | null
    downloads: string
    rating: number
    tags: string[]
    versions: string[]
    featured: boolean
    author: string
    lastUpdated: string
    version: string
    demo: string
    github: string
    documentation: string
    image: string
    longDescription: string
    features: string[]
    techStack: string[]
    installation: string
    type: "theme"
}

type LibraryItem = Plugin | Theme

type TabType = "plugins" | "themes"

type SortOption = "featured" | "downloads" | "rating" | "newest"

type PluginCategory = "All" | "Authentication" | "Payments" | "Analytics" | "Marketing" | "SaaS" | "Communication" | "Storage"

type ThemeCategory = "All" | "SaaS" | "Agency" | "E-commerce" | "Blog" | "Portfolio" | "Restaurant"

const plugins: Plugin[] = [
    {
        id: 1,
        name: "medusav2-file-supabase-storage",
        description: "Medusa v2 file storage plugin for Supabase with advanced features",
        category: "Storage",
        icon: HardDrive,
        price: "Free",
        originalPrice: null,
        downloads: "500+",
        rating: 1,
        tags: ["Medusajs", "TypeScript", "Supabase"],
        versions: ["v0.0.5"],
        featured: true,
        author: "Piranha Studios",
        lastUpdated: "2024-01-15",
        version: "0.0.5",
        demo: "https://www.npmjs.com/package/medusav2-file-supabase-storage",
        github: "https://github.com/greatgatchby/medusav2-file-supabase",
        documentation: "https://www.npmjs.com/package/medusav2-file-supabase-storage",
        longDescription:
            "This plugin integrates Medusa v2 with Supabase storage, allowing you to manage file uploads and storage seamlessly. It provides advanced features like file versioning, metadata management, and automatic file handling, making it ideal for modern e-commerce applications.",
        features: [
            "Supports file uploads to Supabase storage",
            "Automatic file management with Medusa v2",
            "TypeScript support for better development experience",
            "Easy integration with existing Medusa v2 projects",
            "Advanced features like file versioning and metadata management"
        ],
        techStack: ["Medusajs", "Supabase", "TypeScript"],
        installation: "npm install medusav2-file-supabase-storage",
        type: "plugin",
    },
    {
        id: 2,
        name: "medusav2-file-vercel-blob",
        description: "Medusa v2 file storage plugin for Vercel Blob with enhanced features",
        category: "Storage",
        icon: HardDrive,
        price: "Free",
        originalPrice: null,
        downloads: "500+",
        rating: 1,
        tags: ["Medusajs", "TypeScript", "Vercel", "Blob Storage"],
        versions: ["v0.0.1"],
        featured: true,
        author: "Piranha Studios",
        lastUpdated: "2024-01-15",
        version: "0.0.1",
        demo: "https://www.npmjs.com/package/medusav2-file-vercel-blob",
        github: "https://github.com/greatgatchby/medusaV2-file-vercel-blob",
        documentation: "https://www.npmjs.com/package/medusav2-file-vercel-blob",
        longDescription:
            "This plugin integrates Medusa v2 with Vercel Blob storage, providing seamless file management capabilities. It offers efficient file handling, automatic uploads, and is perfectly suited for Medusa-based e-commerce applications deployed on Vercel.",
        features: [
            "Seamless integration with Vercel Blob storage",
            "Compatible with Medusa v2",
            "TypeScript support",
            "Easy setup process",
            "Automatic file handling"
        ],
        techStack: ["Medusajs", "Vercel", "TypeScript"],
        installation: "npm install medusav2-file-vercel-blob",
        type: "plugin"
    },
]

const themes: Theme[] = []

const pluginCategories: PluginCategory[] = ["All", "Authentication", "Payments", "Analytics", "Marketing", "SaaS", "Communication"]

const themeCategories: ThemeCategory[] = ["All", "SaaS", "Agency", "E-commerce", "Blog", "Portfolio", "Restaurant"]

export function LibraryPage() {
    const [activeTab, setActiveTab] = useState<TabType>("plugins")
    const [selectedCategory, setSelectedCategory] = useState<PluginCategory | ThemeCategory>("All")
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null)
    const [sortBy, setSortBy] = useState<SortOption>("featured")

    const currentItems: LibraryItem[] = activeTab === "plugins" ? plugins : themes
    const currentCategories = activeTab === "plugins" ? pluginCategories : themeCategories

    const filteredItems = currentItems
        .filter((item: LibraryItem) => {
            const matchesCategory = selectedCategory === "All" || item.category === selectedCategory
            const matchesSearch =
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
            return matchesCategory && matchesSearch
        })
        .sort((a: LibraryItem, b: LibraryItem) => {
            switch (sortBy) {
                case "featured":
                    return b.featured ? 1 : -1
                case "downloads":
                    return Number.parseFloat(b.downloads) - Number.parseFloat(a.downloads)
                case "rating":
                    return b.rating - a.rating
                case "newest":
                    return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
                default:
                    return 0
            }
        })

    const featuredItems = currentItems.filter((item: LibraryItem) => item.featured)

    // Reset category when switching tabs
    const handleTabChange = (tab: string) => {
        setActiveTab(tab as TabType)
        setSelectedCategory("All")
        setSearchTerm("")
    }

    return (
        <div className="min-h-screen bg-[#091113] text-[#e5e7eb]">
            {/* Header */}
            <section className="pt-24 pb-16 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#e5e7eb] to-[#9ca3af] bg-clip-text text-transparent">
                        Plugins & Themes
                    </h1>
                    <p className="text-xl md:text-2xl text-[#9ca3af] max-w-3xl mx-auto mb-8">
                        Production-ready components, tools, and complete website themes to accelerate your development workflow
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#9ca3af]" />
                            <Input
                                placeholder={`Search ${activeTab}...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 bg-white/10 border-white/20 text-[#e5e7eb] placeholder:text-[#9ca3af] h-12"
                            />
                        </div>
                        <Button className="bg-[#b91c1c] hover:bg-[#dc2626] h-12 px-8">
                            <Download className="h-5 w-5 mr-2" />
                            Browse All
                        </Button>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="px-6">
                <div className="max-w-7xl mx-auto">
                    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                        <div className="flex justify-center mb-8">
                            <TabsList className="grid w-full max-w-md grid-cols-2 bg-white/5">
                                <TabsTrigger value="plugins" className="data-[state=active]:bg-[#b91c1c]">
                                    <Code className="h-4 w-4 mr-2" />
                                    Plugins
                                </TabsTrigger>
                                <TabsTrigger value="themes" className="data-[state=active]:bg-[#b91c1c]">
                                    <Palette className="h-4 w-4 mr-2" />
                                    Themes
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="plugins" className="space-y-16">
                            {/* Featured Plugins */}
                            <div className="bg-gradient-to-b from-transparent to-[#0f1419]/50 py-16 -mx-6 px-6">
                                <div className="max-w-7xl mx-auto">
                                    <h2 className="text-3xl font-bold text-[#e5e7eb] mb-8">Featured Plugins</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                        {featuredItems.map((item) => (
                                            <PluginCard key={item.id} plugin={item} onClick={() => setSelectedItem(item)} featured={true} />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* All Plugins */}
                            <div>
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-3xl font-bold text-[#e5e7eb]">All Plugins</h2>
                                    <div className="flex items-center space-x-4">
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value as SortOption)}
                                            className="px-3 py-2 bg-white/5 border border-white/10 rounded-md text-[#e5e7eb]"
                                        >
                                            <option value="featured">Featured First</option>
                                            <option value="downloads">Most Downloaded</option>
                                            <option value="rating">Highest Rated</option>
                                            <option value="newest">Newest</option>
                                        </select>
                                        <Button variant="outline" className="border-[#fca5a5]/30 text-[#fca5a5] bg-transparent">
                                            <Filter className="h-4 w-4 mr-2" />
                                            Filter
                                        </Button>
                                    </div>
                                </div>

                                {/* Category Filter */}
                                <div className="flex flex-wrap gap-2 mb-8">
                                    {currentCategories.map((category) => (
                                        <Button
                                            key={category}
                                            variant={selectedCategory === category ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setSelectedCategory(category)}
                                            className={
                                                selectedCategory === category
                                                    ? "bg-[#b91c1c] hover:bg-[#dc2626]"
                                                    : "border-[#fca5a5]/30 text-[#fca5a5] hover:bg-[#fca5a5]/10"
                                            }
                                        >
                                            {category}
                                        </Button>
                                    ))}
                                </div>

                                {/* Plugins Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {filteredItems.map((item) => (
                                        <PluginCard key={item.id} plugin={item} onClick={() => setSelectedItem(item)} featured={false} />
                                    ))}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="themes" className="space-y-16">
                            {/* Featured Themes */}
                            <div className="bg-gradient-to-b from-transparent to-[#0f1419]/50 py-16 -mx-6 px-6">
                                <div className="max-w-7xl mx-auto">
                                    <h2 className="text-3xl font-bold text-[#e5e7eb] mb-8">Featured Themes</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {featuredItems.map((item) => (
                                            <ThemeCard key={item.id} theme={item} onClick={() => setSelectedItem(item)} featured={true} />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* All Themes */}
                            <div>
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-3xl font-bold text-[#e5e7eb]">All Themes</h2>
                                    <div className="flex items-center space-x-4">
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value as SortOption)}
                                            className="px-3 py-2 bg-white/5 border border-white/10 rounded-md text-[#e5e7eb]"
                                        >
                                            <option value="featured">Featured First</option>
                                            <option value="downloads">Most Downloaded</option>
                                            <option value="rating">Highest Rated</option>
                                            <option value="newest">Newest</option>
                                        </select>
                                        <Button variant="outline" className="border-[#fca5a5]/30 text-[#fca5a5] bg-transparent">
                                            <Filter className="h-4 w-4 mr-2" />
                                            Filter
                                        </Button>
                                    </div>
                                </div>

                                {/* Category Filter */}
                                <div className="flex flex-wrap gap-2 mb-8">
                                    {currentCategories.map((category) => (
                                        <Button
                                            key={category}
                                            variant={selectedCategory === category ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setSelectedCategory(category)}
                                            className={
                                                selectedCategory === category
                                                    ? "bg-[#b91c1c] hover:bg-[#dc2626]"
                                                    : "border-[#fca5a5]/30 text-[#fca5a5] hover:bg-[#fca5a5]/10"
                                            }
                                        >
                                            {category}
                                        </Button>
                                    ))}
                                </div>

                                {/* Themes Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {filteredItems.map((item) => (
                                        <ThemeCard key={item.id} theme={item} onClick={() => setSelectedItem(item)} featured={false} />
                                    ))}
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6 bg-gradient-to-b from-[#0f1419]/50 to-transparent">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="bg-white/5 backdrop-blur-md rounded-3xl p-12 border border-white/10 shadow-2xl">
                        <h3 className="text-3xl font-bold text-[#e5e7eb] mb-6">Need Something Custom?</h3>
                        <p className="text-xl text-[#9ca3af] mb-8 max-w-2xl mx-auto">
                            Can't find what you're looking for? We build custom plugins, themes, and complete websites tailored to
                            your specific needs.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button className="bg-[#b91c1c] hover:bg-[#dc2626] px-8 py-3">
                                <Code className="h-5 w-5 mr-2" />
                                Request Custom Development
                            </Button>
                            <Button variant="outline" className="border-[#fca5a5]/30 text-[#fca5a5] px-8 py-3 bg-transparent">
                                <Mail className="h-5 w-5 mr-2" />
                                Contact Us
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {selectedItem && <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
        </div>
    )
}
