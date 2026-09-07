-- Rollback-safe public/anonymous smoke test.
-- This script intentionally does not create auth.users.
-- Owner/admin flows are validated only through real Supabase Auth E2E.

begin;

select set_config('request.jwt.claims', '{"role":"anon"}', true);
set local role anon;

do $$
declare
  denied boolean := false;
begin
  if (
    select count(*)
    from public.cities
    where slug = 'salvador'
      and state_code = 'BA'
  ) <> 1 then
    raise exception 'public_city_visibility_failed';
  end if;

  if (
    select count(*)
    from public.classifieds
    where status <> 'published'
  ) <> 0 then
    raise exception 'anon_can_see_unpublished';
  end if;

  begin
    insert into public.classifieds (
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
      '99999999-9999-9999-9999-999999999999',
      'electronics',
      1,
      'anon-should-not-create',
      'Tentativa anônima',
      'Esta linha nunca deve ser persistida pelo usuário anônimo.',
      'used',
      10000,
      'draft'
    );
  exception when others then
    denied := true;
  end;

  if not denied then
    raise exception 'anon_insert_was_not_blocked';
  end if;
end $$;

reset role;
rollback;

select jsonb_build_object(
  'status', 'pass',
  'salvador_active', exists(
    select 1
    from public.cities
    where slug = 'salvador'
      and state_code = 'BA'
      and is_active = true
  ),
  'anon_rpc_submit', has_function_privilege(
    'anon',
    'public.submit_classified_for_review(uuid)',
    'EXECUTE'
  ),
  'anon_rpc_withdraw', has_function_privilege(
    'anon',
    'public.withdraw_classified_from_review(uuid)',
    'EXECUTE'
  )
) as smoke_result;
