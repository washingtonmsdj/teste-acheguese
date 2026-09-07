alter table public.classifieds
  add column if not exists rejection_reason text;

alter table public.classifieds
  drop constraint if exists classifieds_rejection_reason_check;

alter table public.classifieds
  add constraint classifieds_rejection_reason_check
  check (
    rejection_reason is null
    or char_length(rejection_reason) between 10 and 1000
  );

create index if not exists classifieds_moderation_queue_idx
  on public.classifieds (updated_at asc)
  where status = 'pending_review';

create unique index if not exists classified_reports_unique_reporter_idx
  on public.classified_reports (classified_id, reporter_id);

drop policy if exists "Classified admins can review classifieds" on public.classifieds;
create policy "Classified admins can review classifieds"
on public.classifieds
for select
to authenticated
using (
  coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'classified_admin'
);

drop policy if exists "Classified admins can moderate classifieds" on public.classifieds;
create policy "Classified admins can moderate classifieds"
on public.classifieds
for update
to authenticated
using (
  coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'classified_admin'
)
with check (
  coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'classified_admin'
);

drop policy if exists "Classified admins can read reports" on public.classified_reports;
create policy "Classified admins can read reports"
on public.classified_reports
for select
to authenticated
using (
  coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'classified_admin'
);

create or replace function private.enforce_classified_owner_transition()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v_media_count integer;
  v_is_admin boolean :=
    coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'classified_admin';
  v_content_changed boolean;
begin
  v_content_changed := (
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
  );

  if v_is_admin then
    if v_content_changed then
      raise exception 'classified_admin_content_locked';
    end if;

    if old.status = 'pending_review' and new.status = 'published' then
      new.published_at := now();
      new.rejection_reason := null;

      insert into private.classified_moderation (
        classified_id,
        reviewer_id,
        decision,
        internal_notes,
        reviewed_at
      )
      values (
        old.id,
        auth.uid(),
        'approved',
        null,
        now()
      )
      on conflict (classified_id) do update
      set reviewer_id = excluded.reviewer_id,
          decision = excluded.decision,
          internal_notes = excluded.internal_notes,
          reviewed_at = excluded.reviewed_at;

      return new;
    end if;

    if old.status = 'pending_review' and new.status = 'rejected' then
      if new.rejection_reason is null
        or char_length(trim(new.rejection_reason)) < 10 then
        raise exception 'classified_rejection_reason_required';
      end if;

      new.published_at := null;

      insert into private.classified_moderation (
        classified_id,
        reviewer_id,
        decision,
        internal_notes,
        reviewed_at
      )
      values (
        old.id,
        auth.uid(),
        'rejected',
        new.rejection_reason,
        now()
      )
      on conflict (classified_id) do update
      set reviewer_id = excluded.reviewer_id,
          decision = excluded.decision,
          internal_notes = excluded.internal_notes,
          reviewed_at = excluded.reviewed_at;

      return new;
    end if;

    if old.status = 'published' and new.status = 'paused' then
      if new.rejection_reason is null
        or char_length(trim(new.rejection_reason)) < 10 then
        raise exception 'classified_rejection_reason_required';
      end if;

      new.published_at := null;

      insert into private.classified_moderation (
        classified_id,
        reviewer_id,
        decision,
        internal_notes,
        reviewed_at
      )
      values (
        old.id,
        auth.uid(),
        'needs_changes',
        new.rejection_reason,
        now()
      )
      on conflict (classified_id) do update
      set reviewer_id = excluded.reviewer_id,
          decision = excluded.decision,
          internal_notes = excluded.internal_notes,
          reviewed_at = excluded.reviewed_at;

      return new;
    end if;

    raise exception 'classified_invalid_admin_transition';
  end if;

  if old.owner_id <> auth.uid() then
    raise exception 'classified_not_owned';
  end if;

  if new.rejection_reason is distinct from old.rejection_reason then
    raise exception 'classified_rejection_reason_managed';
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

      new.published_at := null;
      new.rejection_reason := null;
      return new;
    end if;

    raise exception 'classified_invalid_owner_transition';
  end if;

  if old.status = 'pending_review' then
    if new.status <> 'draft' then
      raise exception 'classified_not_withdrawable';
    end if;

    if v_content_changed then
      raise exception 'classified_review_content_locked';
    end if;

    new.published_at := null;
    return new;
  end if;

  raise exception 'classified_not_owner_editable';
end;
$$;

revoke all on function private.enforce_classified_owner_transition() from public, anon, authenticated;
