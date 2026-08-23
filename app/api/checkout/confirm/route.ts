/**
 * Deposit confirmation: GET /api/checkout/confirm?session_id=...
 *
 * Called when Stripe returns the customer to /book. Verifies the payment with
 * Stripe (never trusting the query string on its own) and hands the booking
 * step what it needs to resume: the lead's ClickUp task id, name and email.
 *
 * Also records the deposit on the lead task as a comment. That is best effort
 * and idempotent: if the customer reloads the return URL we do not comment
 * twice, and a ClickUp outage must never block the booking.
 */
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { addTaskComment, getTaskComments } from '@/lib/clickup'
import { getPackage } from '@/lib/data/packages'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
})

const gbp = (minor: number | null | undefined) =>
  typeof minor === 'number' ? `£${(minor / 100).toFixed(2).replace(/\.00$/, '')}` : 'unknown'

// One comment per checkout session, so a reload or a back-button replay is a no-op.
async function recordDepositOnLead(taskId: string, marker: string, body: string) {
  const { comments } = await getTaskComments(taskId)
  if (comments.some(c => (c.comment_text ?? '').includes(marker))) return
  await addTaskComment(taskId, body)
}

export async function GET(request: NextRequest) {
  const sessionId = new URL(request.url).searchParams.get('session_id')
  if (!sessionId) {
    return NextResponse.json({ error: 'session_id is required' }, { status: 400 })
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    const paid = session.payment_status === 'paid'
    const meta = session.metadata ?? {}
    const pkg = getPackage(meta.package_id)
    const taskId = meta.clickup_task_id || null

    if (paid && taskId) {
      await recordDepositOnLead(
        taskId,
        sessionId,
        [
          `💳 Deposit paid: ${gbp(session.amount_total)} (${meta.deposit_rate ?? '30%'} of ${meta.package_total ?? 'package'})`,
          `Package: ${meta.package_name ?? 'unknown'}`,
          `Balance due on completion: ${meta.balance_due ?? 'unknown'}`,
          `Stripe session: ${sessionId}`,
        ].join('\n'),
      ).catch(err => console.error('[api/checkout/confirm] clickup comment', err))
    }

    return NextResponse.json({
      paid,
      packageId: meta.package_id ?? null,
      dealId: meta.clickup_deal_id ?? null,
      packageName: meta.package_name ?? pkg?.name ?? null,
      taskId,
      name: meta.contact_name ?? session.customer_details?.name ?? null,
      email: session.customer_details?.email ?? null,
      amountPaid: session.amount_total,
      balanceDue: meta.balance_due ?? null,
      currency: session.currency,
    })
  } catch (error) {
    console.error('[api/checkout/confirm]', error)
    return NextResponse.json({ error: 'Could not verify payment' }, { status: 500 })
  }
}
