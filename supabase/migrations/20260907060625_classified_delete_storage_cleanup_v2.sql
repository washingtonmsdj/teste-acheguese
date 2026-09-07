drop policy if exists "Classified media owners can delete" on storage.objects;
create policy "Classified media owners can delete"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'classified-media'
  and split_part(name, '/', 1) = (select auth.uid())::text
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

  return old;
end;
$$;

revoke all on function private.guard_classified_delete() from public, anon, authenticated;
