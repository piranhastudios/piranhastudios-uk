import Link from "next/link"

export default function HeroSection() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          A Headless Ecosystem <span className="text-red-500">by Piranha Studios</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8">
          Explore our selection of recommended in-house and open source plugins, themes, and solutions that extend the capabilities of your
          online platforms.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="https://github.com/piranhastudios"
            target="_blank"
            className="inline-flex items-center justify-center px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-md transition-colors"
          >
            <svg
              className="mr-2 h-4 w-4"
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
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
            View on GitHub
          </Link>
          <Link
            href="https://www.npmjs.com/org/greatgatchby"
            target="_blank"
            className="inline-flex items-center justify-center px-6 py-3 border border-red-500 text-red-500 hover:bg-red-500/10 font-medium rounded-md transition-colors"
          >
            <svg
              className="mr-2 h-4 w-4"
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
              <path d="M20.91 8.84 8.56 2.23a1.93 1.93 0 0 0-1.81 0L3.1 4.13a2.12 2.12 0 0 0-.05 3.69l12.22 6.93a2.48 2.48 0 0 0 2.48 0L21.1 12.6a2.12 2.12 0 0 0-.19-3.76Z"></path>
              <path d="M3.09 8.84v7.21a2.14 2.14 0 0 0 1.09 1.85l4.8 2.55a2.06 2.06 0 0 0 1.93 0l4.78-2.56a2.14 2.14 0 0 0 1.1-1.86V8.84"></path>
            </svg>
            Browse NPM Packages
          </Link>
        </div>
      </div>
    </section>
  )
}

