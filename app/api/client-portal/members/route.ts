import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-delivery'
import { authPortalClient } from '@/lib/portal-server'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.piranha-studios.co.uk'
const PORTAL_URL = `${BASE_URL}/client-portal`
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

// Lists the additional contacts who can access this hub.
export async function GET(req: NextRequest) {
  const client = await authPortalClient(req)
  if (!client) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  return NextResponse.json({
    members: client.memberEmails,
    primaryEmail: client.email,
    isPrimary: client.callerEmail === client.email,
  })
}

// Adds a contact (primary only) and sends them a magic-link invite.
export async function POST(req: NextRequest) {
  const client = await authPortalClient(req)
  if (!client) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  if (client.callerEmail !== client.email) return NextResponse.json({ error: 'only the primary contact can add people' }, { status: 403 })

  const body = await req.json().catch(() => ({} as { email?: string }))
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: 'invalid email' }, { status: 400 })
  if (email === client.email.toLowerCase()) return NextResponse.json({ ok: true, members: client.memberEmails })

  const admin = getSupabaseAdmin()
  const members = Array.from(new Set([...client.memberEmails, email]))
  const { error } = await admin.from('client_onboarding').update({ member_emails: members }).eq('email', client.email)
  if (error) {
    console.error('[client-portal/members] update failed', error)
    return NextResponse.json({ error: 'could not add contact' }, { status: 500 })
  }

  // Best-effort invite (emails new users; existing users just sign in normally).
  await admin.auth.admin.inviteUserByEmail(email, { redirectTo: PORTAL_URL }).catch(() => {})

  return NextResponse.json({ ok: true, members })
}

// Removes a contact (primary only).
export async function DELETE(req: NextRequest) {
  const client = await authPortalClient(req)
  if (!client) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  if (client.callerEmail !== client.email) return NextResponse.json({ error: 'only the primary contact can remove people' }, { status: 403 })

  const email = (req.nextUrl.searchParams.get('email') ?? '').trim().toLowerCase()
  if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 })

  const admin = getSupabaseAdmin()
  const members = client.memberEmails.filter(m => m !== email)
  const { error } = await admin.from('client_onboarding').update({ member_emails: members }).eq('email', client.email)
  if (error) return NextResponse.json({ error: 'could not remove contact' }, { status: 500 })

  return NextResponse.json({ ok: true, members })
}
