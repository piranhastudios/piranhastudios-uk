import Link from "next/link"

export default function CTASection() {
  return (
    <section className="container mx-auto px-4 py-16 bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900/20 dark:to-red-500/20 rounded-lg my-12">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Need a Custom Medusa Solution?</h2>
        <p className="text-lg text-gray-700 dark:text-gray-400 mb-8">
          Our team specializes in extending and customizing Medusa for unique business requirements. Get in touch to
          discuss how we can enhance your e-commerce platform.
        </p>
        <Link
          href="/contact"
          className="inline-block px-8 py-4 bg-red-500 hover:bg-red-600 text-white text-lg font-medium rounded-md transition-colors"
        >
          Contact Our Team
        </Link>
      </div>
    </section>
  )
}

