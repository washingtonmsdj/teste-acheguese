-- Rollback-safe authenticated/admin RLS and lifecycle smoke.
-- Creates only temporary rows inside this transaction and rolls everything back.

begin;

insert into auth.users (
  id,
  aud,
  role,
  email,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
values
(
  '11111111-1111-4111-8111-111111111111',
  'authenticated',
  'authenticated',
  'rls-owner@example.invalid',
  '{}'::jsonb,
  '{}'::jsonb,
  now(),
  now()
),
(
  '22222222-2222-4222-8222-222222222222',
  'authenticated',
  'authenticated',
  'rls-other@example.invalid',
  '{}'::jsonb,
  '{}'::jsonb,
  now(),
  now()
),
(
  '33333333-3333-4333-8333-333333333333',
  'authenticated',
  'authenticated',
  'rls-admin@example.invalid',
  '{"role":"classified_admin"}'::jsonb,
  '{}'::jsonb,
  now(),
  now()
);

select set_config(
  'request.jwt.claims',
  '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated","app_metadata":{},"user_metadata":{}}',
  true
);
set local role authenticated;

insert into public.classifieds (
  id,
  owner_id,
  category_id,
  city_id,
  slug,
  title,
  description,
  condition,
  price_cents,
  status
)
values (
  '44444444-4444-4444-8444-444444444444',
  '11111111-1111-4111-8111-111111111111',
  'vehicles',
  1,
  'rls-smoke-owner-draft',
  'Veículo de teste RLS',
  'Anúncio temporário usado somente no smoke rollback-safe de RLS autenticado.',
  'used',
  100000,
  'draft'
);

insert into public.classified_media (
  classified_id,
  storage_key,
  alt,
  position
)
values (
  '44444444-4444-4444-8444-444444444444',
  '11111111-1111-4111-8111-111111111111/44444444-4444-4444-8444-444444444444/smoke.webp',
  'Mídia temporária do smoke',
  0
);

do $$
declare
  denied boolean := false;
begin
  begin
    update public.classifieds
    set status='published',
        published_at=now()
    where id='44444444-4444-4444-8444-444444444444';
  exception when others then
    denied := true;
  end;

  if not denied then
    raise exception 'owner_direct_publish_not_blocked';
  end if;
end $$;

select public.submit_classified_for_review(
  '44444444-4444-4444-8444-444444444444'
);

do $$
begin
  if (
    select status
    from public.classifieds
    where id='44444444-4444-4444-8444-444444444444'
  ) <> 'pending_review' then
    raise exception 'owner_submit_failed';
  end if;
end $$;

reset role;
select set_config(
  'request.jwt.claims',
  '{"sub":"22222222-2222-4222-8222-222222222222","role":"authenticated","app_metadata":{},"user_metadata":{"role":"classified_admin"}}',
  true
);
set local role authenticated;

do $$
declare
  visible_count integer;
  changed_count integer;
begin
  select count(*)
  into visible_count
  from public.classifieds
  where id='44444444-4444-4444-8444-444444444444';

  if visible_count <> 0 then
    raise exception 'user_metadata_granted_visibility';
  end if;

  update public.classifieds
  set title='Tentativa indevida'
  where id='44444444-4444-4444-8444-444444444444';

  get diagnostics changed_count = row_count;

  if changed_count <> 0 then
    raise exception 'other_user_updated_foreign_classified';
  end if;
end $$;

reset role;
select set_config(
  'request.jwt.claims',
  '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated","app_metadata":{"role":"classified_admin"},"user_metadata":{}}',
  true
);
set local role authenticated;

do $$
declare
  denied boolean := false;
begin
  begin
    update public.classifieds
    set status='published'
    where id='44444444-4444-4444-8444-444444444444';
  exception when others then
    denied := true;
  end;

  if not denied then
    raise exception 'owner_admin_self_publish_not_blocked';
  end if;
end $$;

reset role;
select set_config(
  'request.jwt.claims',
  '{"sub":"33333333-3333-4333-8333-333333333333","role":"authenticated","app_metadata":{"role":"classified_admin"},"user_metadata":{}}',
  true
);
set local role authenticated;

do $$
declare
  denied boolean := false;
begin
  if (
    select count(*)
    from public.classifieds
    where id='44444444-4444-4444-8444-444444444444'
  ) <> 1 then
    raise exception 'admin_cannot_see_review_queue';
  end if;

  begin
    update public.classifieds
    set title='Admin não pode editar conteúdo'
    where id='44444444-4444-4444-8444-444444444444';
  exception when others then
    denied := true;
  end;

  if not denied then
    raise exception 'admin_content_edit_not_blocked';
  end if;
end $$;

update public.classifieds
set status='published'
where id='44444444-4444-4444-8444-444444444444';

do $$
begin
  if not exists (
    select 1
    from public.classifieds
    where id='44444444-4444-4444-8444-444444444444'
      and status='published'
      and published_at is not null
      and published_at <= now()
  ) then
    raise exception 'admin_publish_failed';
  end if;
end $$;

reset role;

do $$
begin
  if not exists (
    select 1
    from private.classified_moderation
    where classified_id='44444444-4444-4444-8444-444444444444'
      and reviewer_id='33333333-3333-4333-8333-333333333333'
      and decision='approved'
  ) then
    raise exception 'moderation_receipt_missing';
  end if;
end $$;

rollback;

select jsonb_build_object(
  'status','pass',
  'auth_users_after',(select count(*) from auth.users),
  'classifieds_after',(select count(*) from public.classifieds),
  'media_after',(select count(*) from public.classified_media),
  'moderation_after',(select count(*) from private.classified_moderation)
) as smoke_result;
