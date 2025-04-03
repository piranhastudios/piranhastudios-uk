export default function LoadingTabs() {
  return (
    <div className="w-full animate-pulse">
      <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-md mb-8"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-64 bg-gray-200 dark:bg-gray-800 rounded-md"></div>
        ))}
      </div>
    </div>
  )
}

