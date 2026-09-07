drop policy if exists "Owners can delete media on mutable classifieds" on public.classified_media;
create policy "Owners can delete media on deletable classifieds"
on public.classified_media
for delete
to authenticated
using (
  exists (
    select 1
    from public.classifieds c
    where c.id = classified_id
      and c.owner_id = (select auth.uid())
      and c.status in ('draft', 'paused', 'rejected', 'archived')
  )
);

create or replace function private.guard_classified_delete()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if old.owner_id <> auth.uid() then
    raise exception 'classified_not_owned';
  end if;

  if old.status <> 'archived' then
    raise exception 'classified_not_archived';
  end if;

  if exists (
    select 1
    from public.classified_conversations cc
    where cc.classified_id = old.id
  ) then
    raise exception 'classified_has_conversations';
  end if;

  if exists (
    select 1
    from public.classified_reports cr
    where cr.classified_id = old.id
  ) then
    raise exception 'classified_has_reports';
  end if;

  if exists (
    select 1
    from private.classified_moderation cm
    where cm.classified_id = old.id
      and cm.decision is not null
  ) then
    raise exception 'classified_has_moderation_history';
  end if;

  if exists (
    select 1
    from public.classified_media media
    where media.classified_id = old.id
  ) then
    raise exception 'classified_media_must_be_removed';
  end if;

  return old;
end;
$$;

revoke all on function private.guard_classified_delete() from public, anon, authenticated;

drop trigger if exists classifieds_delete_guard on public.classifieds;
create trigger classifieds_delete_guard
before delete on public.classifieds
for each row
execute function private.guard_classified_delete();
