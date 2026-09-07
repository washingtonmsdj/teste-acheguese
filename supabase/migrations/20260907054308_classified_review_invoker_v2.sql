create or replace function private.enforce_classified_owner_transition()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v_media_count integer;
begin
  if old.owner_id <> auth.uid() then
    raise exception 'classified_not_owned';
  end if;

  if old.status in ('draft', 'paused', 'rejected') then
    if new.status in ('draft', 'paused', 'rejected') then
      return new;
    end if;

    if new.status = 'pending_review' then
      select count(*)
        into v_media_count
      from public.classified_media cm
      where cm.classified_id = old.id;

      if v_media_count < 1 then
        raise exception 'classified_media_required';
      end if;

      new.published_at = null;
      return new;
    end if;

    raise exception 'classified_invalid_owner_transition';
  end if;

  if old.status = 'pending_review' then
    if new.status <> 'draft' then
      raise exception 'classified_not_withdrawable';
    end if;

    if (
      new.title,
      new.description,
      new.category_id,
      new.city_id,
      new.condition,
      new.price_cents,
      new.neighborhood,
      new.owner_id,
      new.slug,
      new.currency
    ) is distinct from (
      old.title,
      old.description,
      old.category_id,
      old.city_id,
      old.condition,
      old.price_cents,
      old.neighborhood,
      old.owner_id,
      old.slug,
      old.currency
    ) then
      raise exception 'classified_review_content_locked';
    end if;

    new.published_at = null;
    return new;
  end if;

  raise exception 'classified_not_owner_editable';
end;
$$;

drop trigger if exists classifieds_owner_transition_guard on public.classifieds;
create trigger classifieds_owner_transition_guard
before update on public.classifieds
for each row
execute function private.enforce_classified_owner_transition();

drop policy if exists "Owners can edit mutable classifieds" on public.classifieds;
create policy "Owners can update owner-managed classifieds"
on public.classifieds
for update
to authenticated
using (
  (select auth.uid()) is not null
  and (select auth.uid()) = owner_id
  and status in ('draft', 'paused', 'rejected', 'pending_review')
)
with check (
  (select auth.uid()) = owner_id
  and status in ('draft', 'paused', 'rejected', 'pending_review')
  and published_at is null
);

create or replace function public.submit_classified_for_review(p_classified_id uuid)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  update public.classifieds
  set status = 'pending_review',
      published_at = null
  where id = p_classified_id;

  if not found then
    raise exception 'classified_not_submittable';
  end if;
end;
$$;

create or replace function public.withdraw_classified_from_review(p_classified_id uuid)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  update public.classifieds
  set status = 'draft',
      published_at = null
  where id = p_classified_id;

  if not found then
    raise exception 'classified_not_withdrawable';
  end if;
end;
$$;

revoke execute on function public.submit_classified_for_review(uuid) from public, anon;
revoke execute on function public.withdraw_classified_from_review(uuid) from public, anon;
grant execute on function public.submit_classified_for_review(uuid) to authenticated;
grant execute on function public.withdraw_classified_from_review(uuid) to authenticated;

revoke all on function private.enforce_classified_owner_transition() from public, anon, authenticated;
