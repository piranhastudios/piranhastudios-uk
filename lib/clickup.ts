const API = 'https://api.clickup.com/api/v2'
const TOKEN = process.env.CLICKUP_API_TOKEN!

export type ClickUpStatus = { status: string; color: string; type: string }

export type ClickUpComment = {
  id: string
  comment_text: string
  user: { id: number; username: string; email?: string; profilePicture?: string | null }
  date: string
}

export async function getTask(taskId: string, opts?: { subtasks?: boolean }) {
  const url = new URL(`${API}/task/${taskId}`)
  if (opts?.subtasks) url.searchParams.set('include_subtasks', 'true')
  const res = await fetch(url, {
    headers: { Authorization: TOKEN },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`ClickUp getTask failed: ${res.status}`)
  return res.json()
}

export async function createTask(listId: string, body: {
  name: string
  description?: string
  status?: string
  assignees?: number[]
  custom_fields?: { id: string; value: unknown }[]
}) {
  const res = await fetch(`${API}/list/${listId}/task`, {
    method: 'POST',
    headers: { Authorization: TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`ClickUp createTask failed: ${res.status} ${await res.text()}`)
  return res.json()
}

// The deal's "closer": its assignees, falling back to the task creator.
export function dealCloserAssignees(task: Record<string, unknown>): number[] {
  const assignees = (task.assignees as Array<{ id?: number }> | undefined) ?? []
  const ids = assignees.map(a => a.id).filter((id): id is number => typeof id === 'number')
  if (ids.length) return ids
  const creatorId = (task.creator as { id?: number } | undefined)?.id
  return typeof creatorId === 'number' ? [creatorId] : []
}

export async function addTaskComment(taskId: string, text: string, notifyAll = true) {
  const res = await fetch(`${API}/task/${taskId}/comment`, {
    method: 'POST',
    headers: { Authorization: TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify({ comment_text: text, notify_all: notifyAll }),
  })
  if (!res.ok) throw new Error(`ClickUp addTaskComment failed: ${res.status}`)
  return res.json()
}

export async function setTaskStatus(taskId: string, status: string) {
  const res = await fetch(`${API}/task/${taskId}`, {
    method: 'PUT',
    headers: { Authorization: TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
  if (!res.ok) throw new Error(`ClickUp setTaskStatus failed: ${res.status} ${await res.text()}`)
  return res.json()
}

// Reads a single custom field value (string/url) off a task by field id.
export function getCustomFieldValue(task: Record<string, unknown>, fieldId: string): string | null {
  const fields = task.custom_fields as Array<{ id?: string; value?: unknown }> | undefined
  const f = fields?.find(x => x.id === fieldId)
  if (!f || f.value == null) return null
  const v = typeof f.value === 'string' ? f.value : (f.value as { url?: string })?.url
  return typeof v === 'string' && v ? v : null
}

export async function getTaskComments(taskId: string): Promise<{ comments: ClickUpComment[] }> {
  const res = await fetch(`${API}/task/${taskId}/comment`, {
    headers: { Authorization: TOKEN },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`ClickUp getTaskComments failed: ${res.status}`)
  return res.json()
}

export async function moveTaskToList(taskId: string, fromListId: string, toListId: string) {
  await fetch(`${API}/list/${toListId}/task/${taskId}`, {
    method: 'POST',
    headers: { Authorization: TOKEN, 'Content-Type': 'application/json' },
  })
  await fetch(`${API}/list/${fromListId}/task/${taskId}`, {
    method: 'DELETE',
    headers: { Authorization: TOKEN },
  })
}

// Finds a preview/staging URL on a task: prefer a custom field whose name
// mentions preview/staging/demo, else fall back to any url-type custom field.
export function extractPreviewUrl(task: Record<string, unknown>): string | null {
  const fields = task.custom_fields as Array<{ name?: string; type?: string; value?: unknown }> | undefined
  const asUrl = (value: unknown): string | null => {
    const v = typeof value === 'string' ? value : (value as { url?: string } | null)?.url
    return typeof v === 'string' && /^https?:\/\//i.test(v) ? v : null
  }
  for (const f of fields ?? []) {
    const name = (f.name ?? '').toLowerCase()
    if ((name.includes('preview') || name.includes('staging') || name.includes('demo')) && f.value) {
      const url = asUrl(f.value)
      if (url) return url
    }
  }
  for (const f of fields ?? []) {
    if (f.type === 'url' && f.value) {
      const url = asUrl(f.value)
      if (url) return url
    }
  }
  return null
}

// Reads the deal's Budget (a ClickUp "currency" custom field, stored in major
// units e.g. "5000" = £5000) and returns it in MINOR units (pence). Returns
// null when no positive budget is set. Prefers a currency field named "budget".
export function extractBudgetMinor(task: Record<string, unknown>): number | null {
  const fields = task.custom_fields as Array<{ name?: string; type?: string; value?: unknown }> | undefined
  const toMinor = (v: unknown): number | null => {
    const n = typeof v === 'number' ? v : typeof v === 'string' ? Number(v) : NaN
    return Number.isFinite(n) && n > 0 ? Math.round(n * 100) : null
  }
  for (const f of fields ?? []) {
    if (f.type === 'currency' && (f.name ?? '').toLowerCase().includes('budget') && f.value != null) {
      const m = toMinor(f.value)
      if (m) return m
    }
  }
  for (const f of fields ?? []) {
    if (f.type === 'currency' && f.value != null) {
      const m = toMinor(f.value)
      if (m) return m
    }
  }
  return null
}

export function extractEmail(task: Record<string, unknown>): string | null {
  const re = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/

  const fields = task.custom_fields as Array<{ name?: string; value?: string }> | undefined
  for (const f of fields ?? []) {
    if (f.name?.toLowerCase().includes('email') && f.value) return f.value
  }

  const desc = task.description as string | undefined
  const inDesc = desc?.match(re)
  if (inDesc) return inDesc[0]

  const name = task.name as string | undefined
  const inName = name?.match(re)
  if (inName) return inName[0]

  return null
}
