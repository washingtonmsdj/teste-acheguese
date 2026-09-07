
create or replace view public.territory_fact_catalog
with (security_invoker = true)
as
select
  f.id,
  f.territory_id,
  t.slug as territory_slug,
  t.name as territory_name,
  t.geographic_path,
  f.metric_key,
  md.label as metric_label,
  f.reference_period,
  f.value_numeric,
  f.value_text,
  f.value_boolean,
  f.unit,
  f.dimensions,
  f.source_record_id,
  f.source_snapshot_id,
  s.source_version,
  s.fetched_at,
  d.id as source_id,
  d.key as source_key,
  d.provider_name,
  d.dataset_name,
  d.source_url,
  d.attribution
from public.territory_facts f
join public.territories t
  on t.id = f.territory_id
join public.territory_metric_definitions md
  on md.key = f.metric_key
join public.territory_data_snapshots s
  on s.id = f.source_snapshot_id
join public.territory_data_sources d
  on d.id = s.source_id;

revoke all on table public.territory_fact_catalog
  from anon, authenticated;

grant select on table public.territory_fact_catalog
  to anon, authenticated;

create or replace view public.public_place_catalog
with (security_invoker = true)
as
select
  p.id,
  p.territory_id,
  t.slug as territory_slug,
  t.name as territory_name,
  t.geographic_path,
  p.category_key,
  c.label as category_label,
  p.external_id,
  p.name,
  p.description,
  case
    when p.location is null then null
    else extensions.st_y(p.location)
  end as latitude,
  case
    when p.location is null then null
    else extensions.st_x(p.location)
  end as longitude,
  p.address_text,
  p.neighborhood_label,
  p.postal_code,
  p.phone,
  p.website,
  p.source_updated_at,
  p.source_snapshot_id,
  s.source_version,
  s.fetched_at,
  d.id as source_id,
  d.key as source_key,
  d.provider_name,
  d.dataset_name,
  d.source_url,
  d.attribution
from public.public_places p
join public.territories t
  on t.id = p.territory_id
join public.public_place_categories c
  on c.key = p.category_key
join public.territory_data_snapshots s
  on s.id = p.source_snapshot_id
join public.territory_data_sources d
  on d.id = p.source_id;

revoke all on table public.public_place_catalog
  from anon, authenticated;

grant select on table public.public_place_catalog
  to anon, authenticated;
