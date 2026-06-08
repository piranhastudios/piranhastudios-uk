import { NextRequest, NextResponse } from 'next/server'
import { authPortalClient, ensureProjectTask, type PortalClient } from '@/lib/portal-server'
import { getTaskComments, addTaskComment } from '@/lib/clickup'

// Client messages are posted as "💬 <name>: <text>" so they're readable in
// ClickUp and distinguishable from team replies when rendered in the portal.
const CLIENT_MARK = '💬'

type Channel = 'project' | 'account'

// Resolves which ClickUp task backs the chat: the Account task (account
// manager) or the delivery/project task (project team).
async function channelTaskId(client: PortalClient, channel: Channel): Promise<string | null> {
  if (channel === 'account') return client.clickupAccountTaskId
  const ensured = await ensureProjectTask(client.email).catch(() => null)
  return ensured ?? client.clickupProjectTaskId ?? client.clickupTaskId
}

export async function GET(req: NextRequest) {
  const client = await authPortalClient(req)
  if (!client) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const channel: Channel = req.nextUrl.searchParams.get('channel') === 'account' ? 'account' : 'project'
  const taskId = await channelTaskId(client, channel)
  if (!taskId) return NextResponse.json({ comments: [] })

  const { comments } = await getTaskComments(taskId)
  const mapped = comments
    .map(c => {
      const raw = c.comment_text ?? ''
      const fromClient = raw.startsWith(CLIENT_MARK)
      return {
        id: c.id,
        text: fromClient ? raw.replace(/^💬\s*[^:]*:\s*/, '') : raw,
        author: fromClient ? 'You' : (c.user?.username ?? 'Piranha Studios'),
        fromClient,
        date: c.date,
      }
    })
    .reverse() // ClickUp returns newest-first; render oldest → newest
  return NextResponse.json({ comments: mapped })
}

export async function POST(req: NextRequest) {
  const client = await authPortalClient(req)
  if (!client) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => ({} as { text?: string; channel?: string }))
  const channel: Channel = body.channel === 'account' ? 'account' : 'project'
  const taskId = await channelTaskId(client, channel)
  if (!taskId) return NextResponse.json({ error: 'channel unavailable' }, { status: 400 })

  const trimmed = typeof body.text === 'string' ? body.text.trim() : ''
  if (!trimmed) return NextResponse.json({ error: 'empty message' }, { status: 400 })

  await addTaskComment(taskId, `${CLIENT_MARK} ${client.displayName}: ${trimmed}`)
  return NextResponse.json({ ok: true })
}
