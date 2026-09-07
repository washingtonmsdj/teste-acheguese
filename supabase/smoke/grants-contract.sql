-- Read-only authorization/grants contract smoke.
-- Fails if client roles gain unexpected schema/table/function authority.

do $$
declare
  unexpected text[];
  actual text[];
begin
  if has_schema_privilege('anon', 'private', 'USAGE')
     or has_schema_privilege('authenticated', 'private', 'USAGE')
     or has_schema_privilege('anon', 'private', 'CREATE')
     or has_schema_privilege('authenticated', 'private', 'CREATE') then
    raise exception 'private_schema_exposed';
  end if;

  if has_schema_privilege('anon', 'public', 'CREATE')
     or has_schema_privilege('authenticated', 'public', 'CREATE') then
    raise exception 'public_schema_create_exposed';
  end if;

  select array_agg(
    table_name || ':' || privilege_type
    order by table_name, privilege_type
  )
  into unexpected
  from information_schema.role_table_grants
  where grantee='anon'
    and table_schema='public'
    and privilege_type <> 'SELECT';

  if coalesce(cardinality(unexpected), 0) <> 0 then
    raise exception 'anon_write_grants:%', unexpected;
  end if;

  select array_agg(
    table_name || ':' || privilege_type
    order by table_name, privilege_type
  )
  into unexpected
  from information_schema.role_table_grants
  where grantee='authenticated'
    and table_schema='public'
    and privilege_type in (
      'INSERT',
      'UPDATE',
      'DELETE',
      'TRUNCATE',
      'REFERENCES',
      'TRIGGER'
    )
    and table_name <> all(array[
      'classified_conversations',
      'classified_favorites',
      'classified_media',
      'classified_messages',
      'classified_reports',
      'classifieds'
    ]::text[]);

  if coalesce(cardinality(unexpected), 0) <> 0 then
    raise exception
      'authenticated_write_grant_outside_classifieds:%',
      unexpected;
  end if;

  select array_agg(p.proname order by p.proname)
  into actual
  from pg_proc p
  join pg_namespace n on n.oid=p.pronamespace
  where n.nspname in ('public','private')
    and has_function_privilege(
      'anon',
      p.oid,
      'EXECUTE'
    );

  if coalesce(actual, '{}'::text[]) <> array[
    'get_public_places_in_bbox',
    'get_territory_boundaries_in_bbox'
  ]::text[] then
    raise exception
      'anon_execute_surface_changed:%',
      actual;
  end if;

  select array_agg(p.proname order by p.proname)
  into actual
  from pg_proc p
  join pg_namespace n on n.oid=p.pronamespace
  where n.nspname in ('public','private')
    and has_function_privilege(
      'authenticated',
      p.oid,
      'EXECUTE'
    );

  if coalesce(actual, '{}'::text[]) <> array[
    'get_public_places_in_bbox',
    'get_territory_boundaries_in_bbox',
    'submit_classified_for_review',
    'withdraw_classified_from_review'
  ]::text[] then
    raise exception
      'authenticated_execute_surface_changed:%',
      actual;
  end if;

  select array_agg(
    n.nspname || '.' || p.proname
    order by n.nspname, p.proname
  )
  into unexpected
  from pg_proc p
  join pg_namespace n on n.oid=p.pronamespace
  where n.nspname in ('public','private')
    and has_function_privilege(
      'public',
      p.oid,
      'EXECUTE'
    );

  if coalesce(cardinality(unexpected), 0) <> 0 then
    raise exception
      'public_execute_grants_present:%',
      unexpected;
  end if;

  select array_agg(
    n.nspname || '.' || p.proname
    order by n.nspname, p.proname
  )
  into unexpected
  from pg_proc p
  join pg_namespace n on n.oid=p.pronamespace
  where n.nspname in ('public','private')
    and p.prosecdef
    and (
      has_function_privilege(
        'anon',
        p.oid,
        'EXECUTE'
      )
      or has_function_privilege(
        'authenticated',
        p.oid,
        'EXECUTE'
      )
    );

  if coalesce(cardinality(unexpected), 0) <> 0 then
    raise exception
      'security_definer_executable_by_client:%',
      unexpected;
  end if;

  select array_agg(
    n.nspname || '.' || p.proname
    order by n.nspname, p.proname
  )
  into unexpected
  from pg_proc p
  join pg_namespace n on n.oid=p.pronamespace
  where n.nspname in ('public','private')
    and (
      p.prosecdef
      or has_function_privilege(
        'anon',
        p.oid,
        'EXECUTE'
      )
      or has_function_privilege(
        'authenticated',
        p.oid,
        'EXECUTE'
      )
    )
    and not (
      'search_path=""' = any(
        coalesce(p.proconfig, '{}'::text[])
      )
    );

  if coalesce(cardinality(unexpected), 0) <> 0 then
    raise exception
      'function_search_path_not_closed:%',
      unexpected;
  end if;
end $$;

select jsonb_build_object(
  'status','pass',
  'anon_table_writes',0,
  'authenticated_write_domain','classifieds_only',
  'private_schema_usage',false,
  'anon_execute',jsonb_build_array(
    'get_public_places_in_bbox',
    'get_territory_boundaries_in_bbox'
  ),
  'authenticated_execute',jsonb_build_array(
    'get_public_places_in_bbox',
    'get_territory_boundaries_in_bbox',
    'submit_classified_for_review',
    'withdraw_classified_from_review'
  )
) as grants_contract;
