import { NextRequest, NextResponse } from 'next/server'
import { authPortalClient, ensureProjectTask } from '@/lib/portal-server'
import { getTask, extractPreviewUrl } from '@/lib/clickup'

type CUTask = {
  id?: string
  name?: string
  description?: string
  text_content?: string
  url?: string
  parent?: string | null
  top_level_parent?: string | null
  status?: { status?: string; color?: string; type?: string }
  priority?: { priority?: string; color?: string } | null
  assignees?: Array<{ username?: string; initials?: string; color?: string; profilePicture?: string | null }>
}

export async function GET(req: NextRequest) {
  const client = await authPortalClient(req)
  if (!client) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const taskId = req.nextUrl.searchParams.get('taskId')
  if (!taskId) return NextResponse.json({ error: 'taskId required' }, { status: 400 })

  const projectTaskId = await ensureProjectTask(client.email).catch(() => client.clickupProjectTaskId)

  const task = (await getTask(taskId).catch(() => null)) as CUTask | null
  if (!task) return NextResponse.json({ error: 'not found' }, { status: 404 })

  // Authorise: the task must be the client's project task or one of its subtasks.
  const ownsTask = !!projectTaskId && (
    task.id === projectTaskId ||
    task.parent === projectTaskId ||
    task.top_level_parent === projectTaskId
  )
  if (!ownsTask) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  return NextResponse.json({
    id: task.id ?? taskId,
    name: task.name ?? 'Task',
    description: task.text_content || task.description || '',
    status: task.status?.status ?? null,
    statusColor: task.status?.color ?? null,
    priority: task.priority?.priority ?? null,
    priorityColor: task.priority?.color ?? null,
    assignees: (task.assignees ?? []).map(a => ({
      name: a.username ?? '',
      initials: a.initials ?? '',
      color: a.color ?? null,
    })),
    previewUrl: extractPreviewUrl(task as Record<string, unknown>),
    url: task.url ?? null,
  })
}
