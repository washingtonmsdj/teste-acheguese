
create policy "Deny direct client access to territory ingestion runs"
on private.territory_ingestion_runs
for all
to public
using (false)
with check (false);

create index territory_ingestion_runs_snapshot_idx
  on private.territory_ingestion_runs (source_snapshot_id);

create index public_place_categories_parent_idx
  on public.public_place_categories (parent_key)
  where parent_key is not null;

create index public_places_category_idx
  on public.public_places (category_key);

create index public_places_snapshot_source_idx
  on public.public_places (source_snapshot_id, source_id);

create index territory_facts_metric_idx
  on public.territory_facts (metric_key);
