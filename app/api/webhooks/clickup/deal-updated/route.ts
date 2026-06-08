import { NextRequest, NextResponse } from 'next/server'
import { getTask, extractEmail, extractBudgetMinor } from '@/lib/clickup'
import { upsertDeal, ensureGuildQuest } from '@/lib/portal-server'

// ClickUp calls this when a deal task changes (point a ClickUp Automation /
// webhook for the Incoming list at it — ideally on Budget being set). We record
// the deal and, once a Budget is present, create the client_contract guild quest.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({} as Record<string, unknown>))
    const payload = (body as { payload?: { id?: string }; task_id?: string; id?: string })
    const taskId = payload.payload?.id ?? payload.task_id ?? payload.id
    if (!taskId) return NextResponse.json({ error: 'no task id in payload' }, { status: 400 })

    const task = await getTask(taskId)
    await upsertDeal(task)

    const email = extractEmail(task)
    const budgetMinor = extractBudgetMinor(task)

    // Budget set → create the guild quest if the client is eligible (idempotent;
    // no-ops if there's no onboarding row, the quest already exists, or no budget).
    if (email && budgetMinor) {
      await ensureGuildQuest(email).catch(err => console.error('[clickup/deal-updated] guild quest', err))
    }

    return NextResponse.json({ ok: true, budgetSet: !!budgetMinor })
  } catch (err) {
    console.error('[clickup/deal-updated]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
