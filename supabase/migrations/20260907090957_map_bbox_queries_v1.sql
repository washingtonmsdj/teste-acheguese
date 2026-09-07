
create or replace function public.get_public_places_in_bbox(
  p_west double precision,
  p_south double precision,
  p_east double precision,
  p_north double precision,
  p_limit integer default 200,
  p_category_keys text[] default null
)
returns table (
  id uuid,
  territory_id uuid,
  territory_slug text,
  territory_name text,
  geographic_path text,
  category_key text,
  category_label text,
  external_id text,
  name text,
  description text,
  latitude double precision,
  longitude double precision,
  address_text text,
  neighborhood_label text,
  postal_code text,
  phone text,
  website text,
  source_updated_at timestamptz,
  source_snapshot_id uuid,
  source_version text,
  fetched_at timestamptz,
  source_id uuid,
  source_key text,
  provider_name text,
  dataset_name text,
  source_url text,
  attribution text
)
language plpgsql
stable
security invoker
set search_path = ''
as $$
begin
  if p_west < -180 or p_west > 180
    or p_east < -180 or p_east > 180
    or p_south < -90 or p_south > 90
    or p_north < -90 or p_north > 90
    or p_west >= p_east
    or p_south >= p_north then
    raise exception 'map_bbox_invalid';
  end if;

  if p_limit < 1 or p_limit > 500 then
    raise exception 'map_limit_invalid';
  end if;

  return query
  select
    c.id,
    c.territory_id,
    c.territory_slug,
    c.territory_name,
    c.geographic_path,
    c.category_key,
    c.category_label,
    c.external_id,
    c.name,
    c.description,
    c.latitude,
    c.longitude,
    c.address_text,
    c.neighborhood_label,
    c.postal_code,
    c.phone,
    c.website,
    c.source_updated_at,
    c.source_snapshot_id,
    c.source_version,
    c.fetched_at,
    c.source_id,
    c.source_key,
    c.provider_name,
    c.dataset_name,
    c.source_url,
    c.attribution
  from public.public_place_catalog c
  join public.public_places p on p.id=c.id
  where p.location is not null
    and extensions.st_intersects(
      p.location,
      extensions.st_makeenvelope(
        p_west,p_south,p_east,p_north,4326
      )
    )
    and (
      p_category_keys is null
      or c.category_key = any(p_category_keys)
    )
  order by c.name,c.id
  limit p_limit;
end;
$$;

revoke all on function public.get_public_places_in_bbox(
  double precision,double precision,double precision,double precision,integer,text[]
) from public, anon, authenticated;

grant execute on function public.get_public_places_in_bbox(
  double precision,double precision,double precision,double precision,integer,text[]
) to anon, authenticated;

create or replace function public.get_territory_boundaries_in_bbox(
  p_west double precision,
  p_south double precision,
  p_east double precision,
  p_north double precision,
  p_limit integer default 100
)
returns table (
  territory_id uuid,
  territory_type text,
  slug text,
  name text,
  geographic_path text,
  center_latitude double precision,
  center_longitude double precision,
  source_name text,
  source_url text,
  source_object_id text,
  geojson jsonb,
  bbox_geojson jsonb,
  area_m2 double precision,
  imported_at timestamptz,
  updated_at timestamptz
)
language plpgsql
stable
security invoker
set search_path = ''
as $$
begin
  if p_west < -180 or p_west > 180
    or p_east < -180 or p_east > 180
    or p_south < -90 or p_south > 90
    or p_north < -90 or p_north > 90
    or p_west >= p_east
    or p_south >= p_north then
    raise exception 'map_bbox_invalid';
  end if;

  if p_limit < 1 or p_limit > 500 then
    raise exception 'map_limit_invalid';
  end if;

  return query
  select
    c.territory_id,
    c.territory_type,
    c.slug,
    c.name,
    c.geographic_path,
    c.center_latitude,
    c.center_longitude,
    c.source_name,
    c.source_url,
    c.source_object_id,
    c.geojson,
    c.bbox_geojson,
    c.area_m2,
    c.imported_at,
    c.updated_at
  from public.territory_boundary_catalog c
  join public.territory_boundaries b
    on b.territory_id=c.territory_id
  where extensions.st_intersects(
    b.geometry,
    extensions.st_makeenvelope(
      p_west,p_south,p_east,p_north,4326
    )
  )
  order by c.name,c.territory_id
  limit p_limit;
end;
$$;

revoke all on function public.get_territory_boundaries_in_bbox(
  double precision,double precision,double precision,double precision,integer
) from public, anon, authenticated;

grant execute on function public.get_territory_boundaries_in_bbox(
  double precision,double precision,double precision,double precision,integer
) to anon, authenticated;
