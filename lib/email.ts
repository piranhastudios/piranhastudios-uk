import { Resend } from 'resend'

// Verified sending identity. Override with RESEND_FROM; the domain must be
// verified in Resend for delivery.
const FROM = process.env.RESEND_FROM || 'Piranha Studios <info@piranha-studios.co.uk>'

let _resend: Resend | null = null
function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY
  if (!key) return null
  if (!_resend) _resend = new Resend(key)
  return _resend
}

export async function sendEmail(opts: {
  to: string | string[]
  subject: string
  html: string
  replyTo?: string
}): Promise<boolean> {
  const resend = getResend()
  if (!resend) {
    console.error('[email] RESEND_API_KEY not set — skipping send')
    return false
  }
  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: Array.isArray(opts.to) ? opts.to : [opts.to],
      subject: opts.subject,
      html: opts.html,
      replyTo: opts.replyTo,
    })
    if (error) {
      console.error('[email] send failed', error)
      return false
    }
    return true
  } catch (e) {
    console.error('[email] send threw', e)
    return false
  }
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!))
}

export function invoiceEmailHtml(opts: { name?: string; projectName?: string; amount?: string; paymentLink: string }): string {
  const greeting = opts.name ? `Hi ${escapeHtml(opts.name)},` : 'Hi,'
  const project = opts.projectName ? ` &ldquo;${escapeHtml(opts.projectName)}&rdquo;` : ''
  const amountLine = opts.amount
    ? `<p style="margin:0 0 16px;font-size:15px;color:#111">Remaining balance: <strong>${escapeHtml(opts.amount)}</strong></p>`
    : ''
  return `<div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:520px;margin:0 auto;padding:8px 4px;color:#111">
    <p style="font-size:15px;margin:0 0 12px">${greeting}</p>
    <p style="font-size:15px;margin:0 0 16px">Great news — your project${project} has been approved and completed. 🎉</p>
    ${amountLine}
    <p style="margin:0 0 20px">
      <a href="${opts.paymentLink}" style="display:inline-block;background:#000;color:#fff;text-decoration:none;font-weight:600;font-size:15px;padding:12px 20px;border-radius:8px">Pay remaining balance</a>
    </p>
    <p style="font-size:12px;color:#888;margin:0 0 20px;word-break:break-all">Or paste this link into your browser: ${escapeHtml(opts.paymentLink)}</p>
    <p style="font-size:15px;margin:0">Thank you,<br/>Piranha Studios</p>
  </div>`
}
