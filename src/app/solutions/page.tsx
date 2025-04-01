import { Suspense } from "react"
import type { Metadata } from "next"
import HeroSection from "@/components/solutions/server/hero-section"
import StatsSection from "@/components/solutions/server/stats-section"
import CTASection from "@/components/solutions/server/cta-section"
import TabsContainer from "@/components/solutions/client/tabs-container"
import LoadingTabs from "@/components/solutions/server/loading-tabs"

export const metadata: Metadata = {
    title: "Solutions Ecosystem | Piranha Studios",
    description:
        "Explore our collection of Medusa plugins, themes, and solutions that extend the capabilities of your e-commerce platform.",
}

export default function ReleasesPage() {
    return (
            <div className="flex flex-col min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
                {/* Hero Section */}
                <HeroSection />

                {/* Tabs Section */}
                <section className="container mx-auto px-4 py-12">
                    <Suspense fallback={<LoadingTabs />}>
                        <TabsContainer />
                    </Suspense>
                </section>

                {/* Stats Section */}
                <StatsSection />

                {/* CTA Section */}
                <CTASection />
            </div>
    )
}

// Sample data.ts
const npmPackages = [
    {
        name: "medusav2-file-vercel-blob",
        version: "1.2.0",
        description: "Medusa file service plugin for Vercel Blob storage integration",
        downloads: "12K+",
        stars: 87,
        docsUrl: "#",
        npmUrl: "#",
    },
    {
        name: "medusav2-file-supabase-storage",
        version: "1.1.3",
        description: "Medusa file service plugin for Supabase storage integration",
        downloads: "8K+",
        stars: 64,
        docsUrl: "#",
        npmUrl: "#",
    },
    {
        name: "medusa-payment-stripe-extended",
        version: "2.0.1",
        description: "Extended Stripe payment provider for Medusa with additional features",
        downloads: "15K+",
        stars: 92,
        docsUrl: "#",
        npmUrl: "#",
    },
    {
        name: "medusa-plugin-seo",
        version: "0.9.5",
        description: "SEO optimization plugin for Medusa storefronts",
        downloads: "7K+",
        stars: 43,
        docsUrl: "#",
        npmUrl: "#",
    },
    {
        name: "medusa-plugin-algolia",
        version: "1.3.2",
        description: "Algolia search integration for Medusa e-commerce",
        downloads: "9K+",
        stars: 56,
        docsUrl: "#",
        npmUrl: "#",
    },
    {
        name: "medusa-plugin-sendgrid",
        version: "1.0.4",
        description: "SendGrid email service integration for Medusa",
        downloads: "11K+",
        stars: 38,
        docsUrl: "#",
        npmUrl: "#",
    },
]

const githubRepos = [
    {
        name: "medusa-storefront-starter",
        description: "A Next.js starter template for building custom Medusa storefronts",
        stars: 142,
        forks: 47,
        language: "TypeScript",
        tags: ["medusa", "next.js", "e-commerce", "starter"],
        url: "#",
    },
    {
        name: "medusa-admin-dashboard",
        description: "Custom admin dashboard for Medusa with enhanced features",
        stars: 98,
        forks: 32,
        language: "TypeScript",
        tags: ["medusa", "admin", "dashboard", "react"],
        url: "#",
    },
    {
        name: "mercur",
        description: "A Medusa fork optimized for multivendor marketplaces",
        stars: 187,
        forks: 54,
        language: "TypeScript",
        tags: ["medusa", "marketplace", "multivendor", "e-commerce"],
        url: "#",
    },
    {
        name: "medusa-themes",
        description: "Collection of themes and UI components for Medusa storefronts",
        stars: 76,
        forks: 28,
        language: "TypeScript",
        tags: ["themes", "ui", "components", "medusa"],
        url: "#",
    },
]

const whiteboxSolutions = [
    {
        name: "Healthcare Commerce",
        description: "Specialized e-commerce solution for healthcare products based on Medusa",
        image: "/placeholder.svg?height=300&width=600",
        features: [
            "Compliant with healthcare regulations",
            "Prescription management",
            "Secure patient profiles",
            "Integration with healthcare providers",
            "Specialized checkout for medical products",
        ],
    },
    {
        name: "Mercur Marketplace",
        description: "Complete multivendor marketplace solution based on our Mercur fork of Medusa",
        image: "/placeholder.svg?height=300&width=600",
        features: [
            "Vendor onboarding and management",
            "Commission and fee structure",
            "Multi-seller inventory",
            "Vendor-specific analytics",
            "Marketplace-optimized checkout",
        ],
    },
    {
        name: "Medusa Enterprise",
        description: "Enterprise-grade Medusa implementation with advanced features",
        image: "/placeholder.svg?height=300&width=600",
        features: [
            "High-volume transaction processing",
            "Advanced analytics and reporting",
            "Multi-region deployment",
            "Custom integration services",
            "24/7 enterprise support",
        ],
    },
    {
        name: "Headless POS",
        description: "Point of Sale solution that integrates with Medusa backend",
        image: "/placeholder.svg?height=300&width=600",
        features: [
            "Offline-first architecture",
            "Hardware integration (receipt printers, barcode scanners)",
            "Staff accounts and permissions",
            "Inventory synchronization",
            "Unified online/offline orders",
        ],
    },
]

