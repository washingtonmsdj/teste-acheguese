create index if not exists classified_favorites_classified_idx
  on public.classified_favorites (classified_id);

create index if not exists classified_reports_reporter_idx
  on public.classified_reports (reporter_id);

create index if not exists classified_moderation_reviewer_idx
  on private.classified_moderation (reviewer_id)
  where reviewer_id is not null;

drop policy if exists "Published classifieds are public" on public.classifieds;
drop policy if exists "Owners can read their classifieds" on public.classifieds;

create policy "Classifieds visible to public or owner"
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
);

drop policy if exists "Published classified media is public" on public.classified_media;
drop policy if exists "Owners can read classified media" on public.classified_media;

create policy "Classified media visible to public or owner"
on public.classified_media
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.classifieds c
    where c.id = classified_id
      and (
        (
          c.status = 'published'
          and c.published_at is not null
          and c.published_at <= now()
        )
        or (
          (select auth.uid()) is not null
          and c.owner_id = (select auth.uid())
        )
      )
  )
);

create policy "Private classified locations deny direct access"
on private.classified_locations
for all
to public
using (false)
with check (false);

create policy "Private classified moderation deny direct access"
on private.classified_moderation
for all
to public
using (false)
with check (false);

revoke all on schema private from public;
revoke all on all tables in schema private from anon, authenticated;
revoke all on all functions in schema private from anon, authenticated;
