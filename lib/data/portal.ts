import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// ---------------------------------------------------------------------------
// Logging
// ---------------------------------------------------------------------------

const SCOPE = '[client-portal]'

export function logInfo(event: string, data?: unknown): void {
  if (data !== undefined) console.log(`${SCOPE} ${event}`, data)
  else console.log(`${SCOPE} ${event}`)
}

function safeJson(v: unknown): string {
  try { return JSON.stringify(v) } catch { return '<unserializable>' }
}

export function logError(event: string, error: unknown): void {
  // Supabase/Postgrest errors are plain objects whose fields don't always
  // survive console serialization. Surface everything so an empty-looking
  // error ({}) still reveals its constructor, keys, and string form.
  let detail: unknown = error
  if (error && typeof error === 'object') {
    const e = error as Record<string, unknown>
    detail = {
      name: (e.constructor as { name?: string } | undefined)?.name ?? typeof e,
      message: e.message,
      code: e.code,
      details: e.details,
      hint: e.hint,
      status: e.status ?? e.statusCode,
      statusText: e.statusText,
      keys: Object.keys(e),
      json: safeJson(e),
      string: String(error),
    }
  }
  console.error(`${SCOPE} ${event}`, detail)
}

// ---------------------------------------------------------------------------
// Supabase browser client (lazy singleton — only created at runtime in the
// browser, never during build/SSR)
// ---------------------------------------------------------------------------

let _client: SupabaseClient | null = null

export function getPortalClient(): SupabaseClient {
  if (!_client) {
    _client = createClient(
      process.env.NEXT_PUBLIC_DELIVERY_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_DELIVERY_SUPABASE_ANON_KEY!,
      { auth: { detectSessionInUrl: true, persistSession: true } }
    )
  }
  return _client
}

// ---------------------------------------------------------------------------
// Types & constants
// ---------------------------------------------------------------------------

export type ContactMethod = 'whatsapp' | 'email' | ''

export type Stakeholder = {
  name: string
  role: string
  method: 'whatsapp' | 'email' | ''
  detail: string
}

export const emptyStakeholder = (): Stakeholder => ({ name: '', role: '', method: '', detail: '' })

export type BrandAsset = { path: string; name: string; size: number; type: string }

export type FormData = {
  business_name: string; project_name: string
  primary_contact_method: ContactMethod; primary_contact_name: string
  primary_contact_role: string; primary_contact: string
  other_stakeholders: string; target_kickoff: string; target_launch: string
  one_line_description: string; target_audience: string; why_now: string
  primary_goal: string; business_metrics: string; specific_targets: string
  brand_direction: string; favourite_brands: string; pinterest_board: string
  favourite_websites: string; visual_preferences: string; specific_references: string
  existing_content: string; new_content_needed: string; content_writer: string
  pages_needed: string; key_features: string; integrations: string
  forms: string; compliance: string; current_website_admin: string
  domain_registrar: string; hosting: string; email_service: string; other_platforms: string
  brand_assets: string
}

export const EMPTY: FormData = {
  business_name: '', project_name: '',
  primary_contact_method: '', primary_contact_name: '',
  primary_contact_role: '', primary_contact: '',
  other_stakeholders: '',
  target_kickoff: '', target_launch: '', one_line_description: '', target_audience: '',
  why_now: '', primary_goal: '', business_metrics: '', specific_targets: '',
  brand_direction: '', favourite_brands: '', pinterest_board: '', favourite_websites: '',
  visual_preferences: '', specific_references: '', existing_content: '', new_content_needed: '',
  content_writer: '', pages_needed: '', key_features: '', integrations: '', forms: '',
  compliance: '', current_website_admin: '', domain_registrar: '', hosting: '',
  email_service: '', other_platforms: '', brand_assets: '',
}

const FORM_KEYS = Object.keys(EMPTY) as (keyof FormData)[]

// Keep only real form columns from a DB row, coercing nulls to ''. Prevents
// id/email/created_at/etc. leaking into form state and getting echoed back in
// every UPDATE payload.
export function pickForm(row: Record<string, unknown>): Partial<FormData> {
  const out: Record<string, string> = {}
  for (const k of FORM_KEYS) {
    const v = row[k]
    if (v != null) out[k] = String(v)
  }
  return out as Partial<FormData>
}

export type Step = { title: string; description: string }

export const STEPS: Step[] = [
  { title: 'Project Snapshot', description: 'Start with the basics — names, contacts, and key dates.' },
  { title: 'About Your Business', description: 'Help us understand who you are and who you serve.' },
  { title: 'Goals & Success', description: 'Define what success looks like for this project.' },
  { title: 'Brand', description: 'Share your brand direction and what inspires you.' },
  { title: 'Design Direction', description: 'Show us your visual taste and aesthetic preferences.' },
  { title: 'Content', description: 'Plan what exists, what\'s needed, and who\'s writing it.' },
  { title: 'Functionality', description: 'Define the pages, features, and tools you need.' },
  { title: 'Technical Access', description: 'Share any access we\'ll need to get started.' },
  { title: 'Book Your Consultation', description: 'Schedule your kickoff call and we\'ll take it from here.' },
]

// ---------------------------------------------------------------------------
// Stakeholder serialization
// ---------------------------------------------------------------------------

export function parseStakeholders(raw: string | null | undefined): Stakeholder[] {
  if (!raw) return [emptyStakeholder()]
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.length > 0) return parsed as Stakeholder[]
  } catch {
    logInfo('stakeholders: legacy plain text, starting with an empty row')
  }
  return [emptyStakeholder()]
}

export function serializeStakeholders(stakeholders: Stakeholder[]): string {
  return JSON.stringify(stakeholders)
}

// ---------------------------------------------------------------------------
// Brand assets (Supabase Storage)
// ---------------------------------------------------------------------------

export const BRAND_BUCKET = 'brand-assets'
export const MAX_BRAND_FILE_BYTES = 50 * 1024 * 1024 // 50MB

export function parseBrandAssets(raw: string | null | undefined): BrandAsset[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed as BrandAsset[]
  } catch {
    logInfo('brand: unparseable brand_assets, starting empty')
  }
  return []
}

export function serializeBrandAssets(assets: BrandAsset[]): string {
  return JSON.stringify(assets)
}

// Uploads to "<userId>/brand/<timestamp>-<safe-name>" so the storage RLS
// policy (folder = auth.uid()) authorises it. Returns null on failure.
export async function uploadBrandAsset(userId: string, file: File): Promise<BrandAsset | null> {
  const safeName = file.name.replace(/[^\w.\-]+/g, '_')
  const path = `${userId}/brand/${Date.now()}-${safeName}`
  logInfo('brand: uploading', { path, size: file.size, type: file.type })
  const { error } = await getPortalClient().storage
    .from(BRAND_BUCKET)
    .upload(path, file, { cacheControl: '3600', upsert: false, contentType: file.type || undefined })
  if (error) {
    logError('brand: upload failed', error)
    return null
  }
  logInfo('brand: uploaded', { path })
  return { path, name: file.name, size: file.size, type: file.type || '' }
}

export async function removeBrandAsset(path: string): Promise<void> {
  logInfo('brand: removing', { path })
  const { error } = await getPortalClient().storage.from(BRAND_BUCKET).remove([path])
  if (error) logError('brand: remove failed', error)
}

export async function getBrandAssetSignedUrl(path: string, expiresIn = 3600): Promise<string | null> {
  const { data, error } = await getPortalClient().storage
    .from(BRAND_BUCKET)
    .createSignedUrl(path, expiresIn)
  if (error) {
    logError('brand: signed url failed', error)
    return null
  }
  return data?.signedUrl ?? null
}

// ---------------------------------------------------------------------------
// Data operations
// ---------------------------------------------------------------------------

export type OnboardingRow = Partial<FormData> & {
  current_step: number | null
  completed_at: string | null
  user_id: string | null
}

export async function loadOnboarding(email: string): Promise<OnboardingRow | null> {
  logInfo('load: fetching onboarding', { email })
  const sb = getPortalClient()
  // Primary contact: row keyed by their email. maybeSingle — a missing row is
  // normal (rows are created by the webhook), returns null without an error.
  const { data, error } = await sb.from('client_onboarding').select('*').eq('email', email).maybeSingle()
  if (error) {
    logError('load: failed', error)
    return null
  }
  if (data) {
    logInfo('load: ok', { step: data.current_step, completed: !!data.completed_at })
    return data as OnboardingRow
  }

  // Additional contact: RLS returns the hub(s) they're a member of.
  const member = await sb.from('client_onboarding').select('*').limit(1)
  if (member.error) {
    logError('load: member lookup failed', member.error)
    return null
  }
  const hub = member.data?.[0] ?? null
  if (!hub) logInfo('load: no onboarding row for this email yet')
  else logInfo('load: ok (member access)', { step: hub.current_step, completed: !!hub.completed_at })
  return (hub as OnboardingRow | null) ?? null
}

export async function claimOnboarding(email: string, userId: string): Promise<void> {
  logInfo('claim: linking user_id', { email, userId })
  const { error } = await getPortalClient()
    .from('client_onboarding')
    .update({ user_id: userId })
    .eq('email', email)
  if (error) logError('claim: failed', error)
  else logInfo('claim: ok')
}

export async function saveProgress(email: string, form: FormData, step: number): Promise<{ ok: boolean }> {
  logInfo('save: updating', { email, step })
  const { data, error } = await getPortalClient()
    .from('client_onboarding')
    .update({ ...form, current_step: step, updated_at: new Date().toISOString() })
    .eq('email', email)
    .select('id')
  if (error) {
    logError('save: failed', error)
    return { ok: false }
  }
  if (!data || data.length === 0) {
    logError('save: no onboarding row matched this email — nothing was saved', { email })
    return { ok: false }
  }
  logInfo('save: ok', { step, matched: data.length })
  return { ok: true }
}

export async function completeOnboarding(email: string, form: FormData): Promise<{ ok: boolean }> {
  logInfo('complete: finalising', { email })
  const { data, error } = await getPortalClient()
    .from('client_onboarding')
    .update({ ...form, current_step: STEPS.length, completed_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq('email', email)
    .select('id')
  if (error) {
    logError('complete: update failed', error)
    return { ok: false }
  }
  if (!data || data.length === 0) {
    logError('complete: no onboarding row matched this email — nothing was saved', { email })
    return { ok: false }
  }
  try {
    const res = await fetch('/api/client-portal/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    if (!res.ok) logError('complete: notify api returned non-ok', { status: res.status })
    else logInfo('complete: ok')
  } catch (e) {
    logError('complete: notify api fetch failed', e)
  }
  return { ok: true }
}

export async function sendSignInLink(email: string, redirectTo: string): Promise<{ ok: boolean }> {
  logInfo('auth: sending magic link', { email })
  const { error } = await getPortalClient().auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectTo },
  })
  if (error) {
    logError('auth: send link failed', error)
    return { ok: false }
  }
  logInfo('auth: magic link sent')
  return { ok: true }
}

// ---------------------------------------------------------------------------
// Project dashboard + chat (server-proxied ClickUp, authorised by the
// caller's Supabase access token)
// ---------------------------------------------------------------------------

export type StatusSummary = { name: string; status: string | null; color: string | null; url: string | null }
export type SubtaskSummary = {
  id: string | null; name: string; status: string | null; color: string | null
  complete: boolean; inReview: boolean; previewUrl: string | null
}
export type ProjectSummary = StatusSummary & { subtasks: SubtaskSummary[]; progress: number }
export type ProjectDashboard = { contract: StatusSummary | null; project: ProjectSummary | null; hasProject: boolean; hasAccount: boolean; accountTaskId: string | null; projectTaskId: string | null }

export type ChatChannel = 'project' | 'account'
export type PortalComment = { id: string; text: string; author: string; fromClient: boolean; date: string }
export type HubMembers = { members: string[]; primaryEmail: string; isPrimary: boolean }

export type TaskDetail = {
  id: string; name: string; description: string
  status: string | null; statusColor: string | null
  priority: string | null; priorityColor: string | null
  assignees: { name: string; initials: string; color: string | null }[]
  previewUrl: string | null; url: string | null
}

async function authHeaders(): Promise<Record<string, string>> {
  const { data } = await getPortalClient().auth.getSession()
  const token = data.session?.access_token
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function fetchProjectDashboard(): Promise<ProjectDashboard | null> {
  const res = await fetch('/api/client-portal/project', { headers: await authHeaders() })
  if (!res.ok) {
    logError('dashboard: fetch failed', { status: res.status })
    return null
  }
  return res.json()
}

export async function fetchComments(channel: ChatChannel = 'project'): Promise<PortalComment[]> {
  const res = await fetch(`/api/client-portal/comments?channel=${channel}`, { headers: await authHeaders() })
  if (!res.ok) {
    logError('chat: fetch failed', { status: res.status, channel })
    return []
  }
  const { comments } = await res.json()
  return comments as PortalComment[]
}

export async function approveProject(): Promise<{ ok: boolean; paymentLink: string | null }> {
  const res = await fetch('/api/client-portal/approve', { method: 'POST', headers: await authHeaders() })
  if (!res.ok) {
    logError('approve: failed', { status: res.status })
    return { ok: false, paymentLink: null }
  }
  const data = await res.json()
  return { ok: true, paymentLink: data.paymentLink ?? null }
}

export async function fetchTaskDetail(taskId: string): Promise<TaskDetail | null> {
  const res = await fetch(`/api/client-portal/task?taskId=${encodeURIComponent(taskId)}`, { headers: await authHeaders() })
  if (!res.ok) {
    logError('task: fetch failed', { status: res.status })
    return null
  }
  return res.json()
}

export async function postComment(channel: ChatChannel, text: string): Promise<boolean> {
  const res = await fetch('/api/client-portal/comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(await authHeaders()) },
    body: JSON.stringify({ channel, text }),
  })
  if (!res.ok) logError('chat: post failed', { status: res.status, channel })
  return res.ok
}

// --- Hub access (additional contacts) ---

export async function fetchMembers(): Promise<HubMembers> {
  const res = await fetch('/api/client-portal/members', { headers: await authHeaders() })
  if (!res.ok) return { members: [], primaryEmail: '', isPrimary: false }
  return res.json()
}

export async function addMember(email: string): Promise<{ ok: boolean; members?: string[]; error?: string }> {
  const res = await fetch('/api/client-portal/members', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(await authHeaders()) },
    body: JSON.stringify({ email }),
  })
  const data = await res.json().catch(() => ({}))
  return { ok: res.ok, members: data.members, error: data.error }
}

export async function removeMember(email: string): Promise<boolean> {
  const res = await fetch(`/api/client-portal/members?email=${encodeURIComponent(email)}`, {
    method: 'DELETE',
    headers: await authHeaders(),
  })
  return res.ok
}
