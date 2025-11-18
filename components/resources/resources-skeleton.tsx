export function ResourcesSkeleton() {
  return (
    <>
      {/* Tag Filter Skeleton */}
      <div className="mb-12">
        <div className="flex flex-wrap gap-3 justify-center">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-10 w-32 bg-white/5 rounded-full animate-pulse"
            />
          ))}
        </div>
      </div>

      {/* Articles Grid Skeleton */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden"
          >
            {/* Cover Image Skeleton */}
            <div className="h-48 w-full bg-gradient-to-br from-[#b91c1c]/20 to-[#b91c1c]/5 animate-pulse" />

            {/* Content Skeleton */}
            <div className="p-6">
              {/* Tags Skeleton */}
              <div className="flex gap-2 mb-3">
                <div className="h-6 w-20 bg-white/5 rounded-full animate-pulse" />
                <div className="h-6 w-24 bg-white/5 rounded-full animate-pulse" />
              </div>

              {/* Title Skeleton */}
              <div className="space-y-2 mb-3">
                <div className="h-6 bg-white/5 rounded animate-pulse" />
                <div className="h-6 bg-white/5 rounded w-3/4 animate-pulse" />
              </div>

              {/* Excerpt Skeleton */}
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-white/5 rounded animate-pulse" />
                <div className="h-4 bg-white/5 rounded animate-pulse" />
                <div className="h-4 bg-white/5 rounded w-2/3 animate-pulse" />
              </div>

              {/* Read More Skeleton */}
              <div className="h-4 w-24 bg-white/5 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
