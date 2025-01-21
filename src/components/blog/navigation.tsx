import { Search } from "lucide-react"

const navItems = ["All", "News", "Resources", "Tools", "Featured", "Best Practices", "Testing", "JavaScript"]

export default function Navigation() {
  return (
    <nav className="border-b border-gray-800">
      <div className="flex items-center justify-between px-4 py-4 md:px-6 lg:px-8">
        <div className="flex items-center space-x-4 overflow-x-auto">
          {navItems.map((item) => (
            <a key={item} href="#" className="text-sm text-gray-400 hover:text-white whitespace-nowrap">
              {item}
            </a>
          ))}
        </div>
        <div className="relative ml-4">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search posts..."
            className="pl-8 bg-gray-900 border border-gray-800 rounded-md text-white w-[200px] h-9 text-sm focus:outline-none focus:ring-2 focus:ring-gray-700"
          />
        </div>
      </div>
    </nav>
  )
}

