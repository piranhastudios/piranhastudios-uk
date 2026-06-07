const API = 'https://api.clickup.com/api/v2'
const TOKEN = process.env.CLICKUP_API_TOKEN!

export async function getTask(taskId: string) {
  const res = await fetch(`${API}/task/${taskId}`, {
    headers: { Authorization: TOKEN },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`ClickUp getTask failed: ${res.status}`)
  return res.json()
}

export async function addTaskComment(taskId: string, text: string) {
  const res = await fetch(`${API}/task/${taskId}/comment`, {
    method: 'POST',
    headers: { Authorization: TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify({ comment_text: text, notify_all: true }),
  })
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
