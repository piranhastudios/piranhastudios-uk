/**
 * Stripe webhook: POST /api/webhooks/stripe
 *
 * The durable record that a deposit landed. Needed because the pay-later route
 * never returns to our site at all: the customer clicks a link in a ClickUp
 * email, pays, and closes the tab. /api/checkout/confirm is only the fast path
 * for the on-site journey; this is the source of truth.
 *
 * Only sessions WE created carry clickup_deal_id. A payment made through the
 * Zapier-generated deposit link has no metadata of ours, so it is logged and
 * skipped; a Zap should move that deal to Won instead.
 */
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import {
  addTaskComment,
  getTaskComments,
  setTaskCustomField,
  DEALS_FIELD,
  SALES_STAGE,
} from '@/lib/clickup'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
})

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET

const gbp = (minor: number | null | undefined) =>
  typeof minor === 'number' ? `£${(minor / 100).toFixed(2).replace(/\.00$/, '')}` : 'unknown'

/** One comment per checkout session, so Stripe's retries stay harmless. */
async function commentOnce(taskId: string, marker: string, body: string) {
  const { comments } = await getTaskComments(taskId)
  if (comments.some(c => (c.comment_text ?? '').includes(marker))) return false
  await addTaskComment(taskId, body)
  return true
}

async function markDealPaid(session: Stripe.Checkout.Session) {
  const meta = session.metadata ?? {}
  const dealId = meta.clickup_deal_id
  if (!dealId) {
    console.warn('[webhooks/stripe] paid session with no clickup_deal_id', session.id)
    return
  }

  const wrote = await commentOnce(
    dealId,
    session.id,
    [
      `💳 Deposit paid: ${gbp(session.amount_total)} (${meta.deposit_rate ?? '30%'} of ${meta.package_total ?? 'package'})`,
      `Package: ${meta.package_name ?? 'unknown'}`,
      `Balance due on completion: ${meta.balance_due ?? 'unknown'}`,
      `Paid on the website. Stripe session: ${session.id}`,
    ].join('\n'),
  )

  // Only move the stage the first time, so a manual change is not undone by a replay.
  if (!wrote) return

  // Sales Stage only. Deposit Amount is owned by the Zapier zap that derives
  // it from Deal Value; writing it here would race that zap for no gain.
  await setTaskCustomField(dealId, DEALS_FIELD.salesStage, SALES_STAGE.won).catch(err =>
    console.error('[webhooks/stripe] sales stage', err),
  )
}

export async function POST(req: NextRequest) {
  if (!WEBHOOK_SECRET) {
    console.error('[webhooks/stripe] STRIPE_WEBHOOK_SECRET is not set')
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  }

  const signature = req.headers.get('stripe-signature')
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    // Signature verification needs the RAW body: never req.json() here.
    const raw = await req.text()
    event = stripe.webhooks.constructEvent(raw, signature, WEBHOOK_SECRET)
  } catch (err) {
    console.error('[webhooks/stripe] signature verification failed', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      if (session.payment_status === 'paid') await markDealPaid(session)
    }
    return NextResponse.json({ received: true })
  } catch (err) {
    // 500 asks Stripe to retry; commentOnce keeps that idempotent.
    console.error('[webhooks/stripe]', err)
    return NextResponse.json({ error: 'Handler failed' }, { status: 500 })
  }
}
