drop policy if exists "Classified admins can review classifieds" on public.classifieds;
drop policy if exists "Classified admins can moderate classifieds" on public.classifieds;
drop policy if exists "Classified admins can read reports" on public.classified_reports;

drop policy if exists "Classifieds visible to public or owner" on public.classifieds;
create policy "Classifieds visible to public owner or admin"
on public.classifieds
for select
to anon, authenticated
using (
  (
    status = 'published'
    and published_at is not null
    and published_at <= now()
  )
  or (
    (select auth.uid()) is not null
    and (select auth.uid()) = owner_id
  )
  or (
    coalesce((select auth.jwt()) -> 'app_metadata' ->> 'role', '') = 'classified_admin'
  )
);

drop policy if exists "Owners can update owner-managed classifieds" on public.classifieds;
create policy "Owners or admins can update managed classifieds"
on public.classifieds
for update
to authenticated
using (
  (
    (select auth.uid()) is not null
    and (select auth.uid()) = owner_id
    and status in ('draft', 'paused', 'rejected', 'pending_review')
  )
  or (
    coalesce((select auth.jwt()) -> 'app_metadata' ->> 'role', '') = 'classified_admin'
  )
)
with check (
  (
    (select auth.uid()) = owner_id
    and status in ('draft', 'paused', 'rejected', 'pending_review')
    and published_at is null
  )
  or (
    coalesce((select auth.jwt()) -> 'app_metadata' ->> 'role', '') = 'classified_admin'
  )
);

drop policy if exists "Users can read their reports" on public.classified_reports;
create policy "Users or admins can read classified reports"
on public.classified_reports
for select
to authenticated
using (
  (select auth.uid()) = reporter_id
  or coalesce((select auth.jwt()) -> 'app_metadata' ->> 'role', '') = 'classified_admin'
);

drop policy if exists "Users can report published classifieds" on public.classified_reports;
create policy "Users can report published classifieds"
on public.classified_reports
for insert
to authenticated
with check (
  (select auth.uid()) = reporter_id
  and exists (
    select 1
    from public.classifieds c
    where c.id = classified_id
      and c.status = 'published'
      and c.published_at is not null
      and c.published_at <= now()
      and c.owner_id <> (select auth.uid())
  )
);

drop index if exists public.classified_reports_unique_reporter_idx;
