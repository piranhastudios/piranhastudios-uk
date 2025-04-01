export default function StatsSection() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Our Impact by the Numbers</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-red-500 mb-2">15+</div>
            <div className="text-gray-600 dark:text-gray-400">Medusa Plugins</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-red-500 mb-2">50K+</div>
            <div className="text-gray-600 dark:text-gray-400">Monthly Downloads</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-red-500 mb-2">300+</div>
            <div className="text-gray-600 dark:text-gray-400">GitHub Stars</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-red-500 mb-2">20+</div>
            <div className="text-gray-600 dark:text-gray-400">Active Stores</div>
          </div>
        </div>
      </div>
    </section>
  )
}

