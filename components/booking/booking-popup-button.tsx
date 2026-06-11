"use client"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CalendlyUrls } from "@/lib/data/calendly"
import { CalendarIcon } from "lucide-react"
import { loadCalendlyAssets } from "./calendly-widget"

// Opens the booking calendar as a Calendly popup, tagging the booking with a
// ClickUp task id (salesforce_uuid) so Zapier attaches the appointment to that
// task — e.g. the client's account task or their project task.
export function BookingPopupButton({
  taskId,
  email,
  name,
  label = "Book a call",
  className,
}: {
  taskId: string
  email?: string | null
  name?: string | null
  label?: string
  className?: string
}) {
  useEffect(() => {
    loadCalendlyAssets()
  }, [])

  const open = () => {
    const url = new URL(CalendlyUrls.qa_url)
    url.searchParams.set("salesforce_uuid", taskId)
    if (email) url.searchParams.set("email", email)
    if (name) url.searchParams.set("name", name)
    const target = url.toString()
    if (window.Calendly) window.Calendly.initPopupWidget({ url: target })
    else window.open(target, "_blank", "noopener,noreferrer") // fallback if script not ready
  }

  return (
    <Button type="button" onClick={open} className={className}>
      <CalendarIcon className="h-4 w-4 mr-2" />
      {label}
    </Button>
  )
}
