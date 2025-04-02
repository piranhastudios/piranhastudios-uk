"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { getNpmPackages } from "@/lib/data"
import {PackageList} from "@/types/globals";

export default function NpmPackagesTab() {
  const [packages, setPackages] = useState<PackageList[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPackages() {
      try {
        const data: PackageList[] = await getNpmPackages()
        setPackages(data)
      } catch (error) {
        console.error("Error loading packages:", error)
      } finally {
        setLoading(false)
      }
    }

    loadPackages()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-64 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse"></div>
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.name}
            className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 hover:border-red-500 transition-all shadow-sm rounded-lg overflow-hidden"
          >
            <div className="p-5 border-b border-gray-200 dark:border-zinc-800">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold">{pkg.name}</h3>
                <span className="inline-block px-2 py-1 text-xs font-medium bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-500 border border-red-500 rounded">
                  v{pkg.version}
                </span>
              </div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">{pkg.description}</p>
            </div>
            {pkg.tags && pkg.tags.map((tag: string, index: number) => (
            <span
                key={index}
                className="inline-block px-2 py-1 text-xs font-medium bg-gray-200 text-gray-800 dark:bg-zinc-800 dark:text-gray-300 rounded mb-2"
            >
                                            {tag}
                                        </span>
            ))}
            <div className="p-5">
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <img src={`https://img.shields.io/npm/dw/${pkg.name}`} alt="npm" className="h-4"/>
              </div>
              <div className="mt-4 p-3 bg-gray-100 dark:bg-black rounded text-sm font-mono text-gray-800 dark:text-gray-300">
                npm install {pkg.name}
              </div>
            </div>
            <div className="p-5 border-t border-gray-200 dark:border-zinc-800 flex justify-between">
              <Link href={pkg.npmUrl} className="text-red-500 hover:text-red-400 flex items-center text-sm">
                view
                <svg
                  className="ml-1 h-3 w-3"
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
      {/*<div className="text-center">*/}
      {/*  <Link*/}
      {/*    href="/releases/npm-packages"*/}
      {/*    className="inline-block px-6 py-3 border border-red-500 text-red-500 hover:bg-red-500/10 font-medium rounded-md transition-colors"*/}
      {/*  >*/}
      {/*    View All NPM Packages*/}
      {/*  </Link>*/}
      {/*</div>*/}
    </>
  )
}

