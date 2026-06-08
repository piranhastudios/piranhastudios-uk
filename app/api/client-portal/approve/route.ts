import { NextRequest, NextResponse } from 'next/server'
import { authPortalClient, ensureProjectTask } from '@/lib/portal-server'
import { getTask, setTaskStatus, addTaskComment, getCustomFieldValue } from '@/lib/clickup'
import { sendEmail, invoiceEmailHtml } from '@/lib/email'

// CRM Deal custom fields.
const FINAL_PAYMENT_LINK_FIELD = '8ea32a6c-6644-436a-b183-232afc695f2e'
const DEAL_VALUE_FIELD = '31cd4163-26a5-409b-8bc9-7d92d682736c'
const DEPOSIT_AMOUNT_FIELD = '0ea54494-e584-4af7-a6ed-5b4bbbeb15e7'
const CLOSED_STATUS = 'Closed'

const gbp = (n: number) => `£${n.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`

// Client confirms their review of the overall project. Guarded so it only works
// while the project task is "in review". Closes the project task and delivers
// the balance payment link (read from the deal) into the hub chat.
export async function POST(req: NextRequest) {
  const client = await authPortalClient(req)
  if (!client) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const projectTaskId = (await ensureProjectTask(client.email).catch(() => null)) ?? client.clickupProjectTaskId
  if (!projectTaskId) return NextResponse.json({ error: 'no project' }, { status: 400 })

  const project = await getTask(projectTaskId).catch(() => null)
  const status = ((project as { status?: { status?: string } } | null)?.status?.status ?? '').toLowerCase()
  if (!status.includes('review')) {
    return NextResponse.json({ error: 'project is not in review' }, { status: 409 })
  }

  // Close the project task.
  await setTaskStatus(projectTaskId, CLOSED_STATUS)
  const projectName = (project as { name?: string } | null)?.name

  // Read the pre-made balance payment link + amounts from the deal task.
  let paymentLink: string | null = null
  let amount: string | undefined
  const dealId = client.clickupDealTaskId ?? client.clickupTaskId
  if (dealId) {
    const deal = await getTask(dealId).catch(() => null)
    if (deal) {
      const d = deal as Record<string, unknown>
      paymentLink = getCustomFieldValue(d, FINAL_PAYMENT_LINK_FIELD)
      const dealValue = Number(getCustomFieldValue(d, DEAL_VALUE_FIELD) ?? '')
      const deposit = Number(getCustomFieldValue(d, DEPOSIT_AMOUNT_FIELD) ?? '')
      if (Number.isFinite(dealValue) && dealValue > 0) {
        amount = gbp(dealValue - (Number.isFinite(deposit) ? deposit : 0))
      }
    }
  }

  // Email the client their final invoice (Resend), and mirror it into the chat.
  if (paymentLink) {
    await sendEmail({
      to: client.email,
      subject: 'Your Piranha Studios project is complete — final invoice',
      html: invoiceEmailHtml({ name: client.displayName, projectName, amount, paymentLink }),
      replyTo: 'info@piranha-studios.co.uk',
    }).catch(() => {})
  }
  await addTaskComment(
    projectTaskId,
    paymentLink
      ? `✅ Project approved — thank you!\n\nWe've emailed your final invoice${amount ? ` for ${amount}` : ''}. You can also pay here: ${paymentLink}`
      : `✅ Project approved — thank you!\n\nYour final invoice will follow shortly.`
  ).catch(() => {})

  return NextResponse.json({ ok: true, paymentLink })
}
