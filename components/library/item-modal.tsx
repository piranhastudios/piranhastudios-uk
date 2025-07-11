"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  X,
  Download,
  Star,
  ExternalLink,
  Github,
  FileText,
  Copy,
  CheckCircle,
  Calendar,
  User,
  Code,
  Zap,
  Shield,
  Smartphone,
  Layout,
  Palette,
} from "lucide-react"

interface ItemModalProps {
  item: any
  onClose: () => void
}

export function ItemModal({ item, onClose }: ItemModalProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [copied, setCopied] = useState(false)

  const copyInstallCommand = async () => {
    try {
      await navigator.clipboard.writeText(item.installation)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const isTheme = item.type === "theme"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <Card className="relative w-full max-w-6xl bg-[#0f1419]/95 backdrop-blur-md border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-start justify-between border-b border-white/10 pb-6">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-[#fca5a5]/20 rounded-2xl flex items-center justify-center">
              <item.icon className="h-8 w-8 text-[#fca5a5]" />
            </div>
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <CardTitle className="text-2xl text-[#e5e7eb]">{item.name}</CardTitle>
                {item.featured && (
                  <Badge className="bg-[#b91c1c]/20 text-[#fca5a5] border-[#b91c1c]/30">Featured</Badge>
                )}
                <Badge variant="outline" className="text-xs">
                  {isTheme ? <Palette className="h-3 w-3 mr-1" /> : <Code className="h-3 w-3 mr-1" />}
                  {isTheme ? "Theme" : "Plugin"}
                </Badge>
              </div>
              <p className="text-[#9ca3af] text-lg mb-3">{item.description}</p>
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-[#e5e7eb]">{item.rating}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Download className="h-4 w-4 text-[#9ca3af]" />
                  <span className="text-[#9ca3af]">{item.downloads} downloads</span>
                </div>
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4 text-[#9ca3af]" />
                  <span className="text-[#9ca3af]">{item.author}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4 text-[#9ca3af]" />
                  <span className="text-[#9ca3af]">v{item.version}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-[#fca5a5]">{item.price}</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 bg-white/5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="installation">Installation</TabsTrigger>
              <TabsTrigger value="demo">Demo & Docs</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Item Image */}
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-64 object-cover rounded-xl"
                    />
                  </div>

                  {/* Description */}
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-[#e5e7eb]">About This {isTheme ? "Theme" : "Plugin"}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-[#9ca3af] leading-relaxed">{item.longDescription}</p>
                    </CardContent>
                  </Card>

                  {/* Tech Stack */}
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-[#e5e7eb]">Technology Stack</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {item.techStack.map((tech: any) => (
                          <Badge
                            key={tech}
                            variant="outline"
                            className="bg-[#fca5a5]/10 text-[#fca5a5] border-[#fca5a5]/30"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Quick Actions */}
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-[#e5e7eb]">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button className="w-full bg-[#b91c1c] hover:bg-[#dc2626]">
                        <Download className="h-4 w-4 mr-2" />
                        Download {isTheme ? "Theme" : "Plugin"}
                      </Button>
                      <Button variant="outline" className="w-full border-[#fca5a5]/30 text-[#fca5a5] bg-transparent">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Demo
                      </Button>
                      <Button variant="outline" className="w-full border-[#fca5a5]/30 text-[#fca5a5] bg-transparent">
                        <Github className="h-4 w-4 mr-2" />
                        View Source
                      </Button>
                      <Button variant="outline" className="w-full border-[#fca5a5]/30 text-[#fca5a5] bg-transparent">
                        <FileText className="h-4 w-4 mr-2" />
                        Documentation
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Item Info */}
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-[#e5e7eb]">{isTheme ? "Theme" : "Plugin"} Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-[#9ca3af]">Category:</span>
                        <Badge variant="outline">{item.category}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#9ca3af]">Version:</span>
                        <span className="text-[#e5e7eb]">{item.version}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#9ca3af]">Last Updated:</span>
                        <span className="text-[#e5e7eb]">{new Date(item.lastUpdated).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#9ca3af]">Downloads:</span>
                        <span className="text-[#e5e7eb]">{item.downloads}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#9ca3af]">Rating:</span>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-[#e5e7eb]">{item.rating}</span>
                        </div>
                      </div>
                      {isTheme && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-[#9ca3af]">Pages:</span>
                            <span className="text-[#e5e7eb]">{item.pages?.length || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#9ca3af]">Components:</span>
                            <span className="text-[#e5e7eb]">{item.components || 0}</span>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>

                  {/* Tags */}
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-[#e5e7eb]">Tags</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag: any) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Theme-specific info */}
                  {isTheme && (
                    <Card className="bg-white/5 border-white/10">
                      <CardHeader>
                        <CardTitle className="text-[#e5e7eb]">Theme Features</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[#9ca3af]">Responsive Design:</span>
                          <Badge variant={item.responsive ? "default" : "secondary"} className="text-xs">
                            {item.responsive ? "Yes" : "No"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#9ca3af]">Dark Mode:</span>
                          <Badge variant={item.darkMode ? "default" : "secondary"} className="text-xs">
                            {item.darkMode ? "Yes" : "No"}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="features" className="space-y-6 mt-6">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-[#e5e7eb]">Key Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {item.features.map((feature: any, index: number) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-[#e5e7eb]">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Theme-specific pages list */}
              {isTheme && item.pages && (
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-[#e5e7eb]">Included Pages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {item.pages.map((page: any, index: number) => (
                        <div key={index} className="flex items-center space-x-2 p-2 bg-white/5 rounded-lg">
                          <Layout className="h-4 w-4 text-[#fca5a5]" />
                          <span className="text-[#e5e7eb] text-sm">{page}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Feature Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="pt-6 text-center">
                    <Code className="h-8 w-8 text-[#fca5a5] mx-auto mb-4" />
                    <h3 className="text-[#e5e7eb] font-semibold mb-2">Developer Friendly</h3>
                    <p className="text-[#9ca3af] text-sm">Clean, well-documented code with TypeScript support</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="pt-6 text-center">
                    <Zap className="h-8 w-8 text-[#fca5a5] mx-auto mb-4" />
                    <h3 className="text-[#e5e7eb] font-semibold mb-2">High Performance</h3>
                    <p className="text-[#9ca3af] text-sm">Optimized for speed and minimal bundle size</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="pt-6 text-center">
                    <Shield className="h-8 w-8 text-[#fca5a5] mx-auto mb-4" />
                    <h3 className="text-[#e5e7eb] font-semibold mb-2">Production Ready</h3>
                    <p className="text-[#9ca3af] text-sm">Battle-tested in real-world applications</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="installation" className="space-y-6 mt-6">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-[#e5e7eb]">Installation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-[#9ca3af] mb-3">
                      {isTheme ? "Create a new project with this theme:" : "Install via npm:"}
                    </p>
                    <div className="bg-[#0f1419] rounded-lg p-4 border border-white/10 flex items-center justify-between">
                      <code className="text-[#e5e7eb] font-mono text-sm">{item.installation}</code>
                      <Button variant="ghost" size="sm" onClick={copyInstallCommand}>
                        {copied ? <CheckCircle className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-[#e5e7eb]">Quick Start</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-[#0f1419] rounded-lg p-4 border border-white/10">
                    <pre className="text-[#e5e7eb] text-sm overflow-x-auto">
                      {isTheme
                        ? `# After installation, navigate to your project
cd my-${item.name.toLowerCase().replace(/\s+/g, "-")}-app

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000 in your browser`
                        : `import { ${item.name.replace(/\s+/g, "")} } from '@piranha/${item.name.toLowerCase().replace(/\s+/g, "-")}'

// Basic usage
const config = {
  // Your configuration here
}

export default function App() {
  return (
    <${item.name.replace(/\s+/g, "")} config={config} />
  )
}`}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-[#e5e7eb]">Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-[#9ca3af]">
                    <li>• Node.js 18+ or later</li>
                    <li>• React 18+ or Next.js 13+</li>
                    <li>• TypeScript 4.9+ (recommended)</li>
                    <li>• Tailwind CSS 3.0+ (for styling)</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="demo" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-[#e5e7eb]">Live Demo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-[#0f1419] rounded-lg p-8 border border-white/10 text-center">
                      <ExternalLink className="h-12 w-12 text-[#fca5a5] mx-auto mb-4" />
                      <h3 className="text-[#e5e7eb] font-semibold mb-2">Interactive Demo</h3>
                      <p className="text-[#9ca3af] mb-4">Try out all the features in our live demo environment</p>
                      <Button className="bg-[#b91c1c] hover:bg-[#dc2626]">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open Demo
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-[#e5e7eb]">Documentation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-[#0f1419] rounded-lg p-8 border border-white/10 text-center">
                      <FileText className="h-12 w-12 text-[#fca5a5] mx-auto mb-4" />
                      <h3 className="text-[#e5e7eb] font-semibold mb-2">Complete Guide</h3>
                      <p className="text-[#9ca3af] mb-4">Comprehensive documentation with examples and API reference</p>
                      <Button variant="outline" className="border-[#fca5a5]/30 text-[#fca5a5] bg-transparent">
                        <FileText className="h-4 w-4 mr-2" />
                        View Docs
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-[#e5e7eb]">Additional Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                      variant="outline"
                      className="h-16 flex-col border-[#fca5a5]/30 text-[#fca5a5] bg-transparent"
                    >
                      <Github className="h-5 w-5 mb-1" />
                      <span className="text-xs">Source Code</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-16 flex-col border-[#fca5a5]/30 text-[#fca5a5] bg-transparent"
                    >
                      <FileText className="h-5 w-5 mb-1" />
                      <span className="text-xs">Changelog</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-16 flex-col border-[#fca5a5]/30 text-[#fca5a5] bg-transparent"
                    >
                      <Smartphone className="h-5 w-5 mb-1" />
                      <span className="text-xs">Support</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
