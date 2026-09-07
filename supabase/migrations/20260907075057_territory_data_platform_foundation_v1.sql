
create table public.territory_data_sources (
  id uuid primary key default gen_random_uuid(),
  key text not null unique
    check (key ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  provider_name text not null
    check (char_length(provider_name) between 2 and 160),
  dataset_name text not null
    check (char_length(dataset_name) between 2 and 240),
  source_url text not null,
  license_name text,
  license_url text,
  attribution text,
  ingestion_method text not null
    check (ingestion_method in ('arcgis_feature_service','api','file','manual_verified','other')),
  status text not null default 'active'
    check (status in ('active','inactive')),
  is_public boolean not null default true,
  metadata jsonb not null default '{}'::jsonb
    check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.territory_data_snapshots (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null
    references public.territory_data_sources(id) on delete restrict,
  source_version text,
  source_published_at timestamptz,
  fetched_at timestamptz not null default now(),
  checksum_sha256 text
    check (checksum_sha256 is null or checksum_sha256 ~ '^[a-f0-9]{64}$'),
  status text not null default 'pending'
    check (status in ('pending','verified','rejected','superseded')),
  is_public boolean not null default false,
  metadata jsonb not null default '{}'::jsonb
    check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, source_id),
  check (not is_public or status in ('verified','superseded'))
);

create unique index territory_data_snapshots_checksum_unique_idx
  on public.territory_data_snapshots (source_id, checksum_sha256)
  where checksum_sha256 is not null;

create index territory_data_snapshots_source_fetched_idx
  on public.territory_data_snapshots (source_id, fetched_at desc);

create table public.territory_metric_definitions (
  key text primary key
    check (key ~ '^[a-z0-9]+(?:_[a-z0-9]+)*$'),
  label text not null
    check (char_length(label) between 2 and 160),
  description text,
  value_type text not null
    check (value_type in ('numeric','text','boolean')),
  default_unit text,
  status text not null default 'active'
    check (status in ('active','inactive')),
  sort_order integer not null default 0,
  metadata jsonb not null default '{}'::jsonb
    check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.territory_facts (
  id uuid primary key default gen_random_uuid(),
  territory_id uuid not null
    references public.territories(id) on delete cascade,
  metric_key text not null
    references public.territory_metric_definitions(key) on delete restrict,
  source_snapshot_id uuid not null
    references public.territory_data_snapshots(id) on delete restrict,
  reference_period text not null
    check (char_length(reference_period) between 1 and 80),
  value_numeric numeric,
  value_text text,
  value_boolean boolean,
  unit text,
  dimensions jsonb not null default '{}'::jsonb
    check (jsonb_typeof(dimensions) = 'object'),
  source_record_id text,
  quality_status text not null default 'provisional'
    check (quality_status in ('provisional','verified','retired')),
  metadata jsonb not null default '{}'::jsonb
    check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (value_numeric is not null)::integer
    + (value_text is not null)::integer
    + (value_boolean is not null)::integer
    = 1
  )
);

create unique index territory_facts_identity_unique_idx
  on public.territory_facts (
    territory_id,
    metric_key,
    reference_period,
    source_snapshot_id,
    dimensions
  );

create index territory_facts_territory_metric_period_idx
  on public.territory_facts (territory_id, metric_key, reference_period desc);

create index territory_facts_snapshot_idx
  on public.territory_facts (source_snapshot_id);

create table public.public_place_categories (
  key text primary key
    check (key ~ '^[a-z0-9]+(?:_[a-z0-9]+)*$'),
  parent_key text
    references public.public_place_categories(key) on delete restrict,
  label text not null
    check (char_length(label) between 2 and 120),
  description text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (parent_key is null or parent_key <> key)
);

create table public.public_places (
  id uuid primary key default gen_random_uuid(),
  territory_id uuid not null
    references public.territories(id) on delete restrict,
  category_key text not null
    references public.public_place_categories(key) on delete restrict,
  source_id uuid not null
    references public.territory_data_sources(id) on delete restrict,
  source_snapshot_id uuid not null,
  external_id text,
  name text not null
    check (char_length(name) between 2 and 240),
  description text,
  location extensions.geometry(Point, 4326),
  address_text text,
  neighborhood_label text,
  postal_code text,
  phone text,
  website text,
  status text not null default 'active'
    check (status in ('active','inactive')),
  quality_status text not null default 'provisional'
    check (quality_status in ('provisional','verified','retired')),
  source_updated_at timestamptz,
  metadata jsonb not null default '{}'::jsonb
    check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint public_places_snapshot_source_fkey
    foreign key (source_snapshot_id, source_id)
    references public.territory_data_snapshots(id, source_id)
    on delete restrict
);

create unique index public_places_source_external_unique_idx
  on public.public_places (source_id, external_id)
  where external_id is not null;

create index public_places_territory_category_idx
  on public.public_places (territory_id, category_key, status);

create index public_places_source_idx
  on public.public_places (source_id, source_snapshot_id);

create index public_places_location_gist_idx
  on public.public_places using gist (location);

create table private.territory_ingestion_runs (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null
    references public.territory_data_sources(id) on delete restrict,
  source_snapshot_id uuid
    references public.territory_data_snapshots(id) on delete set null,
  status text not null default 'pending'
    check (status in ('pending','running','succeeded','failed','cancelled')),
  started_at timestamptz,
  finished_at timestamptz,
  rows_received bigint not null default 0 check (rows_received >= 0),
  rows_valid bigint not null default 0 check (rows_valid >= 0),
  rows_rejected bigint not null default 0 check (rows_rejected >= 0),
  error_summary text,
  metadata jsonb not null default '{}'::jsonb
    check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now()
);

create index territory_ingestion_runs_source_created_idx
  on private.territory_ingestion_runs (source_id, created_at desc);

create or replace function private.enforce_territory_fact_value_type()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  expected_type text;
  expected_unit text;
begin
  select d.value_type, d.default_unit
    into expected_type, expected_unit
  from public.territory_metric_definitions d
  where d.key = new.metric_key
    and d.status = 'active';

  if expected_type is null then
    raise exception 'territory_fact_metric_not_active';
  end if;

  if expected_type = 'numeric' and (
    new.value_numeric is null
    or new.value_text is not null
    or new.value_boolean is not null
  ) then
    raise exception 'territory_fact_expected_numeric';
  elsif expected_type = 'text' and (
    new.value_text is null
    or new.value_numeric is not null
    or new.value_boolean is not null
  ) then
    raise exception 'territory_fact_expected_text';
  elsif expected_type = 'boolean' and (
    new.value_boolean is null
    or new.value_numeric is not null
    or new.value_text is not null
  ) then
    raise exception 'territory_fact_expected_boolean';
  end if;

  if new.unit is null and expected_unit is not null then
    new.unit := expected_unit;
  end if;

  return new;
end;
$$;

create or replace function private.enforce_verified_data_provenance()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  snapshot_public boolean;
  snapshot_status text;
  source_public boolean;
begin
  if new.quality_status <> 'verified' then
    return new;
  end if;

  select s.is_public, s.status, d.is_public
    into snapshot_public, snapshot_status, source_public
  from public.territory_data_snapshots s
  join public.territory_data_sources d on d.id = s.source_id
  where s.id = new.source_snapshot_id;

  if snapshot_public is distinct from true
    or snapshot_status not in ('verified','superseded')
    or source_public is distinct from true then
    raise exception 'verified_data_requires_public_verified_provenance';
  end if;

  return new;
end;
$$;

revoke all on function private.enforce_territory_fact_value_type()
  from public, anon, authenticated;
revoke all on function private.enforce_verified_data_provenance()
  from public, anon, authenticated;

create trigger territory_facts_value_type_guard
before insert or update of metric_key, value_numeric, value_text, value_boolean, unit
on public.territory_facts
for each row execute function private.enforce_territory_fact_value_type();

create trigger territory_facts_verified_provenance_guard
before insert or update of quality_status, source_snapshot_id
on public.territory_facts
for each row execute function private.enforce_verified_data_provenance();

create trigger public_places_verified_provenance_guard
before insert or update of quality_status, source_snapshot_id
on public.public_places
for each row execute function private.enforce_verified_data_provenance();

create trigger territory_data_sources_touch_updated_at
before update on public.territory_data_sources
for each row execute function private.touch_row_updated_at();

create trigger territory_data_snapshots_touch_updated_at
before update on public.territory_data_snapshots
for each row execute function private.touch_row_updated_at();

create trigger territory_metric_definitions_touch_updated_at
before update on public.territory_metric_definitions
for each row execute function private.touch_row_updated_at();

create trigger territory_facts_touch_updated_at
before update on public.territory_facts
for each row execute function private.touch_row_updated_at();

create trigger public_place_categories_touch_updated_at
before update on public.public_place_categories
for each row execute function private.touch_row_updated_at();

create trigger public_places_touch_updated_at
before update on public.public_places
for each row execute function private.touch_row_updated_at();

alter table public.territory_data_sources enable row level security;
alter table public.territory_data_snapshots enable row level security;
alter table public.territory_metric_definitions enable row level security;
alter table public.territory_facts enable row level security;
alter table public.public_place_categories enable row level security;
alter table public.public_places enable row level security;
alter table private.territory_ingestion_runs enable row level security;

revoke all on table public.territory_data_sources from anon, authenticated;
revoke all on table public.territory_data_snapshots from anon, authenticated;
revoke all on table public.territory_metric_definitions from anon, authenticated;
revoke all on table public.territory_facts from anon, authenticated;
revoke all on table public.public_place_categories from anon, authenticated;
revoke all on table public.public_places from anon, authenticated;
revoke all on table private.territory_ingestion_runs from anon, authenticated;

grant select on table public.territory_data_sources to anon, authenticated;
grant select on table public.territory_data_snapshots to anon, authenticated;
grant select on table public.territory_metric_definitions to anon, authenticated;
grant select on table public.territory_facts to anon, authenticated;
grant select on table public.public_place_categories to anon, authenticated;
grant select on table public.public_places to anon, authenticated;

grant all on table public.territory_data_sources to service_role;
grant all on table public.territory_data_snapshots to service_role;
grant all on table public.territory_metric_definitions to service_role;
grant all on table public.territory_facts to service_role;
grant all on table public.public_place_categories to service_role;
grant all on table public.public_places to service_role;
grant usage on schema private to service_role;
grant all on table private.territory_ingestion_runs to service_role;

create policy "Public can read public territory data sources"
on public.territory_data_sources
for select
to anon, authenticated
using (is_public);

create policy "Public can read verified territory snapshots"
on public.territory_data_snapshots
for select
to anon, authenticated
using (is_public and status in ('verified','superseded'));

create policy "Public can read active territory metrics"
on public.territory_metric_definitions
for select
to anon, authenticated
using (status = 'active');

create policy "Public can read verified territory facts"
on public.territory_facts
for select
to anon, authenticated
using (quality_status = 'verified');

create policy "Public can read active public place categories"
on public.public_place_categories
for select
to anon, authenticated
using (is_active);

create policy "Public can read verified public places"
on public.public_places
for select
to anon, authenticated
using (status = 'active' and quality_status = 'verified');

insert into public.public_place_categories (key, label, sort_order)
values
  ('education', 'Educação', 10),
  ('health', 'Saúde', 20),
  ('security', 'Segurança', 30),
  ('public_administration', 'Administração pública', 40),
  ('social_assistance', 'Assistência social', 50),
  ('transport', 'Transporte', 60),
  ('culture', 'Cultura', 70),
  ('sports', 'Esporte', 80),
  ('leisure', 'Lazer', 90),
  ('environment', 'Meio ambiente', 100),
  ('emergency', 'Emergência', 110)
on conflict (key) do update
set
  label = excluded.label,
  sort_order = excluded.sort_order,
  is_active = true;
