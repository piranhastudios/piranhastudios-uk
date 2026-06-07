import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-delivery'
import { getTask, addTaskComment, extractEmail } from '@/lib/clickup'

const INCOMING_LIST = process.env.CLICKUP_INCOMING_LIST_ID
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.piranha-studios.co.uk'
const PORTAL_URL = `${BASE_URL}/client-portal`

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    debugger;
    const { event, task_id } = body

    if (event !== 'taskCreated') {
      return NextResponse.json({ ok: true, skipped: 'not taskCreated' })
    }

    const task = await getTask(task_id)

    if (INCOMING_LIST && task.list?.id !== INCOMING_LIST) {
      return NextResponse.json({ ok: true, skipped: 'wrong list' })
    }

    const email = extractEmail(task)
    if (!email) {
      console.warn(`[new-project] No email found in task ${task_id}`)
      return NextResponse.json({ error: 'No email found in task' }, { status: 422 })
    }

    const supabase = getSupabaseAdmin()

    // Invite user (creates account + sends magic link email)
    const { error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email, {
      redirectTo: PORTAL_URL,
      data: { clickup_task_id: task_id },
    })

    let linkNote = `A sign-in link has been sent to **${email}**.`

    if (inviteError) {
      if (inviteError.message.toLowerCase().includes('already been registered')) {
        // User exists — generate a fresh magic link for the team to forward
        const { data: linkData } = await supabase.auth.admin.generateLink({
          type: 'magiclink',
          email,
          options: { redirectTo: PORTAL_URL },
        })
        const actionLink = (linkData as { properties?: { action_link?: string } } | null)?.properties?.action_link
        linkNote = actionLink
          ? `Client already has an account.\n\nMagic link (expires in 24h — forward to client):\n${actionLink}`
          : `Client already has an account. Ask them to visit the portal URL and use magic link sign-in.`
      } else {
        console.error('[new-project] Supabase invite error:', inviteError)
        return NextResponse.json({ error: inviteError.message }, { status: 500 })
      }
    }

    // Upsert record in delivery DB
    await supabase
      .from('client_onboarding')
      .upsert({ email, clickup_task_id: task_id }, { onConflict: 'email', ignoreDuplicates: true })

    // Comment on ClickUp task with portal link
    await addTaskComment(
      task_id,
      `✅ Client portal ready\n\n${linkNote}\n\nPortal URL: ${PORTAL_URL}\n\nOnce signed in, the client will complete the project prep pack and book their consultation.`
    )

    return NextResponse.json({ ok: true, email })
  } catch (err) {
    console.error('[new-project] Webhook error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
