"use client"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CalendlyUrls } from "@/lib/data/calendly"
import { loadCalendlyAssets } from "./calendly-widget"
import { PACKAGES, getPackage, depositMinor, balanceMinor, formatGBP, DEPOSIT_RATE, type Package } from "@/lib/data/packages"
import { CheckCircle, AlertCircle, Loader2, Check, ArrowLeft } from "lucide-react"


type FormData = {
  name: string
  email: string
  company: string
  budget: string
  services: string[]
  message: string
}
type Errors = Partial<Record<keyof FormData, string>>
type Step = "package" | "form" | "payment" | "booking" | "done"

const EMPTY: FormData = {
  name: "", email: "", company: "", budget: "", services: [], message: "",
}

// A cancelled Stripe checkout drops us back here having already created the
// lead. Parking it in sessionStorage means a retry reuses that task instead of
// filing a duplicate.
const RESUME_KEY = "ps_booking_resume"

type ResumeState = { taskId: string; dealId: string | null; packageId: string; formData: FormData }

const readResume = (): ResumeState | null => {
  try {
    const raw = sessionStorage.getItem(RESUME_KEY)
    return raw ? (JSON.parse(raw) as ResumeState) : null
  } catch {
    return null
  }
}

const writeResume = (state: ResumeState) => {
  try {
    sessionStorage.setItem(RESUME_KEY, JSON.stringify(state))
  } catch {
    /* private browsing: the flow still works, a retry just refiles the lead */
  }
}

const clearResume = () => {
  try {
    sessionStorage.removeItem(RESUME_KEY)
  } catch {
    /* nothing to clean up */
  }
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

const DEPOSIT_LABEL = `${Math.round(DEPOSIT_RATE * 100)}%`

type PaidInfo = { packageName: string; amountPaid: number | null; balanceDue: string | null }

type BookingFlowProps = {
  /** ?package= from the homepage CTAs, resolved on the server. */
  initialPackage?: string | null
  /** ?session_id= that Stripe returns with. */
  sessionId?: string | null
  /** ?cancelled=1 when checkout was abandoned. */
  cancelled?: boolean
}

export function BookingFlow({
  initialPackage = null,
  sessionId = null,
  cancelled: wasCancelled = false,
}: BookingFlowProps) {
  const packageParam = initialPackage

  const [step, setStep] = useState<Step>(sessionId ? "booking" : "package")
  const [selected, setSelected] = useState<Package | null>(() => getPackage(packageParam) ?? null)
  // Distinguishes "hasn't chosen yet" from the deliberate "not sure yet" route.
  const [choiceMade, setChoiceMade] = useState(Boolean(getPackage(packageParam)))
  const [formData, setFormData] = useState<FormData>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [taskId, setTaskId] = useState<string | null>(null)
  const [dealId, setDealId] = useState<string | null>(null)
  const [paidInfo, setPaidInfo] = useState<PaidInfo | null>(null)
  const [isVerifying, setIsVerifying] = useState(Boolean(sessionId))
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

  // --- Returning from Stripe: verify the deposit before showing the calendar ---
  useEffect(() => {
    if (!sessionId) return
    let cancelled = false
    fetch(`/api/checkout/confirm?session_id=${encodeURIComponent(sessionId)}`)
      .then(res => res.json())
      .then(data => {
        if (cancelled) return
        if (data?.paid && data.taskId) {
          setTaskId(data.taskId)
          setDealId(data.dealId ?? null)
          setPaidInfo({
            packageName: data.packageName ?? "your package",
            amountPaid: data.amountPaid ?? null,
            balanceDue: data.balanceDue ?? null,
          })

          // Stripe returns us to /book?session_id=... with no ?package=, so the
          // selection has to be rebuilt from the session. Without this the
          // booking step falls back to the free Q&A calendar instead of the
          // consultation the customer just paid for.
          const paidPkg = getPackage(data.packageId)
          if (paidPkg) {
            setSelected(paidPkg)
            setChoiceMade(true)
          }

          // Restore what we can for the Calendly prefill: the session first,
          // then whatever the pre-redirect resume blob still holds.
          const resume = readResume()
          setFormData(prev => ({
            ...prev,
            ...(resume?.formData ?? {}),
            name: data.name || resume?.formData?.name || prev.name,
            email: data.email || resume?.formData?.email || prev.email,
          }))

          clearResume()
          setStep("booking")
        } else {
          setSubmitError("We couldn't confirm that payment. If you were charged, email info@piranha-studios.co.uk and we'll sort it out.")
          setStep("form")
        }
      })
      .catch(() => {
        if (cancelled) return
        setSubmitError("We couldn't confirm that payment. If you were charged, email info@piranha-studios.co.uk and we'll sort it out.")
        setStep("form")
      })
      .finally(() => {
        if (!cancelled) setIsVerifying(false)
      })
    return () => {
      cancelled = true
    }
  }, [sessionId])

  // --- Returning from a cancelled checkout: pick the flow back up mid-way ---
  useEffect(() => {
    if (!wasCancelled) return
    const resume = readResume()
    if (resume) {
      setTaskId(resume.taskId)
      setDealId(resume.dealId)
      setFormData(resume.formData)
      const pkg = getPackage(resume.packageId)
      if (pkg) {
        setSelected(pkg)
        setChoiceMade(true)
      }
    }
    setStep("form")
    setSubmitError("Payment was cancelled. Your details are saved, so you can pick up where you left off.")
  }, [wasCancelled])

  // Deep link straight to a package, e.g. /book?package=business
  useEffect(() => {
    const pkg = getPackage(packageParam)
    if (pkg && !sessionId && !wasCancelled) {
      setSelected(pkg)
      setChoiceMade(true)
      setStep("form")
    }
  }, [packageParam, sessionId, wasCancelled])

  // Packages book the full consultation; a bare enquiry books the free Q&A.
  const calendlyUrl = selected?.meeting === "evaluation" ? CalendlyUrls.evaluation_url : CalendlyUrls.qa_url

  const bookingUrl = (() => {
    const url = new URL(calendlyUrl)
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
  }, [step, taskId, calendlyUrl])

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
    // The package already says which service this is, so only ask when there isn't one.
    if (!selected && !formData.services.length) next.services = "Pick at least one"
    if (!formData.message.trim()) next.message = "Please tell us a little about what you need"
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

  const choosePackage = (pkg: Package | null) => {
    setSelected(pkg)
    setChoiceMade(true)
    setStep("form")
    setSubmitError(null)
  }

  /** Creates the lead once, reusing it if a previous checkout was abandoned. */
  const ensureLead = async (): Promise<string> => {
    if (taskId) return taskId
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, packageId: selected?.id ?? "" }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok || !data.taskId) throw new Error(data.error || "Something went wrong")
    setTaskId(data.taskId)
    return data.taskId as string
  }

  /**
   * Files the CRM deal carrying the money. Best effort by design: a ClickUp
   * outage must not stop someone paying or booking, so a failure returns null
   * and the flow carries on.
   */
  const ensureDeal = async (leadTaskId: string): Promise<string | null> => {
    if (dealId) return dealId
    if (!selected) return null
    try {
      const res = await fetch("/api/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId: selected.id,
          name: formData.name,
          email: formData.email,
          company: formData.company,
          message: formData.message,
          leadTaskId,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (data?.dealId) {
        setDealId(data.dealId)
        return data.dealId as string
      }
    } catch (err) {
      console.error("Deal creation error:", err)
    }
    return null
  }

  const onSubmit = async () => {
    if (!validate()) return
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      const id = await ensureLead()
      const deal = await ensureDeal(id)
      if (deal) writeResume({ taskId: id, dealId: deal, packageId: selected?.id ?? "", formData })

      // Fixed-price packages get the choice of paying now or being sent the link.
      setStep(selected?.requiresDeposit ? "payment" : "booking")
    } catch (err) {
      console.error("Booking flow error:", err)
      setSubmitError("We couldn't save your details. Please try again or email info@piranha-studios.co.uk.")
    } finally {
      setIsSubmitting(false)
    }
  }

  /** Route A: pay the deposit on the site now, via Stripe Checkout. */
  const payNow = async () => {
    if (!selected || !taskId) return
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      writeResume({ taskId, dealId, packageId: selected.id, formData })
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId: selected.id,
          taskId,
          dealId,
          name: formData.name,
          email: formData.email,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.url) throw new Error(data.error || "Could not start checkout")
      window.location.href = data.url // keep the spinner up while the browser navigates
    } catch (err) {
      console.error("Checkout error:", err)
      setSubmitError("We couldn't open the payment page. Please try again or email info@piranha-studios.co.uk.")
      setIsSubmitting(false)
    }
  }

  const totalSteps = selected?.requiresDeposit ? 4 : 3
  const deposit = selected ? depositMinor(selected) : null
  const balance = selected ? balanceMinor(selected) : null

  // --- Verifying a Stripe return ---
  if (isVerifying) {
    return (
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-10 border border-white/10 shadow-lg text-center">
        <Loader2 className="h-12 w-12 text-[#fca5a5] mx-auto mb-6 animate-spin" />
        <h2 className="text-2xl font-semibold text-[#e5e7eb] mb-2">Confirming your payment</h2>
        <p className="text-[#9ca3af]">One moment, then you can pick a time.</p>
      </div>
    )
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
        {paidInfo && (
          <p className="text-[#9ca3af] max-w-md mx-auto mt-4 text-sm">
            Your {paidInfo.packageName} deposit is paid and your receipt is on its way from Stripe.
            {paidInfo.balanceDue ? ` The remaining ${paidInfo.balanceDue} is due on completion.` : ""}
          </p>
        )}
      </div>
    )
  }

  // Deposit packages are gated: the calendar opens only once Stripe has
  // confirmed payment (which is what sets paidInfo). Anything else falls
  // through to the payment step below.
  const depositSettled = !selected?.requiresDeposit || Boolean(paidInfo)

  // --- Calendly embed ---
  if (step === "booking" && depositSettled) {
    return (
      <div className="relative left-1/2 w-screen -translate-x-1/2">
        {paidInfo && (
          <div className="max-w-2xl mx-auto px-6 mb-6">
            <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-xl flex items-start">
              <CheckCircle className="h-5 w-5 text-green-400 mr-3 mt-0.5 shrink-0" />
              <span className="text-green-300 text-sm">
                Deposit received{paidInfo.amountPaid !== null ? ` (${formatGBP(paidInfo.amountPaid)})` : ""} for{" "}
                {paidInfo.packageName}.
                {paidInfo.balanceDue ? ` The remaining ${paidInfo.balanceDue} is due on completion.` : ""} Last step:
                pick a time below.
              </span>
            </div>
          </div>
        )}
        <div className="text-center mb-8 px-6">
          <p className="text-[#fca5a5] font-medium">Step {totalSteps} of {totalSteps}</p>
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

  // --- Payment step (also catches an ungated attempt to reach booking) ---
  if ((step === "payment" || step === "booking") && selected && deposit !== null && balance !== null) {
    return (
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-lg">
        <div className="mb-6">
          <p className="text-[#fca5a5] font-medium">Step 3 of {totalSteps}</p>
          <h2 className="text-2xl font-semibold text-[#e5e7eb] mt-1">Secure your {selected.name} build</h2>
          <p className="text-[#9ca3af] mt-2">
            A {DEPOSIT_LABEL} deposit of{" "}
            <span className="text-[#e5e7eb] font-medium">{formatGBP(deposit)}</span> starts the work. The
            remaining {formatGBP(balance)} is due on completion.
          </p>
        </div>

        {submitError && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-3 shrink-0" />
            <span className="text-red-300 text-sm">{submitError}</span>
          </div>
        )}

        <div className="space-y-3">
          <Button
            onClick={payNow}
            disabled={isSubmitting}
            className="w-full bg-[#b91c1c] hover:bg-[#dc2626] text-white font-semibold rounded-xl py-6 text-base shadow-lg hover:shadow-[#b91c1c]/25 transition-all duration-300 disabled:opacity-60"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Taking you to checkout…
              </span>
            ) : (
              `Pay ${formatGBP(deposit)} deposit now`
            )}
          </Button>

        </div>

        <p className="text-xs text-center text-[#9ca3af]/70 mt-4">
          Secure payment by Stripe. Your consultation is booked straight after.
        </p>

        <p className="text-xs text-center text-[#9ca3af]/60 mt-3">
          Not ready today? Your details are saved. Email{" "}
          <a href="mailto:info@piranha-studios.co.uk" className="underline hover:text-[#fca5a5]">
            info@piranha-studios.co.uk
          </a>{" "}
          and we&apos;ll pick it up with you.
        </p>
      </div>
    )
  }

  // --- Package picker ---
  if (step === "package" && !choiceMade) {
    return (
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-lg">
        <div className="mb-6">
          <p className="text-[#fca5a5] font-medium">Step 1 of 4</p>
          <h2 className="text-2xl font-semibold text-[#e5e7eb] mt-1">Which package do you want?</h2>
          <p className="text-[#9ca3af] mt-2 text-sm">
            Fixed-price packages start with a {DEPOSIT_LABEL} deposit. The rest is due on completion.
          </p>
        </div>

        <div className="space-y-3">
          {PACKAGES.map(pkg => {
            const dep = depositMinor(pkg)
            return (
              <button
                key={pkg.id}
                type="button"
                onClick={() => choosePackage(pkg)}
                className="w-full text-left rounded-2xl border border-white/10 bg-white/5 p-5 transition-all hover:border-[#fca5a5]/40 hover:bg-white/10"
              >
                <div className="flex items-baseline justify-between gap-4 flex-wrap">
                  <span className="text-lg font-semibold text-[#e5e7eb]">{pkg.name}</span>
                  <span className="text-[#fca5a5] font-semibold">
                    {pkg.price}
                    <span className="text-[#9ca3af] text-sm font-normal">{pkg.priceNote}</span>
                  </span>
                </div>
                <p className="text-[#9ca3af] text-sm mt-1">{pkg.tagline}</p>
                <p className="text-xs text-[#9ca3af]/70 mt-2">
                  {dep !== null
                    ? `${formatGBP(dep)} deposit today, ${formatGBP(balanceMinor(pkg)!)} on completion`
                    : "No deposit. We scope it together on the call and invoice monthly."}
                </p>
              </button>
            )
          })}

          <button
            type="button"
            onClick={() => choosePackage(null)}
            className="w-full text-left rounded-2xl border border-dashed border-white/20 bg-transparent p-5 transition-all hover:border-white/40 hover:bg-white/5"
          >
            <span className="text-lg font-semibold text-[#e5e7eb]">Not sure yet, or something custom</span>
            <p className="text-[#9ca3af] text-sm mt-1">
              Talk it through with us first. No payment, just a call.
            </p>
          </button>
        </div>
      </div>
    )
  }

  // --- Intake form ---
  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-lg">
      <div className="mb-6">
        <button
          type="button"
          onClick={() => {
            setChoiceMade(false)
            setStep("package")
            setSubmitError(null)
          }}
          className="inline-flex items-center gap-1 text-sm text-[#9ca3af] hover:text-[#fca5a5] transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          {selected ? "Change package" : "Choose a package"}
        </button>
        <p className="text-[#fca5a5] font-medium">Step 2 of {totalSteps}</p>
        <h2 className="text-2xl font-semibold text-[#e5e7eb] mt-1">
          {selected ? `Tell us about your ${selected.name} build` : "How can we help?"}
        </h2>
      </div>

      {/* Selected package summary */}
      {selected && (
        <div className="mb-6 rounded-xl border border-[#fca5a5]/20 bg-[#fca5a5]/5 p-4">
          <div className="flex items-baseline justify-between gap-4 flex-wrap">
            <span className="font-semibold text-[#e5e7eb]">{selected.name}</span>
            <span className="text-[#fca5a5] font-semibold">
              {selected.price}
              <span className="text-[#9ca3af] text-sm font-normal">{selected.priceNote}</span>
            </span>
          </div>
          {deposit !== null && balance !== null ? (
            <p className="text-sm text-[#9ca3af] mt-2 flex items-start gap-2">
              <Check className="h-4 w-4 text-[#fca5a5] mt-0.5 shrink-0" />
              <span>
                You&apos;ll pay a {DEPOSIT_LABEL} deposit of{" "}
                <span className="text-[#e5e7eb] font-medium">{formatGBP(deposit)}</span> next, then book your call.
                The remaining {formatGBP(balance)} is due on completion.
              </span>
            </p>
          ) : (
            <p className="text-sm text-[#9ca3af] mt-2 flex items-start gap-2">
              <Check className="h-4 w-4 text-[#fca5a5] mt-0.5 shrink-0" />
              <span>No deposit. We scope the retainer together on the call and invoice monthly.</span>
            </p>
          )}
        </div>
      )}

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

        {/* Budget and service interest only matter when there's no package to imply them */}
        {!selected && (
          <>
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
          </>
        )}

        <div>
          <Textarea
            placeholder={
              selected
                ? "Tell us about your business, and anything you already have ready (logo, photos, products)."
                : "What do you need help with? New project, existing site, advice, or anything in between."
            }
            rows={4}
            value={formData.message}
            onChange={e => onChange("message", e.target.value)}
            className={`${fieldClass} resize-none ${errors.message ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
          />
          {errors.message && <p className="mt-1 text-sm text-red-400">{errors.message}</p>}
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
          ) : selected?.requiresDeposit ? (
            "Continue to deposit →"
          ) : (
            "Continue to booking →"
          )}
        </Button>
      </div>
    </div>
  )
}
