
create or replace view public.territory_boundary_catalog
with (security_invoker = true)
as
select
  t.id as territory_id,
  t.type as territory_type,
  t.slug,
  t.name,
  t.geographic_path,
  case
    when t.center is null then null
    else extensions.st_y(t.center)
  end as center_latitude,
  case
    when t.center is null then null
    else extensions.st_x(t.center)
  end as center_longitude,
  b.source_name,
  b.source_url,
  b.source_object_id,
  extensions.st_asgeojson(b.geometry)::jsonb as geojson,
  extensions.st_asgeojson(
    extensions.st_envelope(b.geometry)
  )::jsonb as bbox_geojson,
  extensions.st_area(
    b.geometry::extensions.geography
  ) as area_m2,
  b.imported_at,
  b.updated_at
from public.territory_boundaries b
join public.territories t
  on t.id = b.territory_id;

revoke all on table public.territory_boundary_catalog
  from anon, authenticated;

grant select on table public.territory_boundary_catalog
  to anon, authenticated;
