drop policy if exists "Owners can update their classifieds" on public.classifieds;
create policy "Owners can edit mutable classifieds"
on public.classifieds
for update
to authenticated
using (
  (select auth.uid()) is not null
  and (select auth.uid()) = owner_id
  and status in ('draft', 'paused', 'rejected')
)
with check (
  (select auth.uid()) = owner_id
  and status in ('draft', 'paused', 'rejected')
  and published_at is null
);

drop policy if exists "Owners can delete their classifieds" on public.classifieds;
create policy "Owners can delete unpublished classifieds"
on public.classifieds
for delete
to authenticated
using (
  (select auth.uid()) is not null
  and (select auth.uid()) = owner_id
  and status in ('draft', 'rejected', 'archived')
);

drop policy if exists "Owners can add classified media" on public.classified_media;
create policy "Owners can add media to mutable classifieds"
on public.classified_media
for insert
to authenticated
with check (
  exists (
    select 1
    from public.classifieds c
    where c.id = classified_id
      and c.owner_id = (select auth.uid())
      and c.status in ('draft', 'paused', 'rejected')
  )
);

drop policy if exists "Owners can update classified media" on public.classified_media;
create policy "Owners can update media on mutable classifieds"
on public.classified_media
for update
to authenticated
using (
  exists (
    select 1
    from public.classifieds c
    where c.id = classified_id
      and c.owner_id = (select auth.uid())
      and c.status in ('draft', 'paused', 'rejected')
  )
)
with check (
  exists (
    select 1
    from public.classifieds c
    where c.id = classified_id
      and c.owner_id = (select auth.uid())
      and c.status in ('draft', 'paused', 'rejected')
  )
);

drop policy if exists "Owners can delete classified media" on public.classified_media;
create policy "Owners can delete media on mutable classifieds"
on public.classified_media
for delete
to authenticated
using (
  exists (
    select 1
    from public.classifieds c
    where c.id = classified_id
      and c.owner_id = (select auth.uid())
      and c.status in ('draft', 'paused', 'rejected')
  )
);

create or replace function public.submit_classified_for_review(p_classified_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_owner_id uuid;
  v_status text;
  v_media_count integer;
begin
  if v_user_id is null then
    raise exception 'authentication_required';
  end if;

  select c.owner_id, c.status
    into v_owner_id, v_status
  from public.classifieds c
  where c.id = p_classified_id
  for update;

  if v_owner_id is null then
    raise exception 'classified_not_found';
  end if;

  if v_owner_id <> v_user_id then
    raise exception 'classified_not_owned';
  end if;

  if v_status not in ('draft', 'paused', 'rejected') then
    raise exception 'classified_not_submittable';
  end if;

  select count(*)
    into v_media_count
  from public.classified_media cm
  where cm.classified_id = p_classified_id;

  if v_media_count < 1 then
    raise exception 'classified_media_required';
  end if;

  update public.classifieds
  set status = 'pending_review',
      published_at = null
  where id = p_classified_id;
end;
$$;

revoke all on function public.submit_classified_for_review(uuid) from public;
grant execute on function public.submit_classified_for_review(uuid) to authenticated;

create or replace function public.withdraw_classified_from_review(p_classified_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    raise exception 'authentication_required';
  end if;

  update public.classifieds
  set status = 'draft',
      published_at = null
  where id = p_classified_id
    and owner_id = v_user_id
    and status = 'pending_review';

  if not found then
    raise exception 'classified_not_withdrawable';
  end if;
end;
$$;

revoke all on function public.withdraw_classified_from_review(uuid) from public;
grant execute on function public.withdraw_classified_from_review(uuid) to authenticated;
