'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { getWhiteboxSolutions } from '@/lib/data';
import { WhiteboxSolution } from '@/types/globals';

function SolutionLoader({ slug }: { slug: string }) {
    const router = useRouter();
    const [solution, setSolution] = useState<WhiteboxSolution | null>(null);

    useEffect(() => {
        async function fetchSolution() {
            const solutions = await getWhiteboxSolutions();
            const foundSolution = solutions.find((s) => s.slug === slug);
            if (!foundSolution) {
                router.push('/404'); // Redirect to a not found page
            } else {
                setSolution(foundSolution);
            }
        }

        if (slug) {
            fetchSolution();
        }
    }, [slug, router]);

    if (!solution) {
        return <p>Loading...</p>;
    }

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
            <header className="bg-red-500 text-white py-4">
                <div className="container mx-auto px-4 flex items-center justify-between">
                    <h1 className="text-lg font-medium">Demo: {solution.name}</h1>
                    <button
                        type="button"
                        onClick={() => router.push('/solutions')}
                        className="text-sm hover:underline"
                    >
                        Back to Solutions
                    </button>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-4">
                <iframe src={solution.demoUrl} className="w-full h-screen" />
            </main>
        </div>
    );
}

export default function DemoPage() {
    return (
        <Suspense fallback={<p>Loading search parameters...</p>}>
            <SearchParamsHandler />
        </Suspense>
    );
}

function SearchParamsHandler() {
    const searchParams = useSearchParams();
    const slug = searchParams.get('slug');

    if (!slug) {
        return <p>Invalid demo identifier.</p>;
    }

    return <SolutionLoader slug={slug} />;
}
