-- Catch-up migration. The client_onboarding table on the remote was created
-- from an earlier 0005 (before brand_assets + the brand-assets storage bucket
-- existed). Idempotent, so it's also a no-op on a fresh DB where 0005 already
-- includes these.

alter table public.client_onboarding add column if not exists brand_assets text;

-- Private bucket for brand uploads (path = "<auth.uid>/brand/<file>").
insert into storage.buckets (id, name, public)
values ('brand-assets', 'brand-assets', false)
on conflict (id) do nothing;

drop policy if exists "Users read own brand assets" on storage.objects;
create policy "Users read own brand assets"
  on storage.objects for select to authenticated
  using (bucket_id = 'brand-assets' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Users upload own brand assets" on storage.objects;
create policy "Users upload own brand assets"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'brand-assets' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Users delete own brand assets" on storage.objects;
create policy "Users delete own brand assets"
  on storage.objects for delete to authenticated
  using (bucket_id = 'brand-assets' and (storage.foldername(name))[1] = auth.uid()::text);
