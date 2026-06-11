// Shared Calendly embed helpers + the single global Window.Calendly declaration
// (declaring it in more than one module would clash on the `Calendly` property).

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (opts: {
        url: string
        parentElement: HTMLElement
        prefill?: { name?: string; email?: string }
        utm?: { salesforceUuid?: string; utmContent?: string }
      }) => void
      initPopupWidget: (opts: { url: string }) => void
    }
  }
}

// Injects Calendly's widget CSS + JS once (idempotent across components/pages).
export function loadCalendlyAssets() {
  if (typeof document === "undefined") return
  if (!document.getElementById("calendly-widget-css")) {
    const css = document.createElement("link")
    css.id = "calendly-widget-css"
    css.rel = "stylesheet"
    css.href = "https://assets.calendly.com/assets/external/widget.css"
    document.head.appendChild(css)
  }
  if (!document.getElementById("calendly-widget-js")) {
    const s = document.createElement("script")
    s.id = "calendly-widget-js"
    s.src = "https://assets.calendly.com/assets/external/widget.js"
    s.async = true
    document.body.appendChild(s)
  }
}
