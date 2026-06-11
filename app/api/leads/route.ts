/**
 * Lead intake endpoint — POST /api/leads
 *
 * Creates a task in the ClickUp Leads list from the native intake form and
 * returns its id. The id is handed to the Calendly embed (as salesforce_uuid)
 * so Zapier can attach the booking back to THIS task. The meeting location is
 * chosen in Calendly itself, so it's not captured here.
 *
 * Captures contact details, Service/Product interest, and an optional
 * website-audit request (URL + `audit` tag) onto the task.
 */
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createTask, setTaskCustomField, getListFields, fieldOptions } from '@/lib/clickup'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Leads list: https://app.clickup.com/9015202187/v/li/901523772302
const LEADS_LIST_ID = process.env.CLICKUP_LEADS_LIST_ID ?? '901523772302'

// Custom field ids on the Leads list (GET /list/{id}/field).
const FIELD = {
  email: '38721eaa-db8b-45d8-a38a-a0697db7d37a', // Email (email)
  contactName: '20cc1dc0-5b9d-45cf-b0f2-612232f0b4e9', // Contact Name (short_text)
  website: '75c46481-298b-46d8-a1a4-3962d1bc586a', // Website Link (url)
  serviceProduct: '87118070-1b4b-44de-9ea7-3e9b80c1bd7d', // Service/Product (labels)
} as const

const AUDIT_TAG = 'audit'

// Best-effort id -> label lookup for the Service/Product options, read live from
// ClickUp (cached). Used only to make the task description human-readable; the
// labels field itself is set by id, so this never blocks the lead.
async function resolveServiceLabels(ids: string[]): Promise<string[]> {
  try {
    const fields = await getListFields(LEADS_LIST_ID)
    const byId = new Map(fieldOptions(fields.find(f => f.id === FIELD.serviceProduct)).map(o => [o.id, o.label]))
    return ids.map(id => byId.get(id) ?? id)
  } catch {
    return ids
  }
}

const LeadSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  email: z.string().trim().email('A valid email is required'),
  company: z.string().trim().max(200).optional().or(z.literal('')),
  budget: z.string().trim().max(100).optional().or(z.literal('')),
  services: z.array(z.string().uuid()).max(20).optional(),
  message: z.string().trim().max(5000).optional().or(z.literal('')),
  wantsAudit: z.boolean().optional(),
  websiteUrl: z.string().trim().max(500).optional().or(z.literal('')),
})

// ClickUp url fields reject scheme-less values — normalise "example.com".
const normaliseUrl = (raw: string) =>
  /^https?:\/\//i.test(raw) ? raw : `https://${raw}`

export async function POST(req: NextRequest) {
  try {
    const json = await req.json().catch(() => null)
    const parsed = LeadSchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', issues: parsed.error.flatten().fieldErrors },
        { status: 400 },
      )
    }

    const d = parsed.data
    const serviceLabels = d.services?.length ? await resolveServiceLabels(d.services) : []

    const description = [
      `Email: ${d.email}`,
      d.company ? `Company: ${d.company}` : null,
      d.budget ? `Budget: ${d.budget}` : null,
      serviceLabels.length ? `Service/Product: ${serviceLabels.join(', ')}` : null,
      d.wantsAudit ? `Website audit requested: ${d.websiteUrl ? normaliseUrl(d.websiteUrl) : '(no URL given)'}` : null,
      d.message ? `\nProject details:\n${d.message}` : null,
      `\nSubmitted via website intake form on ${new Date().toISOString()}`,
    ]
      .filter(Boolean)
      .join('\n')

    // Safe-to-inline fields at creation; tags applied here too.
    const task = await createTask(LEADS_LIST_ID, {
      name: d.company ? `${d.name} (${d.company})` : d.name,
      description,
      custom_fields: [
        { id: FIELD.email, value: d.email },
        { id: FIELD.contactName, value: d.name },
        ...(d.services?.length ? [{ id: FIELD.serviceProduct, value: d.services }] : []),
      ],
      ...(d.wantsAudit ? { tags: [AUDIT_TAG] } : {}),
    })

    // Best-effort: a rejected url value must not lose the lead.
    if (d.wantsAudit && d.websiteUrl) {
      await setTaskCustomField(task.id, FIELD.website, normaliseUrl(d.websiteUrl)).catch(err =>
        console.error('[api/leads] website field', err),
      )
    }

    return NextResponse.json({ ok: true, taskId: task.id })
  } catch (err) {
    console.error('[api/leads]', err)
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 })
  }
}
