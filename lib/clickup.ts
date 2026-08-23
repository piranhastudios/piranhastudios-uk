const API = 'https://api.clickup.com/api/v2'
const TOKEN = process.env.CLICKUP_API_TOKEN!

/**
 * Custom field ids on the CRM Deals list (901523772303).
 * Email / Contact Name / Service/Product are space-level, so they share ids
 * with the Leads list and the Service/Product option ids match too.
 */
export const DEALS_FIELD = {
  dealValue: '31cd4163-26a5-409b-8bc9-7d92d682736c', // currency, GBP, MAJOR units
  depositAmount: '0ea54494-e584-4af7-a6ed-5b4bbbeb15e7', // currency, GBP, MAJOR units
  depositLink: '281160a4-cc4d-47bb-811b-5d9479855fa2', // url, written by Zapier
  finalPaymentLink: '8ea32a6c-6644-436a-b183-232afc695f2e',
  salesStage: 'a2ab1356-8371-4544-a476-58850cbaa4ff', // drop_down
  crmItemType: 'e8d73248-dc82-4f3f-8af9-f9e260c4b530', // drop_down
  email: '38721eaa-db8b-45d8-a38a-a0697db7d37a',
  contactName: '20cc1dc0-5b9d-45cf-b0f2-612232f0b4e9',
  serviceProduct: '87118070-1b4b-44de-9ea7-3e9b80c1bd7d', // labels
  websiteLink: '75c46481-298b-46d8-a1a4-3962d1bc586a',
} as const

/** Sales Stage drop_down option ids. Drop-downs are set by option id. */
export const SALES_STAGE = {
  leadQualification: '13c68806-944d-447d-980d-4240468e7ae2',
  newDeal: 'c4fd56ee-884f-457d-9c93-45775001ba67',
  discovery: 'f72cf809-646e-4dab-afca-a61924842ccc',
  proposal: '9ce41294-6124-4d0d-8440-366c22769a60',
  negotiation: '22a75b68-d158-4a47-8aad-53e288a1b4d7',
  depositPending: '36d12340-8b13-455e-8e9a-8cb2adc8fcce',
  won: '5056f94b-56c6-4d88-a672-d2e10d757f04',
  lost: '91c432ce-4305-44f8-8914-363b92228d97',
} as const

/** CRM Item Type drop_down option ids. */
export const CRM_ITEM_TYPE = {
  lead: 'a60e1e70-423a-4301-a3ec-bda4f6aaae55',
  deal: 'c1cbcf7b-4ba7-4910-b3c5-25aef67fa290',
  account: 'db8e863c-17e0-43d4-9600-c23cfd1a8b91',
  contact: 'c6e10865-aa61-4599-9534-eca150884a57',
} as const

export type ClickUpStatus = { status: string; color: string; type: string }

export type ClickUpFieldOption = { id: string; label: string; color: string | null }
export type ClickUpField = {
  id: string
  name: string
  type: string
  type_config?: { options?: Array<{ id: string; name?: string; label?: string; color?: string | null }> }
}

// Fetches a list's custom field definitions (GET /list/{id}/field). Cached for a
// few minutes so option changes in ClickUp propagate without a call per request.
export async function getListFields(listId: string): Promise<ClickUpField[]> {
  const res = await fetch(`${API}/list/${listId}/field`, {
    headers: { Authorization: TOKEN },
    next: { revalidate: 300 },
  })
  if (!res.ok) throw new Error(`ClickUp getListFields failed: ${res.status}`)
  const data = await res.json()
  return (data.fields ?? []) as ClickUpField[]
}

// Normalises a drop_down/labels field's options to { id, label, color }.
export function fieldOptions(field?: ClickUpField): ClickUpFieldOption[] {
  return (field?.type_config?.options ?? []).map(o => ({
    id: o.id,
    label: o.label ?? o.name ?? '',
    color: o.color ?? null,
  }))
}

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
  tags?: string[]
}) {
  const res = await fetch(`${API}/list/${listId}/task`, {
    method: 'POST',
    headers: { Authorization: TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`ClickUp createTask failed: ${res.status} ${await res.text()}`)
  return res.json()
}

// Sets a single custom field on a task (POST /task/{id}/field/{field_id}).
// Call best-effort (catch) for optional fields so a rejected value never blocks
// the surrounding flow.
export async function setTaskCustomField(taskId: string, fieldId: string, value: unknown) {
  const res = await fetch(`${API}/task/${taskId}/field/${fieldId}`, {
    method: 'POST',
    headers: { Authorization: TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify({ value }),
  })
  if (!res.ok) throw new Error(`ClickUp setTaskCustomField failed: ${res.status} ${await res.text()}`)
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

// Reads a deal's monetary value from a ClickUp "currency" custom field (stored
// in MAJOR units e.g. "5000" = £5000) and returns it in MINOR units (pence).
// Returns null when nothing positive is set.
//
// Field preference matters: on the Deals list "Budget" is a drop_down (a RAG
// status, not money) and there are TWO currency fields. "Deposit Amount" sorts
// before "Deal Value" by id, so a blind first-currency-field fallback would
// return the deposit. Match by name first.
export function extractBudgetMinor(task: Record<string, unknown>): number | null {
  const fields = task.custom_fields as Array<{ name?: string; type?: string; value?: unknown }> | undefined
  const toMinor = (v: unknown): number | null => {
    const n = typeof v === 'number' ? v : typeof v === 'string' ? Number(v) : NaN
    return Number.isFinite(n) && n > 0 ? Math.round(n * 100) : null
  }
  const currencyFields = (fields ?? []).filter(f => f.type === 'currency' && f.value != null)

  // Most specific first: the deal's headline value, then a money "budget",
  // then anything else that is currency (but never the deposit).
  for (const wanted of ['deal value', 'budget']) {
    for (const f of currencyFields) {
      if ((f.name ?? '').toLowerCase().includes(wanted)) {
        const m = toMinor(f.value)
        if (m) return m
      }
    }
  }
  for (const f of currencyFields) {
    if ((f.name ?? '').toLowerCase().includes('deposit')) continue
    const m = toMinor(f.value)
    if (m) return m
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
