import { clientProjects } from "@/lib/data/client-projects"

export function IntroSection() {
  // Map client projects to carousel items
  const portfolioItems = clientProjects.map((project) => ({
    title: project.title,
    category: project.client,
    image: project.image,
  }))

  // Duplicate items for seamless infinite scroll
  const items = [...portfolioItems, ...portfolioItems, ...portfolioItems]

  return (
    <section className="overflow-hidden">
      <div className="mb-12 text-center px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-[#e5e7eb] mb-2">
          Recent Work
        </h2>
        <p className="text-[#9ca3af]">Projects we've built and launched</p>
      </div>
      
      <div className="relative">
        {/* Gradient overlays for fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-[#0a0a0a] via-[#0a0a0a] to-transparent z-10 pointer-events-none" />
        
        {/* Scrolling container */}
        <div className="flex gap-6 animate-infinite-scroll">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[420px] bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden hover:border-[#fca5a5]/30 transition-all duration-300 group"
            >
              <div className="relative h-48 bg-gradient-to-br from-[#1a1a1a] to-[#0f1419] overflow-hidden">
                {item.image && (
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1419] to-transparent" />
              </div>
              <div className="p-6">
                <p className="text-xs text-[#fca5a5] font-semibold mb-2 uppercase tracking-wider">
                  {item.category}
                </p>
                <h3 className="text-xl font-bold text-[#e5e7eb]">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
