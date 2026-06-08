import { NextRequest, NextResponse } from 'next/server'
import { ensureProjectTask, ensureCrmRecords } from '@/lib/portal-server'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 })

    // Keeps the deal task in Incoming and creates the linked Projects task
    // (idempotent + concurrency-safe). Also comments on the deal task.
    const projectTaskId = await ensureProjectTask(email)

    // Create the CRM Account (assigned to the deal closer) + Deal in ClickUp.
    await ensureCrmRecords(email).catch(err => console.error('[client-portal/complete] crm', err))

    return NextResponse.json({ ok: true, projectTaskId })
  } catch (err) {
    console.error('[client-portal/complete]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
