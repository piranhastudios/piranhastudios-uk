"use client"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CalendlyUrls } from "@/lib/data/calendly"
import { loadCalendlyAssets } from "./calendly-widget"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

const CALENDLY_URL = CalendlyUrls.qa_url

type FormData = {
  name: string
  email: string
  company: string
  budget: string
  services: string[]
  message: string
  wantsAudit: boolean
  websiteUrl: string
}
type Errors = Partial<Record<keyof FormData, string>>
type Step = "form" | "booking" | "done"

const EMPTY: FormData = {
  name: "", email: "", company: "", budget: "", services: [], message: "",
  wantsAudit: false, websiteUrl: "",
}

// Service/Product options come live from ClickUp (GET /api/lead-fields) so the
// form stays in sync. This list is only a fallback if that fetch fails; the
// values are the ClickUp option ids, which /api/leads forwards straight through.
type ServiceOption = { id: string; label: string }
const SERVICE_OPTIONS_FALLBACK: ServiceOption[] = [
  { id: "32093dfd-8190-47c6-95aa-f6d569bc14a7", label: "Advisory" },
  { id: "d76f85bf-9d9f-4364-9a19-8413df7216c7", label: "Digital Presence" },
  { id: "d5ae5218-7af9-4efc-8307-488c64c7e947", label: "E-Commerce" },
  { id: "608fc462-210d-45c2-b592-24c4677ab9e7", label: "SaaS App" },
  { id: "1d331b03-5126-42f5-b82d-552a0ee893f9", label: "Tech Partnership" },
]

const fieldClass =
  "bg-white/10 border-white/20 text-[#e5e7eb] placeholder:text-[#9ca3af] rounded-xl focus:border-[#fca5a5] focus:ring-[#fca5a5]"

export function BookingFlow() {
  const [step, setStep] = useState<Step>("form")
  const [formData, setFormData] = useState<FormData>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [taskId, setTaskId] = useState<string | null>(null)
  const [serviceOptions, setServiceOptions] = useState<ServiceOption[]>(SERVICE_OPTIONS_FALLBACK)
  const widgetRef = useRef<HTMLDivElement>(null)

  // --- Load Calendly's embed assets + the live Service/Product options once ---
  useEffect(() => {
    loadCalendlyAssets()
    fetch("/api/lead-fields")
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (Array.isArray(data?.services) && data.services.length) setServiceOptions(data.services)
      })
      .catch(() => {
        /* keep the fallback list */
      })
  }, [])

  // Calendly inline-embed URL: prefilled name/email, tagged with salesforce_uuid
  // so Zapier links the booking back to this lead task, and themed (hex, no #).
  const bookingUrl = (() => {
    const url = new URL(CALENDLY_URL)
    if (taskId) url.searchParams.set("salesforce_uuid", taskId)
    if (formData.name) url.searchParams.set("name", formData.name)
    if (formData.email) url.searchParams.set("email", formData.email)
    url.searchParams.set("background_color", "0f1419")
    url.searchParams.set("text_color", "ffffff")
    url.searchParams.set("primary_color", "ff0000")
    url.searchParams.set("hide_gdpr_banner", "1")
    return url.toString()
  })()

  // --- Mount the inline widget once we reach the booking step ---
  useEffect(() => {
    if (step !== "booking" || !taskId || !widgetRef.current) return
    let cancelled = false
    const el = widgetRef.current
    const tryInit = () => {
      if (cancelled || !el) return
      if (el.querySelector("iframe")) return // already initialised
      if (window.Calendly) {
        window.Calendly.initInlineWidget({ url: bookingUrl, parentElement: el })
      } else {
        setTimeout(tryInit, 200)
      }
    }
    tryInit()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, taskId])

  // --- Listen for the booking confirmation from the Calendly iframe ---
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== "https://calendly.com") return
      if (e.data?.event === "calendly.event_scheduled") setStep("done")
    }
    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [])

  const validate = () => {
    const next: Errors = {}
    if (!formData.name.trim()) next.name = "Name is required"
    if (!formData.email.trim()) next.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) next.email = "Please enter a valid email address"
    if (!formData.services.length) next.services = "Pick at least one"
    if (!formData.message.trim()) next.message = "Please tell us a little about what you need"
    if (formData.wantsAudit && !formData.websiteUrl.trim()) next.websiteUrl = "Add your website so we can audit it"
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onChange = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const toggleService = (id: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(id)
        ? prev.services.filter(s => s !== id)
        : [...prev.services, id],
    }))
    if (errors.services) setErrors(prev => ({ ...prev, services: undefined }))
  }

  const onSubmit = async () => {
    if (!validate()) return
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.taskId) throw new Error(data.error || "Something went wrong")
      setTaskId(data.taskId)
      setStep("booking")
    } catch (err) {
      console.error("Lead submission error:", err)
      setSubmitError("We couldn't save your details. Please try again or email info@piranhastudios.co.uk.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // --- Confirmation ---
  if (step === "done") {
    return (
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-10 border border-white/10 shadow-lg text-center">
        <CheckCircle className="h-14 w-14 text-green-400 mx-auto mb-6" />
        <h2 className="text-2xl font-semibold text-[#e5e7eb] mb-3">You&apos;re booked in!</h2>
        <p className="text-[#9ca3af] max-w-md mx-auto">
          Check your inbox for the calendar invite and meeting details. We&apos;re looking forward to speaking with you.
        </p>
      </div>
    )
  }

  // --- Calendly embed ---
  if (step === "booking") {
    return (
      <div className="relative left-1/2 w-screen -translate-x-1/2">
        <div className="text-center mb-8 px-6">
          <p className="text-[#fca5a5] font-medium">Step 2 of 2</p>
          <h2 className="text-2xl font-semibold text-[#e5e7eb] mt-1">Pick a time that works for you</h2>
        </div>
        <div
          ref={widgetRef}
          className="calendly-inline-widget overflow-hidden bg-[#1a1f24]"
          data-url={bookingUrl}
          style={{ minWidth: "320px", height: "900px" }}
        />
      </div>
    )
  }

  // --- Intake form ---
  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-lg">
      <div className="mb-6">
        <p className="text-[#fca5a5] font-medium">Step 1 of 2</p>
        <h2 className="text-2xl font-semibold text-[#e5e7eb] mt-1">How can we help?</h2>
      </div>

      {submitError && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center">
          <AlertCircle className="h-5 w-5 text-red-400 mr-3 shrink-0" />
          <span className="text-red-300 text-sm">{submitError}</span>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <Input
            placeholder="Your Name"
            value={formData.name}
            onChange={e => onChange("name", e.target.value)}
            className={`${fieldClass} ${errors.name ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
          />
          {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
        </div>

        <div>
          <Input
            type="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={e => onChange("email", e.target.value)}
            className={`${fieldClass} ${errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
          />
          {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
        </div>

        <div>
          <Input
            placeholder="Company (optional)"
            value={formData.company}
            onChange={e => onChange("company", e.target.value)}
            className={fieldClass}
          />
        </div>

        <div>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]">
              £
            </span>
            <Input
              placeholder="Project budget (optional)"
              value={formData.budget}
              onChange={e => onChange("budget", e.target.value)}
              className={`${fieldClass} pl-7`}
            />
          </div>
        </div>

        {/* Service / product interest */}
        <div>
          <label className="block text-sm text-[#e5e7eb] mb-2">Which area do you need help with?</label>
          <div className="flex flex-wrap gap-2">
            {serviceOptions.map(opt => {
              const active = formData.services.includes(opt.id)
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => toggleService(opt.id)}
                  className={`rounded-full border px-4 py-2 text-sm transition-all ${
                    active
                      ? "border-[#fca5a5] bg-[#fca5a5]/10 text-[#e5e7eb]"
                      : "border-white/20 bg-white/5 text-[#9ca3af] hover:border-white/40"
                  }`}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>
          {errors.services && <p className="mt-1 text-sm text-red-400">{errors.services}</p>}
        </div>

        <div>
          <Textarea
            placeholder="What do you need help with? New project, existing site, advice, or anything in between."
            rows={4}
            value={formData.message}
            onChange={e => onChange("message", e.target.value)}
            className={`${fieldClass} resize-none ${errors.message ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
          />
          {errors.message && <p className="mt-1 text-sm text-red-400">{errors.message}</p>}
        </div>

        {/* Website audit */}
        <div className="rounded-xl border border-white/20 bg-white/5 p-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.wantsAudit}
              onChange={e => onChange("wantsAudit", e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-white/30 bg-white/10 accent-[#fca5a5]"
            />
            <span className="text-sm text-[#e5e7eb]">
              Want a free website audit?
              <span className="block text-[#9ca3af]">We&apos;ll review your site before the call.</span>
            </span>
          </label>
          {formData.wantsAudit && (
            <div className="mt-3">
              <Input
                placeholder="yourwebsite.com"
                value={formData.websiteUrl}
                onChange={e => onChange("websiteUrl", e.target.value)}
                className={`${fieldClass} ${errors.websiteUrl ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
              />
              {errors.websiteUrl && <p className="mt-1 text-sm text-red-400">{errors.websiteUrl}</p>}
            </div>
          )}
        </div>

        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full bg-[#fca5a5] hover:bg-[#f87171] text-[#091113] font-semibold rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-60 disabled:hover:scale-100"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Saving…
            </span>
          ) : (
            "Continue to booking →"
          )}
        </Button>
      </div>
    </div>
  )
}
