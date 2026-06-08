-- Additional contacts who can access a client's hub. Emails are stored
-- lowercased in member_emails. The SELECT policy is widened so a signed-in user
-- whose email is in member_emails can view that onboarding row (the hub).
-- Members get read access only (chat/contacts go through service-role routes).
alter table public.client_onboarding
  add column if not exists member_emails text[] not null default '{}';

drop policy if exists "Users can view own onboarding" on public.client_onboarding;
create policy "Users can view own onboarding" on public.client_onboarding
  for select to authenticated
  using (
    (user_id = auth.uid())
    or (email = (auth.jwt() ->> 'email'))
    or (lower(auth.jwt() ->> 'email') = any(member_emails))
  );
