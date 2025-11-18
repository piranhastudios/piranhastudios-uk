"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, Settings } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
}

const defaultPreferences: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
}

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences)

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent")
    if (!consent) {
      setShowBanner(true)
    } else {
      const savedPreferences = JSON.parse(consent)
      setPreferences(savedPreferences)
    }
  }, [])

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
    }
    localStorage.setItem("cookie-consent", JSON.stringify(allAccepted))
    setPreferences(allAccepted)
    setShowBanner(false)
  }

  const acceptNecessary = () => {
    localStorage.setItem("cookie-consent", JSON.stringify(defaultPreferences))
    setPreferences(defaultPreferences)
    setShowBanner(false)
  }

  const savePreferences = () => {
    localStorage.setItem("cookie-consent", JSON.stringify(preferences))
    setShowBanner(false)
    setShowSettings(false)
  }

  const updatePreference = (key: keyof CookiePreferences, value: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto bg-[#0f1419]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-[#e5e7eb] mb-2">Cookie Preferences</h3>
              <p className="text-[#9ca3af] text-sm leading-relaxed">
                We use cookies to improve your experience on our site. Necessary cookies are required for
                basic functionality. Analytics cookies help us understand how you use our site. Marketing
                cookies help us show you relevant content.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              <Dialog open={showSettings} onOpenChange={setShowSettings}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-[#fca5a5]/30 text-[#fca5a5] hover:bg-[#fca5a5]/10"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Customize
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#0f1419] border-white/10">
                  <DialogHeader>
                    <DialogTitle className="text-[#e5e7eb]">Cookie Preferences</DialogTitle>
                    <DialogDescription className="text-[#9ca3af]">
                      Manage your cookie preferences. Necessary cookies cannot be disabled.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Label htmlFor="necessary" className="text-[#e5e7eb] font-medium">
                          Necessary Cookies
                        </Label>
                        <p className="text-sm text-[#9ca3af] mt-1">
                          Required for the website to function properly
                        </p>
                      </div>
                      <Switch id="necessary" checked={true} disabled />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Label htmlFor="analytics" className="text-[#e5e7eb] font-medium">
                          Analytics Cookies
                        </Label>
                        <p className="text-sm text-[#9ca3af] mt-1">
                          Help us understand how visitors interact with our website
                        </p>
                      </div>
                      <Switch
                        id="analytics"
                        checked={preferences.analytics}
                        onCheckedChange={(checked) => updatePreference("analytics", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Label htmlFor="marketing" className="text-[#e5e7eb] font-medium">
                          Marketing Cookies
                        </Label>
                        <p className="text-sm text-[#9ca3af] mt-1">
                          Used to show you relevant advertisements
                        </p>
                      </div>
                      <Switch
                        id="marketing"
                        checked={preferences.marketing}
                        onCheckedChange={(checked) => updatePreference("marketing", checked)}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={savePreferences}
                      className="flex-1 bg-[#b91c1c] hover:bg-[#dc2626] text-white"
                    >
                      Save Preferences
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                onClick={acceptNecessary}
                variant="outline"
                className="border-white/10 text-[#9ca3af] hover:bg-white/5"
              >
                Necessary Only
              </Button>

              <Button
                onClick={acceptAll}
                className="bg-[#b91c1c] hover:bg-[#dc2626] text-white"
              >
                Accept All
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
