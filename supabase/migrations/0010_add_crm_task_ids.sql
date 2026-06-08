-- On prep-pack completion we create CRM items in ClickUp: an Account
-- (Accounts list 901523772304, assigned to the deal closer) and a Deal (Deals
-- list 901523772303). Track their task ids here so creation is idempotent
-- (also holds a transient 'pending' claim sentinel).
alter table public.client_onboarding
  add column if not exists clickup_account_task_id text,
  add column if not exists clickup_deal_task_id text;
