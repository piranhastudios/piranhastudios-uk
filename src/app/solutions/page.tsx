import { Suspense } from "react"
import type { Metadata } from "next"
import HeroSection from "@/components/solutions/server/hero-section"
// import StatsSection from "@/components/solutions/server/stats-section"
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
            <div className="flex flex-col min-h-screen  text-gray-900 dark:text-white">
                {/* Hero Section */}
                <HeroSection />

                {/* Tabs Section */}
                <section className="container mx-auto px-4 py-12">
                    <Suspense fallback={<LoadingTabs />}>
                        <TabsContainer />
                    </Suspense>
                </section>

                {/* Stats Section */}
                {/*<StatsSection />*/}

                {/* CTA Section */}
                <CTASection />
            </div>
    )
}

