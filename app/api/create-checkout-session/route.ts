/**
 * Deposit checkout: POST /api/create-checkout-session
 *
 * Takes a package id (never a price) and opens a one-off Stripe Checkout for
 * the 30% deposit. The amount is computed here from lib/data/packages so a
 * tampered client cannot choose what it pays.
 *
 * The ClickUp lead task id rides along in metadata so the booking step, and
 * anything reading the payment later, can be tied back to the same lead.
 */
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import Stripe from 'stripe'
import { getPackage, depositMinor, balanceMinor, formatGBP, DEPOSIT_RATE } from '@/lib/data/packages'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
})

const BodySchema = z.object({
  packageId: z.string().trim().min(1),
  taskId: z.string().trim().max(100).optional(),
  dealId: z.string().trim().max(100).optional(),
  name: z.string().trim().max(200).optional(),
  email: z.string().trim().email().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const parsed = BodySchema.safeParse(await request.json().catch(() => null))
    if (!parsed.success) {
      return NextResponse.json({ error: 'A package is required' }, { status: 400 })
    }

    const pkg = getPackage(parsed.data.packageId)
    if (!pkg) {
      return NextResponse.json({ error: 'Unknown package' }, { status: 400 })
    }

    const deposit = depositMinor(pkg)
    const balance = balanceMinor(pkg)
    if (deposit === null || balance === null) {
      // Partner is scoped on a call and invoiced after, so there is nothing to charge here.
      return NextResponse.json(
        { error: `${pkg.name} is arranged on a call, not paid up front` },
        { status: 400 },
      )
    }

    // Fall back to the request origin so preview deployments work without config.
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? new URL(request.url).origin
    const { taskId, dealId, name, email } = parsed.data

    const metadata: Record<string, string> = {
      package_id: pkg.id,
      package_name: pkg.name,
      package_total: formatGBP(pkg.priceMinor!),
      deposit_paid: formatGBP(deposit),
      balance_due: formatGBP(balance),
      deposit_rate: `${Math.round(DEPOSIT_RATE * 100)}%`,
      ...(taskId ? { clickup_task_id: taskId } : {}),
      ...(dealId ? { clickup_deal_id: dealId } : {}),
      ...(name ? { contact_name: name } : {}),
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      ...(email ? { customer_email: email } : {}),
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            unit_amount: deposit,
            product_data: {
              name: `${pkg.name} package deposit`,
              description: `${Math.round(DEPOSIT_RATE * 100)}% deposit of ${formatGBP(pkg.priceMinor!)}. ${formatGBP(balance)} due on completion. ${pkg.checkoutDescription}`,
            },
          },
          quantity: 1,
        },
      ],
      // Back to /book, which resumes the flow at the booking step.
      success_url: `${baseUrl}/book?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/book?package=${pkg.id}&cancelled=1`,
      metadata,
      payment_intent_data: { metadata },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('[api/create-checkout-session]', error)
    return NextResponse.json({ error: 'Could not start checkout' }, { status: 500 })
  }
}
