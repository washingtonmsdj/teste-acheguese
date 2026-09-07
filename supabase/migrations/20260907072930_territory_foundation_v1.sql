
create extension if not exists postgis with schema extensions;

create table if not exists public.territories (
  id uuid primary key default gen_random_uuid(),
  type text not null
    check (type in ('country','state','city','district','neighborhood')),
  parent_id uuid references public.territories(id) on delete restrict,
  slug text not null
    check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null
    check (char_length(name) between 2 and 120),
  geographic_path text not null unique
    check (geographic_path ~ '^/[a-z0-9-]+(?:/[a-z0-9-]+)*$'),
  status text not null default 'coming_soon'
    check (status in ('active','coming_soon','inactive')),
  country_code text
    check (country_code is null or country_code ~ '^[A-Z]{2}$'),
  state_code text
    check (state_code is null or state_code ~ '^[A-Z]{2}$'),
  ibge_code text
    check (ibge_code is null or ibge_code ~ '^[0-9]+$'),
  timezone text,
  center extensions.geometry(Point, 4326),
  metadata jsonb not null default '{}'::jsonb
    check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists territories_parent_slug_unique_idx
  on public.territories (parent_id, slug)
  where parent_id is not null;

create index if not exists territories_parent_idx
  on public.territories (parent_id);

create index if not exists territories_type_status_idx
  on public.territories (type, status);

create index if not exists territories_ibge_code_idx
  on public.territories (ibge_code)
  where ibge_code is not null;

create index if not exists territories_center_gist_idx
  on public.territories
  using gist (center);

create table if not exists public.territory_groups (
  id uuid primary key default gen_random_uuid(),
  anchor_city_id uuid not null
    references public.territories(id) on delete restrict,
  slug text not null
    check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null
    check (char_length(name) between 2 and 160),
  description text
    check (description is null or char_length(description) <= 2000),
  status text not null default 'coming_soon'
    check (status in ('active','coming_soon','inactive')),
  metadata jsonb not null default '{}'::jsonb
    check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (anchor_city_id, slug)
);

create index if not exists territory_groups_anchor_idx
  on public.territory_groups (anchor_city_id, status);

create table if not exists public.territory_group_members (
  group_id uuid not null
    references public.territory_groups(id) on delete cascade,
  territory_id uuid not null
    references public.territories(id) on delete restrict,
  created_at timestamptz not null default now(),
  primary key (group_id, territory_id)
);

create index if not exists territory_group_members_territory_idx
  on public.territory_group_members (territory_id);

create table if not exists public.territory_boundaries (
  territory_id uuid primary key
    references public.territories(id) on delete cascade,
  geometry extensions.geometry(MultiPolygon, 4326) not null,
  source_name text not null
    check (char_length(source_name) between 2 and 160),
  source_url text,
  source_object_id text,
  source_updated_at timestamptz,
  imported_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
    check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists territory_boundaries_geometry_gist_idx
  on public.territory_boundaries
  using gist (geometry);

create index if not exists territory_boundaries_source_idx
  on public.territory_boundaries (source_name, source_object_id);

create or replace function private.touch_row_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

revoke all on function private.touch_row_updated_at()
  from public, anon, authenticated;

drop trigger if exists territories_touch_updated_at on public.territories;
create trigger territories_touch_updated_at
before update on public.territories
for each row execute function private.touch_row_updated_at();

drop trigger if exists territory_groups_touch_updated_at on public.territory_groups;
create trigger territory_groups_touch_updated_at
before update on public.territory_groups
for each row execute function private.touch_row_updated_at();

drop trigger if exists territory_boundaries_touch_updated_at on public.territory_boundaries;
create trigger territory_boundaries_touch_updated_at
before update on public.territory_boundaries
for each row execute function private.touch_row_updated_at();

create or replace function private.enforce_territory_parentage()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  parent_type text;
begin
  if new.type = 'country' then
    if new.parent_id is not null then
      raise exception 'country_must_not_have_parent';
    end if;
    return new;
  end if;

  if new.parent_id is null then
    raise exception 'territory_parent_required';
  end if;

  select t.type
    into parent_type
  from public.territories t
  where t.id = new.parent_id;

  if parent_type is null then
    raise exception 'territory_parent_not_found';
  end if;

  if new.type = 'state' and parent_type <> 'country' then
    raise exception 'state_parent_must_be_country';
  elsif new.type = 'city' and parent_type <> 'state' then
    raise exception 'city_parent_must_be_state';
  elsif new.type in ('district','neighborhood') and parent_type <> 'city' then
    raise exception 'local_parent_must_be_city';
  end if;

  return new;
end;
$$;

revoke all on function private.enforce_territory_parentage()
  from public, anon, authenticated;

drop trigger if exists territories_parentage_guard on public.territories;
create trigger territories_parentage_guard
before insert or update of type, parent_id
on public.territories
for each row execute function private.enforce_territory_parentage();

create or replace function private.enforce_territory_group_member()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  member_type text;
  member_parent uuid;
  anchor_city uuid;
begin
  select t.type, t.parent_id
    into member_type, member_parent
  from public.territories t
  where t.id = new.territory_id;

  select g.anchor_city_id
    into anchor_city
  from public.territory_groups g
  where g.id = new.group_id;

  if member_type not in ('district','neighborhood') then
    raise exception 'territory_group_member_must_be_local';
  end if;

  if member_parent is distinct from anchor_city then
    raise exception 'territory_group_member_wrong_city';
  end if;

  return new;
end;
$$;

revoke all on function private.enforce_territory_group_member()
  from public, anon, authenticated;

drop trigger if exists territory_group_members_guard
  on public.territory_group_members;
create trigger territory_group_members_guard
before insert or update
on public.territory_group_members
for each row execute function private.enforce_territory_group_member();

alter table public.territories enable row level security;
alter table public.territory_groups enable row level security;
alter table public.territory_group_members enable row level security;
alter table public.territory_boundaries enable row level security;

revoke all on table public.territories from anon, authenticated;
revoke all on table public.territory_groups from anon, authenticated;
revoke all on table public.territory_group_members from anon, authenticated;
revoke all on table public.territory_boundaries from anon, authenticated;

grant select on table public.territories to anon, authenticated;
grant select on table public.territory_groups to anon, authenticated;
grant select on table public.territory_group_members to anon, authenticated;
grant select on table public.territory_boundaries to anon, authenticated;

drop policy if exists "Public can read visible territories"
  on public.territories;
create policy "Public can read visible territories"
on public.territories
for select
to anon, authenticated
using (status in ('active','coming_soon'));

drop policy if exists "Public can read visible territory groups"
  on public.territory_groups;
create policy "Public can read visible territory groups"
on public.territory_groups
for select
to anon, authenticated
using (status in ('active','coming_soon'));

drop policy if exists "Public can read visible territory group members"
  on public.territory_group_members;
create policy "Public can read visible territory group members"
on public.territory_group_members
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.territory_groups g
    where g.id = group_id
      and g.status in ('active','coming_soon')
  )
  and exists (
    select 1
    from public.territories t
    where t.id = territory_id
      and t.status in ('active','coming_soon')
  )
);

drop policy if exists "Public can read visible territory boundaries"
  on public.territory_boundaries;
create policy "Public can read visible territory boundaries"
on public.territory_boundaries
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.territories t
    where t.id = territory_id
      and t.status in ('active','coming_soon')
  )
);

with brazil as (
  insert into public.territories (
    type, parent_id, slug, name, geographic_path, status,
    country_code, timezone, metadata
  )
  values (
    'country', null, 'br', 'Brasil', '/br', 'active',
    'BR', 'America/Sao_Paulo',
    jsonb_build_object(
      'official', true,
      'source_name', 'IBGE'
    )
  )
  on conflict (geographic_path) do update
  set
    name = excluded.name,
    status = excluded.status,
    country_code = excluded.country_code,
    metadata = public.territories.metadata || excluded.metadata
  returning id
),
bahia as (
  insert into public.territories (
    type, parent_id, slug, name, geographic_path, status,
    country_code, state_code, ibge_code, timezone, metadata
  )
  select
    'state', brazil.id, 'ba', 'Bahia', '/br/ba', 'active',
    'BR', 'BA', '29', 'America/Bahia',
    jsonb_build_object(
      'official', true,
      'source_name', 'IBGE'
    )
  from brazil
  on conflict (geographic_path) do update
  set
    parent_id = excluded.parent_id,
    name = excluded.name,
    status = excluded.status,
    state_code = excluded.state_code,
    ibge_code = excluded.ibge_code,
    timezone = excluded.timezone,
    metadata = public.territories.metadata || excluded.metadata
  returning id
),
salvador as (
  insert into public.territories (
    type, parent_id, slug, name, geographic_path, status,
    country_code, state_code, ibge_code, timezone, center, metadata
  )
  select
    'city', bahia.id, 'salvador', 'Salvador',
    '/br/ba/salvador', 'active',
    'BR', 'BA', '2927408', 'America/Bahia',
    extensions.st_setsrid(
      extensions.st_makepoint(-38.51, -12.97),
      4326
    ),
    jsonb_build_object(
      'official', true,
      'source_name', 'IBGE',
      'source_reference', 'Censo 2022 / malha municipal'
    )
  from bahia
  on conflict (geographic_path) do update
  set
    parent_id = excluded.parent_id,
    name = excluded.name,
    status = excluded.status,
    ibge_code = excluded.ibge_code,
    timezone = excluded.timezone,
    center = excluded.center,
    metadata = public.territories.metadata || excluded.metadata
  returning id
),
neighborhood_seed(slug, name, source_object_id, latitude, longitude) as (
  values
    ('nordeste-de-amaralina', 'Nordeste de Amaralina', '112', -13.00912935::double precision, -38.47367582::double precision),
    ('santa-cruz', 'Santa Cruz', '142', -13.00369176::double precision, -38.47539865::double precision),
    ('vale-das-pedrinhas', 'Vale das Pedrinhas', '163', -13.00852241::double precision, -38.48035290::double precision),
    ('chapada-do-rio-vermelho', 'Chapada do Rio Vermelho', '54', -13.00516291::double precision, -38.48064788::double precision)
),
upserted_neighborhoods as (
  insert into public.territories (
    type, parent_id, slug, name, geographic_path, status,
    country_code, state_code, timezone, center, metadata
  )
  select
    'neighborhood',
    salvador.id,
    n.slug,
    n.name,
    '/br/ba/salvador/' || n.slug,
    'active',
    'BR',
    'BA',
    'America/Bahia',
    extensions.st_setsrid(
      extensions.st_makepoint(n.longitude, n.latitude),
      4326
    ),
    jsonb_build_object(
      'official', true,
      'source_name', 'GeoSalvador',
      'source_dataset', 'bairros_app_dados_2010_e_2022',
      'source_url', 'https://services6.arcgis.com/GP5qdNaePRPh2SdT/ArcGIS/rest/services/bairros_app_dados_2010_e_2022/FeatureServer/0',
      'source_object_id', n.source_object_id
    )
  from salvador
  cross join neighborhood_seed n
  on conflict (geographic_path) do update
  set
    parent_id = excluded.parent_id,
    name = excluded.name,
    status = excluded.status,
    timezone = excluded.timezone,
    center = excluded.center,
    metadata = public.territories.metadata || excluded.metadata
  returning id, slug
),
upserted_group as (
  insert into public.territory_groups (
    anchor_city_id, slug, name, description, status, metadata
  )
  select
    salvador.id,
    'complexo-do-nordeste-de-amaralina',
    'Complexo do Nordeste de Amaralina',
    'Agrupamento operacional dos quatro bairros do Complexo do Nordeste de Amaralina em Salvador.',
    'active',
    jsonb_build_object(
      'launch_scope', true,
      'official_hierarchy', false
    )
  from salvador
  on conflict (anchor_city_id, slug) do update
  set
    name = excluded.name,
    description = excluded.description,
    status = excluded.status,
    metadata = public.territory_groups.metadata || excluded.metadata
  returning id
)
insert into public.territory_group_members (
  group_id, territory_id
)
select
  upserted_group.id,
  upserted_neighborhoods.id
from upserted_group
cross join upserted_neighborhoods
on conflict (group_id, territory_id) do nothing;
