/**
 * Deal intake: POST /api/deals
 *
 * Creates a task on the ClickUp CRM Deals list carrying the money for a chosen
 * package: Deal Value, Deposit Amount, and the opening Sales Stage.
 *
 * Deposit-taking packages open in "Deposit Pending". Note the ordering this
 * creates: the stage is ALWAYS set here, at creation, while the Deposit Link
 * field is filled in later by Zapier. So the stage is never the right trigger
 * for the deposit email; the ClickUp automation should fire on Deposit Link
 * being set, gated on Sales Stage = Deposit Pending. See the plan notes.
 *
 * Money is read from lib/data/packages on the server. Never trust an amount
 * from the request body.
 */
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import {
  createTask,
  addTaskComment,
  DEALS_FIELD,
  SALES_STAGE,
  CRM_ITEM_TYPE,
} from '@/lib/clickup'
import { getPackage, depositMinor, balanceMinor, formatGBP, toMajor, WEBSITE_TAG } from '@/lib/data/packages'
import { upsertDeal } from '@/lib/portal-server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const DEALS_LIST_ID = process.env.CLICKUP_DEALS_LIST_ID ?? '901523772303'

const STAGE_BY_OPENING = {
  'deposit-pending': SALES_STAGE.depositPending,
  discovery: SALES_STAGE.discovery,
} as const

const DealSchema = z.object({
  packageId: z.string().trim().min(1),
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email(),
  company: z.string().trim().max(200).optional().or(z.literal('')),
  message: z.string().trim().max(5000).optional().or(z.literal('')),
  leadTaskId: z.string().trim().max(100).optional().or(z.literal('')),
})

const taskUrl = (id: string) => `https://app.clickup.com/t/${id}`

export async function POST(req: NextRequest) {
  const parsed = DealSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  const d = parsed.data
  const pkg = getPackage(d.packageId)
  if (!pkg) {
    return NextResponse.json({ error: 'Unknown package' }, { status: 400 })
  }

  const deposit = depositMinor(pkg)
  const balance = balanceMinor(pkg)

  const description = [
    `Package: ${pkg.name} (${pkg.price}${pkg.priceNote})`,
    `Email: ${d.email}`,
    d.company ? `Company: ${d.company}` : null,
    deposit !== null && balance !== null
      ? `Deposit due: ${formatGBP(deposit)} (30%). Balance on completion: ${formatGBP(balance)}`
      : 'Retainer, scoped on the call. No deposit up front.',
    d.leadTaskId ? `\nLead task: ${taskUrl(d.leadTaskId)}` : null,
    d.message ? `\nWhat they said:\n${d.message}` : null,
    `\nCreated from the website package flow on ${new Date().toISOString()}`,
  ]
    .filter(Boolean)
    .join('\n')

  try {
    const task = await createTask(DEALS_LIST_ID, {
      name: `[${pkg.name}] ${d.company ? `${d.name} (${d.company})` : d.name}`,
      description,
      // The Zapier zap skips deposit-link generation for tagged deals: these
      // customers pay on the site through Stripe Checkout instead.
      tags: [WEBSITE_TAG],
      custom_fields: [
        { id: DEALS_FIELD.email, value: d.email },
        { id: DEALS_FIELD.contactName, value: d.name },
        { id: DEALS_FIELD.serviceProduct, value: [pkg.clickUpServiceId] },
        { id: DEALS_FIELD.crmItemType, value: CRM_ITEM_TYPE.deal },
        { id: DEALS_FIELD.salesStage, value: STAGE_BY_OPENING[pkg.openingStage] },
        // ClickUp currency fields are MAJOR units; ours are pence.
        // Deal Value only: the Zapier zap watching this list derives Deposit
        // Amount from it (30%) and mints the Stripe deposit link, both within
        // ~15s. Writing Deposit Amount here would just race that zap.
        ...(pkg.priceMinor !== null
          ? [{ id: DEALS_FIELD.dealValue, value: toMajor(pkg.priceMinor) }]
          : []),
      ],
    })

    // Mirror into the `deals` table so ensureCrmRecords adopts this deal at
    // onboarding instead of opening a second one. Best effort.
    await upsertDeal(task).catch(err => console.error('[api/deals] upsertDeal', err))

    // Cross-link the two records so either one leads to the other.
    if (d.leadTaskId) {
      await addTaskComment(
        d.leadTaskId,
        `🤝 Deal created for the ${pkg.name} package: ${taskUrl(task.id)}`,
        false,
      ).catch(err => console.error('[api/deals] lead cross-link', err))
    }

    return NextResponse.json({ ok: true, dealId: task.id })
  } catch (err) {
    // A CRM failure must never stop someone paying or booking.
    console.error('[api/deals]', err)
    return NextResponse.json({ ok: false, dealId: null }, { status: 200 })
  }
}
