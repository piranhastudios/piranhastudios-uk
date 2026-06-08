import { getSupabaseAdmin } from '@/lib/supabase-delivery'
import { createTask, addTaskComment, getTask, extractBudgetMinor, extractEmail, dealCloserAssignees } from '@/lib/clickup'

const PROJECTS_LIST = process.env.CLICKUP_PROJECTS_LIST_ID
const ACCOUNTS_LIST = process.env.CLICKUP_ACCOUNTS_LIST_ID || '901523772304'
const DEALS_LIST = process.env.CLICKUP_DEALS_LIST_ID || '901523772303'
// Shared CRM custom field ids (same across the Accounts + Deals lists).
const FIELD_EMAIL = '38721eaa-db8b-45d8-a38a-a0697db7d37a'
const FIELD_CONTACT_NAME = '20cc1dc0-5b9d-45cf-b0f2-612232f0b4e9'
const PENDING_TTL = 60_000 // ms before a stuck "pending" claim can be retaken

const isPending = (v: string | null | undefined): v is string => !!v && v.startsWith('pending:')

export type PortalClient = {
  email: string          // the hub's primary email (owner of the onboarding row)
  callerEmail: string    // the signed-in user (may be an additional contact)
  displayName: string
  clickupTaskId: string | null
  clickupProjectTaskId: string | null
  clickupAccountTaskId: string | null
  clickupDealTaskId: string | null
  memberEmails: string[]
}

const PORTAL_COLS =
  'email, business_name, primary_contact_name, clickup_task_id, clickup_project_task_id, clickup_account_task_id, clickup_deal_task_id, member_emails'

// Verifies the caller's Supabase access token (Bearer) and resolves it to the
// hub they can access — either as the primary email or an additional contact in
// member_emails. The token never carries a task id, so a user can only ever
// reach their own hub's ClickUp tasks.
export async function authPortalClient(req: Request): Promise<PortalClient | null> {
  const authz = req.headers.get('authorization') ?? ''
  const token = authz.startsWith('Bearer ') ? authz.slice(7) : null
  if (!token) return null

  const admin = getSupabaseAdmin()
  const { data: { user }, error } = await admin.auth.getUser(token)
  if (error || !user?.email) return null

  let { data } = await admin.from('client_onboarding').select(PORTAL_COLS).eq('email', user.email).maybeSingle()
  if (!data) {
    const r = await admin.from('client_onboarding').select(PORTAL_COLS).contains('member_emails', [user.email.toLowerCase()]).limit(1)
    data = r.data?.[0] ?? null
  }
  if (!data) return null

  const isPrimary = data.email === user.email
  const localPart = user.email.split('@')[0]
  return {
    email: data.email,
    callerEmail: user.email,
    displayName: isPrimary ? (data.primary_contact_name || data.business_name || localPart) : localPart,
    clickupTaskId: data.clickup_task_id ?? null,
    clickupProjectTaskId: data.clickup_project_task_id ?? null,
    clickupAccountTaskId: data.clickup_account_task_id ?? null,
    clickupDealTaskId: data.clickup_deal_task_id ?? null,
    memberEmails: data.member_emails ?? [],
  }
}

// Returns the client's Projects-list delivery task id, creating it on first
// need. Self-healing: any *completed* client without a project task gets one
// the next time the dashboard (or the complete route) calls this. Idempotent
// and concurrency-safe — an atomic "pending:" claim stops parallel polls from
// creating duplicate ClickUp tasks; a stale claim (>60s) can be retaken if the
// creator crashed mid-flight.
export async function ensureProjectTask(email: string): Promise<string | null> {
  if (!PROJECTS_LIST) return null
  const admin = getSupabaseAdmin()

  const { data: row } = await admin
    .from('client_onboarding')
    .select('clickup_task_id, clickup_project_task_id, completed_at, project_name, business_name')
    .eq('email', email)
    .single()
  if (!row) return null

  const existing: string | null = row.clickup_project_task_id ?? null
  if (existing && !isPending(existing)) return existing
  if (!row.completed_at) return null // only completed clients get a delivery task

  // Decide what state we're allowed to claim from.
  let claimFrom: string | null
  if (!existing) {
    claimFrom = null
  } else {
    const ts = Number(existing.slice('pending:'.length)) || 0
    if (Date.now() - ts < PENDING_TTL) return null // another request is creating it
    claimFrom = existing // stale claim — retake it
  }

  const claim = `pending:${Date.now()}`
  const claimQuery = admin.from('client_onboarding').update({ clickup_project_task_id: claim }).eq('email', email)
  const { data: claimed } = await (claimFrom === null
    ? claimQuery.is('clickup_project_task_id', null)
    : claimQuery.eq('clickup_project_task_id', claimFrom)
  ).select('id')

  if (!claimed || claimed.length === 0) {
    // Lost the race — return whatever the winner set, if it's ready.
    const { data: fresh } = await admin
      .from('client_onboarding').select('clickup_project_task_id').eq('email', email).single()
    const v = fresh?.clickup_project_task_id ?? null
    return v && !isPending(v) ? v : null
  }

  try {
    const name = row.project_name || row.business_name || `Project — ${email}`
    const dealLink = row.clickup_task_id ? `\n\nDeal: https://app.clickup.com/t/${row.clickup_task_id}` : ''
    const created = await createTask(PROJECTS_LIST, {
      name,
      description: `Client delivery for ${email}. Created from the completed prep pack.${dealLink}`,
    })
    const id: string | null = created?.id ?? null
    await admin.from('client_onboarding').update({ clickup_project_task_id: id }).eq('email', email)
    if (row.clickup_task_id && id) {
      await addTaskComment(
        row.clickup_task_id,
        `🎉 Prep pack complete\n\nDelivery task created in Projects: https://app.clickup.com/t/${id}\n\nThe client portal now shows their project dashboard.`
      )
    }
    return id
  } catch (e) {
    // Release the claim so a later request can retry.
    await admin.from('client_onboarding').update({ clickup_project_task_id: null }).eq('email', email)
    throw e
  }
}

// Creates a client_contract quest in the guild hub for a completed client's
// project — but only once the Incoming deal task has a Budget set, which becomes
// the quest reward. No budget → no quest (and no claim, so it'll be created
// later once a budget is added). Idempotent + concurrency-safe via a 'pending'
// claim on guild_quest_id. Writes to the `guild` schema via the service client.
// Records/updates an incoming deal task in public.deals (keyed on the ClickUp
// task id). Called by the ClickUp webhooks so we have a DB record of every deal
// and its current budget/status.
export async function upsertDeal(task: Record<string, unknown>): Promise<void> {
  const admin = getSupabaseAdmin()
  const t = task as {
    id?: string | number; name?: string
    list?: { id?: string }; status?: { status?: string }
  }
  await admin.from('deals').upsert({
    clickup_task_id: String(t.id),
    list_id: t.list?.id ?? null,
    name: t.name ?? null,
    email: extractEmail(task),
    status: t.status?.status ?? null,
    budget_minor: extractBudgetMinor(task),
    updated_at: new Date().toISOString(),
  }, { onConflict: 'clickup_task_id' })
}

export async function ensureGuildQuest(email: string): Promise<void> {
  const admin = getSupabaseAdmin()

  const { data: row } = await admin
    .from('client_onboarding')
    .select('guild_quest_id, clickup_task_id, business_name, project_name')
    .eq('email', email)
    .single()
  if (!row || row.guild_quest_id) return        // created, in progress, or no row
  if (!row.clickup_task_id) return              // no deal task → no budget

  // Reward comes from the deal's Budget custom field (minor units). Skip until set.
  const deal = await getTask(row.clickup_task_id).catch(() => null)
  const rewardMinor = deal ? extractBudgetMinor(deal as Record<string, unknown>) : null
  if (!rewardMinor || rewardMinor <= 0) return

  // Atomically claim creation so concurrent polls can't insert duplicates.
  const { data: claimed } = await admin
    .from('client_onboarding')
    .update({ guild_quest_id: 'pending' })
    .eq('email', email)
    .is('guild_quest_id', null)
    .select('id')
  if (!claimed || claimed.length === 0) return // lost the race

  try {
    const { data: gm } = await admin
      .schema('guild')
      .from('members')
      .select('id')
      .eq('app_role', 'guildmaster')
      .limit(1)
    const posterId = gm?.[0]?.id
    if (!posterId) {
      await admin.from('client_onboarding').update({ guild_quest_id: null }).eq('email', email)
      console.error('[client-portal] guild: no guildmaster member to post quest', { email })
      return
    }

    const title = row.project_name || row.business_name || `Project — ${email}`
    const { data: quest, error } = await admin
      .schema('guild')
      .from('quests')
      .insert({
        type: 'client_contract',
        status: 'draft',
        title,
        description: `Client contract for ${row.business_name || email}. Created from the completed onboarding prep pack.`,
        poster_id: posterId,
        client_name: row.business_name || email,
        // Budget from the deal (minor units). Fee left at 0, so net = reward
        // (satisfies quest_fee_math + reward > 0).
        reward_amount: rewardMinor,
        net_payout_amount: rewardMinor,
      })
      .select('id')
      .single()
    if (error || !quest) throw error ?? new Error('no quest returned')

    await admin.from('client_onboarding').update({ guild_quest_id: quest.id as string }).eq('email', email)
  } catch (e) {
    await admin.from('client_onboarding').update({ guild_quest_id: null }).eq('email', email)
    console.error('[client-portal] guild: quest create failed', e)
  }
}

// Atomically claim a one-shot creation slot on a client_onboarding column by
// flipping it null → 'pending'. Returns true only for the request that won.
async function claimColumn(email: string, column: 'clickup_account_task_id' | 'clickup_deal_task_id'): Promise<boolean> {
  const admin = getSupabaseAdmin()
  const { data } = await admin
    .from('client_onboarding')
    .update({ [column]: 'pending' })
    .eq('email', email)
    .is(column, null)
    .select('id')
  return !!data && data.length > 0
}

// On prep-pack completion, create the CRM Account (assigned to the deal closer)
// and Deal in ClickUp. Idempotent + concurrency-safe; called once from the
// complete route. Best-effort: a failure on one doesn't block the other.
export async function ensureCrmRecords(email: string): Promise<void> {
  const admin = getSupabaseAdmin()
  const { data: row } = await admin
    .from('client_onboarding')
    .select('clickup_task_id, clickup_account_task_id, clickup_deal_task_id, business_name, project_name, primary_contact_name')
    .eq('email', email)
    .single()
  if (!row) return

  const contactName = row.primary_contact_name || ''
  const baseFields = [
    { id: FIELD_EMAIL, value: email },
    ...(contactName ? [{ id: FIELD_CONTACT_NAME, value: contactName }] : []),
  ]

  // Account — assigned to the deal's closer (assignee, else creator).
  if (!row.clickup_account_task_id && await claimColumn(email, 'clickup_account_task_id')) {
    try {
      const deal = row.clickup_task_id ? await getTask(row.clickup_task_id).catch(() => null) : null
      const assignees = deal ? dealCloserAssignees(deal as Record<string, unknown>) : []
      const created = await createTask(ACCOUNTS_LIST, {
        name: row.business_name || email,
        description: `Client account created from the completed onboarding prep pack.`,
        assignees,
        custom_fields: baseFields,
      })
      await admin.from('client_onboarding').update({ clickup_account_task_id: created?.id ?? null }).eq('email', email)
    } catch (e) {
      await admin.from('client_onboarding').update({ clickup_account_task_id: null }).eq('email', email)
      console.error('[client-portal] crm: account create failed', e)
    }
  }

  // Deal — the project we're working on (Deal Value left empty).
  if (!row.clickup_deal_task_id && await claimColumn(email, 'clickup_deal_task_id')) {
    try {
      const created = await createTask(DEALS_LIST, {
        name: row.project_name || row.business_name || `Project — ${email}`,
        description: `Project for ${row.business_name || email}, created from the completed onboarding prep pack.`,
        custom_fields: baseFields,
      })
      await admin.from('client_onboarding').update({ clickup_deal_task_id: created?.id ?? null }).eq('email', email)
    } catch (e) {
      await admin.from('client_onboarding').update({ clickup_deal_task_id: null }).eq('email', email)
      console.error('[client-portal] crm: deal create failed', e)
    }
  }
}
