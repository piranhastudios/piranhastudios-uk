-- Tracks incoming deal tasks from ClickUp (the "Incoming / closed won" list).
-- Upserted by the ClickUp webhooks (new-project + deal-updated) keyed on the
-- ClickUp task id. budget_minor is the deal Budget in minor units (pence).
-- Internal only — RLS on with no policies, so just the service role can access.
create table if not exists public.deals (
  id uuid primary key default gen_random_uuid(),
  clickup_task_id text not null unique,
  list_id text,
  name text,
  email text,
  status text,
  budget_minor integer,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.deals enable row level security;
