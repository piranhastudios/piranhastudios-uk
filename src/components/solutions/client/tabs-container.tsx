"use client"

import { useState } from "react"
import NpmPackagesTab from "./npm-packages-tab"
import GithubReposTab from "./github-repos-tab"
import WhiteboxSolutionsTab from "./whitebox-solutions-tab"

export default function TabsContainer() {
  const [activeTab, setActiveTab] = useState("whitebox")

  return (
    <div className="w-full">
      <div className="grid w-full grid-cols-3 mb-8 bg-gray-100 dark:bg-zinc-900 rounded-md overflow-hidden">
        <button
            onClick={() => setActiveTab("whitebox")}
            className={`py-3 px-4 text-center font-medium transition-colors ${
                activeTab === "whitebox"
                    ? "bg-red-500 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-800"
            }`}
        >
          Solutions
        </button>
        <button
            onClick={() => setActiveTab("github")}
            className={`py-3 px-4 text-center font-medium transition-colors ${
                activeTab === "github"
                    ? "bg-red-500 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-800"
            }`}
        >
          Themes
        </button>
        <button
          onClick={() => setActiveTab("npm")}
          className={`py-3 px-4 text-center font-medium transition-colors ${
            activeTab === "npm"
              ? "bg-red-500 text-white"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-800"
          }`}
        >
          Packages and Extensions
        </button>
      </div>

      <div className="space-y-8">
        {activeTab === "npm" && <NpmPackagesTab />}
        {activeTab === "github" && <GithubReposTab />}
        {activeTab === "whitebox" && <WhiteboxSolutionsTab />}
      </div>
    </div>
  )
}

