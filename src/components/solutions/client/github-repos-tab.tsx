"use client"

import {useState, useEffect} from "react"
import Link from "next/link"
import {getThemes} from "@/lib/data"
import {Theme} from "@/types/globals"

export default function ThemesTab() {
    const [themes, setThemes] = useState<Theme[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        async function loadThemes() {
            try {
                const data: Theme[] = await getThemes()
                setThemes(data)
            } catch (error) {
                console.error("Error loading themes:", error)
            } finally {
                setLoading(false)
            }
        }

        loadThemes()
    }, [])

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-64 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse"></div>
                ))}
            </div>
        )
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {themes.map((theme) => (
                    <div
                        key={theme.name}
                        className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 hover:border-red-500 transition-all shadow-sm rounded-lg overflow-hidden"
                    >
                        <img src={theme.image} alt={theme.name} className="w-full h-40 object-cover"/>
                        <div className="p-5 border-b border-gray-200 dark:border-zinc-800">
                            <h3 className="text-xl font-bold">{theme.name}</h3>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">{theme.description}</p>
                        </div>
                        <div className="p-5">
                            <div className="flex flex-wrap gap-2">
                                {Array.isArray(theme.framework)
                                    ? theme.framework.map((framework: string, index: number) => (
                                        <span
                                            key={index}
                                            className="inline-block px-2 py-1 text-xs font-medium bg-gray-200 text-gray-800 dark:bg-zinc-800 dark:text-gray-300 rounded mb-2"
                                        >
                                            {framework}
                                        </span>
                                    ))
                                    : (
                                        <span
                                            className="inline-block px-2 py-1 text-xs font-medium bg-gray-200 text-gray-800 dark:bg-zinc-800 dark:text-gray-300 rounded">
                                            {theme.framework}
                                        </span>
                                    )}

                                <span
                                    className="inline-block px-2 py-1 text-xs font-medium bg-gray-200 text-gray-800 dark:bg-zinc-800 dark:text-gray-300 rounded">
                                    {theme.style}
                                </span>
                            </div>
                        </div>
                        <div className="p-5 border-t border-gray-200 dark:border-zinc-800">
                            <Link href={theme.demoUrl} className="text-red-500 hover:text-red-400 flex items-center">
                                View Demo
                                <svg
                                    className="ml-1 h-4 w-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <line x1="7" y1="17" x2="17" y2="7"></line>
                                    <polyline points="7 7 17 7 17 17"></polyline>
                                </svg>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
            <div className="text-center">
                <Link
                    href="/themes"
                    className="inline-block px-6 py-3 border border-red-500 text-red-500 hover:bg-red-500/10 font-medium rounded-md transition-colors"
                >
                    Explore All Themes
                </Link>
            </div>
        </>
    )
}
