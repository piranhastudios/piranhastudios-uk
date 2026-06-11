/**
 * Lead form field options — GET /api/lead-fields
 *
 * Surfaces the ClickUp Leads-list option sets the public intake form needs
 * (currently the "Service/Product" labels), so the form stays in sync with
 * ClickUp without hardcoding option ids in the client. Cached for a few minutes.
 */
import { NextResponse } from 'next/server'
import { getListFields, fieldOptions } from '@/lib/clickup'

export const runtime = 'nodejs'
export const revalidate = 300

const LEADS_LIST_ID = process.env.CLICKUP_LEADS_LIST_ID ?? '901523772302'
const SERVICE_FIELD_ID = '87118070-1b4b-44de-9ea7-3e9b80c1bd7d' // Service/Product (labels)

export async function GET() {
  try {
    const fields = await getListFields(LEADS_LIST_ID)
    const services = fieldOptions(fields.find(f => f.id === SERVICE_FIELD_ID))
    return NextResponse.json({ services })
  } catch (err) {
    // Don't break the form: the client falls back to its built-in list.
    console.error('[api/lead-fields]', err)
    return NextResponse.json({ services: [] })
  }
}
