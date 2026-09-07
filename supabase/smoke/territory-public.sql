-- Public Territory Core smoke test.
-- Rollback-safe and read-only except for privilege probes.

begin;

select set_config('request.jwt.claims', '{"role":"anon"}', true);
set local role anon;

do $$
declare
  territory_count integer;
  boundary_count integer;
  group_member_count integer;
begin
  select count(*) into territory_count
  from public.territories;

  select count(*) into boundary_count
  from public.territory_boundaries;

  select count(*) into group_member_count
  from public.territory_group_members;

  if territory_count <> 7 then
    raise exception 'territory_smoke_expected_7_got_%', territory_count;
  end if;

  if boundary_count <> 4 then
    raise exception 'territory_smoke_expected_4_boundaries_got_%', boundary_count;
  end if;

  if group_member_count <> 4 then
    raise exception 'territory_smoke_expected_4_group_members_got_%', group_member_count;
  end if;

  if has_table_privilege('anon','public.territories','INSERT')
    or has_table_privilege('anon','public.territories','UPDATE')
    or has_table_privilege('anon','public.territories','DELETE') then
    raise exception 'territory_smoke_anon_write_privilege_detected';
  end if;
end;
$$;

reset role;
rollback;

select jsonb_build_object(
  'status', 'pass',
  'territories', (select count(*) from public.territories),
  'boundaries', (select count(*) from public.territory_boundaries),
  'groups', (select count(*) from public.territory_groups),
  'members', (select count(*) from public.territory_group_members)
) as territory_smoke_result;
