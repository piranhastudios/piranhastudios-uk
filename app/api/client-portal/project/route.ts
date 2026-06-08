import { NextRequest, NextResponse } from 'next/server'
import { authPortalClient, ensureProjectTask } from '@/lib/portal-server'
import { getTask, getTaskComments, addTaskComment, extractPreviewUrl } from '@/lib/clickup'

type CUStatus = { status?: string; color?: string; type?: string } | undefined
type CUTask = { id?: string; name?: string; url?: string; status?: CUStatus; subtasks?: CUTask[] }

const isComplete = (s: CUStatus) => s?.type === 'closed' || s?.type === 'done'
const isReviewing = (s: CUStatus) => (s?.status ?? '').toLowerCase().includes('review')

export async function GET(req: NextRequest) {
  const client = await authPortalClient(req)
  if (!client) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  // Self-heal: a completed client without a delivery task gets one created here.
  const projectTaskId = await ensureProjectTask(client.email).catch(() => client.clickupProjectTaskId)

  const [contractTask, projectTask] = await Promise.all([
    client.clickupTaskId ? (getTask(client.clickupTaskId).catch(() => null) as Promise<CUTask | null>) : Promise.resolve(null),
    projectTaskId ? (getTask(projectTaskId, { subtasks: true }).catch(() => null) as Promise<CUTask | null>) : Promise.resolve(null),
  ])

  const contract = contractTask ? {
    name: contractTask.name ?? 'Your engagement',
    status: contractTask.status?.status ?? null,
    color: contractTask.status?.color ?? null,
    url: contractTask.url ?? null,
  } : null

  // Enrich subtasks. Preview URLs live on each subtask's custom fields, so we
  // only fetch full detail for the (usually few) tasks currently in review.
  const rawSubtasks = projectTask?.subtasks ?? []
  const subtasks = await Promise.all(rawSubtasks.map(async t => {
    const reviewing = isReviewing(t.status)
    let previewUrl: string | null = null
    if (reviewing && t.id) {
      const full = await getTask(t.id).catch(() => null)
      previewUrl = full ? extractPreviewUrl(full as Record<string, unknown>) : null
    }
    return {
      id: t.id ?? null,
      name: t.name ?? 'Task',
      status: t.status?.status ?? null,
      color: t.status?.color ?? null,
      complete: isComplete(t.status),
      inReview: reviewing,
      previewUrl,
    }
  }))

  const done = subtasks.filter(s => s.complete).length
  const project = projectTask ? {
    name: projectTask.name ?? 'Your project',
    status: projectTask.status?.status ?? null,
    color: projectTask.status?.color ?? null,
    url: projectTask.url ?? null,
    subtasks,
    progress: subtasks.length
      ? Math.round((done / subtasks.length) * 100)
      : (isComplete(projectTask.status) ? 100 : 0),
  } : null

  // Send previews to the client: post a chat message for any in-review task with
  // a preview URL we haven't already announced (dedup by scanning comments).
  const previews = subtasks.filter(s => s.inReview && s.previewUrl)
  if (previews.length && projectTaskId) {
    const { comments } = await getTaskComments(projectTaskId).catch(() => ({ comments: [] }))
    const seen = comments.map(c => c.comment_text ?? '').join('\n')
    for (const p of previews) {
      if (p.previewUrl && !seen.includes(p.previewUrl)) {
        await addTaskComment(projectTaskId, `🔗 Preview ready for review — ${p.name}: ${p.previewUrl}`).catch(() => {})
      }
    }
  }

  return NextResponse.json({ contract, project, hasProject: !!projectTaskId, hasAccount: !!client.clickupAccountTaskId })
}
