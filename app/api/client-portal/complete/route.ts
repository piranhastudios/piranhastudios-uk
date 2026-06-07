import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-delivery'
import { addTaskComment, moveTaskToList } from '@/lib/clickup'

const INCOMING_LIST = process.env.CLICKUP_INCOMING_LIST_ID!
const PROJECTS_LIST = process.env.CLICKUP_PROJECTS_LIST_ID!

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 })

    const { data } = await supabaseAdmin
      .from('client_onboarding')
      .select('clickup_task_id')
      .eq('email', email)
      .single()

    const taskId = data?.clickup_task_id
    if (taskId) {
      await addTaskComment(
        taskId,
        `🎉 Prep pack complete\n\nThe client has submitted their project prep pack and booked their consultation. Ready to review.`
      )
      if (INCOMING_LIST && PROJECTS_LIST) {
        await moveTaskToList(taskId, INCOMING_LIST, PROJECTS_LIST)
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[client-portal/complete]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
