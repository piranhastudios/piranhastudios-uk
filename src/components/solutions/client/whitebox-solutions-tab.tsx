"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { getWhiteboxSolutions } from "@/lib/data"
import {WhiteboxSolution} from "@/types/globals";

export default function WhiteboxSolutionsTab() {
  const [solutions, setSolutions] = useState<WhiteboxSolution[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSolutions() {
      try {
        const data: WhiteboxSolution[] = await getWhiteboxSolutions()
        setSolutions(data)
      } catch (error) {
        console.error("Error loading solutions:", error)
      } finally {
        setLoading(false)
      }
    }

    loadSolutions()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-96 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse"></div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {solutions.map((solution) => (
        <div
          key={solution.name}
          className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 hover:border-red-500 transition-all shadow-sm rounded-lg overflow-hidden"
        >
          <div className="p-5 border-b border-gray-200 dark:border-zinc-800">
            <h3 className="text-xl font-bold">{solution.name}</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">{solution.description}</p>
          </div>
          <div className="p-5">
            <div className="aspect-video relative rounded-md overflow-hidden mb-4">
              <Image src={solution.image || "/placeholder.svg"} alt={solution.name} fill className="object-cover" />
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Key Features:</h4>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                {solution.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="p-5 border-t border-gray-200 dark:border-zinc-800 flex justify-between">
            <Link
              href={`/solutions?slug=${solution.slug}`}
              className="inline-block px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-md transition-colors"
            >
              Learn More
            </Link>
            <Link
              href={`/demos?slug=${solution.slug}`}
              className="inline-block px-4 py-2 border border-red-500 text-red-500 hover:bg-red-500/10 font-medium rounded-md transition-colors"
            >
              View Demo
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}

