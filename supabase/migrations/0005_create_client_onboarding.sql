-- client_onboarding: per-client project prep-pack for the client portal.
-- Run on the delivery Supabase project the app points at
-- (NEXT_PUBLIC_DELIVERY_SUPABASE_URL → mypeipcjrievgkhgsdlv).
--
-- Mirrors the schema on the legacy project plus the structured primary-contact
-- columns. email is UNIQUE because the app keys off it (.eq('email').single())
-- and the ClickUp new-project webhook upserts with onConflict: 'email'.
-- Rows are created by service_role (webhook); RLS only exposes select/update
-- to the authenticated owner.

create table if not exists public.client_onboarding (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  user_id uuid references auth.users(id),
  clickup_task_id text,
  business_name text,
  project_name text,
  primary_contact text,
  other_stakeholders text,
  target_kickoff text,
  target_launch text,
  one_line_description text,
  target_audience text,
  why_now text,
  primary_goal text,
  business_metrics text,
  specific_targets text,
  brand_direction text,
  favourite_brands text,
  pinterest_board text,
  favourite_websites text,
  visual_preferences text,
  specific_references text,
  existing_content text,
  new_content_needed text,
  content_writer text,
  pages_needed text,
  key_features text,
  integrations text,
  forms text,
  compliance text,
  current_website_admin text,
  domain_registrar text,
  hosting text,
  email_service text,
  other_platforms text,
  brand_assets text,
  current_step integer default 0,
  calendly_booked boolean default false,
  completed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  primary_contact_method text,
  primary_contact_name text,
  primary_contact_role text
);

alter table public.client_onboarding enable row level security;

create policy "Users can view own onboarding" on public.client_onboarding
  for select to authenticated
  using ((user_id = auth.uid()) or (email = (auth.jwt() ->> 'email')));

create policy "Users can update own onboarding" on public.client_onboarding
  for update to authenticated
  using ((user_id = auth.uid()) or (email = (auth.jwt() ->> 'email')));

-- Brand asset uploads --------------------------------------------------------
-- Private bucket; clients can only touch files under their own auth.uid()
-- folder (path = "<auth.uid>/brand/<file>"). The portal reads via signed URLs.
insert into storage.buckets (id, name, public)
values ('brand-assets', 'brand-assets', false)
on conflict (id) do nothing;

create policy "Users read own brand assets"
  on storage.objects for select to authenticated
  using (bucket_id = 'brand-assets' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users upload own brand assets"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'brand-assets' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users delete own brand assets"
  on storage.objects for delete to authenticated
  using (bucket_id = 'brand-assets' and (storage.foldername(name))[1] = auth.uid()::text);
